import crypto from "crypto";

const SIGNATURE_PATTERN = /^[a-f0-9]{64}$/i;
const BARE_EMAIL_PATTERN = /^[^<>\s@]+@[^<>\s@]+$/;
const DISPLAY_EMAIL_PATTERN = /^.*<([^<>\s@]+@[^<>\s@]+)>$/;

/** Hashes tokens and message identifiers before persistence or lookup; hashing does not validate origin. */
export function sha256Hex(value) {
  return crypto.createHash("sha256").update(String(value)).digest("hex");
}

/** Signs untouched worker payload bytes with the shared secret for transport authentication. */
export function signEmailIngestionPayload(secret, timestamp, rawBody) {
  const body = Buffer.isBuffer(rawBody) ? rawBody : Buffer.from(rawBody ?? "");
  return crypto
    .createHmac("sha256", secret)
    .update(String(timestamp))
    .update(".")
    .update(body)
    .digest("hex");
}

/** Verifies freshness and a shared-secret HMAC over raw bytes before worker input is trusted. */
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

/** Extracts a normalized mailbox from limited address forms without authenticating its owner. */
export function extractEmailAddress(value) {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  const displayMatch = normalized.match(DISPLAY_EMAIL_PATTERN);
  const address = displayMatch?.[1] ?? (BARE_EMAIL_PATTERN.test(normalized) ? normalized : null);
  return address?.toLowerCase() ?? null;
}

/** Parses administrator-owned sender-domain configuration and discards malformed DNS names. */
export function parseAllowedDomains(value) {
  return String(value ?? "")
    .split(",")
    .map(
      // Normalizes each configured domain for deterministic policy checks.
      (domain) => domain.trim().toLowerCase(),
    )
    .filter(
      // Keeps only bounded domains whose labels match the accepted DNS shape.
      (domain) =>
      domain.length <= 253 &&
      domain.split(".").every(
        // Rejects labels whose malformed syntax could broaden configured matching.
        (label) => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label),
      ),
    );
}

/** Checks claimed sender domain membership; separate authentication evidence is still required. */
export function isAllowedSender(from, allowedDomains) {
  const address = extractEmailAddress(from);
  if (!address || !Array.isArray(allowedDomains) || allowedDomains.length === 0) {
    return false;
  }

  const domain = address.split("@").at(-1);
  return allowedDomains.some(
    // Matches each configured boundary without accepting sibling-domain suffixes.
    (allowed) => domain === allowed || domain.endsWith(`.${allowed}`),
  );
}

// Escapes administrator-owned domains before embedding them in authentication-result patterns.
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Requires aligned DMARC or DKIM pass evidence supplied by the trusted delivery boundary. */
export function hasPassingEmailAuthentication(authenticationResults, from, allowedDomains) {
  if (typeof authenticationResults !== "string") return false;
  const address = extractEmailAddress(from);
  const fromDomain = address?.split("@").at(-1);
  if (!fromDomain || !Array.isArray(allowedDomains)) return false;

  const alignedDomains = allowedDomains.filter(
    // Narrows policy to configured domains aligned with the claimed From domain.
    (allowed) => fromDomain === allowed || fromDomain.endsWith(`.${allowed}`),
  );
  if (alignedDomains.length === 0) return false;

  const dmarcPasses = [...authenticationResults.matchAll(/\bdmarc=pass\b([^;\n]*)/gi)];
  if (
    // Checks each DMARC pass for header-from alignment with the allowed domain set.
    dmarcPasses.some((match) => {
      const headerFrom = match[1].match(/\bheader\.from=([a-z0-9.-]+)/i)?.[1]?.toLowerCase();
      return headerFrom && alignedDomains.some(
        // Matches authenticated header domains against each owner-configured boundary.
        (domain) => headerFrom === domain || headerFrom.endsWith(`.${domain}`),
      );
    })
  ) return true;

  // Falls back to aligned DKIM evidence for each permitted sender domain.
  return alignedDomains.some((domain) => {
    const escaped = escapeRegExp(domain);
    return new RegExp(
      `\\bdkim=pass\\b[^;\\n]*(?:header\\.d|header\\.i|d)=\\S*@?(?:[a-z0-9.-]+\\.)?${escaped}\\b`,
      "i",
    ).test(authenticationResults);
  });
}

/** Extracts a bounded routing token only from the configured ingestion domain; ownership needs a hash lookup. */
export function extractRecipientToken(recipient, ingestionDomain) {
  const address = extractEmailAddress(recipient);
  const domain = String(ingestionDomain ?? "").trim().toLowerCase();
  if (!address || !domain || !address.endsWith(`@${domain}`)) return null;

  const localPart = address.slice(0, -(domain.length + 1));
  const match = localPart.match(/^expenses\+([a-zA-Z0-9_-]{32,128})$/);
  return match?.[1] ?? null;
}
