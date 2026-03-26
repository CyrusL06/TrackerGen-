import { createElement, useState } from "react";
import { ArrowRight, KeyRound, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { FONTS } from "@/components/ui2.0/brand";
import { useSignIn } from "@clerk/react";

const fields = [
  {
    id: "email",
    label: "Email",
    type: "email",
    placeholder: "you@example.com",
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
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isLoaded, signIn, setActive } = useSignIn();
  const borderClass = "border-white/14";
  const mutedTextClass = "text-[color:var(--brand-muted)]";
  const iconColor = "var(--brand-muted)";

  //Sign in for clerk API calls
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isLoaded || isSubmitting) return;

    setError("");
    setIsSubmitting(true);

    try {
      const result = await signIn.create({
        identifier: formData.email,
        password: formData.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        navigate("/dashboard");
        return;
      }

      setError("We couldn't finish sign-in. Refresh and try again.");
    } catch (err) {
      const nextMessage =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        "We couldn't sign you in with those details. Double-check your preview credentials and try again.";

      setError(nextMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className={`flex flex-col gap-5 ${className}`}
      {...props}
      onSubmit={handleSubmit}
      aria-busy={isSubmitting}
    >
      <div className={`border-b ${borderClass} pb-5`}>
        <div className={`text-[0.72rem] uppercase tracking-[0.16em] text-[color:var(--brand-accent)] ${FONTS.mono}`}>
          Invite-only login
        </div>
        <p className={`mt-3 text-[0.76rem] uppercase tracking-[0.14em] text-[color:var(--brand-muted)] ${FONTS.mono}`}>
          {greeting}
        </p>
        <h2
          className={`mt-3 text-[clamp(2.3rem,4.5vw,3.4rem)] leading-[0.92] tracking-[0.04em] text-[color:var(--brand-text)] ${FONTS.display}`}
        >
          Welcome back
        </h2>
        <p className={`mt-3 max-w-md text-[0.84rem] leading-6 ${mutedTextClass} ${FONTS.mono}`}>
          Enter the preview credentials you were given to reopen your monthly snapshot and activity log.
        </p>
        <p className={`mt-3 max-w-md text-[0.72rem] uppercase tracking-[0.12em] text-[color:var(--brand-muted)] ${FONTS.mono}`}>
          Quiet entry. No extra setup steps.
        </p>
      </div>

      {fields.map(({ id, label, type, placeholder, autoComplete, icon, code }) => (
        <label key={id} className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <span
              className={`text-[0.72rem] uppercase tracking-[0.12em] ${mutedTextClass} ${FONTS.mono}`}
            >
              {label}
            </span>
            {id === "password" ? (
              <Link
                to="/"
                className={`text-[0.72rem] uppercase tracking-[0.12em] ${mutedTextClass} transition-colors hover:text-[color:var(--brand-text)] ${FONTS.mono}`}
              >
                Back to site
              </Link>
            ) : (
              <span className={`text-[0.7rem] uppercase tracking-[0.16em] ${mutedTextClass} ${FONTS.mono}`}>
                {code}
              </span>
            )}
          </div>

          <div className={`flex items-center gap-3 border-b ${borderClass} pb-3 transition-colors focus-within:border-[color:var(--brand-accent)]`}>
            {createElement(icon, { size: 16, color: iconColor })}
            <input
              id={id}
              type={type}
              value={formData[id]}
              placeholder={placeholder}
              onChange={(e) => setFormData((prev) => ({ ...prev, [id]: e.target.value }))}
              autoComplete={autoComplete}
              className={`w-full bg-transparent text-[0.92rem] text-[color:var(--brand-text)] outline-none placeholder:text-[color:var(--brand-muted)] ${FONTS.mono}`}
            />
          </div>
        </label>
      ))}

      <label
        className={`flex items-center gap-3 border-b ${borderClass} pb-5 text-[0.74rem] ${mutedTextClass} ${FONTS.mono}`}
      >
        <input
          type="checkbox"
          className="h-4 w-4 rounded border border-white/20 bg-transparent accent-[color:var(--brand-accent)]"
        />
        Keep me signed in on this device
      </label>

      {error ? (
        <div
          className={`delight-rise border border-[color:var(--brand-danger)]/50 bg-[color:var(--brand-danger)]/10 px-4 py-3 text-[0.78rem] leading-6 text-[color:var(--brand-text)] ${FONTS.mono}`}
          role="alert"
        >
          {error}
        </div>
      ) : null}

      {isSubmitting ? (
        <div className={`delight-rise rounded-full border border-[color:var(--brand-border)] bg-[color:var(--brand-surface-2)] px-3 py-2 text-[0.72rem] uppercase tracking-[0.12em] text-[color:var(--brand-muted)] ${FONTS.mono}`}>
          Checking your preview access...
        </div>
      ) : null}

      <button
        type="submit"
        disabled={!isLoaded || isSubmitting}
        className={`delight-chip group inline-flex items-center justify-between border border-[color:var(--brand-accent)] bg-[color:var(--brand-accent)] px-4 py-3 text-[0.84rem] uppercase tracking-[0.14em] text-[color:var(--brand-bg)] shadow-[0_10px_22px_rgba(0,0,0,0.12)] transition-colors hover:bg-transparent hover:text-[color:var(--brand-accent)] disabled:cursor-not-allowed disabled:opacity-60 ${FONTS.mono}`}
      >
        <span>{isSubmitting ? "Signing in..." : "Enter dashboard"}</span>
        <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
      </button>

      <p className={`border-t ${borderClass} pt-4 text-center text-[0.76rem] leading-6 ${mutedTextClass} ${FONTS.mono}`}>
        Public signup is not live yet.{" "}
        <Link to="/" className="transition-colors hover:text-[color:var(--brand-text)]">
          Return to the overview
        </Link>
      </p>
    </form>
  );
}
