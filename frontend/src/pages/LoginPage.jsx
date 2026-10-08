import { useState } from "react";
import {
  Navigate,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();

  const {
    user,
    loading,
    isAuthenticated,
    loginUser,
  } = useAuth();

  const [identifier, setIdentifier] =
    useState("");
  const [password, setPassword] =
    useState("");
  const [showPassword, setShowPassword] =
    useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] =
    useState(false);

  if (loading) {
    return (
      <main className="auth-loading">
        <div className="auth-loading-logo">
          LF
        </div>

        <div className="auth-loading-spinner" />

        <p>Loading LeaveFlow</p>
      </main>
    );
  }

  if (isAuthenticated) {
    const target =
      user?.mustChangePassword
        ? "/change-password"
        : user?.role === "ADMIN"
          ? "/admin"
          : "/employee";

    return (
      <Navigate
        to={target}
        replace
      />
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const normalizedIdentifier =
      identifier.trim();

    if (!normalizedIdentifier) {
      setError(
        "Enter your email address or username."
      );
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const authenticatedUser =
        await loginUser(
          normalizedIdentifier,
          password
        );

      if (
        authenticatedUser.mustChangePassword
      ) {
        navigate(
          "/change-password",
          { replace: true }
        );

        return;
      }

      if (
        authenticatedUser.role === "ADMIN"
      ) {
        navigate(
          "/admin",
          { replace: true }
        );

        return;
      }

      navigate(
        "/employee",
        { replace: true }
      );
    } catch (err) {
      setError(
        err.message ||
          "We could not sign you in. Check your credentials and try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <aside className="auth-aside">
          <div className="auth-aside-top">
            <div className="auth-product">
              <div className="auth-product-mark">
                LF
              </div>

              <div>
                <strong>LeaveFlow</strong>
                <span>
                  Workforce Management
                </span>
              </div>
            </div>

            <div className="auth-aside-copy">
              <span className="auth-kicker">
                Employee leave management
              </span>

              <h1>
                A better way to manage
                employee leave.
              </h1>

              <p>
                One workspace for employee
                requests, approvals, account
                administration, and leave
                visibility.
              </p>
            </div>

            <div className="auth-capabilities">
              <div className="auth-capability">
                <div className="auth-check">
                  ✓
                </div>

                <div>
                  <strong>
                    Centralized requests
                  </strong>

                  <p>
                    Keep employee leave
                    requests organized in one
                    place.
                  </p>
                </div>
              </div>

              <div className="auth-capability">
                <div className="auth-check">
                  ✓
                </div>

                <div>
                  <strong>
                    Approval workflows
                  </strong>

                  <p>
                    Give administrators a
                    clear view of pending and
                    completed requests.
                  </p>
                </div>
              </div>

              <div className="auth-capability">
                <div className="auth-check">
                  ✓
                </div>

                <div>
                  <strong>
                    Role-based workspace
                  </strong>

                  <p>
                    Employees and
                    administrators receive
                    the experience designed
                    for their role.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="auth-aside-footer">
            <span>
              LeaveFlow
            </span>

            <span>
              Workforce Platform
            </span>
          </div>
        </aside>

        <section className="auth-content">
          <div className="auth-mobile-brand">
            <div className="auth-product-mark">
              LF
            </div>

            <div>
              <strong>LeaveFlow</strong>
              <span>
                Workforce Management
              </span>
            </div>
          </div>

          <div className="auth-card">
            <header className="auth-header">
              <div className="auth-status">
                <span />
                Account access
              </div>

              <h2>Sign in to LeaveFlow</h2>

              <p>
                Use your work email address
                or assigned username to
                continue.
              </p>
            </header>

            <form
              className="auth-form"
              onSubmit={handleSubmit}
            >
              <div className="auth-form-group">
                <label htmlFor="identifier">
                  Email or username
                </label>

                <div className="auth-input-wrap">
                  <span
                    className="auth-input-icon"
                    aria-hidden="true"
                  >
                    @
                  </span>

                  <input
                    id="identifier"
                    type="text"
                    value={identifier}
                    onChange={(event) => {
                      setIdentifier(
                        event.target.value
                      );

                      if (error) {
                        setError("");
                      }
                    }}
                    placeholder="name@company.com or username"
                    autoComplete="username"
                    autoFocus
                    disabled={submitting}
                    required
                  />
                </div>
              </div>

              <div className="auth-form-group">
                <label htmlFor="password">
                  Password
                </label>

                <div className="auth-password-wrap">
                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(event) => {
                      setPassword(
                        event.target.value
                      );

                      if (error) {
                        setError("");
                      }
                    }}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={submitting}
                    required
                  />

                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() =>
                      setShowPassword(
                        (current) =>
                          !current
                      )
                    }
                    disabled={submitting}
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword
                      ? "Hide"
                      : "Show"}
                  </button>
                </div>
              </div>

              {error && (
                <div
                  className="auth-error"
                  role="alert"
                  aria-live="polite"
                >
                  <span
                    className="auth-error-icon"
                    aria-hidden="true"
                  >
                    !
                  </span>

                  <span>
                    {error}
                  </span>
                </div>
              )}

              <button
                className="auth-submit"
                type="submit"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="auth-button-spinner" />
                    Signing in
                  </>
                ) : (
                  <>
                    <span>
                      Sign in
                    </span>

                    <span
                      className="auth-submit-arrow"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </>
                )}
              </button>
            </form>

            <footer className="auth-card-footer">
              <div className="auth-security">
                <span className="auth-security-dot" />

                <span>
                  Protected account access
                </span>
              </div>

              <p>
                If you cannot access your
                account, contact your system
                administrator.
              </p>
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
}
