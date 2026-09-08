import { AuthShell } from "@/components/ui/login/auth-shell";
import { SignupForm } from "@/components/ui/login/signup-form";

export default function SignupPage() {
  return (
    <AuthShell
      title="Create a TrackerGen account"
      subtitle="Use Google or GitHub to continue."
      switchPrompt={null}
      switchCta={null}
      switchTo={null}
      footerNote={null}
    >
      <SignupForm />
    </AuthShell>
  );
}
