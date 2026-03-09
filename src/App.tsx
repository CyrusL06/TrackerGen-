import HomePage from "./pages/homePage";
import DashboardPage from "./pages/dashboardPage";
import { useRoutePath } from "./router/router";
import { Routes, Route } from "react-router-dom";



const App = () => {

  return (
    <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/login" element={} /> */}
    </Routes>
  )
};

export default App;
