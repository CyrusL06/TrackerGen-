import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { COLORS, FONTS } from "@/components/ui2.0/brand";

const pageVars = {
  "--auth-bg": COLORS.bg,
  "--auth-border": "rgba(242,237,230,0.06)",
  "--auth-border-strong": "rgba(242,237,230,0.1)",
  "--auth-text": COLORS.text,
  "--auth-muted": "#8a857d",
  "--auth-accent": COLORS.accent,
};

export function AuthMark() {
  return (
    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-[12px] border border-[color:var(--auth-border)] bg-[#c8f135]">
      <svg width="18" height="18" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path
          d="M2 10 L5 6 L8 8 L12 3"
          stroke={COLORS.bg}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function AuthShell({
  title,
  subtitle,
  eyebrow,
  switchPrompt,
  switchCta,
  switchTo,
  children,
  footerNote,
  topActionTo = "/",
  topActionLabel = "Home",
  showTopAction = true,
}) {
  return (
    <main className="relative bg-[color:var(--auth-bg)]" style={pageVars}>
      {showTopAction ? (
        <Link
          to={topActionTo}
          className={`absolute left-4 top-4 z-10 inline-flex min-h-10 items-center gap-2 text-[0.74rem] tracking-[0.02em] text-[color:var(--auth-muted)] transition-colors hover:text-[color:var(--auth-text)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[rgba(242,237,230,0.18)] sm:left-5 sm:top-5 ${FONTS.mono}`}
        >
          <ChevronLeft size={16} />
          <span>{topActionLabel}</span>
        </Link>
      ) : null}

      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-[42rem] items-center justify-center px-4 py-8 sm:px-5 sm:py-10">
        <section className="w-full max-w-[35rem]">
          <AuthMark />
          <div className="mt-5 text-center">
            {eyebrow ? (
              <div
                className={`mb-2.5 text-[0.7rem] tracking-[0.08em] text-[color:var(--auth-muted)] ${FONTS.mono}`}
              >
                {eyebrow}
              </div>
            ) : null}

            <h1
              className={`text-[clamp(1.9rem,4vw,2.55rem)] leading-[0.96] tracking-[0.02em] text-[color:var(--auth-text)] ${FONTS.display}`}
            >
              {title}
            </h1>
            <p
              className={`mx-auto mt-2 max-w-[22rem] text-[0.76rem] leading-5 text-[color:var(--auth-muted)] ${FONTS.mono}`}
            >
              {subtitle}
            </p>
            {switchPrompt && switchCta && switchTo ? (
              <p
                className={`mx-auto mt-1.5 text-[0.78rem] leading-5 text-[color:var(--auth-muted)] ${FONTS.mono}`}
              >
                {switchPrompt}{" "}
                <Link
                  to={switchTo}
                  className="text-[color:var(--auth-text)] transition-opacity hover:opacity-75"
                >
                  {switchCta}
                </Link>
              </p>
            ) : null}
          </div>

          <div className="mt-6">{children}</div>

          {footerNote ? (
            <p
              className={`mx-auto mt-6 max-w-[24rem] text-center text-[0.68rem] leading-5 text-[color:var(--auth-muted)] ${FONTS.mono}`}
            >
              {footerNote}
            </p>
          ) : null}
        </section>
      </div>
    </main>
  );
}
