import { ChevronDown } from "lucide-react";
import { FONTS, LAYOUT } from "../pudgy-brand";

const questions = [
  {
    question: "Do I need to connect my bank?",
    answer: "No. TrackerGen uses the transactions you add through Telegram or the web dashboard. It does not need your online banking credentials.",
  },
  {
    question: "Can I use TrackerGen without Telegram?",
    answer: "Yes. Telegram is the quickest capture method, but you can add, edit, and review transactions directly from the web dashboard.",
  },
  {
    question: "What can I review each month?",
    answer: "The dashboard brings together income, expenses, net change, category breakdowns, and recent activity so you can understand the month at a glance.",
  },
  {
    question: "Can I fix an incorrect transaction?",
    answer: "Yes. Entries can be edited or deleted from the dashboard, and recently deleted transactions can be restored with undo.",
  },
];

export default function FaqSection() {
  return (
    <section id="faq" className={`${LAYOUT.content} scroll-mt-24 py-20 md:py-28`}>
      <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
        <div data-gsap-section>
          <h2 className={`text-balance text-[clamp(2.2rem,4.5vw,3.75rem)] font-bold leading-[1.04] tracking-[-0.035em] text-[var(--home-text)] ${FONTS.display}`}>Questions before you start?</h2>
          <p className={`mt-5 max-w-sm text-body leading-7 text-[var(--home-muted)] ${FONTS.body}`}>The short version: start manually, connect only what helps, and stay in control.</p>
        </div>
        <div className="divide-y divide-[var(--home-border)] border-y border-[var(--home-border)]">
          {questions.map(({ question, answer }) => (
            <details key={question} data-gsap-card className="group">
              <summary className={`flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-body font-semibold text-[var(--home-text)] marker:hidden ${FONTS.body}`}>
                {question}
                <ChevronDown aria-hidden="true" size={19} className="shrink-0 text-[var(--home-accent)] transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <p className={`max-w-2xl pb-6 pr-10 text-body leading-7 text-[var(--home-muted)] ${FONTS.body}`}>{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
