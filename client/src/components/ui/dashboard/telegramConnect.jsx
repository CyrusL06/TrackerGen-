import { CheckCircle2, Copy, ExternalLink, RefreshCcw, Send } from "lucide-react";
import { COLORS, TW } from "./shared.js";
import { DisplayTitle, Eyebrow, SurfaceCard, Tag } from "./primitives.jsx";

export default function TelegramConnect({
  telegram,
  loading,
  error,
  onCreateCode,
  onCopyCommand,
}) {
  const linkCommand = telegram?.linkCommand;
  const botLabel = telegram?.botUsername ? `@${telegram.botUsername}` : "your Telegram bot";
  const telegramStartUrl =
    telegram?.botUsername && telegram?.linkCode
      ? `https://t.me/${telegram.botUsername}?start=${encodeURIComponent(telegram.linkCode)}`
      : null;

  return (
    <SurfaceCard className={TW.panelPadding}>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Eyebrow>Telegram</Eyebrow>
          <DisplayTitle>Bot Connection</DisplayTitle>
          <p className="mt-2 max-w-xl text-[14px] leading-6 text-[color:var(--dashboard-muted)] sm:text-[12px]">
            Connect by pasting the generated link command into Telegram. Your numeric ID is saved automatically after the bot receives it.
          </p>
        </div>

        <Tag color={telegram?.linked ? COLORS.accent : COLORS.amber}>
          {telegram?.linked ? "Connected" : "Not linked"}
        </Tag>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_1.1fr]">
        <div className="border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-surface-2)] p-3">
          <div className="mb-2 flex items-center gap-2 text-[13px] text-[color:var(--dashboard-text)] sm:text-[11px]">
            <Send size={13} color={COLORS.accent} />
            Connect from Telegram
          </div>

          {telegram?.linked ? (
            <div className="grid gap-3 text-[13px] leading-6 text-[color:var(--dashboard-muted)] sm:text-[11px]">
              <div className="flex items-start gap-2">
                <CheckCircle2 size={14} color={COLORS.accent} className="mt-1 shrink-0" />
                <span>
                  Connected{telegram.telegramUsername ? ` as @${telegram.telegramUsername}` : ""}. The bot can now save transactions from this Telegram account.
                </span>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <TelegramIdValue label="Telegram user ID" value={telegram.userId} />
                <TelegramIdValue label="Telegram chat ID" value={telegram.chatId} />
              </div>
            </div>
          ) : (
            <div className="grid gap-3">
              <button
                type="button"
                onClick={onCreateCode}
                disabled={loading}
                className={TW.primaryButton}
              >
                <RefreshCcw size={12} />
                {loading ? "Creating..." : linkCommand ? "Refresh Code" : "Create Link Code"}
              </button>

              {linkCommand ? (
                <div className="grid gap-2">
                  <div className="text-[11px] uppercase tracking-[0.1em] text-[color:var(--dashboard-muted)]">
                    Paste this command in Telegram
                  </div>
                  <div className="select-all break-all border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-bg)] px-3 py-3 text-[14px] text-[color:var(--dashboard-text)] sm:text-[12px]">
                    {linkCommand}
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button type="button" onClick={onCopyCommand} className={TW.secondaryButton}>
                      <Copy size={12} />
                      Copy for Telegram
                    </button>
                    {telegramStartUrl ? (
                      <a
                        href={telegramStartUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={TW.secondaryButton}
                      >
                        <ExternalLink size={12} />
                        Open Telegram
                      </a>
                    ) : null}
                  </div>
                  <p className="text-[12px] leading-5 text-[color:var(--dashboard-muted)] sm:text-[10px]">
                    Open {botLabel} and send this exact command. You do not need to type your Telegram ID manually.
                  </p>
                </div>
              ) : null}
            </div>
          )}

          {error ? (
            <div className="mt-3 text-[12px] leading-5 text-[color:var(--dashboard-red)] sm:text-[10px]">
              {error}
            </div>
          ) : null}
        </div>

        <div className="grid gap-2 border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-surface-2)] p-3">
          <div className="text-[13px] text-[color:var(--dashboard-text)] sm:text-[11px]">
            Try these after linking
          </div>
          <CommandExample command="expense coffee 6.50 food" />
          <CommandExample command="income paycheck 1200 work" />
          <CommandExample command="summary" />
        </div>
      </div>
    </SurfaceCard>
  );
}

function CommandExample({ command }) {
  return (
    <div className="border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-bg)] px-3 py-2 text-[13px] text-[color:var(--dashboard-muted)] sm:text-[11px]">
      {command}
    </div>
  );
}

function TelegramIdValue({ label, value }) {
  async function copyValue() {
    if (!value) return;
    await navigator.clipboard.writeText(value);
  }

  return (
    <div className="border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-bg)] p-3">
      <div className="mb-1 text-[10px] uppercase tracking-[0.1em] text-[color:var(--dashboard-muted)]">
        {label}
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="min-w-0 break-all text-[13px] text-[color:var(--dashboard-text)] sm:text-[11px]">
          {value ?? "Not saved yet"}
        </span>
        {value ? (
          <button type="button" onClick={copyValue} className="shrink-0 text-[color:var(--dashboard-muted)] hover:text-[color:var(--dashboard-accent)]">
            <Copy size={12} />
          </button>
        ) : null}
      </div>
    </div>
  );
}
