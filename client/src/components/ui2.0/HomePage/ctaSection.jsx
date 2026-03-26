import BtnPrimary from "./btnPrimary";
import { FONTS, LAYOUT } from "@/components/ui2.0/brand";

export default function CtaSection() {
  return (
    <section
      id="access"
      className="relative overflow-hidden border-t border-[color:var(--brand-border)] py-24 text-center"
    >
      <div className="pointer-events-none absolute left-1/2 top-6 h-24 w-[22rem] -translate-x-1/2 rounded-full bg-[color:var(--brand-accent)]/10 blur-3xl delight-orbit" />
      <div className={`${LAYOUT.content} relative`}>
        <p className={`delight-rise mb-6 text-[0.72rem] uppercase tracking-[0.12em] text-[color:var(--brand-muted)] ${FONTS.mono}`}>
          Access
        </p>
        <h2
          className={`delight-rise delight-delay-1 mb-8 text-[clamp(3rem,6vw,6rem)] leading-none tracking-[0.02em] text-[color:var(--brand-text)] ${FONTS.display}`}
        >
          Open the preview.
          <br />
          <span className="text-[color:var(--brand-accent)]">Review what changed.</span>
        </h2>
        <p className={`delight-rise delight-delay-2 mb-10 text-[0.85rem] text-[color:var(--brand-muted)] ${FONTS.mono}`}>
          Public signup is not live yet. Use your preview credentials to continue into the tracker.
        </p>
        <div className="delight-rise delight-delay-3 inline-flex flex-col items-center gap-4">
          <BtnPrimary href="/login">Go to preview login</BtnPrimary>
          <span className={`rounded-full border border-[color:var(--brand-border)] bg-[color:var(--brand-surface)] px-3 py-1 text-[0.68rem] uppercase tracking-[0.12em] text-[color:var(--brand-muted)] ${FONTS.mono}`}>
            Opens in one quiet step
          </span>
        </div>
      </div>
    </section>
  );
}
