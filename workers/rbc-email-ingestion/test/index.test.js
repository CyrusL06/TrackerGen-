import assert from "node:assert/strict";
import test from "node:test";
import { handleEmail, MAX_RAW_EMAIL_BYTES } from "../src/index.js";

test("oversized email is rejected before its raw stream is read", async () => {
  let rejectedWith;
  const message = {
    rawSize: MAX_RAW_EMAIL_BYTES + 1,
    get raw() {
      assert.fail("raw email stream must not be read after the metadata size limit fails");
    },
    setReject(reason) {
      rejectedWith = reason;
    },
  };

  await handleEmail(message, {
    EMAIL_INGESTION_SECRET: "x".repeat(32),
    TRACKERGEN_API_URL: "https://api.example.test",
  });
  assert.match(rejectedWith, /too large/);
});

test("requires an HTTPS origin without credentials, paths, query, or fragments", async () => {
  const message = {
    rawSize: 0,
    get raw() { assert.fail("configuration must be rejected before MIME is read"); },
  };
  for (const value of [
    "http://api.example.test",
    "https://user:pass@api.example.test",
    "https://api.example.test/base",
    "https://api.example.test/?token=private",
    "https://api.example.test/#private",
  ]) {
    await assert.rejects(
      handleEmail(message, {
        EMAIL_INGESTION_SECRET: "x".repeat(32),
        TRACKERGEN_API_URL: value,
      }),
      /valid HTTPS origin/,
    );
  }
});
