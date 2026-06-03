import { useState, useEffect, useRef, useCallback } from "react";
import {
  CheckCircle2,
  Copy,
  ExternalLink,
  Loader2,
  RefreshCcw,
  Send,
  ChevronRight,
  ChevronLeft,
  MessageSquare,
  Smartphone,
  Terminal,
  X,
  HelpCircle,
} from "lucide-react";
import { COLORS, FONTS, TW } from "./shared.js";

/* ------------------------------------------------------------------ */
/*  Step 1 — Generate link code                                       */
/* ------------------------------------------------------------------ */
function StepGenerate({ telegram, loading, onCreateCode }) {
  const hasCode = Boolean(telegram?.linkCommand);

  return (
    <div className="grid gap-4">
      <div className="flex items-start gap-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[color:var(--dashboard-border)] text-[11px] text-[color:var(--dashboard-accent)] sm:h-6 sm:w-6 sm:text-[9px]">
          1
        </div>
        <div className="min-w-0">
          <p className="mb-1 text-[14px] text-[color:var(--dashboard-text)] sm:text-[12px]">
            Generate a one-time link code
          </p>
          <p className="text-[12px] leading-5 text-[color:var(--dashboard-muted)] sm:text-[10px]">
            This creates a code that proves it's you when you send it to the bot.
            The code expires after 15 minutes for security.
          </p>
        </div>
      </div>

      {hasCode ? (
        <div className="border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-surface-2)] p-3">
          <div className="mb-1 text-[10px] uppercase tracking-[0.1em] text-[color:var(--dashboard-muted)]">
            Your link code
          </div>
          <div className="mb-2 select-all break-all text-[16px] font-semibold tracking-[0.05em] text-[color:var(--dashboard-accent)] sm:text-[14px]">
            {telegram.linkCommand}
          </div>
          <div className="text-[11px] text-[color:var(--dashboard-muted)] sm:text-[9px]">
            Expires in 15 minutes from generation
          </div>
        </div>
      ) : null}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCreateCode}
          disabled={loading}
          className={TW.primaryButton}
        >
          {loading ? (
            <>
              <Loader2 size={12} className="animate-spin" />
              Creating...
            </>
          ) : hasCode ? (
            <>
              <RefreshCcw size={12} />
              Regenerate Code
            </>
          ) : (
            <>
              <RefreshCcw size={12} />
              Generate Code
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 2 — Connect in Telegram                                      */
/* ------------------------------------------------------------------ */
function StepConnect({ telegram, onCopyCommand }) {
  const linkCommand = telegram?.linkCommand;
  const botUsername = telegram?.botUsername;
  const startUrl =
    botUsername && telegram?.linkCode
      ? `https://t.me/${botUsername}?start=${encodeURIComponent(telegram.linkCode)}`
      : null;

  if (!linkCommand) {
    return (
      <div className="text-[13px] leading-6 text-[color:var(--dashboard-muted)] sm:text-[11px]">
        Generate a link code first to continue.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-start gap-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[color:var(--dashboard-border)] text-[11px] text-[color:var(--dashboard-accent)] sm:h-6 sm:w-6 sm:text-[9px]">
          2
        </div>
        <div className="min-w-0">
          <p className="mb-1 text-[14px] text-[color:var(--dashboard-text)] sm:text-[12px]">
            Send the code to the bot
          </p>
          <p className="text-[12px] leading-5 text-[color:var(--dashboard-muted)] sm:text-[10px]">
            Open the TrackerGen bot on Telegram and paste this command. The bot
            links your Telegram account to this dashboard.
          </p>
        </div>
      </div>

      <div className="border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-surface-2)] p-3">
        <div className="mb-1 text-[10px] uppercase tracking-[0.1em] text-[color:var(--dashboard-muted)]">
          Step-by-step
        </div>
        <ol className="grid gap-3 text-[13px] leading-6 text-[color:var(--dashboard-text)] sm:text-[11px]">
          <li className="flex items-start gap-2">
            <span className="text-[color:var(--dashboard-muted)]">1.</span>
            <span>
              Click <strong className="text-[color:var(--dashboard-text)]">Copy Command</strong> below
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[color:var(--dashboard-muted)]">2.</span>
            <span>
              Open Telegram on your phone or desktop
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[color:var(--dashboard-muted)]">3.</span>
            <span>
              Find <strong className="text-[color:var(--dashboard-text)]">{botUsername ? `@${botUsername}` : "the TrackerGen bot"}</strong> and paste the command
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[color:var(--dashboard-muted)]">4.</span>
            <span>
              The bot replies: <em className="text-[color:var(--dashboard-accent)]">"Telegram is connected"</em>
            </span>
          </li>
        </ol>
      </div>

      <div className="rounded-[4px] border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-bg)] p-3">
        <div className="mb-1 text-[10px] uppercase tracking-[0.1em] text-[color:var(--dashboard-muted)]">
          Paste this in Telegram
        </div>
        <div className="select-all break-all text-[15px] font-semibold tracking-[0.03em] text-[color:var(--dashboard-accent)] sm:text-[13px]">
          {linkCommand}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={onCopyCommand} className={TW.secondaryButton}>
          <Copy size={12} />
          Copy Command
        </button>
        {startUrl ? (
          <a
            href={startUrl}
            target="_blank"
            rel="noreferrer"
            className={TW.secondaryButton}
          >
            <ExternalLink size={12} />
            Open Telegram
          </a>
        ) : null}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 3 — Verify & waiting state                                   */
/* ------------------------------------------------------------------ */
function StepVerify({ telegram, linked }) {
  return (
    <div className="grid gap-4">
      <div className="flex items-start gap-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[color:var(--dashboard-border)] text-[11px] text-[color:var(--dashboard-accent)] sm:h-6 sm:w-6 sm:text-[9px]">
          3
        </div>
        <div className="min-w-0">
          <p className="mb-1 text-[14px] text-[color:var(--dashboard-text)] sm:text-[12px]">
            Verify the connection
          </p>
          <p className="text-[12px] leading-5 text-[color:var(--dashboard-muted)] sm:text-[10px]">
            The dashboard is automatically checking for the link. Once the bot
            confirms, you'll see the connection details below.
          </p>
        </div>
      </div>

      {linked ? (
        <div className="border border-[color:color-mix(in_srgb,var(--dashboard-accent)_25%,transparent)] bg-[color:color-mix(in_srgb,var(--dashboard-accent)_6%,transparent)] p-3">
          <div className="mb-2 flex items-center gap-2">
            <CheckCircle2 size={14} color={COLORS.accent} />
            <span className="text-[13px] font-semibold text-[color:var(--dashboard-text)] sm:text-[11px]">
              Connected successfully
            </span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-bg)] p-2">
              <div className="mb-1 text-[9px] uppercase tracking-[0.1em] text-[color:var(--dashboard-muted)]">
                Telegram ID
              </div>
              <div className="text-[12px] text-[color:var(--dashboard-text)] sm:text-[10px]">
                {telegram?.userId ?? "—"}
              </div>
            </div>
            <div className="border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-bg)] p-2">
              <div className="mb-1 text-[9px] uppercase tracking-[0.1em] text-[color:var(--dashboard-muted)]">
                Username
              </div>
              <div className="text-[12px] text-[color:var(--dashboard-text)] sm:text-[10px]">
                {telegram?.telegramUsername
                  ? `@${telegram.telegramUsername}`
                  : "—"}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-surface-2)] px-3 py-4">
          <Loader2 size={16} className="animate-spin shrink-0" color={COLORS.muted} />
          <div>
            <p className="text-[13px] text-[color:var(--dashboard-text)] sm:text-[11px]">
              Waiting for Telegram...
            </p>
            <p className="text-[11px] text-[color:var(--dashboard-muted)] sm:text-[9px]">
              Send the command in Telegram. This checks every 5 seconds.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 4 — First test transaction                                   */
/* ------------------------------------------------------------------ */
function StepTestTransaction({ linked }) {
  return (
    <div className="grid gap-4">
      <div className="flex items-start gap-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[color:var(--dashboard-border)] text-[11px] text-[color:var(--dashboard-accent)] sm:h-6 sm:w-6 sm:text-[9px]">
          4
        </div>
        <div className="min-w-0">
          <p className="mb-1 text-[14px] text-[color:var(--dashboard-text)] sm:text-[12px]">
            Send your first transaction
          </p>
          <p className="text-[12px] leading-5 text-[color:var(--dashboard-muted)] sm:text-[10px]">
            Try adding an expense or income from Telegram. The bot parses plain
            text commands automatically.
          </p>
        </div>
      </div>

      {!linked ? (
        <div className="border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-surface-2)] px-3 py-3 text-[13px] text-[color:var(--dashboard-muted)] sm:text-[11px]">
          Connect your Telegram account first to test transactions.
        </div>
      ) : (
        <div className="grid gap-3">
          <p className="text-[12px] text-[color:var(--dashboard-text)] sm:text-[10px]">
            Copy one of these and send it to the bot on Telegram:
          </p>

          <div className="space-y-2">
            <div className="border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-bg)] p-3">
              <div className="mb-1 flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--dashboard-red)]" />
                <span className="text-[10px] uppercase tracking-[0.1em] text-[color:var(--dashboard-muted)]">
                  Expense
                </span>
              </div>
              <div className="select-all text-[14px] font-mono text-[color:var(--dashboard-text)] sm:text-[12px]">
                expense coffee 6.50 food
              </div>
              <div className="mt-1 text-[11px] text-[color:var(--dashboard-muted)] sm:text-[9px]">
                Logs a $6.50 coffee under Food & Drink
              </div>
            </div>

            <div className="border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-bg)] p-3">
              <div className="mb-1 flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--dashboard-accent)]" />
                <span className="text-[10px] uppercase tracking-[0.1em] text-[color:var(--dashboard-muted)]">
                  Income
                </span>
              </div>
              <div className="select-all text-[14px] font-mono text-[color:var(--dashboard-text)] sm:text-[12px]">
                income paycheck 1200 work
              </div>
              <div className="mt-1 text-[11px] text-[color:var(--dashboard-muted)] sm:text-[9px]">
                Logs a $1,200 paycheck under Income category
              </div>
            </div>
          </div>

          <p className="text-[11px] leading-5 text-[color:var(--dashboard-muted)] sm:text-[9px]">
            After sending, the bot replies with a confirmation. The transaction
            appears here in the dashboard within 10 seconds.
          </p>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 5 — Full command reference                                   */
/* ------------------------------------------------------------------ */
function StepCommandReference() {
  const commands = [
    {
      command: "expense [name] [amount] [category]",
      description: "Add an expense transaction",
      example: "expense coffee 6.50 food",
    },
    {
      command: "income [name] [amount] [category]",
      description: "Add an income transaction",
      example: "income paycheck 1200 work",
    },
    {
      command: "/add",
      description: "Choose Income or Expense with buttons",
      example: "",
    },
    {
      command: "/summary",
      description: "Show this month's income, expenses, and net",
      example: "",
    },
    {
      command: "/recent",
      description: "Show the 5 most recent transactions",
      example: "",
    },
    {
      command: "/cancel",
      description: "Cancel a button-guided entry in progress",
      example: "",
    },
    {
      command: "/link [code]",
      description: "Link Telegram to your TrackerGen account",
      example: "/link TG-123456",
    },
  ];

  const categories = [
    { alias: "food, coffee, dining, restaurant", mapsTo: "Food & Drink / Dining" },
    { alias: "rent, housing", mapsTo: "Housing" },
    { alias: "shopping, shop", mapsTo: "Shopping" },
    { alias: "transport, transportation, ride", mapsTo: "Transport" },
    { alias: "utilities, utility", mapsTo: "Utilities" },
    { alias: "subscription, subscriptions", mapsTo: "Subscriptions" },
    { alias: "work, salary, paycheck, income", mapsTo: "Income" },
  ];

  return (
    <div className="grid gap-4">
      <div className="flex items-start gap-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[color:var(--dashboard-border)] text-[11px] text-[color:var(--dashboard-accent)] sm:h-6 sm:w-6 sm:text-[9px]">
          5
        </div>
        <div className="min-w-0">
          <p className="mb-1 text-[14px] text-[color:var(--dashboard-text)] sm:text-[12px]">
            Command reference
          </p>
          <p className="text-[12px] leading-5 text-[color:var(--dashboard-muted)] sm:text-[10px]">
            All the commands the bot understands. Format:{" "}
            <span className="font-mono text-[color:var(--dashboard-text)]">
              action name amount category
            </span>
          </p>
        </div>
      </div>

      <div className="border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-surface-2)] p-3">
        <div className="mb-2 text-[11px] uppercase tracking-[0.1em] text-[color:var(--dashboard-muted)] sm:text-[9px]">
          Commands
        </div>
        <div className="grid gap-1.5">
          {commands.map((cmd) => (
            <div
              key={cmd.command}
              className="border-b border-[color:var(--dashboard-border)] pb-1.5 last:border-0 last:pb-0"
            >
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <code className="text-[13px] font-semibold text-[color:var(--dashboard-accent)] sm:text-[11px]">
                  {cmd.command}
                </code>
                {cmd.example ? (
                  <span className="text-[10px] text-[color:var(--dashboard-muted)] sm:text-[8px]">
                    ex: {cmd.example}
                  </span>
                ) : null}
              </div>
              <div className="text-[12px] text-[color:var(--dashboard-muted)] sm:text-[10px]">
                {cmd.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-surface-2)] p-3">
        <div className="mb-2 flex items-center gap-2">
          <HelpCircle size={12} color={COLORS.muted} />
          <span className="text-[11px] uppercase tracking-[0.1em] text-[color:var(--dashboard-muted)] sm:text-[9px]">
            Category Aliases
          </span>
        </div>
        <div className="grid gap-1 text-[12px] sm:text-[10px]">
          {categories.map((cat) => (
            <div key={cat.alias} className="flex flex-wrap gap-1">
              <span className="text-[color:var(--dashboard-muted)]">{cat.alias}</span>
              <span className="text-[color:var(--dashboard-muted)]">→</span>
              <span className="text-[color:var(--dashboard-text)]">{cat.mapsTo}</span>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-[color:var(--dashboard-muted)] sm:text-[9px]">
          Unknown category names are used as-is. The bot falls back to "Other"
          for expenses or "Income" for income when nothing is found.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step indicator                                                     */
/* ------------------------------------------------------------------ */
function StepIndicator({ current, total, labels }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-semibold transition-colors sm:h-5 sm:w-5 sm:text-[8px] ${
              i <= current
                ? "bg-[color:var(--dashboard-accent)] text-[color:var(--dashboard-bg)]"
                : "border border-[color:var(--dashboard-border)] text-[color:var(--dashboard-muted)]"
            }`}
          >
            {i + 1}
          </div>
          {i < total - 1 ? (
            <div
              className={`h-px w-5 transition-colors sm:w-4 ${
                i < current
                  ? "bg-[color:var(--dashboard-accent)]"
                  : "bg-[color:var(--dashboard-border)]"
              }`}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step labels (tiny text below dots)                                */
/* ------------------------------------------------------------------ */
function StepLabels({ labels, current }) {
  return (
    <div className="flex gap-2 overflow-x-auto">
      {labels.map((label, i) => (
        <span
          key={label}
          className={`whitespace-nowrap text-[9px] tracking-[0.06em] uppercase sm:text-[7px] ${
            i <= current
              ? "text-[color:var(--dashboard-text)]"
              : "text-[color:var(--dashboard-muted)]"
          }`}
          style={i <= current ? {} : undefined}
        >
          {label}
        </span>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Setup Assistant Modal                                        */
/* ------------------------------------------------------------------ */
const STEPS = ["generate", "connect", "verify", "test", "reference"];
const STEP_LABELS = ["Generate", "Connect", "Verify", "Test", "Reference"];

export default function TelegramSetupAssistant({
  show,
  onClose,
  telegram,
  loading,
  error,
  onCreateCode,
  onCopyCommand,
}) {
  const [step, setStep] = useState(0);
  const linked = Boolean(telegram?.linked);
  const prevLinkedRef = useRef(linked);

  // Auto-advance past verify when linked
  useEffect(() => {
    if (linked && !prevLinkedRef.current) {
      setStep(3); // jump to "test" step
    }
    prevLinkedRef.current = linked;
  }, [linked]);

  // Reset step when modal opens
  useEffect(() => {
    if (show) {
      if (linked) {
        setStep(3); // already linked — start at test
      } else if (telegram?.linkCommand) {
        setStep(1); // has code — start at connect
      } else {
        setStep(0); // start fresh
      }
    }
  }, [show, linked, telegram?.linkCommand]);

  const currentStepName = STEPS[step];
  const isFirst = step === 0;
  const isLast = step === STEPS.length - 1;

  const goNext = useCallback(() => {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
  }, [step]);

  const goPrev = useCallback(() => {
    if (step > 0) setStep((s) => s - 1);
  }, [step]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto pt-[5vh] sm:pt-[8vh]">
      {/* backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* modal */}
      <div
        className="relative z-10 mx-4 w-full max-w-[560px] border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-bg)] shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Telegram bot setup assistant"
      >
        {/* header */}
        <div className="flex items-center justify-between border-b border-[color:var(--dashboard-border)] px-4 py-3 sm:px-4 sm:py-[12px]">
          <div>
            <div className="text-[11px] uppercase tracking-[0.1em] text-[color:var(--dashboard-muted)] sm:text-[9px]">
              Telegram Bot
            </div>
            <div
              className="text-[1.1rem] tracking-[0.04em] text-[color:var(--dashboard-text)] sm:text-[1rem]"
              style={FONTS.display}
            >
              Setup Assistant
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="flex h-9 w-9 items-center justify-center text-[color:var(--dashboard-muted)] transition-colors hover:text-[color:var(--dashboard-text)] sm:h-8 sm:w-8"
          >
            <X size={16} />
          </button>
        </div>

        {/* step indicator */}
        <div className="border-b border-[color:var(--dashboard-border)] px-4 py-3 sm:px-4 sm:py-[10px]">
          <StepIndicator current={step} total={STEPS.length} labels={STEP_LABELS} />
          <div className="mt-2">
            <StepLabels labels={STEP_LABELS} current={step} />
          </div>
        </div>

        {/* body */}
        <div className="px-4 py-5 sm:px-4 sm:py-[18px]">
          {error ? (
            <div className="mb-4 border border-[color:color-mix(in_srgb,var(--dashboard-red)_30%,transparent)] bg-[color:color-mix(in_srgb,var(--dashboard-red)_8%,transparent)] px-3 py-2 text-[12px] leading-5 text-[color:var(--dashboard-red)] sm:text-[10px]">
              {error}
            </div>
          ) : null}

          {currentStepName === "generate" && (
            <StepGenerate
              telegram={telegram}
              loading={loading}
              onCreateCode={onCreateCode}
            />
          )}
          {currentStepName === "connect" && (
            <StepConnect
              telegram={telegram}
              onCopyCommand={onCopyCommand}
            />
          )}
          {currentStepName === "verify" && (
            <StepVerify telegram={telegram} linked={linked} />
          )}
          {currentStepName === "test" && (
            <StepTestTransaction linked={linked} />
          )}
          {currentStepName === "reference" && <StepCommandReference />}
        </div>

        {/* footer */}
        <div className="flex items-center justify-between border-t border-[color:var(--dashboard-border)] px-4 py-3 sm:px-4 sm:py-[10px]">
          <button
            type="button"
            onClick={goPrev}
            disabled={isFirst}
            className={`inline-flex min-h-10 items-center gap-1 px-3 py-2 text-[11px] tracking-[0.05em] uppercase transition-colors sm:min-h-9 sm:text-[9px] ${
              isFirst
                ? "cursor-not-allowed text-[color:var(--dashboard-border)]"
                : "text-[color:var(--dashboard-muted)] hover:text-[color:var(--dashboard-accent)]"
            }`}
          >
            <ChevronLeft size={12} />
            Back
          </button>

          <div className="flex gap-2">
            {isLast ? (
              <button
                type="button"
                onClick={handleClose}
                className={TW.primaryButton}
              >
                <CheckCircle2 size={12} />
                Done
              </button>
            ) : (
              <button
                type="button"
                onClick={goNext}
                className={TW.primaryButton}
              >
                {currentStepName === "generate" && !telegram?.linkCommand
                  ? "Generate first"
                  : currentStepName === "verify"
                    ? linked
                      ? "Continue"
                      : "Waiting..."
                    : "Continue"}
                <ChevronRight size={12} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
