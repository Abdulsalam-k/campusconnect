import { useState } from "react";
import { Link } from "react-router-dom";

import API_URL from "../config/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [feedback, setFeedback] = useState({
    type: "",
    message: "",
  });

  const [devResetLink, setDevResetLink] =
    useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setFeedback({
      type: "",
      message: "",
    });

    setDevResetLink("");

    if (!email.trim()) {
      setFeedback({
        type: "error",
        message:
          "Please enter your email address.",
      });

      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to process your request."
        );
      }

      setFeedback({
        type: "success",
        message: result.message,
      });

      if (result.devResetLink) {
        setDevResetLink(
          result.devResetLink
        );
      }
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card forgot-password-card">

        <div className="auth-header">
          <span className="auth-badge">
            Account Recovery
          </span>

          <h1>
            Forgot your password?
          </h1>

          <p>
            Enter the email address associated
            with your CampusConnect account and
            we&apos;ll help you reset your
            password.
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

        {devResetLink && (
          <div className="dev-reset-box">
            <strong>
              Development reset link
            </strong>

            <p>
              Email sending is not configured
              yet, so the local reset link is
              displayed here for testing.
            </p>

            <Link
              to={devResetLink.replace(
                "http://localhost:5173",
                ""
              )}
            >
              Open reset password page
            </Link>
          </div>
        )}

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="forgot-email">
              Email address
            </label>

            <input
              id="forgot-email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="Enter your email"
              autoComplete="email"
            />
          </div>

          <button
            type="submit"
            className="auth-submit-button"
            disabled={loading}
          >
            {loading
              ? "Sending..."
              : "Send reset link"}
          </button>
        </form>

        <div className="auth-footer forgot-password-footer">
          <Link
            to="/login"
            className="auth-secondary-link"
          >
            Back to login
          </Link>

          <span>
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="auth-create-account-link"
            >
              Create an account
            </Link>
          </span>
        </div>

      </div>
    </section>
  );
}

export default ForgotPassword;