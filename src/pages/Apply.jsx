import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import useFetch from "../hooks/useFetch";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";

function Apply() {
  const { id } = useParams();

  const {
    user,
    token,
  } = useAuth();

  const { fetchUnreadCount } = useNotifications();

  const {
    data: response,
    loading: opportunityLoading,
    error: opportunityError,
  } = useFetch(
    `http://localhost:5000/api/opportunities/${id}`
  );

  const opportunity = response?.data;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    coverLetter: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // ==========================================
  // PREFILL USER INFORMATION
  // ==========================================

  useEffect(() => {
    if (user) {
      setFormData((previous) => ({
        ...previous,
        fullName: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Clear field error as user edits
    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    if (submitError) {
      setSubmitError("");
    }
  }

  // ==========================================
  // VALIDATE FORM
  // ==========================================

  function validateForm() {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName =
        "Full name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email =
        "Email is required.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone =
        "Phone number is required.";
    }

    if (!formData.coverLetter.trim()) {
      newErrors.coverLetter =
        "Please write a short cover letter.";
    }

    if (
      formData.coverLetter.trim().length < 30
    ) {
      newErrors.coverLetter =
        "Your cover letter should be at least 30 characters.";
    }

    return newErrors;
  }

  // ==========================================
  // SUBMIT APPLICATION
  // ==========================================

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateForm();

    if (
      Object.keys(validationErrors).length > 0
    ) {
      setErrors(validationErrors);
      return;
    }

    if (!token) {
      setSubmitError(
        "Your session has expired. Please log in again."
      );
      return;
    }

    if (!opportunity?._id) {
      setSubmitError(
        "Opportunity information is unavailable."
      );
      return;
    }

    setErrors({});
    setSubmitError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/applications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            opportunityId: opportunity._id,
            fullName: formData.fullName.trim(),
            email: formData.email
              .trim()
              .toLowerCase(),
            phone: formData.phone.trim(),
            coverLetter:
              formData.coverLetter.trim(),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to submit application."
        );
      }

      console.log(
        "Application submitted:",
        result
      );

      // Refresh navbar notification count
      await fetchUnreadCount();

      setSubmitted(true);
    } catch (error) {
      console.error(
        "Application submission error:",
        error.message
      );

      setSubmitError(
        error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (opportunityLoading) {
    return (
      <div className="application-page">
        <p>Loading opportunity...</p>
      </div>
    );
  }

  // ==========================================
  // OPPORTUNITY NOT FOUND
  // ==========================================

  if (
    opportunityError ||
    !opportunity
  ) {
    return (
      <div className="application-page">
        <h1>Opportunity not found</h1>

        <p>
          We couldn't find the opportunity you're
          trying to apply for.
        </p>

        <Link to="/opportunities">
          ← Back to Opportunities
        </Link>
      </div>
    );
  }

  // ==========================================
  // SUCCESS
  // ==========================================

  if (submitted) {
    return (
      <div className="application-success">
        <div className="success-icon">
          ✓
        </div>

        <p className="page-label">
          APPLICATION SUBMITTED
        </p>

        <h1>
          Application sent successfully!
        </h1>

        <p>
          Your application for{" "}
          <strong>
            {opportunity.title}
          </strong>{" "}
          at{" "}
          <strong>
            {opportunity.company}
          </strong>{" "}
          has been submitted successfully.
        </p>

        <p>
          You can track its status from your
          applications page.
        </p>

        <div className="success-actions">

          <Link
            to="/applications"
            className="primary-button"
          >
            View My Applications
          </Link>

          <Link
            to="/opportunities"
            className="secondary-button"
          >
            Explore More Opportunities
          </Link>

        </div>
      </div>
    );
  }

  // ==========================================
  // APPLICATION FORM
  // ==========================================

  return (
    <div className="application-page">

      {/* BACK */}
      <Link
        to={`/opportunities/${opportunity._id}`}
        className="back-link"
      >
        ← Back to Opportunity
      </Link>

      <div className="application-layout">

        {/* ======================================
            FORM
        ======================================= */}

        <section className="application-form-container">

          <p className="page-label">
            APPLICATION
          </p>

          <h1>
            Apply for this opportunity
          </h1>

          <p className="application-intro">
            Complete the form below to submit
            your application.
          </p>

          <form onSubmit={handleSubmit}>

            {/* FULL NAME */}
            <div className="form-group">

              <label htmlFor="fullName">
                Full Name
              </label>

              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
              />

              {errors.fullName && (
                <p className="form-error">
                  {errors.fullName}
                </p>
              )}

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
                disabled
              />

              <small>
                This email comes from your
                CampusConnect account.
              </small>

              {errors.email && (
                <p className="form-error">
                  {errors.email}
                </p>
              )}

            </div>

            {/* PHONE */}
            <div className="form-group">

              <label htmlFor="phone">
                Phone Number
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />

              {errors.phone && (
                <p className="form-error">
                  {errors.phone}
                </p>
              )}

            </div>

            {/* COVER LETTER */}
            <div className="form-group">

              <label htmlFor="coverLetter">
                Cover Letter
              </label>

              <textarea
                id="coverLetter"
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleChange}
                placeholder="Tell the company why you're a good fit..."
                rows="7"
              />

              {errors.coverLetter && (
                <p className="form-error">
                  {errors.coverLetter}
                </p>
              )}

            </div>

            {/* API ERROR */}
            {submitError && (
              <p className="form-error">
                {submitError}
              </p>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              className="apply-submit-button"
              disabled={loading}
            >
              {loading
                ? "Submitting..."
                : "Submit Application"}
            </button>

          </form>

        </section>

        {/* ======================================
            OPPORTUNITY SUMMARY
        ======================================= */}

        <aside className="application-summary">

          <p className="page-label">
            OPPORTUNITY
          </p>

          <h2>
            {opportunity.title}
          </h2>

          <p className="summary-company">
            {opportunity.company}
          </p>

          <div className="summary-details">

            <span>
              📍 {opportunity.location}
            </span>

            <span>
              💼 {opportunity.type}
            </span>

            <span>
              🌐 {opportunity.mode}
            </span>

            <span>
              🏷️ {opportunity.category}
            </span>

          </div>

          <div className="summary-deadline">

            <span>
              Application deadline
            </span>

            <strong>
              {opportunity.deadline}
            </strong>

          </div>

        </aside>

      </div>
    </div>
  );
}

export default Apply;