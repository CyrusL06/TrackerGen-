import { AuthShell } from "@/components/ui2.0/login/auth-shell";

export function OnboardingShell({
  step,
  totalSteps,
  eyebrow,
  title,
  subtitle,
  backTo,
  backLabel = "Back",
  children,
}) {
  return (
    <AuthShell
      eyebrow={eyebrow ?? `Step ${step} of ${totalSteps}`}
      title={title}
      subtitle={subtitle}
      topActionTo={backTo}
      topActionLabel={backLabel}
      switchPrompt={null}
      switchCta={null}
      switchTo={null}
      footerNote={null}
    >
      <div className="mx-auto w-full max-w-[30rem]">{children}</div>
    </AuthShell>
  );
}
