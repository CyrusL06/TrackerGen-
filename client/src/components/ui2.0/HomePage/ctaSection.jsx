import BtnPrimary from "./btnPrimary";
import { FONTS, LAYOUT } from "@/components/ui2.0/brand";

export default function CtaSection() {
  return (
    <section id="access" className="relative overflow-hidden border-t border-[#222220] py-16 text-center md:py-24">
      <div
        className="pointer-events-none absolute left-1/2 top-[-35%] h-[200px] w-[360px] -translate-x-1/2 bg-[radial-gradient(ellipse,rgba(200,241,53,0.04)_0%,transparent_72%)] md:top-[-50%] md:h-[260px] md:w-[520px]"
      />
      <div className={`${LAYOUT.content} relative`}>
        <p className={`mb-4 text-[0.76rem] uppercase tracking-[0.12em] text-[#6b6860] md:mb-6 md:text-[0.72rem] ${FONTS.mono}`}>
          Ready to review?
        </p>
        <h2
          className={`mb-6 text-[clamp(2.25rem,12vw,6rem)] leading-[0.95] tracking-[0.02em] text-[#f2ede6] md:mb-8 md:leading-none ${FONTS.display}`}
        >
          Open the
          <br />
          <span className="text-[#c8f135]">preview.</span>
        </h2>
        <p className={`mb-7 text-[0.95rem] leading-[1.7] text-[#6b6860] md:mb-10 md:text-[0.85rem] ${FONTS.mono}`}>
          Continue into the current dashboard build to add entries and review the month.
        </p>
        <BtnPrimary href="/login">Go to Preview</BtnPrimary>
      </div>
    </section>
  );
}
