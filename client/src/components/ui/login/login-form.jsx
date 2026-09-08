import { goToSocialLogin } from "@/lib/auth";
import { FONTS } from "@/components/ui/pudgy-brand";
import { AuthSocialButtons } from "./auth-primitives.jsx";

export function LoginForm({ className = "", ...props }) {
  return (
    <div className={`grid gap-5 ${className}`} {...props}>
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

      <p className={`mx-auto max-w-[22rem] text-center text-caption leading-5 text-[#8faec3] ${FONTS.body}`}>
        Choose a provider to continue. No password to remember.
      </p>
    </div>
  );
}
