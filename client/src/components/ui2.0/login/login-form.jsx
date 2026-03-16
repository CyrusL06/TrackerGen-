import { createElement } from "react";
import { ArrowRight, KeyRound, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { COLORS, FONTS } from "@/components/ui2.0/brand";

const fields = [
  {
    id: "email",
    label: "Email",
    type: "email",
    placeholder: "name@trackergen.com",
    autoComplete: "email",
    icon: Mail,
    code: "01",
  },
  {
    id: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter password",
    autoComplete: "current-password",
    icon: KeyRound,
    code: "02",
  },
];

export function LoginForm({ className = "", ...props }) {
  const navigate = useNavigate();

  const formVars = {
    "--login-bg": COLORS.bg,
    "--login-border": COLORS.border,
    "--login-text": COLORS.text,
    "--login-muted": COLORS.muted,
    "--login-accent": COLORS.accent,
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/dashboard");
  };

  return (
    <form
      className={`flex flex-col gap-5 ${className}`}
      style={formVars}
      {...props}
      onSubmit={handleSubmit}
    >
      <div className="border-b border-[color:var(--login-border)] pb-5">
        <div className={`text-[0.72rem] uppercase tracking-[0.16em] text-[color:var(--login-accent)] ${FONTS.mono}`}>
          Account login
        </div>
        <h2
          className={`mt-3 text-[clamp(2.3rem,4.5vw,3.4rem)] leading-[0.92] tracking-[0.04em] text-[color:var(--login-text)] ${FONTS.display}`}
        >
          Welcome back
        </h2>
        <p className={`mt-3 max-w-md text-[0.84rem] leading-6 text-[color:var(--login-muted)] ${FONTS.mono}`}>
          Enter your details to reopen your budgets, cash flow, and portfolio watch.
        </p>
      </div>

      {fields.map(({ id, label, type, placeholder, autoComplete, icon, code }) => (
        <label key={id} className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <span
              className={`text-[0.72rem] uppercase tracking-[0.12em] text-[color:var(--login-muted)] ${FONTS.mono}`}
            >
              {label}
            </span>
            {id === "password" ? (
              <Link
                to="/"
                className={`text-[0.72rem] uppercase tracking-[0.12em] text-[color:var(--login-muted)] transition-colors hover:text-[color:var(--login-text)] ${FONTS.mono}`}
              >
                Back to site
              </Link>
            ) : (
              <span className={`text-[0.7rem] uppercase tracking-[0.16em] text-[color:var(--login-muted)] ${FONTS.mono}`}>
                {code}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 border-b border-[color:var(--login-border)] pb-3 transition-colors focus-within:border-[color:var(--login-accent)]">
            {createElement(icon, { size: 16, color: COLORS.muted })}
            <input
              id={id}
              type={type}
              placeholder={placeholder}
              autoComplete={autoComplete}
              className={`w-full bg-transparent text-[0.92rem] text-[color:var(--login-text)] outline-none placeholder:text-[color:var(--login-muted)] ${FONTS.mono}`}
            />
          </div>
        </label>
      ))}

      <label
        className={`flex items-center gap-3 border-b border-[color:var(--login-border)] pb-5 text-[0.74rem] text-[color:var(--login-muted)] ${FONTS.mono}`}
      >
        <input
          type="checkbox"
          className="h-4 w-4 rounded border border-white/20 bg-transparent accent-[color:var(--login-accent)]"
        />
        Keep me signed in on this device
      </label>

      <button
        type="submit"
        className={`group inline-flex items-center justify-between border border-[color:var(--login-accent)] bg-[color:var(--login-accent)] px-4 py-3 text-[0.84rem] uppercase tracking-[0.14em] text-[color:var(--login-bg)] transition-colors hover:bg-transparent hover:text-[color:var(--login-accent)] ${FONTS.mono}`}
      >
        <span>Enter dashboard</span>
        <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
      </button>

      <p
        className={`border-t border-[color:var(--login-border)] pt-4 text-center text-[0.76rem] leading-6 text-[color:var(--login-muted)] ${FONTS.mono}`}
      >
        No account yet?{" "}
        <Link to="/" className="transition-colors hover:text-[color:var(--login-text)]">
          Explore the product first
        </Link>
      </p>
    </form>
  );
}
