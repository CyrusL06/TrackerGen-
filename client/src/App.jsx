import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Suspense, useEffect, useState } from "react";
import { FONT_HREF, PREVIEW_ACCESS_KEY } from "./components/ui2.0/brand";

// Pages
import Nav from "./components/nav";
import Home from "./pages/home";
import Footer from "./components/footer";
import LoginPage from "./pages/loginPage";
import SignupPage from "./pages/signupPage";
import Dashboard from "./pages/dashboard";

const App = () => {
  const location = useLocation();
  const skeleton = <div className="h-28 rounded-lg bg-muted/40 animate-pulse" />;
  const showNavAndFooter =
    location.pathname === "/";
    // location.pathname === "/login" ||
    // location.pathname === "/signup";

  function ProtectedRoute({ children }) {
    const [hasAccess, setHasAccess] = useState(null);

    useEffect(() => {
      if (typeof window === "undefined") {
        setHasAccess(false);
        return;
      }

      setHasAccess(window.sessionStorage.getItem(PREVIEW_ACCESS_KEY) === "granted");
    }, []);

    if (hasAccess === null) {
      return skeleton;
    }

    if (!hasAccess) {
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
