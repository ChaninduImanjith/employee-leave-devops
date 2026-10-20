import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
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

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <main className="auth-page">
        <div className="auth-loading-card">
          <div className="auth-spinner" aria-hidden="true" />
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.mustChangePassword) {
    const target =
      user?.role === "ADMIN" ? "/admin" : "/employee";
    return <Navigate to={target} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    if (newPassword === currentPassword) {
      setError("New password must be different from current password.");
      return;
    }

    setSubmitting(true);

    try {
      const updatedUser = await changePasswordUser(
        currentPassword,
        newPassword
      );

      const target =
        updatedUser.role === "ADMIN" ? "/admin" : "/employee";

      navigate(target, { replace: true });
    } catch (err) {
      setError(err.message || "Password change failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-brand">
              <div className="auth-logo">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <span className="auth-brand-name">LeaveFlow</span>
            </div>
            <h1>Change Password</h1>
            <p className="auth-subtitle">
              Your temporary password must be changed before you can continue.
            </p>
          </div>

          {error && (
            <div className="auth-alert-error" role="alert" aria-live="polite">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                id="currentPassword"
                type={showPasswords ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Enter current password"
                autoComplete="current-password"
                required
                disabled={submitting}
              />
            </div>

            <div className="auth-field">
              <label htmlFor="newPassword">New Password</label>
              <input
                id="newPassword"
                type={showPasswords ? "text" : "password"}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Minimum 8 characters"
                minLength={8}
                maxLength={72}
                autoComplete="new-password"
                required
                disabled={submitting}
              />
            </div>

            <div className="auth-field">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                id="confirmPassword"
                type={showPasswords ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Re-enter new password"
                minLength={8}
                maxLength={72}
                autoComplete="new-password"
                required
                disabled={submitting}
              />
            </div>

            <div className="auth-checkbox-row">
              <label className="auth-checkbox-label">
                <input
                  type="checkbox"
                  checked={showPasswords}
                  onChange={(e) => setShowPasswords(e.target.checked)}
                />
                <span>Show passwords</span>
              </label>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={submitting}
            >
              {submitting ? "Updating Password..." : "Update Password"}
            </button>
          </form>

          <div className="auth-secondary-actions">
            <button
              type="button"
              className="auth-link-btn"
              onClick={logout}
              disabled={submitting}
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="auth-page-footer">
          <p>© {new Date().getFullYear()} LeaveFlow • All rights reserved.</p>
        </div>
      </div>
    </main>
  );
}
