import React from "react";
import Button from "../sections/buttons";
import { navigateTo } from "../router/router";

export default function LoginPage() {
  const handleSubmit = (event) => {
    event.preventDefault();
    navigateTo("/dashboard");
  };

  return (
    <section className="login-shell">
      <div className="login-panel">
        <p className="login-kicker">CryptGen Account</p>
        <h1>Log in to continue</h1>
        <p className="login-copy">
          Access your dashboard, monitor your portfolio, and keep your strategies in sync.
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="you@example.com" required />

          <label htmlFor="password">Password</label>
          <input id="password" type="password" placeholder="Enter password" required />

          <button type="submit">Log In</button>
        </form>

        <div className="login-actions">
          <Button to="/">Back Home</Button>
          <a
            href="#"
            onClick={(event) => {
              event.preventDefault();
              navigateTo("/");
            }}
          >
            Create account
          </a>
        </div>
      </div>
    </section>
  );
}
