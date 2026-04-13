import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Suspense, useEffect, useState } from "react";
import { FONT_HREF } from "./components/ui2.0/brand";
import { fetchCurrentUser } from "./lib/auth";

// Pages
import Nav from "./components/nav";
import Home from "./pages/home";
import Footer from "./components/footer";
import LoginPage from "./pages/loginPage";
import SignupPage from "./pages/signupPage";
import Dashboard from "./pages/dashboard";
import OnboardingFlow, {
  OnboardingChannelPage,
  OnboardingCompletePage,
  OnboardingGoalPage,
  OnboardingRemindersPage,
} from "./pages/onboardingFlow";

const App = () => {
  const location = useLocation();
  const skeleton = <div className="h-28 rounded-lg bg-muted/40 animate-pulse" />;
  const showNavAndFooter =
    location.pathname === "/";
    // location.pathname === "/login" ||
    // location.pathname === "/signup";

  function ProtectedRoute({ children }) {
    const [authState, setAuthState] = useState({
      loading: true,
      authenticated: false,
    });

    useEffect(() => {
      let cancelled = false;

      fetchCurrentUser()
        .then((data) => {
          if (!cancelled) {
            setAuthState({
              loading: false,
              authenticated: data.authenticated,
            });
          }
        })
        .catch(() => {
          if (!cancelled) {
            setAuthState({
              loading: false,
              authenticated: false,
            });
          }
        });

      return () => {
        cancelled = true;
      };
    }, []);

    if (authState.loading) {
      return skeleton;
    }

    if (!authState.authenticated) {
      return <Navigate to="/login" replace />;
    }

    return children;
  }

  return (
    <>
      <link href={FONT_HREF} rel="stylesheet" />
      {showNavAndFooter ? <Nav /> : null}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <OnboardingFlow />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="goal" replace />} />
          <Route path="goal" element={<OnboardingGoalPage />} />
          <Route path="reminders" element={<OnboardingRemindersPage />} />
          <Route path="channel" element={<OnboardingChannelPage />} />
          <Route path="complete" element={<OnboardingCompletePage />} />
        </Route>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Suspense fallback={skeleton}>
                <Dashboard />
              </Suspense>
            </ProtectedRoute>
          }
        />
      </Routes>
      {showNavAndFooter ? <Footer /> : null}
    </>
  );
};

export default App;
