import { FONTS, LAYOUT } from "../pudgy-brand";

const steps = [
  {
    num: "01",
    title: "Open the Preview",
    desc: "Jump into the dashboard from your browser. No signup required, no waiting.",
  },
  {
    num: "02",
    title: "Add What Changed",
    desc: "Log income and expenses with a date, amount, and category. Simple as typing a message.",
  },
  {
    num: "03",
    title: "Review Your Month",
    desc: "Check net change, cash flow, category mix, and recent activity in one place.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className={`${LAYOUT.content} py-20 md:py-28`}>
      <div className="mx-auto max-w-2xl text-center">
        <p className={`mb-3 text-[0.72rem] font-medium uppercase tracking-[0.15em] text-[#2779a7] ${FONTS.mono}`}>
          How It Works
        </p>
        <h2 className={`mb-4 text-[clamp(2rem,6vw,3.5rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-white ${FONTS.display}`}>
          Three steps to clarity.
        </h2>
        <p className={`mb-14 text-[1rem] leading-relaxed text-[#6b7280] md:text-[1.05rem] ${FONTS.body}`}>
          No fluff, no fuss. Just your finances in view.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 md:gap-8">
        {steps.map(({ num, title, desc }) => (
          <div
            key={num}
            className="group relative rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-8 transition-all duration-300 hover:border-[rgba(39,121,167,0.2)] hover:bg-[rgba(39,121,167,0.03)]"
          >
            <span className={`mb-5 block text-[2.5rem] font-semibold text-[rgba(255,255,255,0.06)] ${FONTS.display}`}>
              {num}
            </span>
            <h3 className={`mb-3 text-[1.2rem] font-semibold text-white ${FONTS.display}`}>{title}</h3>
            <p className={`text-[0.9rem] leading-relaxed text-[#6b7280] ${FONTS.body}`}>{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
