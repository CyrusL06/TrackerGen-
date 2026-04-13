import { useState } from "react";
import {Navigate,Outlet,useLocation,useNavigate,useOutletContext} from "react-router-dom";
import { FONTS } from "@/components/ui2.0/brand";
import { AuthField } from "@/components/ui2.0/login/auth-primitives.jsx";
import { OnboardingShell } from "@/components/ui2.0/onboarding/onboarding-shell.jsx";
import {ChoiceCardGroup,QuestionStep,StepFooter,SummaryRow,} from "@/components/ui2.0/onboarding/primitives.jsx";

const initialAnswers = {
  monthlyGoal: "",
  wantsReminders: "",
  preferredChannel: "",
};

const channelLabels = {
  discord: "Discord",
  telegram: "Telegram",
  none: "None yet",
};

function hasGoal(goal) {
  return Number(goal) > 0;
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
    channel: channelLabels[answers.preferredChannel],
  };
}

function getOnboardingRedirect(pathname, answers) {


  //end wth reminders and has no goal to
  if (pathname.endsWith("/reminders") && !hasGoal(answers.monthlyGoal)) {
    return "/onboarding/goal";
  }

  if (
    (pathname.endsWith("/channel") || pathname.endsWith("/complete")) &&
    !answers.wantsReminders
  ) {
    return "/onboarding/reminders";
  }

  if (pathname.endsWith("/complete") && !answers.preferredChannel) {
    return "/onboarding/channel";
  }

  return null;
}

export default function OnboardingFlow() {
  const [answers, setAnswers] = useState(initialAnswers);
  const location = useLocation();
  const redirectTo = getOnboardingRedirect(location.pathname, answers);

  if (redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <Outlet
      context={{
        answers,
        setAnswer: (field, value) =>
        setAnswers((current) => ({...current, [field]: value,})),
        resetAnswers: () => setAnswers(initialAnswers),
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
    const cleaned = event.target.value.replace(/[^\d.]/g, "");
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
            primaryDisabled={!answers.monthlyGoal}
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

    navigate("/onboarding/channel");
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
            primaryDisabled={!answers.wantsReminders}
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
            primaryDisabled={!answers.preferredChannel}
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
  const { answers, resetAnswers } = useOnboarding();

  function handleSubmit(event) {
    event.preventDefault();
    const summary = createDashboardSummary(answers);
    resetAnswers();
    navigate("/dashboard", {
      state: {
        onboardingSummary: summary,
      },
    });
  }

  return (
    <OnboardingShell
      eyebrow="Review ready"
      step={3}
      totalSteps={3}
      title="You are ready to review the month"
      subtitle="Here is the setup you chose for this preview before you enter the dashboard."
      backTo="/onboarding/channel"
      backLabel="Back"
    >
      <form className="grid gap-6" onSubmit={handleSubmit}>
        <div className="border border-[rgba(242,237,230,0.06)] bg-[rgba(24,24,22,0.72)] px-5 py-4">
          <SummaryRow label="Monthly goal" value={formatGoal(answers.monthlyGoal)} />
          <SummaryRow
            label="Future reminders"
            value={answers.wantsReminders === "yes" ? "Yes" : "Not now"}
          />
          <SummaryRow label="Preferred channel" value={channelLabels[answers.preferredChannel]} />
        </div>

        <p className={`text-center text-[0.74rem] leading-6 text-[rgba(242,237,230,0.58)] ${FONTS.mono}`}>
          These answers shape the current onboarding experience only. You can adjust the real product
          behavior later when those settings exist.
        </p>

        <StepFooter backTo="/onboarding/channel" primaryLabel="Open dashboard" />
      </form>
    </OnboardingShell>
  );
}
