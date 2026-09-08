import { AuthShell } from "@/components/ui/login/auth-shell";
import { LoginForm } from "@/components/ui/login/login-form";

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Continue to TrackerGen with one secure provider."
      switchPrompt="New to TrackerGen?"
      switchCta="Create an account."
      switchTo="/signup"
      footerNote={null}
    >
      <LoginForm />
    </AuthShell>
  );
}
