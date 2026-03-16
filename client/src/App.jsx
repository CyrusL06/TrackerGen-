import { Routes, Route, useLocation } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { FONT_HREF } from "./components/ui2.0/brand";

// Pages
import Nav from "./components/nav";
import Home from "./pages/home";
import Footer from "./components/footer";
import LoginPage from "./pages/loginPage";
import Dashboard from "./pages/dashboard";

const App = () => {
  const location = useLocation();
  useEffect(() => {
    // Runs every time the route changes.
    console.log(location.pathname);
  }, [location]);

  const skeleton = <div className="h-28 rounded-lg bg-muted/40 animate-pulse" />;
  const showNavAndFooter =
    location.pathname === "/" || location.pathname === "/login";

  return (
    <>
      <link href={FONT_HREF} rel="stylesheet" />
      {showNavAndFooter ? <Nav /> : null}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={ <Suspense fallback={skeleton}><Dashboard /></Suspense>}
        />
      </Routes>
      {showNavAndFooter ? <Footer /> : null}
    </>
  );
};

export default App;
