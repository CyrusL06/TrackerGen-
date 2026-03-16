import { LoginForm } from "@/components/ui2.0/login/login-form";
import { COLORS, FONTS, NOISE_BACKGROUND } from "@/components/ui2.0/brand";

const pageVars = {
  "--login-bg": COLORS.bg,
  "--login-panel": "#0f0f0d",
  "--login-border": COLORS.border,
  "--login-text": COLORS.text,
  "--login-muted": COLORS.muted,
  "--login-accent": COLORS.accent,
};

export default function LoginPage() {
  return (
    <main
      className="relative overflow-hidden bg-[color:var(--login-bg)]"
      style={pageVars}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{ backgroundImage: NOISE_BACKGROUND }}
      />

      <div className="relative mx-auto flex min-h-[calc(100vh-11rem)] w-full max-w-[31rem] items-center justify-center px-4 py-10 sm:py-14">
        <section className="w-full border border-[color:var(--login-accent)] bg-[color:var(--login-panel)] p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between border-b border-[color:var(--login-border)] pb-4">
            <div>
              <p className={`text-[0.68rem] uppercase tracking-[0.16em] text-[color:var(--login-accent)] ${FONTS.mono}`}>
                Access panel
              </p>
              <p className={`mt-2 text-[0.68rem] uppercase tracking-[0.14em] text-[color:var(--login-muted)] ${FONTS.mono}`}>
                TrackerGen / secure session
              </p>
            </div>

            <div
              className={`border border-[color:var(--login-border)] px-3 py-2 text-[0.64rem] uppercase tracking-[0.18em] text-[color:var(--login-text)] ${FONTS.mono}`}
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
