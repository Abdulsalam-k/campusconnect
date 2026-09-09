import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user, token } = useAuth();

  const [applications, setApplications] = useState([]);
  const [savedOpportunities, setSavedOpportunities] =
    useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // SCROLL TO TOP
  // ==========================================

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // ==========================================
  // FETCH DASHBOARD DATA
  // ==========================================

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        setError("");

        const [applicationsResponse, savedResponse] =
          await Promise.all([
            fetch(
              "http://localhost:5000/api/applications/my",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ),

            fetch(
              "http://localhost:5000/api/saved-opportunities",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ),
          ]);

        const applicationsResult =
          await applicationsResponse.json();

        const savedResult =
          await savedResponse.json();

        if (!applicationsResponse.ok) {
          throw new Error(
            applicationsResult.message ||
              "Failed to load applications."
          );
        }

        if (!savedResponse.ok) {
          throw new Error(
            savedResult.message ||
              "Failed to load saved opportunities."
          );
        }

        setApplications(
          applicationsResult.data || []
        );

        setSavedOpportunities(
          savedResult.data || []
        );
      } catch (error) {
        console.error(
          "Dashboard error:",
          error.message
        );

        setError(
          error.message ||
            "Failed to load dashboard data."
        );

        scrollToTop();
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  // ==========================================
  // APPLICATION STATISTICS
  // ==========================================

  const totalApplications =
    applications.length;

  const pendingApplications =
    applications.filter(
      (application) =>
        application.status === "Pending"
    ).length;

  const acceptedApplications =
    applications.filter(
      (application) =>
        application.status === "Accepted"
    ).length;

  const rejectedApplications =
    applications.filter(
      (application) =>
        application.status === "Rejected"
    ).length;

  // ==========================================
  // PROFILE COMPLETION
  // ==========================================

  const profileCompletion = useMemo(() => {
    if (!user) {
      return 0;
    }

    const fields = [
      user.name,
      user.education,
      user.department,
      user.location,
      user.bio,
    ];

    const completedFields = fields.filter(
      (field) =>
        typeof field === "string" &&
        field.trim()
    ).length;

    const hasSkills =
      Array.isArray(user.skills) &&
      user.skills.length > 0;

    const totalFields = fields.length + 1;

    const completedCount =
      completedFields +
      (hasSkills ? 1 : 0);

    return Math.round(
      (completedCount / totalFields) * 100
    );
  }, [user]);

  // ==========================================
  // LOADING STATE
  // ==========================================

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          <p className="page-label">
            DASHBOARD
          </p>

          <h1>
            Loading your dashboard...
          </h1>

          <p>
            Please wait while we retrieve your
            CampusConnect activity.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR STATE
  // ==========================================

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-error">

          <p className="page-label">
            DASHBOARD
          </p>

          <h2>
            Unable to load dashboard
          </h2>

          <p>{error}</p>

          <button
            type="button"
            className="primary-button"
            onClick={() =>
              window.location.reload()
            }
          >
            Try Again
          </button>

        </div>
      </div>
    );
  }

  // ==========================================
  // RECENT APPLICATIONS
  // ==========================================

  const recentApplications =
    applications.slice(0, 5);

  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <div className="dashboard-page">

      {/* ======================================
          HEADER
      ======================================= */}

      <section className="dashboard-header">

        <div>
          <p className="page-label">
            DASHBOARD
          </p>

          <h1>
            Welcome back, {user?.name} 👋
          </h1>

          <p>
            Here's an overview of your
            CampusConnect activity.
          </p>
        </div>

        <div className="dashboard-header-actions">

          <Link
            to="/opportunities"
            className="dashboard-primary-button"
          >
            Explore Opportunities
          </Link>

          <Link
            to="/saved-opportunities"
            className="dashboard-secondary-button"
          >
            Saved Opportunities
          </Link>

        </div>

      </section>

      {/* ======================================
          STATISTICS
      ======================================= */}

      <section className="dashboard-stats">

        {/* TOTAL APPLICATIONS */}

        <div className="dashboard-stat-card">

          <span className="stat-icon">
            📋
          </span>

          <div>
            <p>Total Applications</p>

            <h2>
              {totalApplications}
            </h2>
          </div>

        </div>

        {/* PENDING */}

        <div className="dashboard-stat-card">

          <span className="stat-icon">
            ⏳
          </span>

          <div>
            <p>Pending</p>

            <h2>
              {pendingApplications}
            </h2>
          </div>

        </div>

        {/* ACCEPTED */}

        <div className="dashboard-stat-card">

          <span className="stat-icon">
            ✅
          </span>

          <div>
            <p>Accepted</p>

            <h2>
              {acceptedApplications}
            </h2>
          </div>

        </div>

        {/* REJECTED */}

        <div className="dashboard-stat-card">

          <span className="stat-icon">
            ❌
          </span>

          <div>
            <p>Rejected</p>

            <h2>
              {rejectedApplications}
            </h2>
          </div>

        </div>

        {/* SAVED */}

        <div className="dashboard-stat-card">

          <span className="stat-icon">
            ❤️
          </span>

          <div>
            <p>Saved Opportunities</p>

            <h2>
              {savedOpportunities.length}
            </h2>
          </div>

        </div>

        {/* PROFILE COMPLETION */}

        <div className="dashboard-stat-card">

          <span className="stat-icon">
            👤
          </span>

          <div>
            <p>Profile Complete</p>

            <h2>
              {profileCompletion}%
            </h2>
          </div>

        </div>

      </section>

      {/* ======================================
          MAIN CONTENT
      ======================================= */}

      <section className="dashboard-content">

        {/* ====================================
            RECENT APPLICATIONS
        ==================================== */}

        <div className="dashboard-section">

          <div className="dashboard-section-header">

            <div>
              <p className="page-label">
                RECENT ACTIVITY
              </p>

              <h2>
                Recent Applications
              </h2>
            </div>

            <Link
              to="/applications"
              className="dashboard-section-link"
            >
              View all
            </Link>

          </div>

          {recentApplications.length > 0 ? (

            <div className="dashboard-applications">

              {recentApplications.map(
                (application) => {

                  const opportunity =
                    application.opportunityId;

                  return (
                    <div
                      className="dashboard-application"
                      key={application._id}
                    >

                      {/* APPLICATION INFORMATION */}

                      <div>

                        <h3>
                          {opportunity?.title ||
                            "Opportunity unavailable"}
                        </h3>

                        <p className="application-company">
                          {opportunity?.company ||
                            "Company information unavailable"}
                        </p>

                        {opportunity && (
                          <div className="dashboard-opportunity-details">

                            {opportunity.location && (
                              <span>
                                📍{" "}
                                {opportunity.location}
                              </span>
                            )}

                            {opportunity.type && (
                              <span>
                                💼{" "}
                                {opportunity.type}
                              </span>
                            )}

                            {opportunity.mode && (
                              <span>
                                🌐{" "}
                                {opportunity.mode}
                              </span>
                            )}

                          </div>
                        )}

                        <p>
                          Submitted{" "}
                          {application.createdAt
                            ? new Date(
                                application.createdAt
                              ).toLocaleDateString()
                            : "—"}
                        </p>

                      </div>

                      {/* APPLICATION ACTIONS */}

                      <div className="dashboard-application-actions">

                        <span
                          className={`dashboard-status ${application.status.toLowerCase()}`}
                        >
                          {application.status}
                        </span>

                        {opportunity?._id ? (
                          <Link
                            to={`/opportunities/${opportunity._id}`}
                            className="dashboard-view-link"
                          >
                            View
                          </Link>
                        ) : (
                          <span className="dashboard-unavailable">
                            Unavailable
                          </span>
                        )}

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          ) : (

            /* EMPTY APPLICATION STATE */

            <div className="dashboard-empty">

              <div className="dashboard-empty-icon">
                📋
              </div>

              <h3>
                No applications yet
              </h3>

              <p>
                Start exploring opportunities
                and submit your first
                application.
              </p>

              <Link
                to="/opportunities"
                className="dashboard-primary-button"
              >
                Find Opportunities
              </Link>

            </div>

          )}

        </div>

        {/* ====================================
            PROFILE
        ==================================== */}

        <aside className="dashboard-profile-card">

          <p className="page-label">
            YOUR PROFILE
          </p>

          {/* PROFILE AVATAR */}

          <div className="dashboard-profile-avatar">
            {user?.name
              ? user.name
                  .charAt(0)
                  .toUpperCase()
              : "U"}
          </div>

          {/* NAME */}

          <h2>
            {user?.name || "Your Name"}
          </h2>

          {/* EMAIL */}

          <p>
            {user?.email ||
              "your@email.com"}
          </p>

          {/* ROLE */}

          <div className="profile-role">
            {user?.role || "student"}
          </div>

          {/* PROFILE COMPLETION */}

          <div className="dashboard-profile-completion">

            <div className="dashboard-profile-completion-header">
              <span>
                Profile completion
              </span>

              <strong>
                {profileCompletion}%
              </strong>
            </div>

            <div className="dashboard-profile-progress">
              <div
                className="dashboard-profile-progress-bar"
                style={{
                  width: `${profileCompletion}%`,
                }}
              />
            </div>

          </div>

          {/* DEPARTMENT */}

          {user?.department && (
            <p>
              🎓 {user.department}
            </p>
          )}

          {/* LOCATION */}

          {user?.location && (
            <p>
              📍 {user.location}
            </p>
          )}

          {/* BIO */}

          {user?.bio && (
            <p className="dashboard-profile-bio">
              {user.bio}
            </p>
          )}

          {/* SKILLS */}

          {user?.skills?.length > 0 && (
            <div className="dashboard-profile-skills">

              {user.skills.map(
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
          )}

          {/* EDIT PROFILE */}

          <Link
            to="/profile"
            className="dashboard-profile-link"
          >
            Edit My Profile
          </Link>

        </aside>

      </section>

    </div>
  );
}

export default Dashboard;