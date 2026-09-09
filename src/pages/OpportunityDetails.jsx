import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import useFetch from "../hooks/useFetch";
import { useAuth } from "../context/AuthContext";

function OpportunityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    user,
    token,
    isAuthenticated,
  } = useAuth();

  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [checkingSaved, setCheckingSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  const {
    data: response,
    loading,
    error,
  } = useFetch(
    `http://localhost:5000/api/opportunities/${id}`
  );

  const opportunity = response?.data;

  // ROLE CHECKS
  const isStudent = user?.role === "student";
  const isRecruiter = user?.role === "recruiter";
  const isAdmin = user?.role === "admin";

  // SAFE SKILLS ARRAY
  const skills = Array.isArray(opportunity?.skills)
    ? opportunity.skills
    : [];

  // ==========================================
  // CHECK IF OPPORTUNITY IS SAVED
  // STUDENTS ONLY
  // ==========================================

  useEffect(() => {
    async function checkSavedOpportunity() {
      if (
        !isAuthenticated ||
        !isStudent ||
        !token ||
        !opportunity?._id
      ) {
        setIsSaved(false);
        return;
      }

      try {
        setCheckingSaved(true);

        const response = await fetch(
          "http://localhost:5000/api/saved-opportunities",
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
              "Failed to check saved opportunities."
          );
        }

        const alreadySaved = (
          result.data || []
        ).some(
          (savedOpportunity) =>
            savedOpportunity._id === opportunity._id
        );

        setIsSaved(alreadySaved);
      } catch (error) {
        console.error(
          "Checking saved opportunity failed:",
          error.message
        );
      } finally {
        setCheckingSaved(false);
      }
    }

    checkSavedOpportunity();
  }, [
    token,
    isAuthenticated,
    isStudent,
    opportunity?._id,
  ]);

  // ==========================================
  // SAVE / UNSAVE OPPORTUNITY
  // ==========================================

  async function handleSaveToggle() {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!isStudent) {
      setSaveError(
        "Only students can save opportunities."
      );
      return;
    }

    if (!opportunity?._id) {
      return;
    }

    setSaving(true);
    setSaveError("");

    try {
      const url = `http://localhost:5000/api/saved-opportunities/${opportunity._id}`;

      const response = await fetch(url, {
        method: isSaved ? "DELETE" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to update saved opportunity."
        );
      }

      setIsSaved((previous) => !previous);
    } catch (error) {
      console.error(
        "Save toggle failed:",
        error.message
      );

      setSaveError(
        error.message ||
          "Failed to update saved opportunity."
      );
    } finally {
      setSaving(false);
    }
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="opportunity-details-page">
        <p>Loading opportunity...</p>
      </div>
    );
  }

  // ==========================================
  // NOT FOUND
  // ==========================================

  if (error || !opportunity) {
    return (
      <div className="opportunity-details-page">
        <h1>Opportunity not found</h1>

        <Link to="/opportunities">
          ← Back to Opportunities
        </Link>
      </div>
    );
  }

  return (
    <div className="opportunity-details-page">

      {/* BACK LINK */}
      <Link
        to="/opportunities"
        className="back-link"
      >
        ← Back to Opportunities
      </Link>

      {/* ======================================
          OPPORTUNITY HEADER
      ======================================= */}

      <section className="opportunity-details-header">

        <div className="large-company-logo">
          {opportunity.company
            ? opportunity.company
                .charAt(0)
                .toUpperCase()
            : "C"}
        </div>

        <div>
          <p className="page-label">
            {opportunity.category}
          </p>

          <h1>
            {opportunity.title}
          </h1>

          <h2>
            {opportunity.company}
          </h2>

          <div className="opportunity-detail-meta">

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
        </div>

      </section>

      {/* ======================================
          DETAILS LAYOUT
      ======================================= */}

      <div className="opportunity-details-layout">

        <main>

          {/* ABOUT */}
          <section className="details-section">
            <h2>
              About this opportunity
            </h2>

            <p>
              {opportunity.description}
            </p>
          </section>

          {/* REQUIRED SKILLS */}
          <section className="details-section">
            <h2>
              Required Skills
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
                No specific skills have been
                listed for this opportunity.
              </p>
            )}
          </section>

          {/* RESPONSIBILITIES */}
          <section className="details-section">
            <h2>
              What you will do
            </h2>

            <ul className="responsibilities">
              <li>
                Work with other team members.
              </li>

              <li>
                Contribute to real-world projects.
              </li>

              <li>
                Apply your technical and
                creative skills.
              </li>

              <li>
                Learn from experienced
                professionals.
              </li>

              <li>
                Participate in project
                discussions.
              </li>
            </ul>
          </section>

        </main>

        {/* ======================================
            ACTION SIDEBAR
        ======================================= */}

        <aside className="application-card">

          {/* STUDENT */}
          {isStudent && (
            <>
              <h2>
                Interested?
              </h2>

              <p>
                Submit your application before
                the deadline.
              </p>
            </>
          )}

          {/* RECRUITER */}
          {isRecruiter && (
            <>
              <h2>
                Opportunity
              </h2>

              <p>
                You are viewing this opportunity
                as a recruiter.
              </p>
            </>
          )}

          {/* ADMIN */}
          {isAdmin && (
            <>
              <h2>
                Opportunity
              </h2>

              <p>
                You are viewing this opportunity
                as an administrator.
              </p>
            </>
          )}

          {/* GUEST */}
          {!isAuthenticated && (
            <>
              <h2>
                Interested?
              </h2>

              <p>
                Log in as a student to apply for
                this opportunity.
              </p>
            </>
          )}

          {/* DEADLINE */}
          <div className="deadline">
            <span>
              Application deadline
            </span>

            <strong>
              {opportunity.deadline}
            </strong>
          </div>

          {/* ==================================
              STUDENT ACTIONS
          =================================== */}

          {isStudent && (
            <>
              <Link
                to={`/opportunities/${opportunity._id}/apply`}
                className="apply-button"
              >
                Apply Now
              </Link>

              <button
                type="button"
                className="save-button"
                onClick={handleSaveToggle}
                disabled={
                  saving || checkingSaved
                }
              >
                {checkingSaved
                  ? "Checking..."
                  : saving
                  ? "Saving..."
                  : isSaved
                  ? "♥ Saved"
                  : "♡ Save Opportunity"}
              </button>

              {saveError && (
                <p className="form-error">
                  {saveError}
                </p>
              )}
            </>
          )}

          {/* ==================================
              GUEST ACTION
          =================================== */}

          {!isAuthenticated && (
            <Link
              to="/login"
              className="apply-button"
            >
              Login to Apply
            </Link>
          )}

        </aside>

      </div>
    </div>
  );
}

export default OpportunityDetails;