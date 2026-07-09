import assert from "node:assert/strict";
import test from "node:test";
import { RbcEmailParseError, parseRbcPurchaseEmail } from "../services/rbcEmailParser.js";

test("parses a labelled RBC purchase alert", () => {
  const result = parseRbcPurchaseEmail({
    subject: "RBC Credit Card Purchase Alert",
    text: [
      "RBC Royal Bank",
      "Purchase amount: $24.80",
      "Merchant: TIM HORTONS #102",
      "Card ending in 1234",
      "Transaction date: 2026-07-09",
    ].join("\n"),
    receivedAt: "2026-07-09T18:00:00.000Z",
  });

  assert.equal(result.amount, 24.8);
  assert.equal(result.merchant, "TIM HORTONS #102");
  assert.equal(result.accountLastFour, "1234");
  assert.equal(result.date, "2026-07-09");
  assert.equal(result.category, "Food & Drink");
  assert.equal(result.status, "pending");
});

test("parses an RBC sentence-style purchase alert", () => {
  const result = parseRbcPurchaseEmail({
    subject: "A purchase was made on your RBC credit card",
    text: "A purchase of CAD 1,245.67 at COSTCO WHOLESALE was made with your card ending 9876.",
    receivedAt: "2026-07-10T02:30:00.000Z",
  });

  assert.equal(result.amount, 1245.67);
  assert.equal(result.merchant, "COSTCO WHOLESALE");
  assert.equal(result.accountLastFour, "9876");
  assert.equal(result.category, "Shopping");
  assert.equal(result.date, "2026-07-09");
});

test("rejects an email without a merchant instead of guessing", () => {
  assert.throws(
    () =>
      parseRbcPurchaseEmail({
        subject: "RBC purchase alert",
        text: "Purchase amount: $12.00\nCard ending in 1234",
        receivedAt: "2026-07-09T18:00:00.000Z",
      }),
    (error) => error instanceof RbcEmailParseError && error.code === "missing_merchant",
  );
});

test("rejects unrelated email", () => {
  assert.throws(
    () =>
      parseRbcPurchaseEmail({
        subject: "Newsletter",
        text: "Your order total is $12.00 at SHOP.",
        receivedAt: "2026-07-09T18:00:00.000Z",
      }),
    (error) => error instanceof RbcEmailParseError && error.code === "not_rbc_purchase",
  );
});
