import { ArrowRight } from "lucide-react";
import { FONTS, LAYOUT } from "../pudgy-brand";

export default function CtaSection() {
  return (
    <section id="access" className="relative overflow-hidden border-t border-[var(--home-border)] py-20 md:py-28">
      <div data-gsap-section className={`${LAYOUT.content} relative text-center`}>
        <h2 className={`mx-auto max-w-4xl text-balance text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[1.02] tracking-[-0.04em] text-[var(--home-text)] ${FONTS.display}`}>
          Remember the purchase now. Understand the month later.
        </h2>

        <p className={`mx-auto mt-6 max-w-xl text-pretty text-body leading-7 text-[var(--home-muted)] md:text-lead ${FONTS.body}`}>
          Create your account, add the first transaction, and start building a clearer picture without connecting your bank.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="/signup"
            className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[var(--action-primary)] px-7 py-3 text-body font-semibold text-white no-underline shadow-[0_14px_36px_rgba(42,132,181,0.24)] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-[var(--action-primary-hover)]"
          >
            Create free account
            <ArrowRight aria-hidden="true" size={17} />
          </a>
          <a
            href="/login"
            className="inline-flex min-h-12 items-center rounded-xl border border-[var(--home-border-strong)] px-7 py-3 text-body font-medium text-[var(--home-muted)] no-underline transition-colors duration-200 hover:text-[var(--home-text)]"
          >
            Sign in
          </a>
        </div>

        <p className={`mx-auto mt-7 max-w-md text-body-sm leading-6 text-[var(--home-dim)] ${FONTS.body}`}>
          No bank credentials required. Add only what you choose to track.
        </p>
      </div>
    </section>
  );
}
