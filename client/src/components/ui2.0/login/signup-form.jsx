import { goToSignup, goToSocialLogin } from "@/lib/auth";
import {
  AuthDivider,
  AuthField,
  AuthFinePrint,
  AuthPrimaryButton,
  AuthSocialButtons,
} from "./auth-primitives.jsx";

export function SignupForm({ className = "", ...props }) {
  return (
    <form
      className={`flex flex-col gap-6 ${className}`}
      {...props}
      onSubmit={(event) => {
        event.preventDefault();
        goToSignup();
      }}
    >
      <AuthSocialButtons
        providers={[
          {
            label: "Continue with Google",
            icon: "google",
            onClick: () => goToSocialLogin("google", "/onboarding/goal"),
          },
          {
            label: "Continue with GitHub",
            icon: "github",
            onClick: () => goToSocialLogin("github", "/onboarding/goal"),
          },
        ]}
      />

      <AuthDivider />

      <div className="grid gap-5">
        <AuthField
          label="Name"
          name="name"
          autoComplete="name"
          placeholder="Jordan Lee"
        />
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
          autoComplete="new-password"
          placeholder="Create a password"
        />
      </div>

      <div className="grid gap-4">
        <AuthPrimaryButton type="submit">Create account</AuthPrimaryButton>
      </div>

      <AuthFinePrint>
        By signing up, you agree to the preview terms, acceptable use, and privacy policy.
      </AuthFinePrint>
    </form>
  );
}
