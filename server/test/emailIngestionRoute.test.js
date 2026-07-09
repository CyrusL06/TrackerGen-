import assert from "node:assert/strict";
import http from "node:http";
import test from "node:test";
import express from "express";
import { Transaction } from "../model/data.js";
import { UserProfile } from "../model/userProfile.js";
import { buildEmailIngestionRouter } from "../routes/emailIngestion.js";
import { signEmailIngestionPayload } from "../services/emailIngestionSecurity.js";

const secret = "route-test-email-secret-that-is-at-least-32-characters";
const token = "abcdef0123456789abcdef0123456789abcdef0123456789";

async function withTestServer(run) {
  const app = express();
  app.use(
    express.json({
      limit: "1mb",
      verify: (req, res, buffer) => {
        if (req.originalUrl === "/api/internal/email/rbc") req.rawBody = Buffer.from(buffer);
      },
    }),
  );
  app.use(
    buildEmailIngestionRouter({
      getAuthenticatedUser: async () => null,
      ingestionDomain: "inbox.trackergen.test",
      ingestionSecret: secret,
      allowedSenderDomains: ["alerts.rbc.test"],
      requireAuthenticationPass: true,
      timeZone: "America/Vancouver",
    }),
  );

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  try {
    await run(`http://127.0.0.1:${address.port}`);
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
}

function createPayload() {
  return {
    messageId: "<rbc-test-message@example.test>",
    from: "RBC Alerts <notice@alerts.rbc.test>",
    to: `expenses+${token}@inbox.trackergen.test`,
    subject: "RBC Credit Card Purchase Alert",
    text: "RBC Royal Bank\nPurchase amount: $18.50\nMerchant: TEST COFFEE\nCard ending in 1234\nTransaction date: 2026-07-09",
    authenticationResults:
      "mx.trackergen.test; dkim=pass header.d=alerts.rbc.test; dmarc=pass header.from=alerts.rbc.test",
    receivedAt: "2026-07-09T18:00:00.000Z",
  };
}

async function signedPost(baseUrl, payload, signatureOverride) {
  const body = JSON.stringify(payload);
  const timestamp = String(Date.now());
  const signature =
    signatureOverride ?? signEmailIngestionPayload(secret, timestamp, Buffer.from(body));
  return fetch(`${baseUrl}/api/internal/email/rbc`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-trackergen-timestamp": timestamp,
      "x-trackergen-signature": signature,
    },
    body,
  });
}

test("signed RBC email creates a pending negative transaction", async () => {
  const originals = {
    findOne: UserProfile.findOne,
    updateOne: UserProfile.updateOne,
    create: Transaction.create,
  };
  let createdDocument;
  UserProfile.findOne = async () => ({ _id: "profile-1", workosUserId: "user-1" });
  UserProfile.updateOne = async () => ({ acknowledged: true });
  Transaction.create = async (document) => {
    createdDocument = document;
    return { _id: "transaction-1", ...document };
  };

  try {
    await withTestServer(async (baseUrl) => {
      const response = await signedPost(baseUrl, createPayload());
      assert.equal(response.status, 201);
      assert.equal(createdDocument.workosUserId, "user-1");
      assert.equal(createdDocument.amount, -18.5);
      assert.equal(createdDocument.authorizedAmount, 18.5);
      assert.equal(createdDocument.source, "email_rbc");
      assert.equal(createdDocument.status, "pending");
      assert.equal(createdDocument.accountLastFour, "1234");
    });
  } finally {
    UserProfile.findOne = originals.findOne;
    UserProfile.updateOne = originals.updateOne;
    Transaction.create = originals.create;
  }
});

test("internal endpoint rejects an invalid signature before database access", async () => {
  const originalFindOne = UserProfile.findOne;
  let databaseWasCalled = false;
  UserProfile.findOne = async () => {
    databaseWasCalled = true;
    return null;
  };

  try {
    await withTestServer(async (baseUrl) => {
      const response = await signedPost(baseUrl, createPayload(), "0".repeat(64));
      assert.equal(response.status, 401);
      assert.equal(databaseWasCalled, false);
    });
  } finally {
    UserProfile.findOne = originalFindOne;
  }
});

test("duplicate message is acknowledged without creating another expense", async () => {
  const originals = {
    findOne: UserProfile.findOne,
    create: Transaction.create,
  };
  UserProfile.findOne = async () => ({ _id: "profile-1", workosUserId: "user-1" });
  Transaction.create = async () => {
    const error = new Error("duplicate key");
    error.code = 11000;
    throw error;
  };

  try {
    await withTestServer(async (baseUrl) => {
      const response = await signedPost(baseUrl, createPayload());
      assert.equal(response.status, 200);
      assert.deepEqual(await response.json(), { ok: true, duplicate: true });
    });
  } finally {
    UserProfile.findOne = originals.findOne;
    Transaction.create = originals.create;
  }
});
