import { useNavigate } from "react-router-dom";
import { PREVIEW_ACCESS_KEY } from "@/components/ui2.0/brand";
import {
  AuthDivider,
  AuthField,
  AuthFinePrint,
  AuthPrimaryButton,
  AuthSocialButtons,
} from "./auth-primitives.jsx";

export function SignupForm({ className = "", ...props }) {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    window.sessionStorage.setItem(PREVIEW_ACCESS_KEY, "granted");
    navigate("/dashboard");
  };

  return (
    <form
      className={`flex flex-col gap-6 ${className}`}
      {...props}
      onSubmit={handleSubmit}
    >
      <AuthSocialButtons
        providers={[
          { label: "Continue with Google", icon: "google" },
          { label: "Continue with GitHub", icon: "github" },
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
        <AuthPrimaryButton>Create account</AuthPrimaryButton>
      </div>

      <AuthFinePrint>
        By signing up, you agree to the preview terms, acceptable use, and privacy policy.
      </AuthFinePrint>
    </form>
  );
}
