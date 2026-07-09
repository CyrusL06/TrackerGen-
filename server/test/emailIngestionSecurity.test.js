import assert from "node:assert/strict";
import test from "node:test";
import {
  extractRecipientToken,
  hasPassingEmailAuthentication,
  isAllowedSender,
  parseAllowedDomains,
  signEmailIngestionPayload,
  verifyEmailIngestionSignature,
} from "../services/emailIngestionSecurity.js";

const secret = "test-email-ingestion-secret-that-is-long-enough";

test("accepts a current valid HMAC signature", () => {
  const rawBody = Buffer.from('{"messageId":"abc"}');
  const timestamp = String(Date.now());
  const signature = signEmailIngestionPayload(secret, timestamp, rawBody);
  assert.deepEqual(
    verifyEmailIngestionSignature({ secret, timestamp, signature, rawBody }),
    { ok: true },
  );
});

test("rejects a modified body and expired signature", () => {
  const timestamp = String(Date.now() - 10 * 60 * 1000);
  const original = Buffer.from('{"messageId":"abc"}');
  const signature = signEmailIngestionPayload(secret, timestamp, original);
  const expired = verifyEmailIngestionSignature({
    secret,
    timestamp,
    signature,
    rawBody: original,
  });
  assert.equal(expired.ok, false);
  assert.equal(expired.reason, "expired");

  const currentTimestamp = String(Date.now());
  const currentSignature = signEmailIngestionPayload(secret, currentTimestamp, original);
  const modified = verifyEmailIngestionSignature({
    secret,
    timestamp: currentTimestamp,
    signature: currentSignature,
    rawBody: Buffer.from('{"messageId":"changed"}'),
  });
  assert.equal(modified.ok, false);
  assert.equal(modified.reason, "invalid_signature");
});

test("extracts only opaque tokens for the configured domain", () => {
  const token = "abcdef0123456789abcdef0123456789abcdef0123456789";
  assert.equal(
    extractRecipientToken(`expenses+${token}@inbox.trackergen.app`, "inbox.trackergen.app"),
    token,
  );
  assert.equal(extractRecipientToken(`expenses+short@inbox.trackergen.app`, "inbox.trackergen.app"), null);
  assert.equal(extractRecipientToken(`expenses+${token}@attacker.example`, "inbox.trackergen.app"), null);
});

test("requires sender domain and aligned email authentication", () => {
  const domains = parseAllowedDomains("alerts.rbc.com, rbcroyalbank.com");
  assert.equal(isAllowedSender("RBC Alerts <notice@alerts.rbc.com>", domains), true);
  assert.equal(isAllowedSender("RBC Alerts <notice@example.com>", domains), false);
  assert.equal(
    hasPassingEmailAuthentication(
      "mx.example; dkim=pass header.d=alerts.rbc.com; dmarc=pass header.from=alerts.rbc.com",
      "RBC Alerts <notice@alerts.rbc.com>",
      domains,
    ),
    true,
  );
  assert.equal(
    hasPassingEmailAuthentication(
      "mx.example; dkim=pass header.d=gmail.com; dmarc=fail header.from=alerts.rbc.com",
      "RBC Alerts <notice@alerts.rbc.com>",
      domains,
    ),
    false,
  );
});
