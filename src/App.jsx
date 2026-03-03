import "./App.css";
import HomePage from "./pages/homePage";
import DashboardPage from "./pages/dashboardPage";
import { useRoutePath } from "./router/router";

const App = () => {
  const path = useRoutePath();
  const isDashboardPath = path === "/dashboard";

  return (
    <div className="page-shell">
      {isDashboardPath ? <DashboardPage /> : <HomePage />}
    </div>
  );
};

export default App;
