import assert from "node:assert/strict";
import test from "node:test";
import { createAuthState, verifyAuthState } from "../services/authState.js";

const secret = "test-auth-state-secret-with-at-least-32-characters";

// Verifies auth state integrity, browser binding, and expiration handling.
test("auth state is signed, browser-bound, and expires", () => {
  const now = Date.now();
  const { state, nonce } = createAuthState(secret, "/dashboard", now);
  assert.deepEqual(verifyAuthState(secret, state, nonce, now + 1_000), {
    returnTo: "/dashboard",
  });
  assert.equal(verifyAuthState(secret, state, "another-browser", now + 1_000), null);
  assert.equal(verifyAuthState(secret, `${state}x`, nonce, now + 1_000), null);
  assert.equal(verifyAuthState(secret, state, nonce, now + 11 * 60 * 1_000), null);
});
