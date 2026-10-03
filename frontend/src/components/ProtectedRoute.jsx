import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  children,
  allowedRole,
}) {
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
