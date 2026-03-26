import BtnPrimary from "./btnPrimary";
import { FONTS, LAYOUT } from "../brand";

function BtnGhost({ children }) {
  return (
    <a
      href="#workflow"
      className={`flex items-center gap-1.5 text-[0.78rem] tracking-[0.05em] text-[color:var(--brand-muted)] no-underline transition-colors duration-200 hover:text-[color:var(--brand-text)] ${FONTS.mono}`}
    >
      {children}
    </a>
  );
}

export default function Hero() {
  const proofPoints = [
    ["Fast entry", "Capture income and expenses without leaving the page."],
    ["Monthly clarity", "See cash flow, spending mix, and savings rate together."],
    ["Focused review", "A private preview built around the essentials, not feature sprawl."],
  ];

  return (
    <section id="home" className={`${LAYOUT.content} flex flex-col pt-28 pb-28`}>
      <div className="mx-auto max-w-[42rem]">
        <div
          className={`delight-rise mb-6 inline-flex items-center gap-2 border border-[color:var(--brand-border)] bg-[color:var(--brand-surface)] px-[0.7rem] py-[0.3rem] text-[0.72rem] uppercase tracking-[0.1em] text-[color:var(--brand-accent)] ${FONTS.mono}`}
        >
          <span className="delight-orbit h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--brand-accent)]" />
          Private preview
        </div>
        <h1
          className={`delight-rise delight-delay-1 mb-3 text-[clamp(3.5rem,6vw,6rem)] leading-[0.95] tracking-[0.02em] text-[color:var(--brand-text)] ${FONTS.display}`}
        >
          A cleaner way
          <br />
          to review your
          <br />
          <span className={`block text-[clamp(3rem,5.5vw,5.4rem)] text-[color:var(--brand-accent)] ${FONTS.serif}`}>
            monthly money.
          </span>
        </h1>

        <p className={`delight-rise delight-delay-2 my-6 max-w-[36rem] text-[0.92rem] leading-[1.8] text-[color:var(--brand-muted)] ${FONTS.mono}`}>
          TrackerGen is a focused cash-flow tracker in private preview. Sign in, add income and
          expenses, and review a clear monthly snapshot without fake banking claims or overloaded
          dashboards.
        </p>

        <div className="delight-rise delight-delay-3 flex flex-wrap items-center gap-4">
          <BtnPrimary href="/login">Preview the dashboard</BtnPrimary>
          <BtnGhost>See the workflow</BtnGhost>
        </div>

        <div className="mt-12 grid gap-px border border-[color:var(--brand-border)] bg-[color:var(--brand-border)] md:grid-cols-3 delight-rise delight-delay-4">
          {proofPoints.map(([title, description]) => (
            <div key={title} className="delight-card bg-[color:var(--brand-bg)] px-5 py-6">
              <span
                className={`mb-3 block text-[0.68rem] uppercase tracking-[0.16em] text-[color:var(--brand-accent)] ${FONTS.mono}`}
              >
                {title}
              </span>
              <p className={`text-[0.82rem] leading-[1.7] text-[color:var(--brand-muted)] ${FONTS.mono}`}>
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
