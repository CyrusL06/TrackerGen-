import express from "express";
import crypto from "crypto";
import { Transaction } from "../model/data.js"
import {UserProfile}  from "../model/userProfile.js"

//Debug the database collection name
console.log("Transaction collection:", Transaction.collection.name);
console.log("UserProfile collection:", UserProfile.collection.name);

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

export function buildRouter({getAuthenticatedUser}){
    const router = express.Router()
router.use(express.urlencoded({extended:true}))

router.get("/api/profile", async (req,res) => {
    const user = await getAuthenticatedUser(req,res);

    if(!user){
        return res.status(401).json({message:"Unauthorized User"})
    }

    const profile = await UserProfile.findOne({
        workosUserId: user.id
    })

    return res.json({profile});

})

router.post("/api/profile/onboarding-complete", async (req, res) => {
    const user = await getAuthenticatedUser(req);

    if (!user) {
        return res.status(401).json({ message: "Unauthorized User" });
    }

    try {
        const profile = await UserProfile.findOneAndUpdate(
            { workosUserId: user.id },
            {
                $set: {
                    email: user.email,
                    monthlyGoal: Number(req.body.monthlyGoal),
                    wantsReminders: req.body.wantsReminders,
                    preferredChannel: req.body.preferredChannel ?? null,
                    hasCompletedOnboarding: true,
                    completedOnboardingAt: new Date(),
                },
            },
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true,
            },
        );

        return res.status(200).json({ ok: true, profile });
    } catch (error) {
        console.log(`ERROR ${error}`);
        return res.status(500).json({ message: "Failed to save onboarding profile" });
    }
})

router.get("/api/profile/telegram", async (req, res) => {
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

router.post("/api/profile/telegram-link-code", async (req, res) => {
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
        console.log(`ERROR ${error}`);
        return res.status(500).json({ message: "Failed to create Telegram link code" });
    }
})

//Fetch transaction of each user
router.get("/api/transactions", async (req,res) => {

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
        console.log(`ERROR ${error}`)
        res.status(500).json({message:"Failed to fetch Transactions"})
    }
})

//AdD Transaction
router.post("/api/transactions", async(req,res) => {
    const user = await getAuthenticatedUser(req,res);

    if (!user) {
        return res.status(401).json({message:"Unauthorized User"})
    }

    try {
        const transaction = await Transaction.create({
        workosUserId: user.id,
        name: req.body.name,
        category: req.body.category,
        amount: req.body.amount,
        date: req.body.date
        
    })

        return res.status(201).json({transaction})

    } catch (error) {
        console.log(`ERROR ${error}`)
        res.status(500).json({message:"Failed to post Transactions"})
    }

})

router.put("/api/transactions/:id", async (req, res) => {
    const user = await getAuthenticatedUser(req);

    if (!user) {
        return res.status(401).json({ message: "Unauthorized User" });
    }

    try {
        const updatedTransaction = await Transaction.findOneAndUpdate(
            {
                _id: req.params.id,
                workosUserId: user.id,
            },
            {
                $set: {
                    name: req.body.name,
                    category: req.body.category,
                    amount: req.body.amount,
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
        console.log(`ERROR ${error}`);
        return res.status(500).json({ message: "Failed to update transaction" });
    }
})


router.delete("/api/transactions/:id", async (req,res) => {
    const user = await getAuthenticatedUser(req);

    try {

        if (!user) {
            return res.status(401).json({ message: "Unauthorized User" });
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
         console.log(`ERROR ${error}`);
         return res.status(500).json({ message: "Failed to delete transaction" });
    }

})

    return router
}
