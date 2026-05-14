// Telegram bot tokens must stay on the server.
// The browser should only call protected backend routes after the user is logged in.
export async function getTelegramReminderStatus() {
  return {
    enabled: false,
    message: "Telegram reminder setup is handled by the server bot.",
  };
}
