import { FONTS, LAYOUT } from "@/components/ui2.0/brand";

function Step({ num, title, desc }) {
  return (
    <article className="delight-card group relative bg-[color:var(--brand-bg)] px-6 py-10 transition-colors duration-200 hover:bg-[color:var(--brand-surface)] md:px-10">
      <div className="absolute left-0 top-0 h-0 w-[2px] bg-[color:var(--brand-accent)] transition-all duration-300 group-hover:h-full" />
      <div className={`mb-6 text-[4rem] leading-none tracking-[0.02em] text-[color:var(--brand-border)] transition-transform duration-300 group-hover:translate-x-1 ${FONTS.display}`}>
        {num}
      </div>
      <div className={`mb-3 text-[1.4rem] tracking-[0.04em] text-[color:var(--brand-text)] ${FONTS.display}`}>
        {title}
      </div>
      <p className={`text-[0.8rem] leading-[1.7] text-[color:var(--brand-muted)] ${FONTS.mono}`}>{desc}</p>
    </article>
  );
}

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "SIGN IN TO THE PREVIEW",
      desc: "Use your preview access to open the dashboard. The current release is invite-only and focused on the core tracking flow.",
    },
    {
      num: "02",
      title: "LOG WHAT CHANGED",
      desc: "Add income or expense entries with amount, date, and category so the monthly totals and recent activity stay grounded in real input.",
    },
    {
      num: "03",
      title: "REVIEW THE SNAPSHOT",
      desc: "Check your net view, cash flow trend, category mix, and recent transactions in one place before deciding what to adjust next.",
    },
  ];
  return (
    <section id="workflow" className={`${LAYOUT.content} py-24`}>
      <p className={`delight-rise mb-4 text-[0.72rem] uppercase tracking-[0.12em] text-[color:var(--brand-accent)] ${FONTS.mono}`}>
        How it works
      </p>
      <h2
        className={`delight-rise delight-delay-1 mb-16 text-[clamp(2.5rem,4vw,4rem)] leading-none tracking-[0.02em] text-[color:var(--brand-text)] ${FONTS.display}`}
      >
        Clear enough to trust.
        <br />
        <em className={`text-[color:var(--brand-muted)] ${FONTS.serif}`}>Focused enough to keep moving.</em>
      </h2>
      <div className="grid gap-px border border-[color:var(--brand-border)] bg-[color:var(--brand-border)] md:grid-cols-3 delight-rise delight-delay-2">
        {steps.map((step) => (
          <Step key={step.num} {...step} />
        ))}
      </div>
    </section>
  );
}
