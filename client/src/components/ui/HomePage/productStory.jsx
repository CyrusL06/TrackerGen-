import { CircleDollarSign, FileCheck2, MailCheck, Sparkles } from "lucide-react";
import { createElement } from "react";
import { FONTS, LAYOUT } from "../pudgy-brand";
import TelegramScrollStory from "./telegramScrollStory";

const alertSteps = [
  { icon: MailCheck, title: "A supported alert arrives", text: "A narrowly forwarded RBC purchase notification reaches your private TrackerGen address." },
  { icon: FileCheck2, title: "TrackerGen verifies it", text: "The sender and message are checked before the amount and merchant are extracted." },
  { icon: CircleDollarSign, title: "A pending expense appears", text: "The transaction is added once and stays ready for your review in the dashboard." },
];

export default function ProductStory() {
  return (
    <section
      id="product"
      className="relative scroll-mt-24 border-y border-[var(--home-border)] py-16 md:py-24 lg:py-28"
      style={{ background: "linear-gradient(180deg, var(--bg-page) 0%, var(--home-section) 18%, var(--home-section) 82%, var(--bg-page) 100%)" }}
    >
      <div
        aria-hidden="true"
        className="product-edge-highlight pointer-events-none absolute inset-x-0 top-0 z-20 mx-auto h-px w-[300px] max-w-full -translate-y-1/2"
      />
      <div
        aria-hidden="true"
        className="product-edge-halo pointer-events-none absolute inset-x-0 -top-1 mx-auto h-[200px] w-full max-w-[220px] -translate-y-1/2 md:max-w-[420px]"
      />

      <div className={`${LAYOUT.content} relative z-10`}>
        <div data-gsap-section className="mb-12 max-w-3xl md:mb-14">
          <h2 className={`text-balance text-[clamp(2.15rem,5vw,4.5rem)] font-bold leading-[1.01] tracking-[-0.04em] text-[var(--home-text)] ${FONTS.display}`}>
            Add it without leaving the conversation.
          </h2>
          <p className={`mt-5 max-w-2xl text-pretty text-body leading-7 text-[var(--home-muted)] md:text-lead ${FONTS.body}`}>
            Send <code className="rounded bg-[var(--home-surface-subtle)] px-1.5 py-1 text-[var(--home-text)]">/add</code>, choose Expense or Income, then follow the prompt.
          </p>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute -right-4 top-10 z-10 hidden rotate-3 rounded-[1.5rem] border border-[var(--home-border)] bg-[var(--home-surface)] px-5 py-4 shadow-[var(--home-shadow)] lg:block">
            <p className={`text-caption font-semibold text-[var(--home-dim)] ${FONTS.body}`}>guided flow</p>
            <p className={`mt-1 text-sub font-bold text-[var(--home-text)] ${FONTS.display}`}>30 seconds</p>
          </div>
          <TelegramScrollStory />
        </div>

        <div className="mt-10 grid gap-5 lg:mt-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div data-gsap-card className="relative overflow-hidden rounded-[2rem] border border-[var(--home-border)] bg-[var(--home-surface)] p-7 shadow-[var(--home-shadow)] sm:p-9 lg:p-10">
            <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full border-[42px] border-[#70b8df]/[0.07]" />
            <div className="relative">
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--home-accent-soft)] text-[var(--home-accent)]"><Sparkles aria-hidden="true" size={22} /></div>
              <h3 className={`max-w-md text-balance text-[clamp(1.8rem,4vw,2.85rem)] font-bold leading-[1.04] tracking-[-0.035em] text-[var(--home-text)] ${FONTS.display}`}>Optional capture when typing gets old.</h3>
              <p className={`mt-5 max-w-lg text-pretty text-body leading-7 text-[var(--home-muted)] ${FONTS.body}`}>
                Supported RBC purchase-alert emails can become pending expenses for review. Manual Telegram and web entry still work on their own.
              </p>
            </div>
          </div>

          <ol className="grid gap-4" aria-label="Automatic expense capture sequence">
            {alertSteps.map(({ icon, title, text }, index) => (
              <li key={title} data-gsap-card className={`rounded-[1.5rem] border border-[var(--home-border)] bg-[var(--home-surface-raised)] p-5 sm:p-6 ${index === 1 ? "lg:translate-x-6" : ""}`}>
                <div className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--home-accent-soft)] text-[var(--home-accent)]">{createElement(icon, { "aria-hidden": true, size: 21 })}</span>
                  <div>
                    <h4 className={`text-sub font-semibold text-[var(--home-text)] ${FONTS.display}`}>{title}</h4>
                    <p className={`mt-2 max-w-xl text-body-sm leading-6 text-[var(--home-muted)] ${FONTS.body}`}>{text}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
