import { goToLogin, goToSocialLogin } from "@/lib/auth";
import { FONTS } from "@/components/ui/pudgy-brand";
import {
  AuthDivider,
  AuthField,
  AuthFinePrint,
  AuthPrimaryButton,
  AuthSocialButtons,
} from "./auth-primitives.jsx";

export function LoginForm({ className = "", ...props }) {
  return (
    <form
      className={`flex flex-col gap-6 ${className}`}
      {...props}
      onSubmit={(event) => {
        event.preventDefault();
        goToLogin("/dashboard");
      }}
    >
      <AuthSocialButtons
        providers={[
          {
            label: "Continue with Google",
            icon: "google",
            onClick: () => goToSocialLogin("google", "/dashboard"),
          },
          {
            label: "Continue with GitHub",
            icon: "github",
            onClick: () => goToSocialLogin("github", "/dashboard"),
          },
        ]}
      />

      <AuthDivider />

      <div className="grid gap-5">
        <AuthField
          label="Email address"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="name@example.com"
        />
        <AuthField
          label="Password"
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          auxiliary={
            <button
              type="button"
              className={`text-[0.72rem] text-[rgba(255,255,255,0.5)] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[rgba(255,255,255,0.15)] ${FONTS.body}`}
            >
              Forgot password?
            </button>
          }
        />
      </div>

      <div className="grid gap-4">
        <AuthPrimaryButton type="submit">Log in</AuthPrimaryButton>
      </div>

      <AuthFinePrint>
        By continuing, you agree to the preview terms and privacy policy for this app.
      </AuthFinePrint>
    </form>
  );
}
