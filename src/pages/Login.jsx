import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye } from "react-icons/fi";

import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (
      !formData.email.trim() ||
      !formData.password
    ) {
      setError(
        "Email and password are required."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Login failed."
        );
      }

      login(result.data, result.token);

      if (result.data.role === "admin") {
        navigate("/admin-dashboard");
      } else if (
        result.data.role === "recruiter"
      ) {
        navigate("/recruiter-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(
        "Login error:",
        error.message
      );

      setError(
        error.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">

        <p className="page-label">
          CAMPUSCONNECT
        </p>

        <h1>
          Welcome back
        </h1>

        <p className="auth-description">
          Login to continue to your CampusConnect
          account.
        </p>

        <form onSubmit={handleSubmit}>

          {/* EMAIL */}

          <div className="form-group">
            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
            />
          </div>

          {/* PASSWORD */}

          <div className="form-group">
            <div className="password-label-row">
              <label htmlFor="password">
                Password
              </label>

              <Link
                to="/forgot-password"
                className="forgot-password-link"
              >
                Forgot password?
              </Link>
            </div>

            <div className="password-input-wrapper">
              <input
                id="password"
                name="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
              />

              <button
                type="button"
                className={`login-password-toggle ${
                  !showPassword
                    ? "login-password-toggle-hidden"
                    : ""
                }`}
                onClick={() =>
                  setShowPassword(
                    (current) => !current
                  )
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
                <span className="login-password-eye">
                  <FiEye />
                </span>
              </button>
            </div>
          </div>

          {/* ERROR */}

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          {/* LOGIN */}

          <button
            type="submit"
            className="auth-submit-button"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>
        </form>

        {/* ACCOUNT LINK */}

        <div className="auth-footer">
          <p>
            Don't have an account?
          </p>

          <Link
            to="/register"
            className="auth-create-account-link"
          >
            Create an account
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Login;

