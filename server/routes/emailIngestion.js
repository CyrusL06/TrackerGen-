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

function buildAddress(token, domain) {
  return token && domain ? `expenses+${token}@${domain}` : null;
}

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

function isBoundedString(value, maxLength, { required = true } = {}) {
  if (value === undefined || value === null) return !required;
  return typeof value === "string" && value.length > 0 && value.length <= maxLength;
}

function validateWorkerPayload(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) return false;
  return (
    isBoundedString(body.messageId, MAX_HEADER_LENGTH) &&
    isBoundedString(body.from, MAX_HEADER_LENGTH) &&
    isBoundedString(body.to, MAX_HEADER_LENGTH) &&
    isBoundedString(body.subject, MAX_SUBJECT_LENGTH, { required: false }) &&
    isBoundedString(body.text, MAX_TEXT_LENGTH) &&
    isBoundedString(body.authenticationResults, MAX_HEADER_LENGTH, { required: false }) &&
    isBoundedString(body.receivedAt, 100)
  );
}

function isDuplicateKeyError(error) {
  return error?.code === 11000;
}

export function buildEmailIngestionRouter({
  getAuthenticatedUser,
  csrfProtection,
  ingestionDomain = process.env.EMAIL_INGESTION_DOMAIN,
  ingestionSecret = process.env.EMAIL_INGESTION_SECRET,
  allowedSenderDomains = parseAllowedDomains(process.env.RBC_EMAIL_ALLOWED_DOMAINS),
  requireAuthenticationPass = process.env.EMAIL_REQUIRE_AUTH_PASS !== "false",
  timeZone = process.env.EMAIL_TRANSACTION_TIME_ZONE || "America/Vancouver",
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

  router.get("/api/profile/email-ingestion", userLimiter, async (req, res) => {
    const user = await getAuthenticatedUser(req, res);
    if (!user) return res.status(401).json({ message: "Unauthorized User" });

    try {
      const profile = await UserProfile.findOne({ workosUserId: user.id }).select(
        "+emailIngestionToken",
      );
      return res.json(publicEmailIngestionProfile(profile, normalizedDomain, available));
    } catch (error) {
      console.error("Failed to load email ingestion profile:", error.message || error);
      return res.status(500).json({ message: "Failed to load email tracking setup" });
    }
  });

  router.post(
    "/api/profile/email-ingestion/rotate",
    userLimiter,
    ...stateChangingRoutes,
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
        const profile = await UserProfile.findOneAndUpdate(
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
        console.error("Failed to rotate email ingestion address:", error.message || error);
        return res.status(500).json({ message: "Failed to create email tracking address" });
      }
    },
  );

  router.post(
    "/api/profile/email-ingestion/disable",
    userLimiter,
    ...stateChangingRoutes,
    async (req, res) => {
      const user = await getAuthenticatedUser(req, res);
      if (!user) return res.status(401).json({ message: "Unauthorized User" });

      try {
        await UserProfile.updateOne(
          { workosUserId: user.id },
          { $set: { emailIngestionEnabled: false } },
        );
        return res.json({ ok: true, enabled: false });
      } catch (error) {
        console.error("Failed to disable email ingestion:", error.message || error);
        return res.status(500).json({ message: "Failed to disable email tracking" });
      }
    },
  );

  router.post("/api/internal/email/rbc", internalLimiter, async (req, res) => {
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
      return res.status(401).json({ message: "Invalid ingestion signature" });
    }

    if (!validateWorkerPayload(req.body)) {
      return res.status(400).json({ message: "Invalid email ingestion payload" });
    }

    const token = extractRecipientToken(req.body.to, normalizedDomain);
    if (!token) return res.status(404).json({ message: "Unknown ingestion address" });

    if (!isAllowedSender(req.body.from, allowedSenderDomains)) {
      return res.status(403).json({ message: "Untrusted email sender" });
    }
    if (
      requireAuthenticationPass &&
      !hasPassingEmailAuthentication(
        req.body.authenticationResults,
        req.body.from,
        allowedSenderDomains,
      )
    ) {
      return res.status(403).json({ message: "Email authentication did not pass" });
    }

    try {
      const profile = await UserProfile.findOne({
        emailIngestionTokenHash: sha256Hex(token),
        emailIngestionEnabled: true,
      });
      if (!profile) return res.status(404).json({ message: "Unknown ingestion address" });

      const parsed = parseRbcPurchaseEmail({
        subject: req.body.subject ?? "",
        text: req.body.text,
        receivedAt: req.body.receivedAt,
        timeZone,
      });
      const sourceMessageIdHash = sha256Hex(`${profile.workosUserId}:${req.body.messageId}`);

      const transaction = await Transaction.create({
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

      await UserProfile.updateOne(
        { _id: profile._id },
        { $set: { emailIngestionLastReceivedAt: new Date() } },
      );

      return res.status(201).json({
        ok: true,
        transactionId: transaction._id,
        status: transaction.status,
      });
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        return res.status(200).json({ ok: true, duplicate: true });
      }
      if (error instanceof RbcEmailParseError) {
        return res.status(422).json({ message: "RBC purchase email was not recognized" });
      }

      console.error("Failed to ingest RBC purchase email:", error.message || error);
      return res.status(500).json({ message: "Failed to process purchase email" });
    }
  });

  return router;
}
