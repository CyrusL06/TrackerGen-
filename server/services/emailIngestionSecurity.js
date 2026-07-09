import crypto from "crypto";

const SIGNATURE_PATTERN = /^[a-f0-9]{64}$/i;
const EMAIL_PATTERN = /<([^<>\s]+@[^<>\s]+)>|([^<>\s]+@[^<>\s]+)/;

export function sha256Hex(value) {
  return crypto.createHash("sha256").update(String(value)).digest("hex");
}

export function signEmailIngestionPayload(secret, timestamp, rawBody) {
  const body = Buffer.isBuffer(rawBody) ? rawBody : Buffer.from(rawBody ?? "");
  return crypto
    .createHmac("sha256", secret)
    .update(String(timestamp))
    .update(".")
    .update(body)
    .digest("hex");
}

export function verifyEmailIngestionSignature({
  secret,
  timestamp,
  signature,
  rawBody,
  now = Date.now(),
  maxAgeMs = 5 * 60 * 1000,
}) {
  if (typeof secret !== "string" || secret.length < 32) {
    return { ok: false, reason: "not_configured" };
  }

  if (typeof timestamp !== "string" || !/^\d{10,13}$/.test(timestamp)) {
    return { ok: false, reason: "invalid_timestamp" };
  }

  const timestampNumber = Number(timestamp);
  const timestampMs = timestamp.length === 10 ? timestampNumber * 1000 : timestampNumber;
  if (!Number.isFinite(timestampMs) || Math.abs(now - timestampMs) > maxAgeMs) {
    return { ok: false, reason: "expired" };
  }

  if (typeof signature !== "string" || !SIGNATURE_PATTERN.test(signature)) {
    return { ok: false, reason: "invalid_signature" };
  }

  if (!Buffer.isBuffer(rawBody)) {
    return { ok: false, reason: "missing_raw_body" };
  }

  const expected = signEmailIngestionPayload(secret, timestamp, rawBody);
  const suppliedBuffer = Buffer.from(signature.toLowerCase(), "hex");
  const expectedBuffer = Buffer.from(expected, "hex");

  if (
    suppliedBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(suppliedBuffer, expectedBuffer)
  ) {
    return { ok: false, reason: "invalid_signature" };
  }

  return { ok: true };
}

export function extractEmailAddress(value) {
  if (typeof value !== "string") return null;
  const match = value.trim().match(EMAIL_PATTERN);
  return (match?.[1] ?? match?.[2] ?? "").toLowerCase() || null;
}

export function parseAllowedDomains(value) {
  return String(value ?? "")
    .split(",")
    .map((domain) => domain.trim().toLowerCase())
    .filter((domain) => /^[a-z0-9.-]+$/.test(domain) && !domain.startsWith("."));
}

export function isAllowedSender(from, allowedDomains) {
  const address = extractEmailAddress(from);
  if (!address || !Array.isArray(allowedDomains) || allowedDomains.length === 0) {
    return false;
  }

  const domain = address.split("@").at(-1);
  return allowedDomains.some(
    (allowed) => domain === allowed || domain.endsWith(`.${allowed}`),
  );
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function hasPassingEmailAuthentication(authenticationResults, from, allowedDomains) {
  if (typeof authenticationResults !== "string") return false;
  const address = extractEmailAddress(from);
  const fromDomain = address?.split("@").at(-1);
  if (!fromDomain || !Array.isArray(allowedDomains)) return false;

  const alignedDomains = allowedDomains.filter(
    (allowed) => fromDomain === allowed || fromDomain.endsWith(`.${allowed}`),
  );
  if (alignedDomains.length === 0) return false;

  if (/\bdmarc=pass\b/i.test(authenticationResults)) return true;

  return alignedDomains.some((domain) => {
    const escaped = escapeRegExp(domain);
    return new RegExp(
      `\\bdkim=pass\\b[^;\\n]*(?:header\\.d|header\\.i|d)=\\S*@?(?:[a-z0-9.-]+\\.)?${escaped}\\b`,
      "i",
    ).test(authenticationResults);
  });
}

export function extractRecipientToken(recipient, ingestionDomain) {
  const address = extractEmailAddress(recipient);
  const domain = String(ingestionDomain ?? "").trim().toLowerCase();
  if (!address || !domain || !address.endsWith(`@${domain}`)) return null;

  const localPart = address.slice(0, -(domain.length + 1));
  const match = localPart.match(/^expenses\+([a-zA-Z0-9_-]{32,128})$/);
  return match?.[1] ?? null;
}
