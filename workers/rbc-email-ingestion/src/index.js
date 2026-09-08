import PostalMime from "postal-mime";

export const MAX_RAW_EMAIL_BYTES = 750_000;

// Encodes Web Crypto output for HTTP signatures and synthetic message IDs.
function bytesToHex(bytes) {
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

// Produces a content digest without retaining the original value.
async function sha256Hex(value) {
  return bytesToHex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
}

// Signs the exact payload sent to the ingestion API.
async function hmacHex(secret, value) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return bytesToHex(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value)));
}

// Reads a mail header while normalizing absent values to an empty string.
function headerValue(headers, name) {
  return headers.get(name) ?? "";
}

// Emits allowlisted operational fields so email contents never reach logs.
function diagnostic(logger, level, event, reason, correlationId, status) {
  const fields = { event, reason, correlationId };
  if (Number.isInteger(status)) fields.status = status;
  logger[level](event, fields);
}

// Builds the fixed ingestion path from a configured HTTPS origin.
function ingestionEndpoint(value) {
  let base;
  try {
    base = new URL(value);
  } catch {
    throw new Error("TRACKERGEN_API_URL must be a valid HTTPS origin");
  }
  if (
    base.protocol !== "https:" ||
    base.username ||
    base.password ||
    base.pathname !== "/" ||
    base.search ||
    base.hash
  ) {
    throw new Error("TRACKERGEN_API_URL must be a valid HTTPS origin");
  }
  return new URL("/api/internal/email/rbc", base);
}

// Converts an inbound email into a bounded, signed API request and signals retryable failures.
export async function handleEmail(message, env, { fetchImpl = fetch, logger = console } = {}) {
  if (!env.EMAIL_INGESTION_SECRET || env.EMAIL_INGESTION_SECRET.length < 32) {
    throw new Error("EMAIL_INGESTION_SECRET is not configured");
  }
  if (!env.TRACKERGEN_API_URL) throw new Error("TRACKERGEN_API_URL is not configured");
  const endpoint = ingestionEndpoint(env.TRACKERGEN_API_URL);

  if (Number.isFinite(message.rawSize) && message.rawSize > MAX_RAW_EMAIL_BYTES) {
    message.setReject("Purchase alert is too large to process");
    return;
  }

  const raw = await new Response(message.raw).arrayBuffer();
  if (raw.byteLength > MAX_RAW_EMAIL_BYTES) {
    message.setReject("Purchase alert is too large to process");
    return;
  }

  const parsed = await PostalMime.parse(raw);
  // Hash the complete MIME when Message-ID is absent to avoid collisions without retaining content.
  const messageId = parsed.messageId ||
    `synthetic:${bytesToHex(await crypto.subtle.digest("SHA-256", raw))}`;
  const correlationId = crypto.randomUUID();
  const authenticationResults = [
    headerValue(message.headers, "authentication-results"),
    headerValue(message.headers, "arc-authentication-results"),
  ]
    .filter(Boolean)
    .join("\n");
  const payload = {
    messageId,
    from: parsed.from?.address || parsed.from?.name || message.from,
    to: message.to,
    subject: parsed.subject || "",
    text: parsed.text || "",
    authenticationResults,
    receivedAt: new Date().toISOString(),
    correlationId,
  };
  const body = JSON.stringify(payload);
  const timestamp = String(Date.now());
  const signature = await hmacHex(env.EMAIL_INGESTION_SECRET, `${timestamp}.${body}`);
  const response = await fetchImpl(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-trackergen-timestamp": timestamp,
      "x-trackergen-signature": signature,
    },
    body,
    redirect: "error",
  });

  if (response.ok) {
    diagnostic(logger, "info", "EMAIL_INGEST_DELIVERED", "accepted", correlationId, response.status);
    return;
  }
  if (response.status >= 500 || response.status === 429) {
    diagnostic(logger, "warn", "EMAIL_INGEST_RETRY", "upstream_temporary", correlationId, response.status);
    throw new Error("TrackerGen ingestion temporarily failed");
  }
  diagnostic(logger, "warn", "EMAIL_INGEST_REJECTED", "upstream_rejected", correlationId, response.status);
}

export default {
  email: handleEmail,
};
