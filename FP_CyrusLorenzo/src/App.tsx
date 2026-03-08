import HomePage from "./pages/homePage";
import DashboardPage from "./pages/dashboardPage";
import { useRoutePath } from "./router/router";
import { Routes, Route } from "react-router-dom";



const App = () => {
  const path = useRoutePath();
  const isDashboardPath = path === "/dashboard";

  return (
    <Routes>
        <Route path="/" element={<HomePage />} />
    </Routes>
  )
};

export default App;
