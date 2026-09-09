import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye } from "react-icons/fi";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  }

  function getPasswordStrength() {
    const password = formData.password;

    if (!password) {
      return {
        level: 0,
        label: "",
      };
    }

    let score = 0;

    if (password.length >= 6) {
      score += 1;
    }

    if (password.length >= 10) {
      score += 1;
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    }

    if (/[0-9]/.test(password)) {
      score += 1;
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1;
    }

    if (score <= 2) {
      return {
        level: 1,
        label: "Weak",
      };
    }

    if (score <= 3) {
      return {
        level: 2,
        label: "Fair",
      };
    }

    if (score === 4) {
      return {
        level: 3,
        label: "Good",
      };
    }

    return {
      level: 4,
      label: "Strong",
    };
  }

  const passwordStrength = getPasswordStrength();

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    const name = formData.name.trim();
    const email = formData.email.trim();

    if (
      !name ||
      !email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("All fields are required.");
      return;
    }

    if (name.length < 2) {
      setError(
        "Full name must be at least 2 characters."
      );
      return;
    }

    if (formData.password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password: formData.password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Registration failed."
        );
      }

      console.log(
        "Registration successful:",
        result
      );

      navigate("/login", {
        state: {
          message:
            "Account created successfully. Please log in.",
        },
      });
    } catch (error) {
      console.error(
        "Registration error:",
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
          Create your account
        </h1>

        <p className="auth-description">
          Join CampusConnect and connect with
          students, talent and opportunities.
        </p>

        <form onSubmit={handleSubmit}>

          {/* FULL NAME */}

          <div className="form-group">
            <label htmlFor="name">
              Full Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              autoComplete="name"
            />
          </div>

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
            <label htmlFor="password">
              Password
            </label>

            <div className="register-password-wrapper">
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
                placeholder="Create a password"
                autoComplete="new-password"
              />

              <button
                type="button"
                className={`register-password-toggle ${
                  !showPassword
                    ? "register-password-hidden"
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
                <span className="register-password-eye">
                  <FiEye />
                </span>
              </button>
            </div>

            {formData.password && (
              <div className="password-strength">
                <div className="password-strength-header">
                  <span>Password strength</span>

                  <strong
                    className={`password-strength-label level-${passwordStrength.level}`}
                  >
                    {passwordStrength.label}
                  </strong>
                </div>

                <div className="password-strength-bars">
                  {[1, 2, 3, 4].map(
                    (bar) => (
                      <span
                        key={bar}
                        className={
                          bar <=
                          passwordStrength.level
                            ? `password-strength-bar active level-${passwordStrength.level}`
                            : "password-strength-bar"
                        }
                      ></span>
                    )
                  )}
                </div>

                <small>
                  Use at least 6 characters.
                  Adding uppercase letters,
                  numbers and symbols makes your
                  password stronger.
                </small>
              </div>
            )}
          </div>

          {/* CONFIRM PASSWORD */}

          <div className="form-group">
            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <div className="register-password-wrapper">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                value={
                  formData.confirmPassword
                }
                onChange={handleChange}
                placeholder="Confirm your password"
                autoComplete="new-password"
              />

              <button
                type="button"
                className={`register-password-toggle ${
                  !showConfirmPassword
                    ? "register-password-hidden"
                    : ""
                }`}
                onClick={() =>
                  setShowConfirmPassword(
                    (current) => !current
                  )
                }
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                title={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                <span className="register-password-eye">
                  <FiEye />
                </span>
              </button>
            </div>

            {formData.confirmPassword && (
              <p
                className={
                  formData.password ===
                  formData.confirmPassword
                    ? "password-match-success"
                    : "password-match-error"
                }
              >
                {formData.password ===
                formData.confirmPassword
                  ? "✓ Passwords match"
                  : "Passwords do not match"}
              </p>
            )}
          </div>

          {/* ERROR */}

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          {/* SUBMIT */}

          <button
            type="submit"
            className="auth-submit-button register-submit-button"
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Create Account"}
          </button>
        </form>

        {/* LOGIN LINK */}

        <div className="auth-footer register-auth-footer">
          <p>
            Already have an account?
          </p>

          <Link
            to="/login"
            className="auth-create-account-link"
          >
            Login to your account
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Register;

