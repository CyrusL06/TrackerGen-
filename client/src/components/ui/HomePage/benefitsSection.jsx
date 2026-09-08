import { BarChart3, MessageSquareText, PencilLine } from "lucide-react";
import { createElement } from "react";
import { FONTS, LAYOUT } from "../pudgy-brand";

const benefits = [
  {
    icon: MessageSquareText,
    title: "Capture it where you already chat",
    text: "Send a short Telegram message when you spend, then keep moving.",
    className: "lg:col-span-5 lg:min-h-[19rem]",
  },
  {
    icon: BarChart3,
    title: "See the month without spreadsheet math",
    text: "Income, expenses, category totals, and net change stay together in one calm view.",
    className: "lg:col-span-7 lg:min-h-[19rem] lg:translate-y-10",
  },
  {
    icon: PencilLine,
    title: "Fix the record anytime",
    text: "Add, edit, delete, or restore transactions when you need to correct the month.",
    className: "lg:col-span-8 lg:col-start-3 lg:min-h-[17rem]",
  },
];

export default function BenefitsSection() {
  return (
    <section className={`${LAYOUT.content} py-18 md:py-28`} aria-labelledby="benefits-title">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
        <div data-gsap-section className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start">
          <h2 id="benefits-title" className={`text-balance text-[clamp(2.2rem,4.8vw,4.35rem)] font-bold leading-[1] tracking-[-0.045em] text-[var(--home-text)] ${FONTS.display}`}>
            Built for a habit you can actually keep.
          </h2>
          <p className={`mt-6 max-w-md text-pretty text-body leading-7 text-[var(--home-muted)] md:text-lead ${FONTS.body}`}>
            No heavy setup. Just a faster way to notice where your money went.
          </p>
        </div>

        <div className="grid gap-4 lg:col-span-7 lg:grid-cols-12 lg:gap-5">
          {benefits.map(({ icon, title, text, className }, index) => (
            <article key={title} data-gsap-card className={`group relative overflow-hidden rounded-[1.75rem] border border-[var(--home-border)] bg-[var(--home-surface)] p-6 shadow-[var(--home-shadow)] transition duration-200 hover:-translate-y-1 hover:border-[var(--home-border-strong)] sm:p-7 ${className}`}>
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[var(--home-accent-soft)]" />
              <div className="relative flex h-full flex-col justify-between gap-10">
                <div className="flex items-start justify-between gap-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--home-accent-soft)] text-[var(--home-accent)]">
                    {createElement(icon, { "aria-hidden": true, size: 23 })}
                  </div>
                  <p className={`text-[clamp(2.8rem,7vw,5.25rem)] font-bold leading-none text-[var(--home-accent)] opacity-15 ${FONTS.display}`}>0{index + 1}</p>
                </div>

                <div>
                  <h3 className={`max-w-lg text-balance text-[clamp(1.55rem,3vw,2.35rem)] font-bold leading-[1.04] tracking-[-0.035em] text-[var(--home-text)] ${FONTS.display}`}>{title}</h3>
                  <p className={`mt-4 max-w-md text-pretty text-body leading-7 text-[var(--home-muted)] ${FONTS.body}`}>{text}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
