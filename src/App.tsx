import HomePage from "./pages/homePage";
// import DashboardPage from "./pages/dashboardPage";
// import LoginPage from "./pages/loginPage";
import { Routes, Route } from "react-router-dom";
import {Suspense, lazy} from "react";


const App = () => {

  const LoginPage = lazy(() => import("./pages/loginPage"))
  const DashboardPage = lazy(() => import("./pages/dashboardPage"));

  const RouteFallback = () => <div className="p-6 text-sm text-muted-foreground">Loading...</div>


  return (
    <Routes>
        <Route path="/" element={<HomePage />} />
                {/* Prior to adding this I had 7000ms -> 4000ms */}
        {/* <Route path="/" element={<Suspense fallback={<RouteFallback />}><HomePage /></Suspense>} /> */}
        <Route path="/login" element={<Suspense fallback={<RouteFallback />}><LoginPage /></Suspense>} />
         <Route path="/dashboard" element={<Suspense fallback={<RouteFallback />}><DashboardPage /></Suspense>} />

        {/* <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} /> */}
    </Routes>
  )
};

export default App;
