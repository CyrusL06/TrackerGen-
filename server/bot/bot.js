import TelegramBot from "node-telegram-bot-api";

const token = process.env.BOT_TOKEN;

if (!token) {
    console.log("Telegram bot is disabled because BOT_TOKEN is not set.");
} else {
    const bot = new TelegramBot(token, {polling:true});

    // Future flow:
    // 1. User signs in through the app.
    // 2. Backend links that authenticated user to their Telegram chat ID.
    // 3. Bot messages can then create reminders or transactions for that user.
    bot.on("message", async (msg) =>{
        console.log("Received Telegram message");
        console.log(msg);
    });
}
