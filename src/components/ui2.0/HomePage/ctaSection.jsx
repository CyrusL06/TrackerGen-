import BtnPrimary from "./btnPrimary";
import { COLORS, FONTS, LAYOUT } from "@/components/ui2.0/brand";

export default function CtaSection() {
  return (
    <section className="relative overflow-hidden border-t border-[#222220] py-24 text-center">
      <div
        className="pointer-events-none absolute left-1/2 top-[-50%] h-[300px] w-[600px] -translate-x-1/2 bg-[radial-gradient(ellipse,rgba(200,241,53,0.06)_0%,transparent_70%)]"
      />
      <div className={`${LAYOUT.content} relative`}>
        <p className={`mb-6 text-[0.72rem] uppercase tracking-[0.12em] text-[#6b6860] ${FONTS.mono}`}>
          Ready to start?
        </p>
        <h2
          className={`mb-8 text-[clamp(3rem,6vw,6rem)] leading-none tracking-[0.02em] text-[#f2ede6] ${FONTS.display}`}
        >
          Your finances.
          <br />
          <span className="text-[#c8f135]">Clarified.</span>
        </h2>
        <p className={`mb-10 text-[0.85rem] text-[#6b6860] ${FONTS.mono}`}>
          Free to start. No credit card required.
        </p>
        <BtnPrimary>Create your account</BtnPrimary>
      </div>
    </section>
  );
}
