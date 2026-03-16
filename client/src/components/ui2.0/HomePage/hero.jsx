import BtnPrimary from "./btnPrimary";
import { COLORS, FONTS, LAYOUT } from "../brand";

function BtnGhost({ children }) {
  return (
    <a
      href="#how-it-works"
      className={`flex items-center gap-1.5 text-[0.78rem] tracking-[0.05em] text-[#6b6860] no-underline transition-colors duration-200 hover:text-[#f2ede6] ${FONTS.mono}`}
    >
      {children}
    </a>
  );
}

export default function Hero() {
  return (
    
    <section id="home" className={`${LAYOUT.content} flex flex-col pt-28 pb-28 jus`}>
      <div className="mx-auto">          {/* Center */}
           <div
        className={`mb-6 inline-flex items-center gap-2 border border-[rgba(200,241,53,0.3)] px-[0.7rem] py-[0.3rem] text-[0.72rem] uppercase tracking-[0.1em] text-[#c8f135] ${FONTS.mono}`}
      >
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#c8f135] animate-pulse motion-reduce:animate-none" />
        Now in early access
      </div>
      <h1
        className={`mb-2 text-[clamp(3.5rem,6vw,6rem)] leading-[0.95] tracking-[0.02em] text-[#f2ede6] ${FONTS.display}`}
      >
        Track every
        <br />
        <span className={`block text-[clamp(3rem,5.5vw,5.5rem)] text-[#f1a935] ${FONTS.serif}`}>
          dollar.
        </span>
        Know where
        <br />
        it goes.
      </h1>

      <p className={`my-6 max-w-[360px] text-[0.88rem] leading-[1.7] text-[#8c8c8c] ${FONTS.mono}`}>
        Built for people who actually want to see their numbers.{" "}
        <strong className="font-medium text-[#f2ede6]">Real-time expense tracking</strong> and
        portfolio management - no fluff, no bloat.
      </p>

      <div className="flex flex-wrap items-center gap-4">
        <BtnPrimary href="/login">Get Started Free</BtnPrimary>
        <BtnGhost>See how it works</BtnGhost>
      </div>

      <div className="mt-12 flex flex-wrap gap-8 border-t border-[#222220] pt-8">
        {[["12K+","Active users"],["$2.4M","Tracked monthly"],["99.9%","Uptime"]].map(([num, label]) => (
          <div key={label}>
            <span className={`block text-[2rem] tracking-[0.02em] text-[#f2ede6] ${FONTS.display}`}>
              {num}
            </span>
            <span className={`text-[0.7rem] uppercase tracking-[0.08em] text-[#6b6860] ${FONTS.mono}`}>
              {label}
            </span>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
