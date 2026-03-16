import { FONTS, LAYOUT } from "@/components/ui2.0/brand";

function Step({ num, title, desc }) {
  return (
    <article className="group relative bg-[#0a0a08] px-6 py-10 transition-colors duration-200 hover:bg-[#111110] md:px-10">
      <div className="absolute left-0 top-0 h-0 w-[2px] bg-[#c8f135] transition-all duration-300 group-hover:h-full" />
      <div className={`mb-6 text-[4rem] leading-none tracking-[0.02em] text-[#222220] ${FONTS.display}`}>
        {num}
      </div>
      <div className={`mb-3 text-[1.4rem] tracking-[0.04em] text-[#f2ede6] ${FONTS.display}`}>
        {title}
      </div>
      <p className={`text-[0.8rem] leading-[1.7] text-[#6b6860] ${FONTS.mono}`}>{desc}</p>
    </article>
  );
}

export default function HowItWorks() {
  const steps = [
    { num:"01", title:"CONNECT YOUR ACCOUNTS", desc:"Link your bank, credit cards, and investment accounts in under 2 minutes. We support 10,000+ institutions." },
    { num:"02", title:"SEE YOUR NUMBERS",       desc:"Every transaction categorized automatically. Spending patterns surfaced instantly. No manual entry, ever." },
    { num:"03", title:"MAKE BETTER MOVES",      desc:"Set goals, track progress, get alerts when you overspend. Your money, finally working for you." },
  ];
  return (
    <section id="how-it-works" className={`${LAYOUT.content} py-24`}>
      <p className={`mb-4 text-[0.72rem] uppercase tracking-[0.12em] text-[#c8f135] ${FONTS.mono}`}>
        How it works
      </p>
      <h2
        className={`mb-16 text-[clamp(2.5rem,4vw,4rem)] leading-none tracking-[0.02em] text-[#f2ede6] ${FONTS.display}`}
      >
        Simple by design.
        <br />
        <em className={`text-[#6b6860] ${FONTS.serif}`}>Powerful by default.</em>
      </h2>
      <div className="grid gap-px border border-[#222220] bg-[#222220] md:grid-cols-3">
        {steps.map((step) => (
          <Step key={step.num} {...step} />
        ))}
      </div>
    </section>
  );
}
