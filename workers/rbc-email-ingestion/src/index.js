import PostalMime from "postal-mime";

const MAX_RAW_EMAIL_BYTES = 750_000;

function bytesToHex(bytes) {
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function sha256Hex(value) {
  return bytesToHex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
}

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

function headerValue(headers, name) {
  return headers.get(name) ?? "";
}

export default {
  async email(message, env) {
    if (!env.EMAIL_INGESTION_SECRET || env.EMAIL_INGESTION_SECRET.length < 32) {
      throw new Error("EMAIL_INGESTION_SECRET is not configured");
    }
    if (!env.TRACKERGEN_API_URL) throw new Error("TRACKERGEN_API_URL is not configured");

    const raw = await new Response(message.raw).arrayBuffer();
    if (raw.byteLength > MAX_RAW_EMAIL_BYTES) {
      message.setReject("Purchase alert is too large to process");
      return;
    }

    const parsed = await PostalMime.parse(raw);
    const messageId = parsed.messageId || (await sha256Hex(`${message.from}:${message.to}:${parsed.subject}:${parsed.date}`));
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
    };
    const body = JSON.stringify(payload);
    const timestamp = String(Date.now());
    const signature = await hmacHex(env.EMAIL_INGESTION_SECRET, `${timestamp}.${body}`);
    const endpoint = new URL("/api/internal/email/rbc", env.TRACKERGEN_API_URL);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-trackergen-timestamp": timestamp,
        "x-trackergen-signature": signature,
      },
      body,
    });

    if (response.ok) return;
    if (response.status >= 500 || response.status === 429) {
      throw new Error(`TrackerGen ingestion temporarily failed with ${response.status}`);
    }
    console.warn("TrackerGen permanently rejected an email", { status: response.status });
  },
};
