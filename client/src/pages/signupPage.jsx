import { AuthShell } from "@/components/ui2.0/login/auth-shell";
import { SignupForm } from "@/components/ui2.0/login/signup-form";

export default function SignupPage() {
  return (
    <AuthShell
      title="Create a TrackerGen account"
      subtitle="Sign up with your details"
      switchPrompt="Already have an account?"
      switchCta="Log in."
      switchTo="/login"
      footerNote={null}
    >
      <SignupForm />
    </AuthShell>
  );
}
