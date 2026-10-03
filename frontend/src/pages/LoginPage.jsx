import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();

  const {
    user,
    loading,
    isAuthenticated,
    loginUser,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div style={{ padding: "2rem" }}>
        Loading...
      </div>
    );
  }

  if (isAuthenticated) {
    const target =
      user?.role === "ADMIN"
        ? "/admin"
        : "/employee";

    return <Navigate to={target} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      const authenticatedUser =
        await loginUser(email, password);

      if (authenticatedUser.role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/employee", { replace: true });
      }
    } catch (err) {
      setError(
        err.message || "Login failed"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <h1>LeaveFlow</h1>

        <p>
          Sign in to access your leave management dashboard.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">
            Email
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="you@example.com"
            autoComplete="email"
            required
          />

          <label htmlFor="password">
            Password
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="Enter your password"
            autoComplete="current-password"
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
              ? "Signing in..."
              : "Sign In"}
          </button>
        </form>
      </section>
    </main>
  );
}
