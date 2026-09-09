import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiEye } from "react-icons/fi";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [feedback, setFeedback] = useState({
    type: "",
    message: "",
  });

  const [resetComplete, setResetComplete] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setFeedback({
      type: "",
      message: "",
    });

    const { password, confirmPassword } = formData;

    if (!password || !confirmPassword) {
      setFeedback({
        type: "error",
        message: "Please fill in both password fields.",
      });
      return;
    }

    if (password.length < 6) {
      setFeedback({
        type: "error",
        message: "Password must be at least 6 characters.",
      });
      return;
    }

    if (password !== confirmPassword) {
      setFeedback({
        type: "error",
        message: "Passwords do not match.",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password,
            confirmPassword,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to reset your password."
        );
      }

      setFeedback({
        type: "success",
        message: result.message,
      });

      setResetComplete(true);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleGoToLogin() {
    navigate("/login", {
      state: {
        message: "Password reset successful. Please log in.",
      },
    });
  }

  return (
    <section className="auth-page">
      <div className="auth-card reset-password-card">
        {!resetComplete ? (
          <>
            <div className="auth-header">
              <span className="auth-badge">Secure Reset</span>

              <h1>Create a new password</h1>

              <p>
                Choose a new password for your CampusConnect account.
              </p>
            </div>

            {feedback.message && (
              <div
                className={`auth-feedback ${
                  feedback.type === "success"
                    ? "auth-feedback-success"
                    : "auth-feedback-error"
                }`}
              >
                {feedback.message}
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="reset-password">
                  New password
                </label>

                <div className="password-input-wrapper">
                  <input
                    id="reset-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your new password"
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className={`reset-password-toggle ${
                      !showPassword
                        ? "reset-password-hidden"
                        : ""
                    }`}
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    title={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    <span className="reset-password-eye">
                      <FiEye />
                    </span>
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reset-confirm-password">
                  Confirm new password
                </label>

                <div className="password-input-wrapper">
                  <input
                    id="reset-confirm-password"
                    name="confirmPassword"
                    type={
                      showConfirmPassword ? "text" : "password"
                    }
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your new password"
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className={`reset-password-toggle ${
                      !showConfirmPassword
                        ? "reset-password-hidden"
                        : ""
                    }`}
                    onClick={() =>
                      setShowConfirmPassword((current) => !current)
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    title={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    <span className="reset-password-eye">
                      <FiEye />
                    </span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="auth-submit-button"
                disabled={loading}
              >
                {loading
                  ? "Resetting password..."
                  : "Reset password"}
              </button>
            </form>

            <div className="auth-footer">
              <span>
                Remembered your password?{" "}
                <Link
                  to="/login"
                  className="auth-create-account-link"
                >
                  Back to login
                </Link>
              </span>
            </div>
          </>
        ) : (
          <div className="reset-success-state">
            <div className="reset-success-icon">✓</div>

            <span className="auth-badge">Success</span>

            <h1>Password updated</h1>

            <p>
              Your CampusConnect password has been changed
              successfully.
            </p>

            {feedback.message && (
              <div className="auth-feedback auth-feedback-success">
                {feedback.message}
              </div>
            )}

            <button
              type="button"
              className="auth-submit-button"
              onClick={handleGoToLogin}
            >
              Continue to login
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default ResetPassword;

