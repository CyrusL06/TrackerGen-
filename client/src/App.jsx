import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Suspense, useEffect, useState } from "react";
import {
  DEFAULT_THEME,
  FONT_HREF,
  THEME_STORAGE_KEY,
} from "./components/ui2.0/brand";

// Pages
import Nav from "./components/nav";
import Home from "./pages/home";
import Footer from "./components/footer";
import LoginPage from "./pages/loginPage";
import Dashboard from "./pages/dashboard";

// Use Clerk API
import { useAuth } from "@clerk/react";

const App = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return DEFAULT_THEME;

    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === "light" || storedTheme === "dark") return storedTheme;

    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  });
  const location = useLocation();
  const skeleton = (
    <div className="mx-auto min-h-[14rem] w-full max-w-[1100px] px-4 py-8 sm:px-8">
      <div className="h-28 animate-pulse border border-[color:var(--brand-border)] bg-[color:var(--brand-surface)]" />
    </div>
  );
  const showNavAndFooter = location.pathname === "/" || location.pathname === "/login";

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));

  function ProtectedRoute({ children }) {
    const { isLoaded, isSignedIn } = useAuth();

    if (!isLoaded) {
      return (
        <div className="mx-auto min-h-[14rem] w-full max-w-[1100px] px-4 py-8 sm:px-8">
          <div className="flex min-h-28 items-center border border-[color:var(--brand-border)] bg-[color:var(--brand-surface)] px-5 text-[0.84rem] uppercase tracking-[0.12em] text-[color:var(--brand-muted)]">
            Checking session...
          </div>
        </div>
      );
    }
    if (!isSignedIn) return <Navigate to="/login" replace />;

    return children;
  }

  return (
    <>
      <link href={FONT_HREF} rel="stylesheet" />
      <div>
        {showNavAndFooter ? <Nav theme={theme} onToggleTheme={toggleTheme} /> : null}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              // <ProtectedRoute>
                <Suspense fallback={skeleton}>
                  <Dashboard theme={theme} onToggleTheme={toggleTheme} />
                </Suspense>
              // </ProtectedRoute>
            }
          />
        </Routes>
        {showNavAndFooter ? <Footer /> : null}
      </div>
    </>
  );
};

export default App;
