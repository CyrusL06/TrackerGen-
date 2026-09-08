import { Database, Landmark, ShieldCheck } from "lucide-react";
import { FONTS, LAYOUT } from "../pudgy-brand";

export default function PrivacySection() {
  return (
    <section id="privacy" className="scroll-mt-24 py-14 md:py-20" style={{ background: "var(--bg-page)" }}>
      <div className={LAYOUT.content}>
        <div data-gsap-section className="relative overflow-hidden rounded-[2rem] border border-[var(--home-border)] bg-[var(--home-surface)] px-6 py-12 text-[var(--home-text)] shadow-[var(--home-shadow)] sm:px-10 md:px-14 md:py-16">
          <div data-gsap-drift className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full border-[46px] border-[#70b8df]/[0.07]" />
          <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--home-accent-soft)] text-[var(--home-accent)]">
                <ShieldCheck aria-hidden="true" size={26} />
              </div>
              <h2 className={`max-w-xl text-balance text-[clamp(2.15rem,5vw,4.25rem)] font-bold leading-[1.02] tracking-[-0.04em] ${FONTS.display}`}>
                Your budget does not require your bank password.
              </h2>
              <p className={`mt-6 max-w-xl text-pretty text-body leading-7 text-[var(--home-muted)] md:text-lead ${FONTS.body}`}>
                TrackerGen is built around transactions you choose to record, not permission to browse your bank account.
              </p>
            </div>

            <div className="self-end rounded-[1.75rem] border border-[var(--home-border)] bg-[var(--home-surface-raised)] p-6 sm:p-8">
              <div className="flex gap-4 border-b border-[var(--home-border)] pb-6">
                <Landmark aria-hidden="true" className="mt-0.5 shrink-0 text-[var(--home-accent)]" size={22} />
                <div>
                  <h3 className={`font-semibold text-[var(--home-text)] ${FONTS.body}`}>What we do not ask for</h3>
                  <p className={`mt-2 text-body-sm leading-6 text-[var(--home-muted)] ${FONTS.body}`}>Bank login credentials or permission to browse your account.</p>
                </div>
              </div>
              <div className="flex gap-4 pt-6">
                <Database aria-hidden="true" className="mt-0.5 shrink-0 text-[var(--home-accent)]" size={22} />
                <div>
                  <h3 className={`font-semibold text-[var(--home-text)] ${FONTS.body}`}>What powers your dashboard</h3>
                  <p className={`mt-2 text-body-sm leading-6 text-[var(--home-muted)] ${FONTS.body}`}>The entries and preferences you submit through TrackerGen.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
