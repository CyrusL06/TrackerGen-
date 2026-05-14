import { AuthShell } from "@/components/ui/login/auth-shell";
import { LoginForm } from "@/components/ui/login/login-form";

export default function LoginPage() {
  return (
    <AuthShell
      title="Log in to TrackerGen"
      subtitle="Use your email, and password to continue."
      switchPrompt="Don't have an account?"
      switchCta="Create one."
      switchTo="/signup"
      footerNote={null}
    >
      <LoginForm />
    </AuthShell>
  );
}
