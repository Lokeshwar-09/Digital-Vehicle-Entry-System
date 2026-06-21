import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login";
import DepartmentDashboard from "./pages/DepartmentDashboard";
import SecurityDashboard from "./pages/SecurityDashboard";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* LOGIN */}
        <Route
          path="/"
          element={<Login />}
        />

        {/* EMPLOYEE DASHBOARD */}
        <Route
          path="/dashboard"
          element={<DepartmentDashboard />}
        />

        {/* SECURITY DASHBOARD */}
        <Route
          path="/security"
          element={<SecurityDashboard />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;