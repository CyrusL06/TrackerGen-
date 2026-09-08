import crypto from "crypto";

const STATE_TTL_MS = 10 * 60 * 1000;

// Authenticates app-owned OAuth state payloads with the configured server secret.
function signature(secret, payload) {
  return crypto.createHmac("sha256", secret).update(payload).digest("base64url");
}

/** Creates short-lived signed OAuth state and a nonce intended for a separate cookie. */
export function createAuthState(secret, returnTo, now = Date.now()) {
  const nonce = crypto.randomBytes(32).toString("base64url");
  const payload = Buffer.from(JSON.stringify({ returnTo, nonce, issuedAt: now })).toString("base64url");
  return { nonce, state: `${payload}.${signature(secret, payload)}` };
}

/** Verifies state integrity, nonce ownership, and freshness before trusting its return path. */
export function verifyAuthState(secret, state, expectedNonce, now = Date.now()) {
  if (typeof state !== "string" || typeof expectedNonce !== "string") return null;
  const [payload, suppliedSignature, extra] = state.split(".");
  if (!payload || !suppliedSignature || extra) return null;

  const expectedSignature = signature(secret, payload);
  const supplied = Buffer.from(suppliedSignature);
  const expected = Buffer.from(expectedSignature);
  if (supplied.length !== expected.length || !crypto.timingSafeEqual(supplied, expected)) return null;

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (
      parsed.nonce !== expectedNonce ||
      !Number.isFinite(parsed.issuedAt) ||
      parsed.issuedAt > now ||
      now - parsed.issuedAt > STATE_TTL_MS
    ) return null;
    return { returnTo: parsed.returnTo };
  } catch {
    return null;
  }
}
