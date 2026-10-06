import { useState } from "react";
import {
  Navigate,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

export default function ChangePasswordPage() {
  const navigate = useNavigate();

  const {
    user,
    loading,
    isAuthenticated,
    changePasswordUser,
    logout,
  } = useAuth();

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] =
    useState(false);

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

  if (!user?.mustChangePassword) {
    const target =
      user?.role === "ADMIN"
        ? "/admin"
        : "/employee";

    return <Navigate to={target} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (newPassword !== confirmPassword) {
      setError(
        "New password and confirmation do not match"
      );
      return;
    }

    if (newPassword === currentPassword) {
      setError(
        "New password must be different from current password"
      );
      return;
    }

    setSubmitting(true);

    try {
      const updatedUser =
        await changePasswordUser(
          currentPassword,
          newPassword
        );

      const target =
        updatedUser.role === "ADMIN"
          ? "/admin"
          : "/employee";

      navigate(target, {
        replace: true,
      });
    } catch (err) {
      setError(
        err.message || "Password change failed"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <h1>Change Password</h1>

        <p>
          Your temporary password must be changed
          before you can continue.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="currentPassword">
            Current Password
          </label>

          <input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(event) =>
              setCurrentPassword(
                event.target.value
              )
            }
            autoComplete="current-password"
            required
          />

          <label htmlFor="newPassword">
            New Password
          </label>

          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(event) =>
              setNewPassword(
                event.target.value
              )
            }
            minLength={8}
            maxLength={72}
            autoComplete="new-password"
            required
          />

          <label htmlFor="confirmPassword">
            Confirm New Password
          </label>

          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(
                event.target.value
              )
            }
            minLength={8}
            maxLength={72}
            autoComplete="new-password"
            required
          />

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? "Changing Password..."
              : "Change Password"}
          </button>
        </form>

        <button
          type="button"
          onClick={logout}
          disabled={submitting}
        >
          Sign Out
        </button>
      </section>
    </main>
  );
}
