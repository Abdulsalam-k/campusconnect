import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import API_URL from "../config/api";

function ApplicantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { token, user } = useAuth();

  const [application, setApplication] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [updatingStatus, setUpdatingStatus] =
    useState(false);

  // ==========================================
  // FETCH APPLICATION
  // ==========================================

  useEffect(() => {
    async function fetchApplication() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/recruiter/applications/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to fetch application."
          );
        }

        setApplication(result.data);
      } catch (error) {
        console.error(
          "Fetching applicant details error:",
          error.message
        );

        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    if (token && id) {
      fetchApplication();
    }
  }, [token, id]);

  // ==========================================
  // UPDATE APPLICATION STATUS
  // ==========================================

  async function updateApplicationStatus(status) {
    try {
      setUpdatingStatus(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/applications/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to update application."
        );
      }

      setApplication((previous) => ({
        ...previous,
        status: result.data.status,
      }));
    } catch (error) {
      console.error(
        "Updating application status error:",
        error.message
      );

      setError(error.message);
    } finally {
      setUpdatingStatus(false);
    }
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="applicant-details-page">
        <div className="dashboard-loading">
          <h2>
            Loading applicant details...
          </h2>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error || !application) {
    return (
      <div className="applicant-details-page">
        <div className="dashboard-error">

          <p className="page-label">
            APPLICANT
          </p>

          <h1>
            Unable to load application
          </h1>

          <p>
            {error ||
              "Application not found."}
          </p>

          <Link
            to="/recruiter-dashboard"
            className="back-link"
          >
            ← Back to Recruiter Dashboard
          </Link>

        </div>
      </div>
    );
  }

  // ==========================================
  // DATA
  // ==========================================

  const applicant =
    application.userId || {};

  const opportunity =
    application.opportunityId || {};

  const skills = Array.isArray(
    applicant.skills
  )
    ? applicant.skills
    : [];

  const initial = applicant.name
    ? applicant.name
        .charAt(0)
        .toUpperCase()
    : "U";

  return (
    <div className="applicant-details-page">

      {/* ======================================
          BACK
      ======================================= */}

      <Link
        to="/recruiter-dashboard"
        className="back-link"
      >
        ← Back to Recruiter Dashboard
      </Link>

      {/* ======================================
          HEADER
      ======================================= */}

      <section className="applicant-details-header">

        <div className="applicant-details-avatar">
          {initial}
        </div>

        <div className="applicant-details-heading">

          <p className="page-label">
            APPLICANT PROFILE
          </p>

          <h1>
            {applicant.name ||
              application.fullName}
          </h1>

          {applicant.department && (
            <p className="applicant-subtitle">
              {applicant.department}
            </p>
          )}

          {applicant.location && (
            <p className="applicant-location">
              📍 {applicant.location}
            </p>
          )}

        </div>

        <div className="applicant-status-wrapper">

          <span className="status-label">
            Application Status
          </span>

          <span
            className={`status-badge status-${application.status.toLowerCase()}`}
          >
            {application.status}
          </span>

        </div>

      </section>

      {/* ======================================
          OPPORTUNITY
      ======================================= */}

      <section className="applicant-opportunity-card">

        <div>
          <p className="section-eyebrow">
            APPLIED FOR
          </p>

          <h2>
            {opportunity.title}
          </h2>

          <p>
            {opportunity.company}
          </p>
        </div>

        <div className="applicant-opportunity-meta">

          {opportunity.location && (
            <span>
              📍 {opportunity.location}
            </span>
          )}

          {opportunity.type && (
            <span>
              💼 {opportunity.type}
            </span>
          )}

          {opportunity.mode && (
            <span>
              🌐 {opportunity.mode}
            </span>
          )}

        </div>

      </section>

      {/* ======================================
          CONTENT
      ======================================= */}

      <div className="applicant-details-grid">

        {/* ====================================
            CONTACT INFORMATION
        ===================================== */}

        <section className="applicant-details-card">

          <h2>
            Contact Information
          </h2>

          <div className="applicant-info-list">

            <div>
              <span>
                Email
              </span>

              <strong>
                {application.email ||
                  applicant.email ||
                  "Not provided"}
              </strong>
            </div>

            <div>
              <span>
                Phone
              </span>

              <strong>
                {application.phone ||
                  "Not provided"}
              </strong>
            </div>

            <div>
              <span>
                Location
              </span>

              <strong>
                {applicant.location ||
                  "Not provided"}
              </strong>
            </div>

          </div>

        </section>

        {/* ====================================
            EDUCATION
        ===================================== */}

        <section className="applicant-details-card">

          <h2>
            Education
          </h2>

          <div className="applicant-info-list">

            <div>
              <span>
                Education
              </span>

              <strong>
                {applicant.education ||
                  "Not provided"}
              </strong>
            </div>

            <div>
              <span>
                Department
              </span>

              <strong>
                {applicant.department ||
                  "Not provided"}
              </strong>
            </div>

          </div>

        </section>

        {/* ====================================
            SKILLS
        ===================================== */}

        <section className="applicant-details-card">

          <h2>
            Skills
          </h2>

          {skills.length > 0 ? (
            <div className="skills">

              {skills.map(
                (skill, index) => (
                  <span
                    className="skill-tag"
                    key={`${skill}-${index}`}
                  >
                    {skill}
                  </span>
                )
              )}

            </div>
          ) : (
            <p>
              No skills provided.
            </p>
          )}

        </section>

        {/* ====================================
            BIO
        ===================================== */}

        <section className="applicant-details-card full-width">

          <h2>
            About the Applicant
          </h2>

          <p className="applicant-bio">
            {applicant.bio ||
              "The applicant has not added a bio yet."}
          </p>

        </section>

        {/* ====================================
            COVER LETTER
        ===================================== */}

        <section className="applicant-details-card full-width">

          <h2>
            Cover Letter
          </h2>

          <div className="cover-letter-display">

            <p>
              {application.coverLetter}
            </p>

          </div>

        </section>

      </div>

      {/* ======================================
          ACTIONS
      ======================================= */}

      {application.status === "Pending" && (
        <section className="applicant-decision-card">

          <div>
            <p className="section-eyebrow">
              APPLICATION DECISION
            </p>

            <h2>
              Review this application
            </h2>

            <p>
              Choose whether to accept or
              reject this application.
            </p>
          </div>

          <div className="applicant-decision-actions">

            <button
              type="button"
              className="accept-button"
              disabled={updatingStatus}
              onClick={() =>
                updateApplicationStatus(
                  "Accepted"
                )
              }
            >
              {updatingStatus
                ? "Updating..."
                : "✓ Accept Application"}
            </button>

            <button
              type="button"
              className="reject-button"
              disabled={updatingStatus}
              onClick={() =>
                updateApplicationStatus(
                  "Rejected"
                )
              }
            >
              {updatingStatus
                ? "Updating..."
                : "✕ Reject Application"}
            </button>

          </div>

        </section>
      )}

      {/* ======================================
          ADMIN NOTE
      ======================================= */}

      {user?.role === "admin" && (
        <p className="applicant-admin-note">
          You are viewing this application
          as an administrator.
        </p>
      )}

    </div>
  );
}

export default ApplicantDetails;