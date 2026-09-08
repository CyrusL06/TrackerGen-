import express from "express";
import crypto from "crypto";
import mongoose from "mongoose";
import { Transaction } from "../model/data.js"
import {UserProfile}  from "../model/userProfile.js"
import { createRateLimiter } from "../config/rateLimit.js";

const VALID_CATEGORIES = new Set([
    "Housing",
    "Shopping",
    "Utilities",
    "Food & Drink",
    "Income",
    "Transport",
    "Dining",
    "Subscriptions",
    "Other",
]);

const MAX_NAME_LENGTH = 200;
const MAX_AMOUNT = 1_000_000_000;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// Confirms an untrusted date is both ISO-shaped and a real UTC calendar date.
function isValidIsoDate(value) {
    if (typeof value !== "string" || !DATE_REGEX.test(value)) return false;
    const [year, month, day] = value.split("-").map(
        // Converts each fixed date segment for calendar validation.
        Number,
    );
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.getUTCFullYear() === year
        && date.getUTCMonth() === month - 1
        && date.getUTCDate() === day;
}

/** Validates client transaction fields before they are persisted for an authenticated owner. */
export function validateTransactionInput(body) {
    const errors = [];

    if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
        errors.push("name is required");
    } else if (body.name.length > MAX_NAME_LENGTH) {
        errors.push(`name must be at most ${MAX_NAME_LENGTH} characters`);
    }

    const amount = Number(body.amount);
    if (!Number.isFinite(amount) || Number.isNaN(amount)) {
        errors.push("amount must be a valid number");
    } else if (amount === 0) {
        errors.push("amount must be non-zero");
    } else if (Math.abs(amount) > MAX_AMOUNT) {
        errors.push(`amount must not exceed ${MAX_AMOUNT}`);
    }

    if (!body.category || typeof body.category !== "string") {
        errors.push("category is required");
    } else if (!VALID_CATEGORIES.has(body.category)) {
        errors.push(`category must be one of: ${[...VALID_CATEGORIES].join(", ")}`);
    }

    if (!isValidIsoDate(body.date)) {
        errors.push("date must be a valid calendar date in YYYY-MM-DD format");
    }

    return errors;
}

// Bounds optional onboarding preferences before profile persistence.
function validateOnboardingInput(body) {
    const errors = [];
    const goal = Number(body.monthlyGoal);

    if (body.monthlyGoal !== undefined && body.monthlyGoal !== null && body.monthlyGoal !== "") {
        if (!Number.isFinite(goal) || goal < 0 || goal > MAX_AMOUNT) {
            errors.push("monthlyGoal must be a non-negative number");
        }
    }

    if (body.wantsReminders && !["yes", "not-now"].includes(body.wantsReminders)) {
        errors.push('wantsReminders must be "yes" or "not-now"');
    }

    if (body.preferredChannel && !["discord", "telegram", "none"].includes(body.preferredChannel)) {
        errors.push('preferredChannel must be "discord", "telegram", or "none"');
    }

    return errors;
}

/** Creates an opaque linking credential for the caller to assign an owner and expiry. */
export function createTelegramLinkCode() {
    return `TG-${crypto.randomBytes(24).toString("base64url")}`;
}

// Builds the redacted chat-ID preview returned alongside the raw owner-visible value.
function maskChatId(chatId) {
    if (!chatId) return null;
    return `...${String(chatId).slice(-4)}`;
}

// Builds the redacted user-ID preview returned alongside the raw owner-visible value.
function maskTelegramId(telegramId) {
    if (!telegramId) return null;
    return `...${String(telegramId).slice(-4)}`;
}

// Rejects malformed client identifiers before owner-scoped database queries.
function isValidObjectId(id) {
    return typeof id === "string" && mongoose.Types.ObjectId.isValid(id);
}

/** Builds owner-scoped profile and transaction routes with rate limiting and optional CSRF middleware. */
export function buildRouter({getAuthenticatedUser, csrfProtection}){
    const router = express.Router()
    const stateChangingRoutes = csrfProtection ? [csrfProtection] : [];
    const apiLimiter = createRateLimiter({ windowMs: 60 * 1000, maxRequests: 100 });

router.get(
    "/api/profile",
    apiLimiter,
    // Returns profile data only for the authenticated WorkOS owner.
    async (req,res) => {
    const user = await getAuthenticatedUser(req,res);

    if(!user){
        return res.status(401).json({message:"Unauthorized User"})
    }

    const profile = await UserProfile.findOne({
        workosUserId: user.id
    })
    return res.json({profile});

    },
)

router.post(
    "/api/profile/onboarding-complete",
    apiLimiter,
    ...stateChangingRoutes,
    // Persists validated onboarding fields for the authenticated profile owner.
    async (req, res) => {
    const user = await getAuthenticatedUser(req);

    if (!user) {
        return res.status(401).json({ message: "Unauthorized User" });
    }

    try {
        const validationErrors = validateOnboardingInput(req.body);
        if (validationErrors.length > 0) {
            return res.status(400).json({ message: validationErrors.join("; ") });
        }

        const setFields = {
            email: user.email,
            wantsReminders: req.body.wantsReminders,
            preferredChannel: req.body.preferredChannel ?? null,
            hasCompletedOnboarding: true,
            completedOnboardingAt: new Date(),
        };

        if (req.body.monthlyGoal !== undefined && req.body.monthlyGoal !== null && req.body.monthlyGoal !== "") {
            setFields.monthlyGoal = Number(req.body.monthlyGoal);
        }

        const profile = await UserProfile.findOneAndUpdate(
            { workosUserId: user.id },
            { $set: setFields },
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true,
                runValidators: true,
            },
        );

        return res.status(200).json({ ok: true, profile });
    } catch (error) {
        console.error("Failed to save onboarding profile:", error.message || error);
        return res.status(500).json({ message: "Failed to save onboarding profile" });
    }
    },
)

router.get(
    "/api/profile/telegram",
    apiLimiter,
    // Returns Telegram linkage state for the authenticated profile owner.
    async (req, res) => {
    const user = await getAuthenticatedUser(req);

    if (!user) {
        return res.status(401).json({ message: "Unauthorized User" });
    }

    const profile = await UserProfile.findOne({ workosUserId: user.id });
    const now = new Date();
    const hasActiveCode =
        Boolean(profile?.telegramLinkCode) &&
        profile.telegramLinkCodeExpiresAt &&
        profile.telegramLinkCodeExpiresAt > now;

    return res.json({
        linked: Boolean(profile?.telegramChatId),
        chatId: profile?.telegramChatId ?? null,
        chatIdPreview: maskChatId(profile?.telegramChatId),
        userId: profile?.telegramUserId ?? null,
        userIdPreview: maskTelegramId(profile?.telegramUserId),
        telegramUsername: profile?.telegramUsername ?? null,
        linkedAt: profile?.telegramLinkedAt ?? null,
        linkCode: hasActiveCode ? profile.telegramLinkCode : null,
        linkCommand: hasActiveCode ? `/link ${profile.telegramLinkCode}` : null,
        botUsername: process.env.TELEGRAM_BOT_USERNAME ?? null,
    });
    },
)

router.post(
    "/api/profile/telegram-link-code",
    apiLimiter,
    ...stateChangingRoutes,
    // Issues a temporary Telegram link credential for the authenticated profile owner.
    async (req, res) => {
    const user = await getAuthenticatedUser(req);

    if (!user) {
        return res.status(401).json({ message: "Unauthorized User" });
    }

    try {
        const linkCode = createTelegramLinkCode();
        const expiresAt = new Date(Date.now() + 1000 * 60 * 15);

        const profile = await UserProfile.findOneAndUpdate(
            { workosUserId: user.id },
            {
                $set: {
                    email: user.email,
                    telegramLinkCode: linkCode,
                    telegramLinkCodeExpiresAt: expiresAt,
                },
            },
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true,
                runValidators: true,
            },
        );

        return res.status(200).json({
            linked: Boolean(profile.telegramChatId),
            chatId: profile.telegramChatId ?? null,
            chatIdPreview: maskChatId(profile.telegramChatId),
            userId: profile.telegramUserId ?? null,
            userIdPreview: maskTelegramId(profile.telegramUserId),
            telegramUsername: profile.telegramUsername ?? null,
            linkCode,
            linkCommand: `/link ${linkCode}`,
            expiresAt,
            botUsername: process.env.TELEGRAM_BOT_USERNAME ?? null,
        });
    } catch (error) {
        console.error("Failed to create Telegram link code:", error.message || error);
        return res.status(500).json({ message: "Failed to create Telegram link code" });
    }
    },
)

router.get(
    "/api/transactions",
    apiLimiter,
    // Fetches transactions constrained to the authenticated owner's identifier.
    async (req,res) => {

    const user = await getAuthenticatedUser(req,res);

    if (!user) {
        return res.status(401).json({message:"Unauthorized User"})
    }

    try {
        
        const transactions = await Transaction.find({
            workosUserId: user.id,
        });

        // const userProfile = await UserProfile.find();

        if(transactions.length == 0){
            return res.status(200).json({message: "No Transaction for User Found"})
        }

         res.status(200).json(transactions)

    } catch (error) {
        console.error("Failed to fetch transactions:", error.message || error)
        res.status(500).json({message:"Failed to fetch Transactions"})
    }
    },
)

router.post(
    "/api/transactions",
    apiLimiter,
    ...stateChangingRoutes,
    // Creates a validated transaction owned by the authenticated user.
    async(req,res) => {
    const user = await getAuthenticatedUser(req,res);

    if (!user) {
        return res.status(401).json({message:"Unauthorized User"})
    }

    try {
        const validationErrors = validateTransactionInput(req.body);
        if (validationErrors.length > 0) {
            return res.status(400).json({ message: validationErrors.join("; ") });
        }

        const transaction = await Transaction.create({
        workosUserId: user.id,
        name: req.body.name.trim(),
        category: req.body.category,
        amount: Number(req.body.amount),
        date: req.body.date
        
    })

        return res.status(201).json({transaction})

    } catch (error) {
        console.error("Failed to post transaction:", error.message || error)
        res.status(500).json({message:"Failed to post Transactions"})
    }

    },
)

router.put(
    "/api/transactions/:id",
    apiLimiter,
    ...stateChangingRoutes,
    // Updates a validated transaction only when its identifier and owner both match.
    async (req, res) => {
    const user = await getAuthenticatedUser(req);

    if (!user) {
        return res.status(401).json({ message: "Unauthorized User" });
    }

    if (!isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: "Invalid transaction ID" });
    }

    try {
        const validationErrors = validateTransactionInput(req.body);
        if (validationErrors.length > 0) {
            return res.status(400).json({ message: validationErrors.join("; ") });
        }

        const updatedTransaction = await Transaction.findOneAndUpdate(
            {
                _id: req.params.id,
                workosUserId: user.id,
            },
            {
                $set: {
                    name: req.body.name.trim(),
                    category: req.body.category,
                    amount: Number(req.body.amount),
                    date: req.body.date,
                },
            },
            { new: true, runValidators: true },
        );

        if (!updatedTransaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        return res.status(200).json({ transaction: updatedTransaction });
    } catch (error) {
        console.error("Failed to update transaction:", error.message || error);
        return res.status(500).json({ message: "Failed to update transaction" });
    }
    },
)


router.delete(
    "/api/transactions/:id",
    apiLimiter,
    ...stateChangingRoutes,
    // Deletes a transaction only when its identifier and authenticated owner both match.
    async (req,res) => {
    const user = await getAuthenticatedUser(req);

    try {

        if (!user) {
            return res.status(401).json({ message: "Unauthorized User" });
        }

        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid transaction ID" });
        }

        const deleted = await Transaction.findOneAndDelete({
            _id: req.params.id,
            workosUserId: user.id,
        })

        if (!deleted) {
            return res.status(404).json({ message: "Transaction not found" });
         }

        return res.json({ok:true})

    } catch (error) {
         console.error("Failed to delete transaction:", error.message || error);
         return res.status(500).json({ message: "Failed to delete transaction" });
    }

    },
)

    return router
}
