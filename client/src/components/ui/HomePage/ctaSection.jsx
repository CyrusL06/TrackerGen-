import { FONTS, LAYOUT } from "../pudgy-brand";

export default function CtaSection() {
  return (
    <section id="access" className="relative overflow-hidden border-t border-[rgba(255,255,255,0.05)] py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2779a7]/4 via-transparent to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-[-20%] h-[400px] w-[600px] -translate-x-1/2 bg-[radial-gradient(ellipse,#2779a7/4_0%,transparent_60%)]" />

      <div className={`${LAYOUT.content} relative text-center`}>
        <p className={`mb-3 text-caption font-medium uppercase tracking-[0.15em] text-[#2779a7] ${FONTS.mono}`}>
          Get Started
        </p>

        <h2 className={`mb-4 text-[clamp(2.2rem,7vw,4rem)] font-bold leading-[1.1] tracking-[-0.02em] text-white ${FONTS.display}`}>
          Your money deserves
          <br />
          <span className="text-[#2779a7]">a clear view.</span>
        </h2>

        <p className={`mx-auto mb-10 max-w-md text-body leading-relaxed text-[oklch(0.52_0.025_260)] md:text-lead ${FONTS.body}`}>
          Start tracking in under two minutes. No bank connections, no credit cards.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="/login"
            className="inline-flex items-center gap-2 rounded-lg bg-[#2779a7] px-8 py-3.5 text-body font-medium text-white no-underline transition-all duration-200 hover:bg-[#1d5f83] hover:-translate-y-0.5"
          >
            Open Preview
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a
            href="/signup"
            className="inline-flex items-center gap-2 rounded-lg border border-[rgba(255,255,255,0.15)] px-8 py-3.5 text-body font-medium text-[oklch(0.65_0.025_260)] no-underline transition-all duration-200 hover:border-[rgba(255,255,255,0.3)] hover:text-white"
          >
            Create Account
          </a>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-body-sm text-[oklch(0.52_0.025_260)]">
          <span className={`inline-flex items-center gap-1.5 ${FONTS.body}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2779a7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3  y=11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            No bank access needed
          </span>
          <span className={`inline-flex items-center gap-1.5 ${FONTS.body}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2779a7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4Z" />
            </svg>
            Telegram powered
          </span>
          <span className={`inline-flex items-center gap-1.5 ${FONTS.body}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2779a7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Free to use
          </span>
        </div>
      </div>
    </section>
  );
}
