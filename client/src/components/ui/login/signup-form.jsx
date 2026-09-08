import { goToSocialLogin } from "@/lib/auth";
import { AuthSocialButtons } from "./auth-primitives.jsx";

export function SignupForm({ className = "", ...props }) {
  return (
    <div className={`flex flex-col gap-6 ${className}`} {...props}>
      <AuthSocialButtons
        providers={[
          {
            label: "Sign in with Google",
            icon: "google",
            onClick: () => goToSocialLogin("google", "/onboarding/goal"),
          },
          {
            label: "Sign in with GitHub",
            icon: "github",
            onClick: () => goToSocialLogin("github", "/onboarding/goal"),
          },
        ]}
      />
    </div>
  );
}
