import BtnPrimary from "./btnPrimary";
import { FONTS, LAYOUT } from "../brand";


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
    <section
      id="home"
      className={`${LAYOUT.content} flex min-h-[calc(100svh-4.8rem)] flex-col justify-center pt-10 pb-8 md:min-h-[calc(100svh-5.4rem)] md:pt-14 md:pb-12`}
    >
      <div className="mx-auto w-full max-w-3xl">
        <div
          className={`mb-3 inline-flex items-center gap-2 border border-[rgba(200,241,53,0.3)] px-[0.65rem] py-[0.28rem] text-[0.68rem] uppercase tracking-[0.1em] text-[#c8f135] md:mb-4 md:text-[0.7rem] ${FONTS.mono}`}
        >
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#c8f135] animate-pulse motion-reduce:animate-none" />
          Early access preview
        </div>
        <h1
          className={`mb-2 text-[clamp(2.55rem,11vw,5.1rem)] leading-[0.94] tracking-[0.02em] text-[#f2ede6] md:leading-[0.92] ${FONTS.display}`}
        >
          Your 
               <br />
          Expense
          <br />
          Tracker
             <br />
          Buddy on
          <span className={`block text-[clamp(2.2rem,10vw,4.45rem)] text-[#f1a935] ${FONTS.serif}`}>
            Telegram.
          </span>
        
        </h1>

        <p
          className={`my-4 max-w-136 text-[0.96rem] leading-[1.7] text-[#8c8c8c] md:my-5 md:text-[0.84rem] md:leading-[1.65] ${FONTS.mono}`}
        >
          {/* Built for people who want a clear monthly money snapshot. Add income and expenses
          manually, then review cash flow, category mix, and recent activity in one place. */}

          Add what came in. Add what went out. See exactly where you stand — 
          in under 2 minutes. No bank connections. No overwhelm. Just clarity.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <BtnPrimary href="/login">Open Preview</BtnPrimary>
          <BtnGhost>See how it works</BtnGhost>
        </div>

        <div className="mt-6 grid gap-4 border-t border-[#222220] pt-4 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-5 sm:pt-5">
          {[
            ["Manual", "Income and expense entry"],
            ["Monthly", "Current snapshot review"],
            ["Recent", "Activity and quick corrections"],
          ].map(([num, label]) => (
            <div key={label}>
              <span className={`block text-[1.45rem] tracking-[0.02em] text-[#f2ede6] sm:text-[1.7rem] ${FONTS.display}`}>
                {num}
              </span>
              <span
                className={`text-[0.74rem] uppercase tracking-[0.08em] text-[#6b6860] sm:text-[0.68rem] ${FONTS.mono}`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
