# RBC email ingestion: production setup and operations

This path receives a narrowly forwarded RBC purchase-alert email at Cloudflare, parses MIME in an Email Worker, HMAC-signs normalized JSON, validates it in Express, looks up an enabled profile by a hashed opaque token, parses the alert, and creates one pending Mongo transaction. The unique `(workosUserId, sourceMessageIdHash)` index provides replay idempotency.

It is **not** a statement-feed reconciliation system. Holds, tips, reversals, refunds, and final posted values require separate reconciliation. Never use real financial emails as fixtures or paste them into tickets/logs.

## Security and data flow

- SMTP/MIME is untrusted. Cloudflare supplies the envelope and authentication-result headers; the backend still enforces sender domain, aligned DMARC or DKIM, HMAC, timestamp freshness, opaque recipient token, limits, and parser rules.
- The HMAC covers the exact JSON body. `EMAIL_INGESTION_SECRET` must be identical on Worker and backend and at least 32 characters.
- The Worker requires an HTTPS backend URL and refuses redirects.
- Diagnostics contain only stable event/reason identifiers, a random correlation UUID, and HTTP status. They must never contain raw MIME/body, subject, sender/recipient address, merchant, amount, profile token, HMAC, or secrets.
- Raw email is held only in Worker memory for parsing. The API receives normalized text transiently. Mongo stores parsed transaction fields and one-way hashes, not raw MIME.

## 1. Backend configuration

Generate secrets locally with an OS cryptographic generator (for example `openssl rand -base64 48`); do not put generated values in shell history, chat, source control, or screenshots. Set in the backend secret manager:

```dotenv
EMAIL_INGESTION_DOMAIN=inbox.example.com
EMAIL_INGESTION_SECRET=<random-secret-at-least-32-characters>
RBC_EMAIL_ALLOWED_DOMAINS=<exact-aligned-domain-observed-on-a-verified-RBC-alert>
EMAIL_REQUIRE_AUTH_PASS=true
EMAIL_TRANSACTION_TIME_ZONE=America/Vancouver
```

Keep `EMAIL_REQUIRE_AUTH_PASS=true`. Confirm that Mongo has the partial unique index described in `server/model/data.js`; do not assume application schema declaration proves the deployed index exists. Deploy the backend first and confirm its normal health checks. The internal endpoint is `/api/internal/email/rbc`; it is internet-reachable only because Cloudflare must call it, so HMAC is mandatory.

Create a user's private destination with authenticated `POST /api/profile/email-ingestion/rotate` (session and CSRF required). Store/copy the returned address as a secret. `POST /api/profile/email-ingestion/disable` revokes ingestion for that address.

## 2. Cloudflare DNS and Email Routing

1. Add the domain to Cloudflare and use Cloudflare authoritative nameservers.
2. In **Email > Email Routing**, enable routing for the dedicated subdomain (for example `inbox.example.com`). Accept Cloudflare's required MX and SPF DNS records. Do not add conflicting MX records on that subdomain.
3. In `workers/rbc-email-ingestion/wrangler.jsonc`, replace only `TRACKERGEN_API_URL` with the backend's public **HTTPS origin** (for example `https://api.example.com`). Paths, query strings, fragments, embedded credentials, HTTP, and redirects are rejected.
4. From `workers/rbc-email-ingestion`, run `npm ci`, `npm test`, and `npm run check`.
5. Add the secret interactively: `npx wrangler secret put EMAIL_INGESTION_SECRET`. Do not place it under `vars` or in `wrangler.jsonc`.
6. Deploy with `npm run deploy`. Deployment alone does not route mail.
7. Create an Email Routing rule for `expenses+*@inbox.example.com` to **Send to a Worker**, selecting `trackergen-rbc-email-ingestion`. If the UI cannot match plus-address wildcards, use a catch-all only on this dedicated ingestion subdomain; never use a catch-all on a general-purpose mail domain. The backend still accepts only `expenses+<32-128 character token>@domain`.
8. Confirm Email Routing shows active DNS and the Worker binding. No KV/D1/R2 binding is required by this implementation.

## 3. Gmail: narrowly scoped forwarding

Use a dedicated filter, not global forwarding.

1. In Gmail **Settings > Forwarding and POP/IMAP**, add the private TrackerGen address returned by `rotate` and complete Gmail's verification flow. If verification mail is not an RBC alert, it will be rejected by policy; temporarily completing this may require an administrator-controlled destination/verification process. Do **not** weaken backend sender/auth rules. If verification cannot be completed safely, stop and use an approved mail-routing administrator workflow.
2. Open a verified, genuine RBC purchase alert and use **Filter messages like these**.
3. Constrain `From` to the exact RBC alert address/domain and `Subject` to the stable purchase-alert phrase. Do not filter only on broad terms such as “RBC” or “transaction.”
4. Select only **Forward it to** the private TrackerGen destination. Do not forward existing matching mail, statements, account notices, security codes, or unrelated financial email.
5. Senders and templates vary. Derive `RBC_EMAIL_ALLOWED_DOMAINS` from aligned authentication results observed through authorized mail administration, not from display names.

## 4. Controlled smoke test

1. Enable one test profile and record the start time; never record its opaque address in a ticket.
2. Trigger one legitimate RBC purchase alert above the configured threshold. Do not fabricate the sender.
3. Confirm Worker diagnostics show `EMAIL_INGEST_DELIVERED` / `accepted` and backend diagnostics with the same correlation ID show `EMAIL_API_ACCEPTED` / `created`.
4. Confirm exactly one Mongo transaction has `source=email_rbc`, `status=pending`, a negative amount, expected date/currency, and the test profile's owner. Confirm `emailIngestionLastReceivedAt` advanced.
5. Replay only in a controlled non-production harness. Expected backend result is HTTP 200 with `duplicate=true`, diagnostic reason `duplicate`, no second transaction, and no second profile timestamp update.

Do not claim production verification until this is completed with authorized credentials in the deployed environment. Local tests cannot verify Cloudflare DNS/Email Routing, Gmail forwarding verification, an actual RBC template/authentication result, deployed secrets, the production backend, or the production Mongo indexes.

## Diagnostic code runbook

| Event | Reason | Meaning/action |
|---|---|---|
| `EMAIL_INGEST_DELIVERED` | `accepted` | API accepted create or duplicate. Correlate with backend event. |
| `EMAIL_INGEST_RETRY` | `upstream_temporary` | 429/5xx; Cloudflare retry is requested. Check backend health/rate limit. |
| `EMAIL_INGEST_REJECTED` | `upstream_rejected` | Non-retryable policy/contract rejection. Use correlation ID and backend reason. |
| `EMAIL_API_ACCEPTED` | `created` / `duplicate` | Created once / safely replayed. |
| `EMAIL_API_REJECTED` | `signature_*` | Secret mismatch, stale request, malformed signature, or missing raw body. Rotate if compromise is suspected. |
| `EMAIL_API_REJECTED` | `invalid_payload` | Worker/backend contract or size mismatch. Check deployed versions; do not log payload. |
| `EMAIL_API_REJECTED` | `recipient_policy` | Address token/domain is invalid, disabled, or unknown. Rotate/reconfigure privately. |
| `EMAIL_API_REJECTED` | `sender_policy` / `authentication_policy` | Sender allowlist or aligned DMARC/DKIM failed. Inspect provider metadata only in access-controlled tooling. Never bypass. |
| `EMAIL_API_REJECTED` | `parser_*` | Template not recognized. Create a fully redacted synthetic regression fixture; never log/copy real content. |
| `EMAIL_API_FAILED` | `internal_error` | Unexpected server/persistence failure. Correlate with infrastructure traces that obey the same redaction policy. |

External responses intentionally use generic rejection text. Detailed reasons exist only in controlled server diagnostics.

## Rollback, revocation, and incident response

1. Disable affected profiles (`POST /api/profile/email-ingestion/disable`) and remove the Gmail filter/forwarding destination.
2. Disable the Cloudflare Email Routing rule or detach the Worker to stop delivery.
3. If HMAC compromise is possible, rotate `EMAIL_INGESTION_SECRET` in both secret stores in a coordinated deployment; old in-flight deliveries will fail closed.
4. Rotate profile addresses with `rotate` if an opaque destination leaks; update Gmail, then disable the old route.
5. Roll back Worker/backend versions together when their payload contract changes. Never set `EMAIL_REQUIRE_AUTH_PASS=false` as rollback.
6. Investigate using event/reason/correlation only. Revoke exported logs that contain prohibited content and follow the organization's incident process.

## Production checklist

- [ ] Dedicated Cloudflare email subdomain, correct MX/SPF, no conflicting MX
- [ ] HTTPS backend origin; Worker redirect refusal retained
- [ ] Secret is random, >=32 characters, stored only in secret managers, identical at both ends
- [ ] Exact RBC sender domains confirmed; aligned DMARC/DKIM tests pass; auth enforcement true
- [ ] Mongo unique partial index verified in the deployed database
- [ ] Profile address treated as secret; Gmail filter is sender+subject scoped; no historical forwarding
- [ ] Server `npm test`; ingestion harness `npm run test:email-ingestion`; Worker `npm test` and `npm run check`; client lint/build all pass
- [ ] Logs/alerts use only documented diagnostics and retention/access controls are configured
- [ ] Authorized smoke test shows create, timestamp update, and no unexpected data
- [ ] Rollback owners, secret rotation, profile revocation, and parser-template incident process rehearsed
- [ ] Reconciliation limitations communicated; pending alerts are not treated as final ledger truth
