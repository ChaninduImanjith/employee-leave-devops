import {
  Navigate,
  NavLink,
  Route,
  Routes,
} from "react-router-dom";
import "./App.css";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">LM</div>

          <div>
            <h1>LeaveFlow</h1>
            <p>Employee Leave Management</p>
          </div>
        </div>

        <nav className="navigation">
          <NavLink
            to="/employee"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Employee Portal
          </NavLink>

          <NavLink
            to="/admin"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            HR Admin
          </NavLink>
        </nav>

        <div className="environment-badge">
          <span className="environment-dot"></span>
          Development
        </div>
      </header>

      <Routes>
        <Route
          path="/"
          element={
            <Navigate
              to="/employee"
              replace
            />
          }
        />

        <Route
          path="/employee"
          element={<EmployeeDashboard />}
        />

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/employee"
              replace
            />
          }
        />
      </Routes>

      <footer>
        Employee Leave Management System · DevOps Project
      </footer>
    </div>
  );
}

export default App;
