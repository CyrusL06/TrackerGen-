import assert from "node:assert/strict";
import http from "node:http";
import test from "node:test";
import express from "express";
import { handleEmail } from "../../workers/rbc-email-ingestion/src/index.js";
import { buildEmailIngestionRouter } from "../routes/emailIngestion.js";
import { signEmailIngestionPayload } from "../services/emailIngestionSecurity.js";

const secret = "e2e-only-secret-with-at-least-thirty-two-characters";
const token = "0123456789abcdef0123456789abcdef0123456789abcdef";
const recipient = `expenses+${token}@inbox.trackergen.test`;

/** Builds a controlled purchase-alert MIME message for end-to-end scenarios. */
function rawMime({ from = "RBC Alerts <notice@alerts.rbc.test>", subject = "RBC purchase alert", text } = {}) {
  return [
    `From: ${from}`,
    `To: ${recipient}`,
    `Subject: ${subject}`,
    "Message-ID: <controlled-e2e-alert@rbc.test>",
    "Date: Thu, 9 Jul 2026 18:00:00 +0000",
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset="utf-8"',
    "",
    text ?? "RBC Royal Bank\nPurchase amount: CAD 18.50\nMerchant: REDACTED TEST CAFE\nCard ending in 1234\nTransaction date: 2026-07-09",
  ].join("\r\n");
}

/** Adapts raw MIME and trusted delivery headers to Cloudflare's EmailMessage shape. */
function cloudflareMessage(raw, { authenticationResults } = {}) {
  return {
    from: "notice@alerts.rbc.test",
    to: recipient,
    rawSize: Buffer.byteLength(raw),
    raw: new Response(raw).body,
    headers: new Headers({
      "authentication-results": authenticationResults ??
        "mx.trackergen.test; dkim=pass header.d=alerts.rbc.test; dmarc=pass header.from=alerts.rbc.test",
    }),
    // Fails the test if the worker unexpectedly rejects the controlled message.
    setReject(reason) { throw new Error(`unexpected SMTP rejection: ${reason}`); },
  };
}

/** Runs the real HTTP boundary with deterministic in-memory persistence substitutes. */
async function withEmailIngestionTestServer(run) {
  const state = { transactions: [], profileUpdates: [], diagnostics: [] };
  const profileModel = {
    // Resolves the controlled profile only for an enabled ingestion lookup.
    async findOne(query) {
      return query.emailIngestionEnabled ? { _id: "profile-1", workosUserId: "user-1" } : null;
    },
    // Captures profile updates for post-request assertions.
    async updateOne(filter, update) { state.profileUpdates.push({ filter, update }); },
  };
  const transactionModel = {
    // Persists unique transactions and reproduces MongoDB duplicate-key behavior.
    async create(document) {
      // Detects repeated source messages in the in-memory transaction store.
      if (state.transactions.some((item) => item.sourceMessageIdHash === document.sourceMessageIdHash)) {
        const error = new Error("controlled duplicate");
        error.code = 11000;
        error.keyPattern = { workosUserId: 1, sourceMessageIdHash: 1 };
        throw error;
      }
      const saved = { _id: `transaction-${state.transactions.length + 1}`, ...document };
      state.transactions.push(saved);
      return saved;
    },
  };
  // Builds one diagnostic recorder for each logger severity.
  const logger = Object.fromEntries(["info", "warn", "error"].map((level) => [
    level,
    // Retains structured diagnostics for privacy and outcome assertions.
    (event, fields) => state.diagnostics.push({ level, event, fields }),
  ]));
  const app = express();
  app.use(express.json({
    limit: "1mb",
    // Retains the ingestion request bytes used by signature verification.
    verify(req, res, body) { if (req.originalUrl === "/api/internal/email/rbc") req.rawBody = Buffer.from(body); },
  }));
  app.use(buildEmailIngestionRouter({
    // Confirms the internal ingestion route does not depend on a browser session.
    getAuthenticatedUser: async () => null,
    ingestionDomain: "inbox.trackergen.test",
    ingestionSecret: secret,
    allowedSenderDomains: ["alerts.rbc.test"],
    requireAuthenticationPass: true,
    timeZone: "America/Vancouver",
    transactionModel,
    profileModel,
    logger,
  }));
  const server = http.createServer(app);
  // Waits until the ephemeral HTTP listener can accept worker requests.
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  // Redirects worker API requests through the local end-to-end server.
  const bridgeFetch = (url, options) => fetch(`${baseUrl}${new URL(url).pathname}`, options);
  try { await run({ state, bridgeFetch, logger, baseUrl }); }
  // Waits for shutdown and propagates listener cleanup failures.
  finally { await new Promise((resolve, reject) => server.close(
    // Converts the server close result into Promise completion.
    (error) => error ? reject(error) : resolve(),
  )); }
}

// Verifies successful ingestion and duplicate idempotency across the complete boundary.
test("raw MIME traverses worker, signed Express router, parser, persistence, timestamp, response, and duplicate idempotency", async () => {
  // Exercises two deliveries against one isolated server state.
  await withEmailIngestionTestServer(async ({ state, bridgeFetch, logger }) => {
    const env = { EMAIL_INGESTION_SECRET: secret, TRACKERGEN_API_URL: "https://api.trackergen.test" };
    await handleEmail(cloudflareMessage(rawMime()), env, { fetchImpl: bridgeFetch, logger });
    await handleEmail(cloudflareMessage(rawMime()), env, { fetchImpl: bridgeFetch, logger });

    assert.equal(state.transactions.length, 1);
    assert.equal(state.transactions[0].workosUserId, "user-1");
    assert.equal(state.transactions[0].amount, -18.5);
    assert.equal(state.transactions[0].source, "email_rbc");
    assert.equal(state.profileUpdates.length, 1);
    // Confirms diagnostics record the initial creation outcome.
    assert(state.diagnostics.some(({ event, fields }) => event === "EMAIL_API_ACCEPTED" && fields.reason === "created"));
    // Confirms diagnostics distinguish the duplicate delivery outcome.
    assert(state.diagnostics.some(({ event, fields }) => event === "EMAIL_API_ACCEPTED" && fields.reason === "duplicate"));
    for (const entry of state.diagnostics) {
      const serialized = JSON.stringify(entry);
      assert.doesNotMatch(serialized, /REDACTED TEST CAFE|18\.50|expenses\+|0123456789abcdef/);
    }
  });
});

// Verifies malformed and unauthenticated inputs fail without persisting data or leaking details.
test("forged HMAC, forged sender authentication, malformed payload, and unrecognized MIME are rejected", async () => {
  // Exercises independent rejection paths against one isolated server state.
  await withEmailIngestionTestServer(async ({ state, bridgeFetch, logger, baseUrl }) => {
    const env = { EMAIL_INGESTION_SECRET: secret, TRACKERGEN_API_URL: "https://api.trackergen.test" };
    const malformedBody = JSON.stringify({ correlationId: "PRIVATE-DATA-NOT-A-UUID" });
    const malformedTimestamp = String(Date.now());
    const [forgedResponse, malformedResponse] = await Promise.all([
      fetch(`${baseUrl}/api/internal/email/rbc`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-trackergen-timestamp": String(Date.now()),
          "x-trackergen-signature": "0".repeat(64),
        },
        body: JSON.stringify({ secret: "MUST-NOT-LOG", correlationId: "NOT-A-UUID" }),
      }),
      fetch(`${baseUrl}/api/internal/email/rbc`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-trackergen-timestamp": malformedTimestamp,
          "x-trackergen-signature": signEmailIngestionPayload(secret, malformedTimestamp, malformedBody),
        },
        body: malformedBody,
      }),
    ]);
    assert.equal(forgedResponse.status, 401);
    assert.equal(malformedResponse.status, 400);
    await handleEmail(cloudflareMessage(rawMime(), {
      authenticationResults: "mx.trackergen.test; dmarc=pass header.from=attacker.test",
    }), env, { fetchImpl: bridgeFetch, logger });
    await handleEmail(cloudflareMessage(rawMime({ text: "RBC service message with no purchase fields" })), env,
      { fetchImpl: bridgeFetch, logger });
    assert.equal(state.transactions.length, 0);
    // Finds the diagnostic emitted for a forged request signature.
    assert(state.diagnostics.some(({ fields }) => fields.reason === "signature_invalid_signature"));
    // Finds the diagnostic emitted for a malformed request body.
    assert(state.diagnostics.some(({ fields }) => fields.reason === "invalid_payload"));
    // Finds the diagnostic emitted for failed sender authentication.
    assert(state.diagnostics.some(({ fields }) => fields.reason === "authentication_policy"));
    // Finds the diagnostic emitted when purchase parsing fails.
    assert(state.diagnostics.some(({ fields }) => fields.reason?.startsWith("parser_")));
    for (const { fields } of state.diagnostics) {
      assert(Object.keys(fields).every(
        // Restricts each diagnostic key to the public metadata allowlist.
        (key) => ["correlationId", "event", "reason", "status"].includes(key),
      ));
      assert.match(fields.correlationId, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
      assert.doesNotMatch(JSON.stringify(fields), /PRIVATE-DATA|MUST-NOT-LOG|NOT-A-UUID/);
    }
  });
});
