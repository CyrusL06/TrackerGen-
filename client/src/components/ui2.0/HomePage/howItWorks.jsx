import { FONTS, LAYOUT } from "@/components/ui2.0/brand";

function Step({ num, title, desc }) {
  return (
    <article className="group relative bg-[#0a0a08] px-5 py-7 transition-colors duration-200 hover:bg-[#111110] md:px-10 md:py-10">
      <div className="absolute left-0 top-0 h-0 w-[2px] bg-[#c8f135] transition-all duration-300 group-hover:h-full" />
      <div className={`mb-4 text-[2.9rem] leading-none tracking-[0.02em] text-[#222220] md:mb-6 md:text-[4rem] ${FONTS.display}`}>
        {num}
      </div>
      <div className={`mb-2 text-[1.2rem] tracking-[0.04em] text-[#f2ede6] md:mb-3 md:text-[1.4rem] ${FONTS.display}`}>
        {title}
      </div>
      <p className={`text-[0.92rem] leading-[1.7] text-[#6b6860] md:text-[0.8rem] ${FONTS.mono}`}>{desc}</p>
    </article>
  );
}

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "OPEN THE PREVIEW",
      desc: "Use the preview route to enter the current dashboard experience on this device.",
    },
    {
      num: "02",
      title: "ADD WHAT CHANGED",
      desc: "Log income and expenses with a date, amount, and category so the current month stays grounded in real entries.",
    },
    {
      num: "03",
      title: "REVIEW THE MONTH",
      desc: "Check net change, cash flow, category mix, and recent activity before deciding what to update next.",
    },
  ];
  return (
    <section id="how-it-works" className={`${LAYOUT.content} py-16 md:py-24`}>
      <p className={`mb-3 text-[0.76rem] uppercase tracking-[0.12em] text-[#c8f135] md:mb-4 md:text-[0.72rem] ${FONTS.mono}`}>
        How it works
      </p>
      <h2
        className={`mb-8 text-[clamp(2rem,10vw,4rem)] leading-[0.98] tracking-[0.02em] text-[#f2ede6] md:mb-16 md:leading-none ${FONTS.display}`}
      >
        Honest by design.
        <br />
        <em className={`text-[#6b6860] ${FONTS.serif}`}>Focused on the current month.</em>
      </h2>
      <div className="grid gap-px border border-[#222220] bg-[#222220] md:grid-cols-3">
        {steps.map((step) => (
          <Step key={step.num} {...step} />
        ))}
      </div>
    </section>
  );
}
