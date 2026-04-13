import { Link } from "react-router-dom";
import { COLORS, FONTS } from "@/components/ui2.0/brand";
import { AuthPrimaryButton } from "@/components/ui2.0/login/auth-primitives.jsx";

const vars = {
  "--auth-border": "rgba(242,237,230,0.06)",
  "--auth-border-strong": "rgba(242,237,230,0.1)",
  "--auth-text": COLORS.text,
  "--auth-muted": "#8a857d",
  "--auth-accent": COLORS.accent,
};

export function QuestionStep({ children, error, onSubmit, footer }) {
  return (
    <form className="grid gap-6" onSubmit={onSubmit} style={vars}>
      <div className="grid gap-4">{children}</div>
      {error ? (
        <p
          className={`rounded-[14px] border border-[color:color-mix(in_srgb,var(--auth-accent)_18%,transparent)] bg-[color:color-mix(in_srgb,var(--auth-accent)_6%,transparent)] px-4 py-3 text-[0.74rem] leading-6 text-[color:var(--auth-text)] ${FONTS.mono}`}
        >
          {error}
        </p>
      ) : null}
      {footer}
    </form>
  );
}

export function ChoiceCardGroup({ options, value, onChange }) {
  return (
    <div className="grid gap-3" style={vars}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-[16px] border px-4 py-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[rgba(242,237,230,0.18)] ${
              selected
                ? "border-[color:color-mix(in_srgb,var(--auth-accent)_40%,transparent)] bg-[color:color-mix(in_srgb,var(--auth-accent)_10%,transparent)]"
                : "border-[color:var(--auth-border)] bg-[rgba(24,24,22,0.72)] hover:border-[color:var(--auth-border-strong)]"
            }`}
          >
            <div className={`text-[0.9rem] text-[color:var(--auth-text)] ${FONTS.mono}`}>
              {option.label}
            </div>
            {option.description ? (
              <div
                className={`mt-1 text-[0.72rem] leading-6 text-[color:var(--auth-muted)] ${FONTS.mono}`}
              >
                {option.description}
              </div>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export function StepFooter({
  backTo,
  backLabel = "Back",
  primaryLabel = "Continue",
  primaryDisabled = false,
}) {
  return (
    <div className="flex items-center justify-between gap-4" style={vars}>
      <Link
        to={backTo}
        className={`inline-flex min-h-11 items-center text-[0.78rem] tracking-[0.02em] text-[color:var(--auth-muted)] transition-colors hover:text-[color:var(--auth-text)] ${FONTS.mono}`}
      >
        {backLabel}
      </Link>
      <AuthPrimaryButton disabled={primaryDisabled}>{primaryLabel}</AuthPrimaryButton>
    </div>
  );
}

export function SummaryRow({ label, value }) {
  return (
    <div
      className="flex items-center justify-between gap-4 border-b border-[color:var(--auth-border)] py-3"
      style={vars}
    >
      <span className={`text-[0.74rem] text-[color:var(--auth-muted)] ${FONTS.mono}`}>{label}</span>
      <span className={`text-[0.86rem] text-[color:var(--auth-text)] ${FONTS.mono}`}>{value}</span>
    </div>
  );
}
