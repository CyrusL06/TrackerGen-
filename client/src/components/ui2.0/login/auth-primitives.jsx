import { Link } from "react-router-dom";
import { COLORS, FONTS } from "@/components/ui2.0/brand";

const vars = {
  "--auth-bg": COLORS.bg,
  "--auth-border": "rgba(242,237,230,0.06)",
  "--auth-border-strong": "rgba(242,237,230,0.1)",
  "--auth-text": COLORS.text,
  "--auth-muted": "#8a857d",
  "--auth-accent": COLORS.accent,
};

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M21.81 10.02h-9.77v3.95h5.59c-.24 1.27-.96 2.35-2.04 3.07v2.55h3.3c1.93-1.77 3.04-4.38 3.04-7.49c0-.71-.04-1.39-.12-2.08Z"
      />
      <path
        fill="currentColor"
        d="M12.04 22c2.75 0 5.05-.91 6.73-2.45l-3.3-2.55c-.91.61-2.08.97-3.43.97c-2.64 0-4.87-1.78-5.67-4.18H2.96v2.63A10.16 10.16 0 0 0 12.04 22Z"
      />
      <path
        fill="currentColor"
        d="M6.37 13.79a6.1 6.1 0 0 1 0-3.89V7.27H2.96a10.01 10.01 0 0 0 0 9.15l3.41-2.63Z"
      />
      <path
        fill="currentColor"
        d="M12.04 6.03c1.5 0 2.84.52 3.9 1.55l2.92-2.92C17.08 2.99 14.78 2 12.04 2A10.16 10.16 0 0 0 2.96 7.27L6.37 9.9c.8-2.4 3.03-4.18 5.67-4.18Z"
      />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5A12 12 0 0 0 8.2 23.9c.6.1.8-.2.8-.6v-2.1c-3.3.7-4-1.4-4-1.4c-.6-1.4-1.3-1.8-1.3-1.8c-1.1-.7.1-.7.1-.7c1.2.1 1.8 1.2 1.8 1.2c1 .1 1.9 1.7 1.9 1.7c1 .1 1.7-.2 2.1-.5c.1-.8.4-1.3.7-1.6c-2.7-.3-5.6-1.3-5.6-6A4.7 4.7 0 0 1 6 9.1c-.1-.3-.5-1.5.1-3.1c0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2c.6 1.6.2 2.8.1 3.1a4.7 4.7 0 0 1 1.3 3.3c0 4.7-2.9 5.7-5.6 6c.4.4.8 1 .8 2.1v3.1c0 .4.2.7.8.6A12 12 0 0 0 12 .5Z" />
    </svg>
  );
}

export function AuthField({
  label,
  type = "text",
  name,
  placeholder,
  autoComplete,
  auxiliary,
  helpText,
  value,
  onChange,
  inputMode,
  min,
  step,
  required,
  disabled,
  prefix,
  className = "",
  inputClassName = "",
}) {
  const input = (
    <input
      type={type}
      name={name}
      autoComplete={autoComplete}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      inputMode={inputMode}
      min={min}
      step={step}
      required={required}
      disabled={disabled}
      className={`min-h-[3rem] rounded-[12px] border border-[color:var(--auth-border)] bg-[rgba(24,24,22,0.7)] px-3.5 text-[0.84rem] text-[color:var(--auth-text)] outline-none transition-colors placeholder:text-[color:var(--auth-muted)] focus:border-[color:var(--auth-border-strong)] focus-visible:ring-1 focus-visible:ring-[rgba(242,237,230,0.18)] motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-50 ${prefix ? "pl-10" : ""} ${FONTS.mono} ${inputClassName}`}
    />
  );

  return (
    <label className={`grid gap-2 ${className}`} style={vars}>
      <div className="flex items-center justify-between gap-4">
        <span
          className={`text-[0.7rem] tracking-[0.02em] text-[color:var(--auth-muted)] ${FONTS.mono}`}
        >
          {label}
        </span>
        {auxiliary}
      </div>
      {prefix ? (
        <div className="relative">
          <span
            className={`pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[0.8rem] text-[color:var(--auth-muted)] ${FONTS.mono}`}
          >
            {prefix}
          </span>
          {input}
        </div>
      ) : (
        input
      )}
      {helpText ? (
        <span className={`text-[0.68rem] leading-5 text-[color:var(--auth-muted)] ${FONTS.mono}`}>
          {helpText}
        </span>
      ) : null}
    </label>
  );
}

export function AuthSocialButtons({ providers }) {
  return (
    <div className="grid gap-2.5 sm:grid-cols-2" style={vars}>
      {providers.map((provider) => {
        const Icon = provider.icon === "github" ? GithubIcon : GoogleIcon;
        return (
          <button
            key={provider.label}
            type="button"
            onClick={provider.onClick}
            className={`inline-flex min-h-[2.95rem] items-center justify-center gap-2.5 rounded-[12px] border border-[color:var(--auth-border)] bg-[rgba(24,24,22,0.72)] px-3.5 text-[0.8rem] text-[color:var(--auth-text)] transition-colors hover:border-[color:var(--auth-border-strong)] hover:bg-[rgba(28,28,26,0.78)] focus-visible:border-[color:var(--auth-border-strong)] focus-visible:ring-1 focus-visible:ring-[rgba(242,237,230,0.18)] motion-reduce:transition-none ${FONTS.mono}`}
          >
            <Icon />
            <span>{provider.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function AuthDivider() {
  return (
    <div className="flex items-center gap-4" style={vars}>
      <div className="h-px flex-1 bg-[color:var(--auth-border)]" />
      <span className={`text-[0.72rem] text-[color:var(--auth-muted)] ${FONTS.mono}`}>or</span>
      <div className="h-px flex-1 bg-[color:var(--auth-border)]" />
    </div>
  );
}

export function AuthPrimaryButton({
  children,
  type = "submit",
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      style={vars}
      className={`inline-flex min-h-[3rem] items-center justify-center rounded-[12px] border border-[color:var(--auth-border)] bg-[rgba(24,24,22,0.74)] px-4 text-[0.82rem] transition-colors focus-visible:border-[color:var(--auth-border-strong)] focus-visible:ring-1 focus-visible:ring-[rgba(242,237,230,0.18)] motion-reduce:transition-none ${
        disabled
          ? "cursor-not-allowed text-[rgba(242,237,230,0.35)]"
          : "text-[rgba(242,237,230,0.6)] hover:border-[color:var(--auth-border-strong)] hover:text-[color:var(--auth-text)]"
      } ${FONTS.mono} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function AuthAltLink({ prompt, cta, to }) {
  return (
    <p className={`text-center text-[0.78rem] leading-5 text-[color:var(--auth-muted)] ${FONTS.mono}`} style={vars}>
      {prompt}{" "}
      <Link to={to} className="text-[color:var(--auth-text)] transition-opacity hover:opacity-75">
        {cta}
      </Link>
    </p>
  );
}

export function AuthFinePrint({ children }) {
  return (
    <p className={`mx-auto max-w-[22rem] text-center text-[0.68rem] leading-5 text-[color:var(--auth-muted)] ${FONTS.mono}`} style={vars}>
      {children}
    </p>
  );
}
