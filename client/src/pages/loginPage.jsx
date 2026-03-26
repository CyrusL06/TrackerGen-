import { LoginForm } from "@/components/ui2.0/login/login-form";
import { FONTS, NOISE_BACKGROUND } from "@/components/ui2.0/brand";

export default function LoginPage() {
  return (
    <main className="relative overflow-hidden bg-[color:var(--brand-bg)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{ backgroundImage: NOISE_BACKGROUND }}
      />
      <div className="pointer-events-none absolute left-1/2 top-16 h-32 w-[24rem] -translate-x-1/2 rounded-full bg-[color:var(--brand-accent)]/10 blur-3xl delight-orbit" />

      <div className="relative mx-auto flex min-h-[calc(100vh-11rem)] w-full max-w-[31rem] items-center justify-center px-4 py-10 sm:py-14">
        <section className="delight-rise w-full border border-[color:var(--brand-accent)] bg-[color:var(--brand-surface)] p-5 sm:p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]">
          <div className="mb-5 flex items-center justify-between border-b border-white/12 pb-4">
            <div>
              <p className={`text-[0.68rem] uppercase tracking-[0.16em] text-[color:var(--brand-accent)] ${FONTS.mono}`}>
                Preview access
              </p>
              <p className={`mt-2 text-[0.68rem] uppercase tracking-[0.14em] text-[color:var(--brand-muted)] ${FONTS.mono}`}>
                TrackerGen / invite-only session
              </p>
            </div>

            <div
              className={`border border-white/15 px-3 py-2 text-[0.64rem] uppercase tracking-[0.18em] text-[color:var(--brand-text)] ${FONTS.mono}`}
            >
              01
            </div>
          </div>

          <LoginForm />
        </section>
      </div>
    </main>
  );
}
