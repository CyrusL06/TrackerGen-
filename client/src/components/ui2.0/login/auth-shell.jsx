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

function AuthMark() {
  return (
    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-[12px] border border-[color:var(--auth-border)] bg-[#c8f135]">
      <svg width="18" height="18" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path
          d="M2 10 L5 6 L8 8 L12 3"
          stroke="black" //sVG color
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[color:var(--auth-text)]"
        />
      </svg>
    </div>
  );
}

export function AuthShell({
  title,
  subtitle,
  switchPrompt,
  switchCta,
  switchTo,
  children,
  footerNote,
}) {
  return (
    <main className="bg-[color:var(--auth-bg)]" style={pageVars}>

         <Link
          to="/"
          className={`absolute sm:left-22 sm:top-6 left-8 top-6 inline-flex min-h-11 items-center gap-2 text-[0.78rem] tracking-[0.02em] text-[color:var(--auth-muted)] transition-colors hover:text-[color:var(--auth-text)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[rgba(242,237,230,0.18)]  ${FONTS.mono}`}
        >
          <ChevronLeft size={16} />
          <span>Home</span>
        </Link>
      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-[46rem] items-center justify-center px-4 py-10 sm:px-6 sm:py-12">

        <section className="w-full max-w-[40rem]">
          <AuthMark />
          <div className="mt-6 text-center">
            <h1
              className={`text-[clamp(2.15rem,4.5vw,2.9rem)] leading-[0.96] tracking-[0.02em] text-[color:var(--auth-text)] ${FONTS.display}`}>
              {title}
            </h1>
            <p
              className={`mx-auto mt-2.5 max-w-[24rem] text-[0.8rem] leading-6 text-[color:var(--auth-muted)] ${FONTS.mono}`}>
              {subtitle}
            </p>
            {switchPrompt && switchCta && switchTo ? (
              <p
                className={`mx-auto text-[0.82rem] leading-6 text-[color:var(--auth-muted)] ${FONTS.mono}`}
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

          <div className="mt-7">{children}</div>

          {footerNote ? (
            <p
              className={`mx-auto mt-7 max-w-[28rem] text-center text-[0.72rem] leading-6 text-[color:var(--auth-muted)] ${FONTS.mono}`}
            >
              {footerNote}
            </p>
          ) : null}
        </section>
      </div>
    </main>
  );
}
