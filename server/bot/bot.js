import TelegramBot from "node-telegram-bot-api";
import { Transaction } from "../model/data.js";
import { UserProfile } from "../model/userProfile.js";

const HELP_TEXT = [
    "Hey Boss here are the commands:",
    "/link TG-123456 - connect Telegram to your TrackerGen account",
    "expense coffee 6.50 food  -> add an expense",
    "income paycheck 1200 work -> add income",
    "/summary - show this month's totals",
    "/recent - show recent transaction totals",
].join("\n");

const RECENT_TRANSACTION_LIMIT = 5;

const botStartedAt = Math.floor(Date.now() / 1000);

const CATEGORY_ALIASES = {
    food: "Food & Drink",
    coffee: "Food & Drink",
    dining: "Dining",
    restaurant: "Dining",
    rent: "Housing",
    housing: "Housing",
    shopping: "Shopping",
    shop: "Shopping",
    transport: "Transport",
    transportation: "Transport",
    ride: "Transport",
    utilities: "Utilities",
    utility: "Utilities",
    subscription: "Subscriptions",
    subscriptions: "Subscriptions",
    work: "Income",
    salary: "Income",
    paycheck: "Income",
    income: "Income",
};

function todayIsoDate() {
    return new Date().toISOString().slice(0, 10);
}

function formatMoney(value) {
    return `$${Math.abs(value).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

function formatSignedMoney(value) {
    const sign = value >= 0 ? "+" : "-";
    return `${sign}${formatMoney(value)}`;
}

function parseAmountToken(token) {
    const cleaned = token.replace(/[$,]/g, "");
    const amount = Number(cleaned);
    return Number.isFinite(amount) && amount > 0 ? amount : null;
}

function normalizeCategory(rawCategory, type) {
    if (!rawCategory) {
        return type === "income" ? "Income" : "Other";
    }

    return CATEGORY_ALIASES[rawCategory.toLowerCase()] ?? rawCategory;
}

export function parseTransactionText(text, type) {
    const [, ...parts] = text.trim().split(/\s+/);
    const amountIndex = parts.findIndex((part) => parseAmountToken(part) !== null);

    if (amountIndex === -1) {
        return null;
    }

    const amount = parseAmountToken(parts[amountIndex]);
    const beforeAmount = parts.slice(0, amountIndex);
    const afterAmount = parts.slice(amountIndex + 1);
    const category = normalizeCategory(afterAmount[0], type);
    const nameParts =
        beforeAmount.length > 0
            ? beforeAmount
            : afterAmount.length > 1
              ? afterAmount.slice(1)
              : afterAmount;
    const name = nameParts.join(" ");

    if (!Number.isFinite(amount) || amount <= 0 || !category || !name) {
        return null;
    }

    return {
        name,
        category,
        amount: type === "expense" ? -Math.abs(amount) : Math.abs(amount),
        date: todayIsoDate(),
    };
}

async function findLinkedProfile(chatId) {
    return UserProfile.findOne({ telegramChatId: String(chatId) });
}

function getTelegramMessageIdentity(msg) {
    return {
        chatId: String(msg.chat.id),
        messageId: msg.message_id ? String(msg.message_id) : null,
        userId: msg.from?.id ? String(msg.from.id) : null,
    };
}

function getTelegramUser(msg) {
    return {
        userId: msg.from?.id ? String(msg.from.id) : null,
        username: msg.from?.username ?? null,
    };
}

async function sendMonthlySummary(bot, chatId, workosUserId) {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .slice(0, 10);

    const transactions = await Transaction.find({
        workosUserId,
        date: { $gte: monthStart },
    });

    const income = transactions
        .filter((transaction) => transaction.amount > 0)
        .reduce((sum, transaction) => sum + transaction.amount, 0);
    const expenses = transactions
        .filter((transaction) => transaction.amount < 0)
        .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
    const net = income - expenses;

    await bot.sendMessage(
        chatId,
        [
            "This month in TrackerGen:",
            `Income: ${formatMoney(income)}`,
            `Expenses: ${formatMoney(expenses)}`,
            `Net: ${net >= 0 ? "+" : "-"}${formatMoney(net)}`,
            `Entries: ${transactions.length}`,
        ].join("\n"),
    );
}

async function sendRecentTransactionSummary(bot, chatId, workosUserId) {
    const transactions = await Transaction.find({ workosUserId })
        .sort({ createdAt: -1 })
        .limit(RECENT_TRANSACTION_LIMIT);

    if (transactions.length === 0) {
        await bot.sendMessage(chatId, "No recent TrackerGen transactions yet.");
        return;
    }

    const income = transactions
        .filter((transaction) => transaction.amount > 0)
        .reduce((sum, transaction) => sum + transaction.amount, 0);
    const expenses = transactions
        .filter((transaction) => transaction.amount < 0)
        .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
    const net = income - expenses;
    const recentLines = transactions.map((transaction, index) => {
        return `${index + 1}. ${transaction.name} (${transaction.category}) ${formatSignedMoney(transaction.amount)}`;
    });

    await bot.sendMessage(
        chatId,
        [
            `Recent ${transactions.length} transactions:`,
            ...recentLines,
            "",
            `Recent income: ${formatMoney(income)}`,
            `Recent expenses: ${formatMoney(expenses)}`,
            `Recent net: ${formatSignedMoney(net)}`,
        ].join("\n"),
    );
}

async function handleLinkCommand(bot, msg, text) {
    const chatId = String(msg.chat.id);
    const { userId, username } = getTelegramUser(msg);
    const linkCode = text
        .replace(/^\/(?:link|start)(?:@\w+)?\s+/i, "")
        .trim()
        .toUpperCase();

    if (!linkCode) {
        await bot.sendMessage(chatId, "Send your code like this: /link TG-123456");
        return;
    }

    const profile = await UserProfile.findOneAndUpdate(
        {
            telegramLinkCode: linkCode,
            telegramLinkCodeExpiresAt: { $gt: new Date() },
        },
        {
            $set: {
                telegramChatId: chatId,
                telegramUserId: userId,
                telegramUsername: username,
                telegramLinkedAt: new Date(),
            },
            $unset: {
                telegramLinkCode: "",
                telegramLinkCodeExpiresAt: "",
            },
        },
        { new: true },
    );

    if (!profile) {
        console.log(`Telegram link failed for chat ${chatId} with code ${linkCode}`);
        await bot.sendMessage(chatId, "That link code is invalid or expired. Generate a new code in TrackerGen.");
        return;
    }

    console.log(
        `Telegram linked chat ${chatId} and user ${userId} to TrackerGen user ${profile.workosUserId}`,
    );
    await bot.sendMessage(chatId, "Telegram is connected to TrackerGen. Try: expense coffee 6.50 food");
}

async function handleTransactionCommand(bot, msg, text, type) {
    const { chatId, messageId, userId } = getTelegramMessageIdentity(msg);
    const profile = await findLinkedProfile(chatId);

    if (!profile) {
        console.log(`Telegram ${type} rejected because chat ${chatId} is not linked`);
        await bot.sendMessage(chatId, "Connect first from TrackerGen, then send /link TG-123456 here.");
        return;
    }

    if (messageId) {
        const existingTransaction = await Transaction.findOne({
            source: "telegram",
            telegramChatId: chatId,
            telegramMessageId: messageId,
        });

        if (existingTransaction) {
            console.log(
                `Skipped duplicate Telegram message ${messageId} from chat ${chatId}`,
            );
            await bot.sendMessage(
                chatId,
                `That Telegram message was already saved as ${existingTransaction.name}.`,
            );
            await sendRecentTransactionSummary(bot, chatId, profile.workosUserId);
            return;
        }
    }

    const parsed = parseTransactionText(text, type);

    if (!parsed) {
        await bot.sendMessage(
            chatId,
            `Use: ${type} description amount category\nExample: ${type} coffee 6.50 food`,
        );
        return;
    }

    const transaction = await Transaction.create({
        workosUserId: profile.workosUserId,
        source: "telegram",
        telegramChatId: chatId,
        telegramUserId: userId,
        telegramMessageId: messageId,
        ...parsed,
    });

    console.log(
        `Telegram created transaction ${transaction._id} for user ${profile.workosUserId}`,
    );

    await bot.sendMessage(
        chatId,
        [
            `Saved to TrackerGen: ${parsed.name}`,
            `${type === "expense" ? "Expense" : "Income"}: ${type === "expense" ? "-" : "+"}${formatMoney(parsed.amount)}`,
            `Category: ${parsed.category}`,
            // `Database id: ${transaction._id}`,
        ].join("\n"),
    );

    await sendRecentTransactionSummary(bot, chatId, profile.workosUserId);
}

export function startTelegramBot() {
    const token = process.env.BOT_TOKEN;

    if (!token) {
        console.log("Telegram bot is disabled because BOT_TOKEN is not set.");
        return null;
    }

    const bot = new TelegramBot(token, { polling: true });

    bot.on("message", async (msg) => {
        const chatId = String(msg.chat.id);
        const text = msg.text?.trim() ?? "";

        try {
            if (msg.date && msg.date < botStartedAt) {
                console.log(
                    `Ignored old Telegram message ${msg.message_id} from chat ${chatId}`,
                );
                return;
            }

            if (!text || /^\/?help(?:@\w+)?$/i.test(text) || /^\/start(?:@\w+)?$/i.test(text)) {
                await bot.sendMessage(chatId, HELP_TEXT);
                return;
            }

            console.log(`Telegram message from chat ${chatId}: ${text}`);

            if (/^\/(?:link|start)(?:@\w+)?\s+/i.test(text)) {
                await handleLinkCommand(bot, msg, text);
                return;
            }

            if (/^expense\s+/i.test(text)) {
                await handleTransactionCommand(bot, msg, text, "expense");
                return;
            }

            if (/^income\s+/i.test(text)) {
                await handleTransactionCommand(bot, msg, text, "income");
                return;
            }

            if (/^\/?summary(?:@\w+)?$/i.test(text)) {
                const profile = await findLinkedProfile(chatId);

                if (!profile) {
                    await bot.sendMessage(chatId, "Connect first from TrackerGen, then send /link TG-123456 here.");
                    return;
                }

                await sendMonthlySummary(bot, chatId, profile.workosUserId);
                return;
            }

            if (/^\/?recent(?:@\w+)?$/i.test(text)) {
                const profile = await findLinkedProfile(chatId);

                if (!profile) {
                    await bot.sendMessage(chatId, "Connect first from TrackerGen, then send /link TG-123456 here.");
                    return;
                }

                await sendRecentTransactionSummary(bot, chatId, profile.workosUserId);
                return;
            }

            await bot.sendMessage(chatId, HELP_TEXT);
        } catch (error) {
            console.log("Telegram bot error:", error);
            await bot.sendMessage(chatId, "Something went wrong while updating TrackerGen.");
        }
    });

    console.log("Telegram bot polling started.");
    return bot;
}
