import {
  Navigate,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({
  children,
  allowedRole,
}) {
  const location = useLocation();

  const {
    user,
    loading,
    isAuthenticated,
  } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: "2rem" }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (
    user?.mustChangePassword &&
    location.pathname !== "/change-password"
  ) {
    return (
      <Navigate
        to="/change-password"
        replace
      />
    );
  }

  if (
    allowedRole &&
    user?.role !== allowedRole
  ) {
    const redirectPath =
      user?.role === "ADMIN"
        ? "/admin"
        : "/employee";

    return (
      <Navigate
        to={redirectPath}
        replace
      />
    );
  }

  return children;
}
