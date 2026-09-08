import assert from "node:assert/strict";
import test from "node:test";
import mongoose from "mongoose";
import {
  buildLinkedProfileQuery,
  validateTelegramWebhookSecret,
} from "../bot/bot.js";
import { Transaction } from "../model/data.js";
import { createTelegramLinkCode, validateTransactionInput } from "../routes/route.js";

// Verifies Telegram lookups require both the chat and initiating user identity.
test("Telegram profile lookup binds both chat and initiating user", () => {
  assert.deepEqual(buildLinkedProfileQuery("group-1", "user-1"), {
    telegramChatId: "group-1",
    telegramUserId: "user-1",
  });
  assert.equal(buildLinkedProfileQuery("group-1", null), null);
});

// Verifies generated link codes are unique in a sample and match the expected format.
test("Telegram link codes have at least 192 bits of random material", () => {
  // Generates each sampled link code through the production factory.
  const codes = new Set(Array.from({ length: 100 }, createTelegramLinkCode));
  assert.equal(codes.size, 100);
  for (const code of codes) {
    assert.match(code, /^TG-[A-Za-z0-9_-]{32}$/);
  }
});

// Verifies enabled webhooks reject missing or weak secrets in any environment.
test("Telegram webhooks fail closed without a strong secret in every environment", () => {
  // Exercises the missing-secret rejection path.
  assert.throws(() => validateTelegramWebhookSecret(true, undefined), /required/);
  // Exercises the weak-secret rejection path.
  assert.throws(() => validateTelegramWebhookSecret(true, "too-short"), /required/);
  // Exercises the enabled-webhook path with an accepted secret.
  assert.doesNotThrow(() => validateTelegramWebhookSecret(true, "x".repeat(32)));
  // Exercises the disabled-webhook path without a configured secret.
  assert.doesNotThrow(() => validateTelegramWebhookSecret(false, undefined));
});

// Verifies transaction validation rejects zero amounts and impossible dates.
test("transaction schema rejects zero amounts and impossible calendar dates", () => {
  const common = {
    workosUserId: "user-1",
    name: "Test",
    category: "Other",
  };
  const zero = new Transaction({ ...common, amount: 0, date: "2026-07-10" });

  assert.match(zero.validateSync().errors.amount.message, /non-zero/);
  assert.match(validateTransactionInput({ ...common, amount: -1, date: "2026-02-31" })[0], /valid calendar date/);
  assert.match(validateTransactionInput({ ...common, amount: 0, date: "2026-07-10" })[0], /non-zero/);
  assert.deepEqual(validateTransactionInput({ ...common, amount: -1, date: "2024-02-29" }), []);
});

// Removes registered models so this test file leaves no global Mongoose state.
test.after(() => mongoose.deleteModel(/.*/));
