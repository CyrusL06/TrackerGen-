import { FONTS, LAYOUT } from "../pudgy-brand";

const steps = [
  {
    num: "01",
    title: "Create your account",
    desc: "Set the basics once.",
  },
  {
    num: "02",
    title: "Record what changed",
    desc: "Add a purchase by Telegram or web.",
  },
  {
    num: "03",
    title: "Notice the pattern",
    desc: "Use the month view to decide what comes next.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 border-y border-[var(--home-border)] py-14 md:py-20" style={{ background: "var(--bg-page)" }}>
      <div className={LAYOUT.content}>
        <div data-gsap-section className="mb-9 max-w-2xl">
          <h2 className={`text-balance text-[clamp(2rem,4.4vw,3.75rem)] font-bold leading-[1.03] tracking-[-0.035em] text-[var(--home-text)] ${FONTS.display}`}>
            Three steps, then keep moving.
          </h2>
          <p className={`mt-4 max-w-xl text-pretty text-body leading-7 text-[var(--home-muted)] ${FONTS.body}`}>
            A compact setup for the habit shown above.
          </p>
        </div>

        <ol className="grid gap-4 md:grid-cols-3">
          {steps.map(({ num, title, desc }) => (
            <li key={num} data-gsap-card className="rounded-[1.75rem] border border-[var(--home-border)] bg-[var(--home-surface)] p-5 shadow-[var(--home-shadow)] sm:p-6">
              <span className={`text-body-sm font-semibold text-[var(--home-accent)] ${FONTS.body}`}>{num}</span>
              <h3 className={`mt-5 text-balance text-sub font-bold tracking-[-0.02em] text-[var(--home-text)] ${FONTS.display}`}>{title}</h3>
              <p className={`mt-2 text-body-sm leading-6 text-[var(--home-muted)] ${FONTS.body}`}>{desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
