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

function validateTransactionInput(body) {
    const errors = [];

    if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
        errors.push("name is required");
    } else if (body.name.length > MAX_NAME_LENGTH) {
        errors.push(`name must be at most ${MAX_NAME_LENGTH} characters`);
    }

    const amount = Number(body.amount);
    if (!Number.isFinite(amount) || Number.isNaN(amount)) {
        errors.push("amount must be a valid number");
    } else if (Math.abs(amount) > MAX_AMOUNT) {
        errors.push(`amount must not exceed ${MAX_AMOUNT}`);
    }

    if (!body.category || typeof body.category !== "string") {
        errors.push("category is required");
    } else if (!VALID_CATEGORIES.has(body.category)) {
        errors.push(`category must be one of: ${[...VALID_CATEGORIES].join(", ")}`);
    }

    if (!body.date || typeof body.date !== "string" || !DATE_REGEX.test(body.date)) {
        errors.push("date must be in YYYY-MM-DD format");
    }

    return errors;
}

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

function createTelegramLinkCode() {
    return `TG-${crypto.randomInt(100000, 999999)}`;
}

function maskChatId(chatId) {
    if (!chatId) return null;
    return `...${String(chatId).slice(-4)}`;
}

function maskTelegramId(telegramId) {
    if (!telegramId) return null;
    return `...${String(telegramId).slice(-4)}`;
}

function isValidObjectId(id) {
    return typeof id === "string" && mongoose.Types.ObjectId.isValid(id);
}

export function buildRouter({getAuthenticatedUser, csrfProtection}){
    const router = express.Router()
    const stateChangingRoutes = csrfProtection ? [csrfProtection] : [];
    const apiLimiter = createRateLimiter({ windowMs: 60 * 1000, maxRequests: 100 });

router.get("/api/profile", apiLimiter, async (req,res) => {
    const user = await getAuthenticatedUser(req,res);

    if(!user){
        return res.status(401).json({message:"Unauthorized User"})
    }

    const profile = await UserProfile.findOne({
        workosUserId: user.id
    })
    return res.json({profile});

})

router.post("/api/profile/onboarding-complete", apiLimiter, ...stateChangingRoutes, async (req, res) => {
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
})

router.get("/api/profile/telegram", apiLimiter, async (req, res) => {
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
})

router.post("/api/profile/telegram-link-code", apiLimiter, ...stateChangingRoutes, async (req, res) => {
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
})

//Fetch transaction of each user
router.get("/api/transactions", apiLimiter, async (req,res) => {

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
})

//AdD Transaction
router.post("/api/transactions", apiLimiter, ...stateChangingRoutes, async(req,res) => {
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

})

router.put("/api/transactions/:id", apiLimiter, ...stateChangingRoutes, async (req, res) => {
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
})


router.delete("/api/transactions/:id", apiLimiter, ...stateChangingRoutes, async (req,res) => {
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

})

    return router
}
