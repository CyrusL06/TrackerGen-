import "./App.css";
import HomePage from "./pages/homePage";
import LoginPage from "./pages/loginPage";
import DashboardPage from "./pages/dashboardPage";
import { useRoutePath } from "./router/router";

const App = () => {
  const path = useRoutePath();

  const isLoginPath = path === "/login";
  const isDashboardPath = path === "/dashboard";

  return (
    <div className="page-shell">
      {isLoginPath ? <LoginPage /> : null}
      {isDashboardPath ? <DashboardPage /> : null}
      {!isLoginPath && !isDashboardPath ? <HomePage /> : null}
    </div>
  );
};

export default App;
