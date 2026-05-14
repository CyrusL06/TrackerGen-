import { CheckCircle2, Copy, RefreshCcw, Send } from "lucide-react";
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

  return (
    <SurfaceCard className={TW.panelPadding}>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Eyebrow>Telegram</Eyebrow>
          <DisplayTitle>Bot Connection</DisplayTitle>
          <p className="mt-2 max-w-xl text-[14px] leading-6 text-[color:var(--dashboard-muted)] sm:text-[12px]">
            Link your Telegram chat, then message the bot to add income, expenses, or ask for a summary.
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
            <div className="flex items-start gap-2 text-[13px] leading-6 text-[color:var(--dashboard-muted)] sm:text-[11px]">
              <CheckCircle2 size={14} color={COLORS.accent} className="mt-1 shrink-0" />
              <span>Linked to chat {telegram.chatIdPreview}. You can send bot commands now.</span>
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
                  <div className="border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-bg)] px-3 py-3 text-[14px] text-[color:var(--dashboard-text)] sm:text-[12px]">
                    {linkCommand}
                  </div>
                  <button type="button" onClick={onCopyCommand} className={TW.secondaryButton}>
                    <Copy size={12} />
                    Copy command
                  </button>
                  <p className="text-[12px] leading-5 text-[color:var(--dashboard-muted)] sm:text-[10px]">
                    Open {botLabel} and send this command. Codes expire after 15 minutes.
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
