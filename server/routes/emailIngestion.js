import crypto from "crypto";
import express from "express";
import { createRateLimiter } from "../config/rateLimit.js";
import { Transaction } from "../model/data.js";
import { UserProfile } from "../model/userProfile.js";
import {
  extractRecipientToken,
  hasPassingEmailAuthentication,
  isAllowedSender,
  parseAllowedDomains,
  sha256Hex,
  verifyEmailIngestionSignature,
} from "../services/emailIngestionSecurity.js";
import { RbcEmailParseError, parseRbcPurchaseEmail } from "../services/rbcEmailParser.js";

const MAX_SUBJECT_LENGTH = 500;
const MAX_TEXT_LENGTH = 100_000;
const MAX_HEADER_LENGTH = 2_000;
const CORRELATION_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Accepts only safe correlation IDs before including them in diagnostics.
function safeCorrelationId(value) {
  return typeof value === "string" && CORRELATION_ID_PATTERN.test(value)
    ? value
    : crypto.randomUUID();
}

// Logs a fixed diagnostic schema rather than request or email contents.
function emitDiagnostic(logger, level, event, reason, correlationId) {
  logger[level](event, { event, reason, correlationId: safeCorrelationId(correlationId) });
}

// Formats the private forwarding address returned to an authenticated user.
function buildAddress(token, domain) {
  return token && domain ? `expenses+${token}@${domain}` : null;
}

// Shapes owner-visible profile state with the routing token embedded only in its forwarding address.
function publicEmailIngestionProfile(profile, domain, available) {
  return {
    available,
    enabled: Boolean(profile?.emailIngestionEnabled),
    address: available ? buildAddress(profile?.emailIngestionToken, domain) : null,
    createdAt: profile?.emailIngestionCreatedAt ?? null,
    lastReceivedAt: profile?.emailIngestionLastReceivedAt ?? null,
    institution: "rbc",
  };
}

// Applies explicit type and length limits to worker-supplied strings.
function isBoundedString(value, maxLength, { required = true } = {}) {
  if (value === undefined || value === null) return !required;
  return typeof value === "string" && (required ? value.length > 0 : true) && value.length <= maxLength;
}

// Validates the complete worker-to-server payload before policy or persistence work.
function validateWorkerPayload(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) return false;
  return (
    isBoundedString(body.messageId, MAX_HEADER_LENGTH) &&
    isBoundedString(body.from, MAX_HEADER_LENGTH) &&
    isBoundedString(body.to, MAX_HEADER_LENGTH) &&
    isBoundedString(body.subject, MAX_SUBJECT_LENGTH, { required: false }) &&
    isBoundedString(body.text, MAX_TEXT_LENGTH) &&
    isBoundedString(body.authenticationResults, MAX_HEADER_LENGTH, { required: false }) &&
    isBoundedString(body.receivedAt, 100) &&
    typeof body.correlationId === "string" && CORRELATION_ID_PATTERN.test(body.correlationId)
  );
}

// Recognizes only the compound idempotency constraint used by email transactions.
function isDuplicateKeyError(error) {
  return (
    error?.code === 11000 &&
    error?.keyPattern?.workosUserId === 1 &&
    error?.keyPattern?.sourceMessageIdHash === 1
  );
}

/** Builds profile controls and an internal ingestion endpoint with separate user and worker trust checks. */
export function buildEmailIngestionRouter({
  getAuthenticatedUser,
  csrfProtection,
  ingestionDomain = process.env.EMAIL_INGESTION_DOMAIN,
  ingestionSecret = process.env.EMAIL_INGESTION_SECRET,
  allowedSenderDomains = parseAllowedDomains(process.env.RBC_EMAIL_ALLOWED_DOMAINS),
  requireAuthenticationPass = process.env.EMAIL_REQUIRE_AUTH_PASS !== "false",
  timeZone = process.env.EMAIL_TRANSACTION_TIME_ZONE || "America/Vancouver",
  transactionModel = Transaction,
  profileModel = UserProfile,
  logger = console,
} = {}) {
  const router = express.Router();
  const stateChangingRoutes = csrfProtection ? [csrfProtection] : [];
  const userLimiter = createRateLimiter({ windowMs: 60 * 1000, maxRequests: 30 });
  const internalLimiter = createRateLimiter({ windowMs: 60 * 1000, maxRequests: 120 });
  const normalizedDomain = String(ingestionDomain ?? "").trim().toLowerCase();
  const available = Boolean(
    normalizedDomain &&
      ingestionSecret &&
      ingestionSecret.length >= 32 &&
      allowedSenderDomains.length > 0,
  );

  router.get(
    "/api/profile/email-ingestion",
    userLimiter,
    // Returns forwarding state only for the authenticated profile owner.
    async (req, res) => {
    const user = await getAuthenticatedUser(req, res);
    if (!user) return res.status(401).json({ message: "Unauthorized User" });

    try {
      const profile = await profileModel.findOne({ workosUserId: user.id }).select(
        "+emailIngestionToken",
      );
      return res.json(publicEmailIngestionProfile(profile, normalizedDomain, available));
    } catch (error) {
      emitDiagnostic(logger, "error", "EMAIL_PROFILE_FAILED", "load_failed");
      return res.status(500).json({ message: "Failed to load email tracking setup" });
    }
    },
  );

  router.post(
    "/api/profile/email-ingestion/rotate",
    userLimiter,
    ...stateChangingRoutes,
    // Rotates the authenticated owner's opaque address under CSRF protection when configured.
    async (req, res) => {
      const user = await getAuthenticatedUser(req, res);
      if (!user) return res.status(401).json({ message: "Unauthorized User" });
      if (!available) {
        return res.status(503).json({
          message: "Email tracking is not configured on this server",
        });
      }

      try {
        const token = crypto.randomBytes(24).toString("hex");
        const profile = await profileModel.findOneAndUpdate(
          { workosUserId: user.id },
          {
            $set: {
              email: user.email,
              emailIngestionToken: token,
              emailIngestionTokenHash: sha256Hex(token),
              emailIngestionEnabled: true,
              emailIngestionCreatedAt: new Date(),
            },
          },
          {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
            runValidators: true,
          },
        ).select("+emailIngestionToken");

        return res.status(200).json(
          publicEmailIngestionProfile(profile, normalizedDomain, available),
        );
      } catch (error) {
        emitDiagnostic(logger, "error", "EMAIL_PROFILE_FAILED", "rotate_failed");
        return res.status(500).json({ message: "Failed to create email tracking address" });
      }
    },
  );

  router.post(
    "/api/profile/email-ingestion/disable",
    userLimiter,
    ...stateChangingRoutes,
    // Disables ingestion only for the authenticated profile owner under CSRF protection.
    async (req, res) => {
      const user = await getAuthenticatedUser(req, res);
      if (!user) return res.status(401).json({ message: "Unauthorized User" });

      try {
        await profileModel.updateOne(
          { workosUserId: user.id },
          { $set: { emailIngestionEnabled: false } },
        );
        return res.json({ ok: true, enabled: false });
      } catch (error) {
        emitDiagnostic(logger, "error", "EMAIL_PROFILE_FAILED", "disable_failed");
        return res.status(500).json({ message: "Failed to disable email tracking" });
      }
    },
  );

  router.post(
    "/api/internal/email/rbc",
    internalLimiter,
    // Accepts worker payloads only after HMAC, sender policy, recipient ownership, and parser checks.
    async (req, res) => {
    const correlationId = safeCorrelationId(req.body?.correlationId);
    if (!available) {
      return res.status(503).json({ message: "Email ingestion is not configured" });
    }

    const signatureResult = verifyEmailIngestionSignature({
      secret: ingestionSecret,
      timestamp: req.get("x-trackergen-timestamp"),
      signature: req.get("x-trackergen-signature"),
      rawBody: req.rawBody,
    });
    if (!signatureResult.ok) {
      emitDiagnostic(logger, "warn", "EMAIL_API_REJECTED", `signature_${signatureResult.reason}`);
      return res.status(401).json({ message: "Ingestion request rejected" });
    }

    if (!validateWorkerPayload(req.body)) {
      emitDiagnostic(logger, "warn", "EMAIL_API_REJECTED", "invalid_payload", correlationId);
      return res.status(400).json({ message: "Ingestion request rejected" });
    }

    const token = extractRecipientToken(req.body.to, normalizedDomain);
    if (!token) {
      emitDiagnostic(logger, "warn", "EMAIL_API_REJECTED", "recipient_policy", correlationId);
      return res.status(403).json({ message: "Ingestion request rejected" });
    }

    if (!isAllowedSender(req.body.from, allowedSenderDomains)) {
      emitDiagnostic(logger, "warn", "EMAIL_API_REJECTED", "sender_policy", correlationId);
      return res.status(403).json({ message: "Ingestion request rejected" });
    }
    if (
      requireAuthenticationPass &&
      !hasPassingEmailAuthentication(
        req.body.authenticationResults,
        req.body.from,
        allowedSenderDomains,
      )
    ) {
      emitDiagnostic(logger, "warn", "EMAIL_API_REJECTED", "authentication_policy", correlationId);
      return res.status(403).json({ message: "Ingestion request rejected" });
    }

    try {
      const profile = await profileModel.findOne({
        emailIngestionTokenHash: sha256Hex(token),
        emailIngestionEnabled: true,
      });
      if (!profile) {
        emitDiagnostic(logger, "warn", "EMAIL_API_REJECTED", "recipient_policy", correlationId);
        return res.status(403).json({ message: "Ingestion request rejected" });
      }

      const parsed = parseRbcPurchaseEmail({
        subject: req.body.subject ?? "",
        text: req.body.text,
        receivedAt: req.body.receivedAt,
        timeZone,
      });
      const sourceMessageIdHash = sha256Hex(`${profile.workosUserId}:${req.body.messageId}`);

      const transaction = await transactionModel.create({
        workosUserId: profile.workosUserId,
        name: parsed.merchant,
        category: parsed.category,
        amount: -Math.abs(parsed.amount),
        authorizedAmount: parsed.amount,
        date: parsed.date,
        source: "email_rbc",
        status: parsed.status,
        institution: parsed.institution,
        currency: parsed.currency,
        accountLastFour: parsed.accountLastFour,
        ingestionConfidence: parsed.confidence,
        sourceMessageIdHash,
      });

      await profileModel.updateOne(
        { _id: profile._id },
        { $set: { emailIngestionLastReceivedAt: new Date() } },
      );

      emitDiagnostic(logger, "info", "EMAIL_API_ACCEPTED", "created", correlationId);
      return res.status(201).json({
        ok: true,
        transactionId: transaction._id,
        status: transaction.status,
      });
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        emitDiagnostic(logger, "info", "EMAIL_API_ACCEPTED", "duplicate", correlationId);
        return res.status(200).json({ ok: true, duplicate: true });
      }
      if (error instanceof RbcEmailParseError) {
        emitDiagnostic(logger, "warn", "EMAIL_API_REJECTED", `parser_${error.code}`, correlationId);
        return res.status(422).json({ message: "Ingestion request rejected" });
      }

      emitDiagnostic(logger, "error", "EMAIL_API_FAILED", "internal_error", correlationId);
      return res.status(500).json({ message: "Failed to process purchase email" });
    }
    },
  );

  return router;
}
