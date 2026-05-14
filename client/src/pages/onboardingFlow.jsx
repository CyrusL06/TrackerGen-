import { useEffect, useState } from "react";
import {Navigate,Outlet,useLocation,useNavigate,useOutletContext} from "react-router-dom";
import { FONTS } from "@/components/ui/brand";
import { AuthField } from "@/components/ui/login/auth-primitives.jsx";
import { OnboardingShell } from "@/components/ui/onboarding/onboarding-shell.jsx";
import {ChoiceCardGroup,QuestionStep,StepFooter,SummaryRow,} from "@/components/ui/onboarding/onboarding-components.jsx";
import { completeOnboarding } from "@/lib/auth";

const initialAnswers = {
  monthlyGoal: "",
  wantsReminders: "",
  preferredChannel: "",
};

const ONBOARDING_STORAGE_KEY = "trackergen-onboarding-answers";

const channelLabels = {
  discord: "Discord",
  telegram: "Telegram",
  none: "None yet",
};

function hasGoal(goal) {
  return Number(goal) > 0;
}

function hasChoice(value) {
  return Boolean(value);
}

function sanitizeGoalInput(rawValue) {
  const digitsAndDotsOnly = rawValue.replace(/[^\d.]/g, "");
  const [whole = "", ...decimalParts] = digitsAndDotsOnly.split(".");

  if (decimalParts.length === 0) {
    return whole;
  }

  return `${whole}.${decimalParts.join("")}`;
}

function formatGoal(goal) {
  return `$${Number(goal).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  })}`;
}

function createDashboardSummary(answers) {
  const reminderText =
    answers.wantsReminders === "yes"
      ? `Future reminders can start with ${channelLabels[answers.preferredChannel]}.`
      : "Reminders are set to not now for this preview.";

  return {
    text: `Setup complete. Monthly goal: ${formatGoal(answers.monthlyGoal)}. ${reminderText}`,
    goal: formatGoal(answers.monthlyGoal),
    reminders: answers.wantsReminders === "yes" ? "Yes" : "Not now",
    channel: answers.wantsReminders === "yes" ? channelLabels[answers.preferredChannel] : "Not selected",
  };
}

function getOnboardingRedirect(pathname, answers) {
  const isRemindersPath = pathname.endsWith("/reminders");
  const isChannelPath = pathname.endsWith("/channel");
  const isCompletePath = pathname.endsWith("/complete");

  // Step 2 requires a completed goal from step 1.
  if (isRemindersPath && !hasGoal(answers.monthlyGoal)) {
    return "/onboarding/goal";
  }

  // Step 3 and completion both require the reminder choice from step 2.
  if ((isChannelPath || isCompletePath) && !answers.wantsReminders) {
    return "/onboarding/reminders";
  }

  // Only the final review page requires a selected channel.
  // The channel page itself should stay accessible while the user is still choosing.
  if (answers.wantsReminders === "yes" && isCompletePath && !answers.preferredChannel) {
    return "/onboarding/channel";
  }

  // If reminders are skipped, sending the user to channel should jump to completion instead.
  if (answers.wantsReminders === "not-now" && isChannelPath) {
    return "/onboarding/complete";
  }

  return null;
}

export default function OnboardingFlow() {
  const [answers, setAnswers] = useState(() => {
    const savedAnswers = window.sessionStorage.getItem(ONBOARDING_STORAGE_KEY);

    if (!savedAnswers) {
      return initialAnswers;
    }

    try {
      return { ...initialAnswers, ...JSON.parse(savedAnswers) };
    } catch {
      return initialAnswers;
    }
  });
  const location = useLocation();
  const redirectTo = getOnboardingRedirect(location.pathname, answers);

  useEffect(() => {
    // Keep onboarding answers alive across nested route changes and brief remounts.
    window.sessionStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(answers));
  }, [answers]);

  if (redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <Outlet
      context={{
        answers,
        setAnswer: (field, value) =>
        setAnswers((current) => ({...current, [field]: value,})),
        resetAnswers: () => {
          window.sessionStorage.removeItem(ONBOARDING_STORAGE_KEY);
          setAnswers(initialAnswers);
        },
      }}
    />
  );
}

function useOnboarding() {
  return useOutletContext();
}

export function OnboardingGoalPage() {
  const navigate = useNavigate();
  const { answers, setAnswer } = useOnboarding();
  const [error, setError] = useState("");

  function handleChange(event) {
    const cleaned = sanitizeGoalInput(event.target.value);
    setAnswer("monthlyGoal", cleaned);
    if (error) setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!hasGoal(answers.monthlyGoal)) {
      setError("Enter a monthly goal greater than 0 to continue.");
      return;
    }

    navigate("/onboarding/reminders");
  }

  return (
    <OnboardingShell
      step={1}
      totalSteps={3}
      title="Set a monthly spending goal"
      subtitle="Start with one number that helps shape the review you see after signup."
      backTo="/signup"
      backLabel="Back"
    >
      <QuestionStep
        onSubmit={handleSubmit}
        error={error}
        footer={
          <StepFooter
            backTo="/signup"
            primaryLabel="Continue"
            primaryDisabled={!hasGoal(answers.monthlyGoal)}
          />
        }
      >
        <AuthField
          label="Monthly goal"
          name="monthlyGoal"
          inputMode="decimal"
          placeholder="1,500"
          value={answers.monthlyGoal}
          onChange={handleChange}
          prefix="$"
          helpText="This shapes the review in the current preview. It does not lock spending."
        />
      </QuestionStep>
    </OnboardingShell>
  );
}

export function OnboardingRemindersPage() {
  const navigate = useNavigate();
  const { answers, setAnswer } = useOnboarding();
  const [error, setError] = useState("");

  function handleSelect(value) {
    setAnswer("wantsReminders", value);
    if (error) setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!answers.wantsReminders) {
      setError("Choose whether you want future reminders before continuing.");
      return;
    }

    navigate(answers.wantsReminders === "yes" ? "/onboarding/channel" : "/onboarding/complete");
  }

  return (
    <OnboardingShell
      step={2}
      totalSteps={3}
      title="Should TrackerGen remind you later?"
      subtitle="This is just a preference for the preview. No reminders are sent yet."
      backTo="/onboarding/goal"
      backLabel="Back"
    >
      <QuestionStep
        onSubmit={handleSubmit}
        error={error}
        footer={
          <StepFooter
            backTo="/onboarding/goal"
            primaryLabel="Continue"
            primaryDisabled={!hasChoice(answers.wantsReminders)}
          />
        }
      >
        <ChoiceCardGroup
          value={answers.wantsReminders}
          onChange={handleSelect}
          options={[
            {
              value: "yes",
              label: "Yes, keep the reminder option open",
              description: "You can choose where those reminders should start later in the flow.",
            },
            {
              value: "not-now",
              label: "Not now",
              description: "You can keep the review focused and decide on reminders later.",
            },
          ]}
        />
      </QuestionStep>
    </OnboardingShell>
  );
}

export function OnboardingChannelPage() {
  const navigate = useNavigate();
  const { answers, setAnswer } = useOnboarding();
  const [error, setError] = useState("");

  function handleSelect(value) {
    setAnswer("preferredChannel", value);
    if (error) setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!answers.preferredChannel) {
      setError("Choose a preferred channel before continuing.");
      return;
    }

    navigate("/onboarding/complete");
  }

  return (
    <OnboardingShell
      step={3}
      totalSteps={3}
      title="Where should future reminders start?"
      subtitle="Pick the first place you would expect them. This does not connect anything yet."
      backTo="/onboarding/reminders"
      backLabel="Back"
    >
      <QuestionStep
        onSubmit={handleSubmit}
        error={error}
        footer={
          <StepFooter
            backTo="/onboarding/reminders"
            primaryLabel="Continue"
            primaryDisabled={!hasChoice(answers.preferredChannel)}
          />
        }
      >
        <ChoiceCardGroup
          value={answers.preferredChannel}
          onChange={handleSelect}
          options={[
            {
              value: "discord",
              label: "Discord",
              description: "Best if you already check community updates there.",
            },
            {
              value: "telegram",
              label: "Telegram",
              description: "Good if you prefer a lighter, direct reminder channel.",
            },
            {
              value: "none",
              label: "None for now",
              description: "Keep the option open without choosing a messaging channel yet.",
            },
          ]}
        />
      </QuestionStep>
    </OnboardingShell>
  );
}

export function OnboardingCompletePage() {
  const navigate = useNavigate();
  const { answers } = useOnboarding();
  const backTo = answers.wantsReminders === "yes" ? "/onboarding/channel" : "/onboarding/reminders";
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSaving(true);
    const summary = createDashboardSummary(answers);

    try {
      await completeOnboarding({
        monthlyGoal: Number(answers.monthlyGoal),
        wantsReminders: answers.wantsReminders,
        preferredChannel: answers.wantsReminders === "yes" ? answers.preferredChannel : null,
      });

      window.sessionStorage.removeItem(ONBOARDING_STORAGE_KEY);
      navigate("/dashboard", {
        replace: true,
        state: {
          onboardingSummary: summary,
        },
      });
    } catch (saveError) {
      setError("We couldn't save your onboarding details yet. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <OnboardingShell
      eyebrow="Review ready"
      step={3}
      totalSteps={3}
      title="You are ready to review the month"
      subtitle="Here is the setup you chose for this preview before you enter the dashboard."
      backTo={backTo}
      backLabel="Back"
    >
      <form className="grid gap-6" onSubmit={handleSubmit}>
        <div className="border border-[rgba(242,237,230,0.06)] bg-[rgba(24,24,22,0.72)] px-5 py-4">
          <SummaryRow label="Monthly goal" value={formatGoal(answers.monthlyGoal)} />
          <SummaryRow
            label="Future reminders"
            value={answers.wantsReminders === "yes" ? "Yes" : "Not now"}
          />
          <SummaryRow
            label="Preferred channel"
            value={answers.wantsReminders === "yes" ? channelLabels[answers.preferredChannel] : "Not selected"}
          />
        </div>

        {error ? (
          <p className={`rounded-[14px] border border-[rgba(242,237,230,0.1)] bg-[rgba(24,24,22,0.72)] px-4 py-3 text-[0.74rem] leading-6 text-[rgba(242,237,230,0.86)] ${FONTS.mono}`}>
            {error}
          </p>
        ) : null}

        <p className={`text-center text-[0.74rem] leading-6 text-[rgba(242,237,230,0.58)] ${FONTS.mono}`}>
          These answers shape the current onboarding experience only.  adjust the real product
          behavior later when those settings exist.
        </p>

        <StepFooter
          backTo={backTo}
          primaryLabel={isSaving ? "Saving..." : "Open dashboard"}
          primaryDisabled={isSaving}
        />
      </form>
    </OnboardingShell>
  );
}
