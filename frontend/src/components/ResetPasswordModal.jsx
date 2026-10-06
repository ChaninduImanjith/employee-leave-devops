import { useState } from "react";

export default function ResetPasswordModal({
  employee,
  submitting,
  onClose,
  onSubmit,
}) {
  const [temporaryPassword, setTemporaryPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (temporaryPassword.length < 8) {
      setError(
        "Temporary password must contain at least 8 characters."
      );
      return;
    }

    if (temporaryPassword !== confirmPassword) {
      setError(
        "Password confirmation does not match."
      );
      return;
    }

    onSubmit(temporaryPassword);
  }

  if (!employee) {
    return null;
  }

  return (
    <div className="modal-backdrop">
      <section
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reset-password-title"
      >
        <div className="modal-heading">
          <div>
            <p className="eyebrow">
              Account Security
            </p>

            <h2 id="reset-password-title">
              Reset Password
            </h2>
          </div>

          <button
            type="button"
            className="modal-close-button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <p className="modal-description">
          Set a temporary password for{" "}
          <strong>{employee.fullName}</strong>.
          The employee will be required to change it
          after signing in.
        </p>

        <form
          className="modal-form"
          onSubmit={handleSubmit}
        >
          <label htmlFor="reset-temporary-password">
            Temporary Password

            <input
              id="reset-temporary-password"
              type="password"
              value={temporaryPassword}
              onChange={(event) =>
                setTemporaryPassword(
                  event.target.value
                )
              }
              minLength={8}
              maxLength={72}
              autoComplete="new-password"
              required
              autoFocus
            />
          </label>

          <label htmlFor="reset-confirm-password">
            Confirm Temporary Password

            <input
              id="reset-confirm-password"
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
          </label>

          {error && (
            <p className="modal-error">
              {error}
            </p>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={submitting}
            >
              {submitting
                ? "Resetting..."
                : "Reset Password"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
