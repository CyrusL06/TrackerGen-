import TelegramBot from "node-telegram-bot-api";
import { Transaction } from "../model/data.js";
import { UserProfile } from "../model/userProfile.js";
import { ProxyAgent } from "undici";



// WELCOME MESSGAHE WHEN BOT STARTs
const HELP_TEXT = [
    "What's up boss",
    "Here are the commands:",
    "________________________",
    "/add - choose Income or Expense with buttons",
    "/link TG-123456 - connect Telegram to your TrackerGen account",
    "/summary - show this month's totals",
    "/recent - show recent transaction totals",
    "/cancel - cancel the current button entry",
    "______________________________",
    "As example if needed:",
    "expense coffee 6.50 food  -> add an expense",
    "income paycheck 1200 work -> add income",
].join("\n");

//Revent transsaction limit per user
const RECENT_TRANSACTION_LIMIT = 5;
const TRANSACTION_TYPE_CALLBACK_PREFIX = "transaction_type:";
const MESSAGE_DELETE_DELAY_MS = 5 * 60 * 1000;
const LINK_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const LINK_RATE_LIMIT_MAX_ATTEMPTS = 5;
const MAX_TELEGRAM_AMOUNT = 1_000_000_000;

const botStartedAt = Math.floor(Date.now() / 1000);
const pendingTransactionTypes = new Map();
const linkAttempts = new Map();


/*
 * AUG - 10  2026
 * 1:41pm TO BE DONBE....
 * PROBLEM: User have different type of SETS
 *
 * Need to have this fix to have a custom categry so have
 * 4-5 catgerory and have add button custom to be added
 *
 * Change the DB Schema and havbe that fix
 * */

const VALID_CATEGORIES = new Set([
    "Housing", "Shopping", "Utilities", "Food & Drink",
    "Income", "Transport", "Dining", "Subscriptions", "Other",
]);




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

/** Produces the server's current ISO date for bot-created transaction records. */
function todayIsoDate() {
    return new Date().toISOString().slice(0, 10);
}

/** Formats numeric transaction data for display without changing stored ownership or value. */
function formatMoney(value) {
    return `$${Math.abs(value).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

/** Adds transaction direction to a display-only monetary value. */
function formatSignedMoney(value) {
    const sign = value >= 0 ? "+" : "-";
    return `${sign}${formatMoney(value)}`;
}

/** Parses and bounds an untrusted Telegram amount token before persistence. */
function parseAmountToken(token) {
    const cleaned = token.replace(/[$,]/g, "");
    const amount = Number(cleaned);
    return Number.isFinite(amount) && amount > 0 && amount <= MAX_TELEGRAM_AMOUNT ? amount : null;
}

/** Maps untrusted category text into the application's fixed category set. */
function normalizeCategory(rawCategory, type) {
    if (!rawCategory) {
        return type === "income" ? "Income" : "Other";
    }

    const mapped = CATEGORY_ALIASES[rawCategory.toLowerCase()] ?? rawCategory;
    return VALID_CATEGORIES.has(mapped) ? mapped : (type === "income" ? "Income" : "Other");
}

/** Parses bounded Telegram text into transaction fields; caller must establish linked ownership. */
export function parseTransactionText(text, type) {
    const [, ...parts] = text.trim().split(/\s+/);
    // Locates the first token that satisfies the transaction amount policy.
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

/** Builds a query requiring both Telegram chat and user identity to establish profile linkage. */
export function buildLinkedProfileQuery(chatId, userId) {
    if (chatId === null || chatId === undefined || userId === null || userId === undefined) {
        return null;
    }
    return {
        telegramChatId: String(chatId),
        telegramUserId: String(userId),
    };
}

/** Resolves a profile only when both Telegram identity components match stored ownership. */
async function findLinkedProfile(chatId, userId) {
    const query = buildLinkedProfileQuery(chatId, userId);
    return query ? UserProfile.findOne(query) : null;
}

/** Names process-local pending state by both chat and Telegram user identity. */
function telegramIdentityKey(chatId, userId) {
    return `${chatId}:${userId}`;
}

/** Limits link-code guesses per process and chat; it is not a distributed abuse control. */
function checkLinkRateLimit(chatId) {
    const now = Date.now();
    const attempt = linkAttempts.get(chatId);

    if (!attempt || now - attempt.windowStart >= LINK_RATE_LIMIT_WINDOW_MS) {
        linkAttempts.set(chatId, { count: 1, windowStart: now });
        return true;
    }

    if (attempt.count >= LINK_RATE_LIMIT_MAX_ATTEMPTS) {
        return false;
    }

    attempt.count += 1;
    return true;
}

/** Extracts nullable identity fields from Telegram-owned message metadata. */
function getTelegramUser(msg) {
    return {
        userId: msg.from?.id ? String(msg.from.id) : null,
        username: msg.from?.username ?? null,
    };
}

/** Normalizes Telegram identifiers for ownership and deduplication checks. */
function getTelegramMessageIdentity(msg) {
    return {
        chatId: String(msg.chat.id),
        messageId: msg.message_id ? String(msg.message_id) : null,
        userId: msg.from?.id ? String(msg.from.id) : null,
    };
}

/** Builds fixed callback data rather than reflecting untrusted message content. */
function getAddTransactionKeyboard() {
    return {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "Income", callback_data: `${TRANSACTION_TYPE_CALLBACK_PREFIX}income` },
                    { text: "Expense", callback_data: `${TRANSACTION_TYPE_CALLBACK_PREFIX}expense` },
                ],
            ],
        },
    };
}

/** Sends transaction choices to the already selected Telegram chat. */
async function sendAddTransactionButtons(bot, chatId) {
    await sendAutoDeletingMessage(bot, chatId, "What are you looking to add?", getAddTransactionKeyboard());
}

/** Selects a fixed help example for the validated transaction direction. */
function getTransactionDetailExample(type) {
    return type === "income"
        ? "paycheck 1200 work"
        : "coffee 6.50 food";
}

/** Schedules best-effort removal of bot-visible content from its originating chat. */
function scheduleMessageDelete(bot, chatId, messageId) {
    if (!messageId) {
        return;
    }

    // Deletes the specific Telegram message after the configured retention delay.
    setTimeout(async () => {
        try {
            await bot.deleteMessage(chatId, messageId);
        } catch (error) {
            console.log(
                `Could not delete Telegram message ${messageId} from chat ${chatId}:`,
                error.message,
            );
        }
    }, MESSAGE_DELETE_DELAY_MS);
}

/** Sends a response to the selected chat and applies the bot's best-effort retention policy. */
async function sendAutoDeletingMessage(bot, chatId, text, options) {
    const sentMessage = await bot.sendMessage(chatId, text, options);
    scheduleMessageDelete(bot, chatId, sentMessage.message_id);
    return sentMessage;
}

/** Extracts only the configured webhook path for local Express registration. */
function getWebhookPath(webhookUrl) {
    try {
        return new URL(webhookUrl).pathname;
    } catch {
        return null;
    }
}

/** Rejects webhook mode unless its configured shared secret has a minimum strength. */
export function validateTelegramWebhookSecret(webhookEnabled, webhookSecret) {
    if (webhookEnabled && (typeof webhookSecret !== "string" || webhookSecret.length < 32)) {
        throw new Error(
            "TELEGRAM_WEBHOOK_SECRET of at least 32 characters is required when Telegram webhooks are enabled.",
        );
    }
}

/** Summarizes transactions already scoped to the linked TrackerGen owner. */
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
        // Selects owner-scoped income records for aggregation.
        .filter((transaction) => transaction.amount > 0)
        // Totals income values without mutating persisted transactions.
        .reduce((sum, transaction) => sum + transaction.amount, 0);
    const expenses = transactions
        // Selects owner-scoped expense records for aggregation.
        .filter((transaction) => transaction.amount < 0)
        // Totals expense magnitudes without mutating persisted transactions.
        .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
    const net = income - expenses;

    await sendAutoDeletingMessage(
        bot,
        chatId,
        [
            "This month in TrackerGen:",
            "_____________________________",
            `Income: ${formatMoney(income)}`,
            `Expenses: ${formatMoney(expenses)}`,
            `Net: ${net >= 0 ? "+" : "-"}${formatMoney(net)}`,
            `Entries: ${transactions.length}`,
        ].join("\n"),
    );
}

/** Summarizes recent transactions already scoped to the linked TrackerGen owner. */
async function sendRecentTransactionSummary(bot, chatId, workosUserId) {
    const transactions = await Transaction.find({ workosUserId })
        .sort({ createdAt: -1 })
        .limit(RECENT_TRANSACTION_LIMIT);

    if (transactions.length === 0) {
        await sendAutoDeletingMessage(bot, chatId, "No recent TrackerGen transactions yet.");
        return;
    }

    const income = transactions
        // Selects recent owner-scoped income records.
        .filter((transaction) => transaction.amount > 0)
        // Totals recent income values for display.
        .reduce((sum, transaction) => sum + transaction.amount, 0);
    const expenses = transactions
        // Selects recent owner-scoped expense records.
        .filter((transaction) => transaction.amount < 0)
        // Totals recent expense magnitudes for display.
        .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
    const net = income - expenses;
    // Formats each owner-scoped transaction without exposing database identifiers.
    const recentLines = transactions.map((transaction, index) => {
        return `${index + 1}. ${transaction.name} (${transaction.category}) ${formatSignedMoney(transaction.amount)}`;
    });

    await sendAutoDeletingMessage(
        bot,
        chatId,
        [
            `Recent ${transactions.length} transactions:`,
            "_____________________________",
            ...recentLines,
            "",
            `Recent income: ${formatMoney(income)}`,
            `Recent expenses: ${formatMoney(expenses)}`,
            `Recent net: ${formatSignedMoney(net)}`,
        ].join("\n"),
    );
}

/** Consumes a link credential and binds both Telegram identities to its profile owner. */
async function handleLinkCommand(bot, msg, text) {
    const chatId = String(msg.chat.id);
    const { userId, username } = getTelegramUser(msg);
    const linkCode = text
        .replace(/^\/(?:link|start)(?:@\w+)?\s+/i, "")
        .trim()
        .toUpperCase();

    if (!linkCode) {
        await sendAutoDeletingMessage(bot, chatId, "Send your code like this: /link TG-123456");
        return;
    }

    if (!checkLinkRateLimit(chatId)) {
        await sendAutoDeletingMessage(bot, chatId, "Too many link attempts. Try again in 15 minutes.");
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
        { new: true, runValidators: true },
    );

    if (!profile) {
        console.log(`Telegram link failed for chat ${chatId}`);
        await sendAutoDeletingMessage(bot, chatId, "That link code is invalid or expired. Generate a new code in TrackerGen.");
        return;
    }

    console.log(
        `Telegram linked chat ${chatId} and user ${userId} to TrackerGen user ${profile.workosUserId}`,
    );
    await sendAutoDeletingMessage(bot, chatId, "Telegram is connected to TrackerGen. Try: expense coffee 6.50 food");
}

/** Creates a transaction only after linked identity, duplicate, and input checks pass. */
async function handleTransactionCommand(bot, msg, text, type) {
    const { chatId, messageId, userId } = getTelegramMessageIdentity(msg);
    const profile = await findLinkedProfile(chatId, userId);

    if (!profile) {
        console.log(`Telegram ${type} rejected because chat ${chatId} is not linked`);
        await sendAutoDeletingMessage(bot, chatId, "Connect first from TrackerGen, then send /link TG-123456 here.");
        return false;
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
            await sendAutoDeletingMessage(
                bot,
                chatId,
                `That Telegram message was already saved as ${existingTransaction.name}.`,
            );
            await sendRecentTransactionSummary(bot, chatId, profile.workosUserId);
            return true;
        }
    }

    const parsed = parseTransactionText(text, type);

    if (!parsed) {
        await sendAutoDeletingMessage(
            bot,
            chatId,
            `Use: ${type} description amount category\nExample: ${type} coffee 6.50 food`,
        );
        return false;
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

    await sendAutoDeletingMessage(
        bot,
        chatId,
        [
            `Saved to TrackerGen: ${parsed.name}`,
            `${type === "expense" ? "Expense" : "Income"}: ${type === "expense" ? "-" : "+"}${formatMoney(parsed.amount)}`,
            `Category: ${parsed.category}`,
            // `Database id: ${transaction._id}`,
        ].join("\n"),
    );

    await sendRecentTransactionSummary(bot, chatId, profile.workosUserId);
    return true;
}

/** Starts the Telegram integration in polling or shared-secret webhook mode when configured. */
export function startTelegramBot(app) {
    const token = process.env.BOT_TOKEN;
    const webhookUrl = process.env.TELEGRAM_WEBHOOK_URL;
    const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;

    if (!token) {
        console.log("Telegram bot is disabled because BOT_TOKEN is not set.");
        return null;
    }

    const useWebhook = Boolean(webhookUrl && app);
    const proxyUrl = process.env.TELEGRAM_PROXY_URL;
    const botOptions = { polling: !useWebhook };

    if (proxyUrl) {
        const proxyAgent = new ProxyAgent(proxyUrl);
        botOptions.request = {
            fetchOptions: { dispatcher: proxyAgent },
        };
        console.log(`Telegram bot using proxy: ${proxyUrl}`);
    }

    validateTelegramWebhookSecret(useWebhook, webhookSecret);
    const bot = new TelegramBot(token, botOptions);

    // Records polling failures without logging bot credentials.
    bot.on("polling_error", (error) => {
        console.log("Telegram polling error:", error.message || error);
    });

    // Handles fixed transaction choices only after the Telegram user and chat are linked.
    bot.on("callback_query", async (query) => {
        const chatId = query.message?.chat?.id ? String(query.message.chat.id) : null;
        const userId = query.from?.id ? String(query.from.id) : null;
        const data = query.data ?? "";

        if (!chatId || !userId || !data.startsWith(TRANSACTION_TYPE_CALLBACK_PREFIX)) {
            await bot.answerCallbackQuery(query.id);
            return;
        }

        const type = data.replace(TRANSACTION_TYPE_CALLBACK_PREFIX, "");

        if (!["income", "expense"].includes(type)) {
            await bot.answerCallbackQuery(query.id);
            return;
        }

        try {
            const profile = await findLinkedProfile(chatId, userId);
            if (!profile) {
                await bot.answerCallbackQuery(query.id, { text: "Connect your account first." });
                return;
            }
            pendingTransactionTypes.set(telegramIdentityKey(chatId, userId), type);
            await bot.answerCallbackQuery(query.id, {
                text: `${type === "income" ? "Income" : "Expense"} selected`,
            });
            await sendAutoDeletingMessage(
                bot,
                chatId,
                `Send the details like this:\n${getTransactionDetailExample(type)}`,
            );
        } catch (error) {
            console.log("Telegram button error:", error.message || error);
            await bot.answerCallbackQuery(query.id, {
                text: "Something went wrong.",
            });
        }
    });

    // Routes Telegram messages through linkage, freshness, validation, and deduplication checks.
    bot.on("message", async (msg) => {
        const chatId = String(msg.chat.id);
        const userId = msg.from?.id ? String(msg.from.id) : null;
        const identityKey = telegramIdentityKey(chatId, userId ?? "missing");
        const text = msg.text?.trim() ?? "";
        const isOldMessage = Boolean(msg.date && msg.date < botStartedAt);

        try {
            if (isOldMessage) {
                console.log(
                    `Received old Telegram message ${msg.message_id} from chat ${chatId}`,
                );
            }

            scheduleMessageDelete(bot, chatId, msg.message_id);

            if (!text || /^\/?help(?:@\w+)?$/i.test(text) || /^\/start(?:@\w+)?$/i.test(text)) {
                await sendAutoDeletingMessage(bot, chatId, HELP_TEXT);
                return;
            }

            console.log(`Telegram message received from chat ${chatId}`);

            if (/^\/?add(?:@\w+)?$/i.test(text)) {
                await sendAddTransactionButtons(bot, chatId);
                return;
            }

            if (/^\/?cancel(?:@\w+)?$/i.test(text)) {
                pendingTransactionTypes.delete(identityKey);
                await sendAutoDeletingMessage(bot, chatId, "Canceled the current button entry.");
                return;
            }

            if (/^\/(?:link|start)(?:@\w+)?\s+/i.test(text)) {
                await handleLinkCommand(bot, msg, text);
                return;
            }

            if (/^expense\s+/i.test(text)) {
                if (isOldMessage) {
                    await sendAutoDeletingMessage(bot, chatId, "That expense arrived while I was restarting. Send it again so I do not save an old transaction by accident.");
                    return;
                }

                const saved = await handleTransactionCommand(bot, msg, text, "expense");

                if (saved) {
                    pendingTransactionTypes.delete(identityKey);
                }

                return;
            }

            if (/^income\s+/i.test(text)) {
                if (isOldMessage) {
                    await sendAutoDeletingMessage(bot, chatId, "That income arrived while I was restarting. Send it again so I do not save an old transaction by accident.");
                    return;
                }

                const saved = await handleTransactionCommand(bot, msg, text, "income");

                if (saved) {
                    pendingTransactionTypes.delete(identityKey);
                }

                return;
            }

            if (/^\/?summary(?:@\w+)?$/i.test(text)) {
                const profile = await findLinkedProfile(chatId, userId);

                if (!profile) {
                    await sendAutoDeletingMessage(bot, chatId, "Connect first from TrackerGen, then send /link TG-123456 here.");
                    return;
                }

                await sendMonthlySummary(bot, chatId, profile.workosUserId);
                return;
            }

            if (/^\/?recent(?:@\w+)?$/i.test(text)) {
                const profile = await findLinkedProfile(chatId, userId);

                if (!profile) {
                    await sendAutoDeletingMessage(bot, chatId, "Connect first from TrackerGen, then send /link TG-123456 here.");
                    return;
                }

                await sendRecentTransactionSummary(bot, chatId, profile.workosUserId);
                return;
            }

            const pendingType = pendingTransactionTypes.get(identityKey);

            if (pendingType && !text.startsWith("/")) {
                if (isOldMessage) {
                    await sendAutoDeletingMessage(bot, chatId, "That entry arrived while I was restarting. Send it again so I do not save an old transaction by accident.");
                    return;
                }

                const saved = await handleTransactionCommand(
                    bot,
                    msg,
                    `${pendingType} ${text}`,
                    pendingType,
                );

                if (saved) {
                    pendingTransactionTypes.delete(identityKey);
                }

                return;
            }

            await sendAutoDeletingMessage(bot, chatId, HELP_TEXT);
        } catch (error) {
            console.log("Telegram bot error:", error.message || error);
            await sendAutoDeletingMessage(bot, chatId, "Something went wrong while updating TrackerGen.");
        }
    });

    if (useWebhook) {
        const webhookPath = getWebhookPath(webhookUrl);

        if (!webhookPath) {
            console.log("Telegram webhook is disabled because TELEGRAM_WEBHOOK_URL is invalid.");
            return bot;
        }

        // Accepts Telegram updates only when the configured webhook secret matches.
        app.post(webhookPath, (req, res) => {
            if (req.get("X-Telegram-Bot-Api-Secret-Token") !== webhookSecret) {
                return res.sendStatus(401);
            }

            bot.processUpdate(req.body);
            return res.sendStatus(200);
        });

        const webhookOptions = webhookSecret
            ? { secret_token: webhookSecret }
            : {};

        bot.setWebHook(webhookUrl, webhookOptions)
            // Reports successful registration without exposing the webhook secret.
            .then(() => {
                console.log(`Telegram webhook set at ${webhookPath}`);
            })
            // Reports registration failures without exposing bot credentials.
            .catch((error) => {
                console.log("Telegram webhook setup error:", error.message || error);
            });
    } else {
        console.log("Telegram bot polling started.");
    }

    return bot;
}
