import { goToLogin, goToSocialLogin } from "@/lib/auth";
import { FONTS } from "@/components/ui2.0/brand";
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
              className={`text-[0.72rem] text-[rgba(242,237,230,0.62)] transition-colors hover:text-[rgba(242,237,230,0.86)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[rgba(242,237,230,0.18)] ${FONTS.mono}`}
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
        By continuing, you agree to the preview terms and privacy policy for this build.
      </AuthFinePrint>
    </form>
  );
}
