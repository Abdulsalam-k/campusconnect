import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RecruiterDashboard() {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [deletingOpportunityId, setDeletingOpportunityId] =
    useState(null);

  const [updatingApplicationId, setUpdatingApplicationId] =
    useState(null);

  // ==========================================
  // OPPORTUNITY SEARCH / FILTERS
  // ==========================================

  const [opportunitySearch, setOpportunitySearch] =
    useState("");

  const [opportunityTypeFilter, setOpportunityTypeFilter] =
    useState("All");

  const [opportunityModeFilter, setOpportunityModeFilter] =
    useState("All");

  // ==========================================
  // APPLICATION SEARCH / FILTERS
  // ==========================================

  const [applicationSearch, setApplicationSearch] =
    useState("");

  const [applicationStatusFilter, setApplicationStatusFilter] =
    useState("All");

  const [applicationOpportunityFilter, setApplicationOpportunityFilter] =
    useState("All");

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
  // FETCH RECRUITER DASHBOARD
  // ==========================================

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/recruiter/dashboard",
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
              "Failed to fetch dashboard."
          );
        }

        setDashboard(result.data);
      } catch (error) {
        console.error(
          "Recruiter dashboard error:",
          error.message
        );

        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchDashboard();
    }
  }, [token]);

  // ==========================================
  // FILTER OPPORTUNITIES
  // ==========================================

  const filteredOpportunities = useMemo(() => {
    if (!dashboard) {
      return [];
    }

    const searchValue =
      opportunitySearch.trim().toLowerCase();

    return dashboard.opportunities.filter(
      (opportunity) => {
        const searchableText = [
          opportunity.title,
          opportunity.company,
          opportunity.category,
          opportunity.location,
          opportunity.description,
          ...(Array.isArray(opportunity.skills)
            ? opportunity.skills
            : []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const matchesSearch =
          !searchValue ||
          searchableText.includes(searchValue);

        const matchesType =
          opportunityTypeFilter === "All" ||
          opportunity.type ===
            opportunityTypeFilter;

        const matchesMode =
          opportunityModeFilter === "All" ||
          opportunity.mode ===
            opportunityModeFilter;

        return (
          matchesSearch &&
          matchesType &&
          matchesMode
        );
      }
    );
  }, [
    dashboard,
    opportunitySearch,
    opportunityTypeFilter,
    opportunityModeFilter,
  ]);

  // ==========================================
  // CLEAR OPPORTUNITY FILTERS
  // ==========================================

  function clearOpportunityFilters() {
    setOpportunitySearch("");
    setOpportunityTypeFilter("All");
    setOpportunityModeFilter("All");
  }

  // ==========================================
  // FILTER APPLICATIONS
  // ==========================================

  const filteredApplications = useMemo(() => {
    if (!dashboard) {
      return [];
    }

    const searchValue =
      applicationSearch.trim().toLowerCase();

    return dashboard.applications.filter(
      (application) => {
        const applicant =
          application.userId &&
          typeof application.userId === "object"
            ? application.userId
            : {};

        const opportunity =
          application.opportunityId &&
          typeof application.opportunityId === "object"
            ? application.opportunityId
            : {};

        const searchableText = [
          applicant.name,
          applicant.email,
          applicant.department,
          applicant.education,
          application.fullName,
          application.email,
          application.phone,
          opportunity.title,
          opportunity.company,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const matchesSearch =
          !searchValue ||
          searchableText.includes(searchValue);

        const matchesStatus =
          applicationStatusFilter === "All" ||
          application.status ===
            applicationStatusFilter;

        const matchesOpportunity =
          applicationOpportunityFilter === "All" ||
          opportunity._id ===
            applicationOpportunityFilter;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesOpportunity
        );
      }
    );
  }, [
    dashboard,
    applicationSearch,
    applicationStatusFilter,
    applicationOpportunityFilter,
  ]);

  // ==========================================
  // CLEAR APPLICATION FILTERS
  // ==========================================

  function clearApplicationFilters() {
    setApplicationSearch("");
    setApplicationStatusFilter("All");
    setApplicationOpportunityFilter("All");
  }

  // ==========================================
  // UPDATE APPLICATION STATUS
  // ==========================================

  async function updateApplicationStatus(
    applicationId,
    status
  ) {
    try {
      setError("");
      setSuccess("");
      setUpdatingApplicationId(applicationId);

      const response = await fetch(
        `http://localhost:5000/api/applications/${applicationId}/status`,
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

      setDashboard((currentDashboard) => {
        if (!currentDashboard) {
          return currentDashboard;
        }

        const previousApplication =
          currentDashboard.applications.find(
            (application) =>
              application._id === applicationId
          );

        if (!previousApplication) {
          return currentDashboard;
        }

        const previousStatus =
          previousApplication.status;

        const updatedApplications =
          currentDashboard.applications.map(
            (application) =>
              application._id === applicationId
                ? {
                    ...application,
                    status: result.data.status,
                  }
                : application
          );

        const updatedStats = {
          ...currentDashboard.stats,
        };

        // Remove previous status count

        if (previousStatus === "Pending") {
          updatedStats.pending -= 1;
        }

        if (previousStatus === "Accepted") {
          updatedStats.accepted -= 1;
        }

        if (previousStatus === "Rejected") {
          updatedStats.rejected -= 1;
        }

        // Add new status count

        if (status === "Pending") {
          updatedStats.pending += 1;
        }

        if (status === "Accepted") {
          updatedStats.accepted += 1;
        }

        if (status === "Rejected") {
          updatedStats.rejected += 1;
        }

        return {
          ...currentDashboard,
          applications: updatedApplications,
          stats: updatedStats,
        };
      });

      setSuccess(
        `Application ${status.toLowerCase()} successfully.`
      );

      scrollToTop();
    } catch (error) {
      console.error(
        "Updating application status error:",
        error.message
      );

      setError(error.message);
      scrollToTop();
    } finally {
      setUpdatingApplicationId(null);
    }
  }

  // ==========================================
  // DELETE OPPORTUNITY
  // ==========================================

  async function deleteOpportunity(
    opportunityId,
    opportunityTitle
  ) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${opportunityTitle}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");
      setDeletingOpportunityId(opportunityId);

      const response = await fetch(
        `http://localhost:5000/api/opportunities/${opportunityId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to delete opportunity."
        );
      }

      setDashboard((currentDashboard) => {
        if (!currentDashboard) {
          return currentDashboard;
        }

        return {
          ...currentDashboard,

          opportunities:
            currentDashboard.opportunities.filter(
              (opportunity) =>
                opportunity._id !== opportunityId
            ),

          stats: {
            ...currentDashboard.stats,

            totalOpportunities:
              Math.max(
                currentDashboard.stats
                  .totalOpportunities - 1,
                0
              ),
          },
        };
      });

      setSuccess(
        `"${opportunityTitle}" was deleted successfully.`
      );

      scrollToTop();
    } catch (error) {
      console.error(
        "Deleting opportunity error:",
        error.message
      );

      setError(error.message);
      scrollToTop();
    } finally {
      setDeletingOpportunityId(null);
    }
  }

  // ==========================================
  // VIEW APPLICANT
  // ==========================================

  function viewApplicant(applicationId) {
    navigate(
      `/recruiter/applications/${applicationId}`
    );
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          <h2>
            Loading recruiter dashboard...
          </h2>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error && !dashboard) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-error">
          <h2>Recruiter Dashboard</h2>

          <p>{error}</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // NO DATA
  // ==========================================

  if (!dashboard) {
    return (
      <div className="dashboard-page">
        <p>
          No dashboard data available.
        </p>
      </div>
    );
  }

  const {
    stats,
    opportunities,
    applications,
  } = dashboard;

  return (
    <div className="dashboard-page">

      {/* ======================================
          PAGE HEADER
      ======================================= */}

      <div className="dashboard-header">

        <div>
          <p className="dashboard-eyebrow">
            RECRUITER PORTAL
          </p>

          <h1>
            Recruiter Dashboard
          </h1>

          <p className="dashboard-welcome">
            Welcome back,{" "}
            <strong>{user?.name}</strong>.
            Manage your opportunities and
            applications from one place.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() =>
            navigate("/create-opportunity")
          }
        >
          + Create Opportunity
        </button>

      </div>

      {/* ======================================
          SUCCESS ALERT
      ======================================= */}

      {success && (
        <div className="dashboard-success">
          <strong>✓</strong>

          <span>{success}</span>
        </div>
      )}

      {/* ======================================
          ERROR ALERT
      ======================================= */}

      {error && (
        <div className="dashboard-alert">
          {error}
        </div>
      )}

      {/* ======================================
          STATISTICS
      ======================================= */}

      <div className="dashboard-stats">

        <div className="stat-card">
          <div className="stat-card-icon">
            💼
          </div>

          <div>
            <p>Opportunities</p>

            <h2>
              {stats.totalOpportunities}
            </h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon">
            📄
          </div>

          <div>
            <p>Applications</p>

            <h2>
              {stats.totalApplications}
            </h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon">
            ⏳
          </div>

          <div>
            <p>Pending</p>

            <h2>
              {stats.pending}
            </h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon">
            ✅
          </div>

          <div>
            <p>Accepted</p>

            <h2>
              {stats.accepted}
            </h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon">
            ❌
          </div>

          <div>
            <p>Rejected</p>

            <h2>
              {stats.rejected}
            </h2>
          </div>
        </div>

      </div>

      {/* ======================================
          MY OPPORTUNITIES
      ======================================= */}

      <section className="dashboard-section">

        <div className="section-heading">

          <div>
            <p className="section-eyebrow">
              YOUR POSTINGS
            </p>

            <h2>
              My Opportunities
            </h2>

            <p>
              Create, edit and manage your
              opportunities.
            </p>
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={() =>
              navigate("/create-opportunity")
            }
          >
            + New Opportunity
          </button>

        </div>

        {/* OPPORTUNITY FILTERS */}

        {opportunities.length > 0 && (
          <>
            <div className="recruiter-opportunity-filters">

              <input
                type="text"
                placeholder="Search title, company, category, location..."
                value={opportunitySearch}
                onChange={(event) =>
                  setOpportunitySearch(
                    event.target.value
                  )
                }
              />

              <select
                value={opportunityTypeFilter}
                onChange={(event) =>
                  setOpportunityTypeFilter(
                    event.target.value
                  )
                }
              >
                <option value="All">
                  All Types
                </option>

                <option value="Internship">
                  Internship
                </option>

                <option value="Part-time">
                  Part-time
                </option>

                <option value="Full-time">
                  Full-time
                </option>

                <option value="Contract">
                  Contract
                </option>
              </select>

              <select
                value={opportunityModeFilter}
                onChange={(event) =>
                  setOpportunityModeFilter(
                    event.target.value
                  )
                }
              >
                <option value="All">
                  All Modes
                </option>

                <option value="Remote">
                  Remote
                </option>

                <option value="On-site">
                  On-site
                </option>

                <option value="Hybrid">
                  Hybrid
                </option>
              </select>

              {(opportunitySearch ||
                opportunityTypeFilter !==
                  "All" ||
                opportunityModeFilter !==
                  "All") && (
                <button
                  type="button"
                  className="recruiter-clear-filters"
                  onClick={
                    clearOpportunityFilters
                  }
                >
                  Clear Filters
                </button>
              )}

            </div>

            <div className="recruiter-opportunity-results">

              <p>
                Showing{" "}
                <strong>
                  {
                    filteredOpportunities.length
                  }
                </strong>{" "}
                of{" "}
                <strong>
                  {opportunities.length}
                </strong>{" "}
                {opportunities.length === 1
                  ? "opportunity"
                  : "opportunities"}
              </p>

            </div>
          </>
        )}

        {/* OPPORTUNITY CONTENT */}

        {opportunities.length === 0 ? (
          <div className="empty-state">

            <h3>
              No opportunities yet
            </h3>

            <p>
              Create your first opportunity to
              start receiving applications.
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={() =>
                navigate("/create-opportunity")
              }
            >
              Create Opportunity
            </button>

          </div>
        ) : filteredOpportunities.length ===
          0 ? (
          <div className="empty-state">

            <h3>
              No matching opportunities
            </h3>

            <p>
              No opportunities match your current
              search or filters.
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={
                clearOpportunityFilters
              }
            >
              Clear Filters
            </button>

          </div>
        ) : (
          <div className="opportunities-grid">

            {filteredOpportunities.map(
              (opportunity) => {

                const opportunityApplications =
                  applications.filter(
                    (application) =>
                      application
                        .opportunityId?._id ===
                      opportunity._id
                  );

                const isDeleting =
                  deletingOpportunityId ===
                  opportunity._id;

                return (
                  <article
                    key={opportunity._id}
                    className="dashboard-opportunity"
                  >

                    <div className="opportunity-top">

                      <span className="opportunity-category">
                        {opportunity.category}
                      </span>

                      <span className="opportunity-type">
                        {opportunity.type}
                      </span>

                    </div>

                    <h3>
                      {opportunity.title}
                    </h3>

                    <p className="opportunity-company">
                      {opportunity.company}
                    </p>

                    <div className="opportunity-details">

                      <span>
                        📍{" "}
                        {opportunity.location}
                      </span>

                      <span>
                        💻{" "}
                        {opportunity.mode}
                      </span>

                      <span>
                        📅{" "}
                        {opportunity.deadline}
                      </span>

                      <span>
                        📄{" "}
                        {
                          opportunityApplications.length
                        }{" "}
                        application
                        {opportunityApplications.length !==
                        1
                          ? "s"
                          : ""}
                      </span>

                    </div>

                    <div className="opportunity-actions">

                      {/* EDIT */}

                      <button
                        type="button"
                        className="edit-button"
                        onClick={() =>
                          navigate(
                            `/opportunities/${opportunity._id}/edit`
                          )
                        }
                        disabled={isDeleting}
                      >
                        Edit
                      </button>

                      {/* DELETE */}

                      <button
                        type="button"
                        className="delete-button"
                        onClick={() =>
                          deleteOpportunity(
                            opportunity._id,
                            opportunity.title
                          )
                        }
                        disabled={isDeleting}
                      >
                        {isDeleting
                          ? "Deleting..."
                          : "Delete"}
                      </button>

                    </div>

                  </article>
                );
              }
            )}

          </div>
        )}

      </section>

      {/* ======================================
          APPLICATIONS
      ======================================= */}

      <section className="dashboard-section">

        <div className="section-heading">

          <div>
            <p className="section-eyebrow">
              APPLICATION MANAGEMENT
            </p>

            <h2>
              Applications
            </h2>

            <p>
              Review applicants and manage their
              application status.
            </p>
          </div>

        </div>

        {/* APPLICATION FILTERS */}

        {applications.length > 0 && (
          <>
            <div className="recruiter-application-filters">

              <input
                type="text"
                placeholder="Search applicant, email, opportunity..."
                value={applicationSearch}
                onChange={(event) =>
                  setApplicationSearch(
                    event.target.value
                  )
                }
              />

              <select
                value={applicationStatusFilter}
                onChange={(event) =>
                  setApplicationStatusFilter(
                    event.target.value
                  )
                }
              >
                <option value="All">
                  All Statuses
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="Accepted">
                  Accepted
                </option>

                <option value="Rejected">
                  Rejected
                </option>
              </select>

              <select
                value={
                  applicationOpportunityFilter
                }
                onChange={(event) =>
                  setApplicationOpportunityFilter(
                    event.target.value
                  )
                }
              >
                <option value="All">
                  All Opportunities
                </option>

                {opportunities.map(
                  (opportunity) => (
                    <option
                      key={opportunity._id}
                      value={opportunity._id}
                    >
                      {opportunity.title}
                    </option>
                  )
                )}

              </select>

              {(applicationSearch ||
                applicationStatusFilter !==
                  "All" ||
                applicationOpportunityFilter !==
                  "All") && (
                <button
                  type="button"
                  className="recruiter-clear-application-filters"
                  onClick={
                    clearApplicationFilters
                  }
                >
                  Clear Filters
                </button>
              )}

            </div>

            <div className="recruiter-application-results">

              <p>
                Showing{" "}
                <strong>
                  {filteredApplications.length}
                </strong>{" "}
                of{" "}
                <strong>
                  {applications.length}
                </strong>{" "}
                {applications.length === 1
                  ? "application"
                  : "applications"}
              </p>

            </div>
          </>
        )}

        {/* APPLICATION CONTENT */}

        {applications.length === 0 ? (
          <div className="empty-state">

            <h3>
              No applications yet
            </h3>

            <p>
              Applications submitted to your
              opportunities will appear here.
            </p>

          </div>
        ) : filteredApplications.length ===
          0 ? (
          <div className="empty-state">

            <h3>
              No matching applications
            </h3>

            <p>
              No applications match your current
              search or filters.
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={
                clearApplicationFilters
              }
            >
              Clear Filters
            </button>

          </div>
        ) : (
          <div className="applications-grid">

            {filteredApplications.map(
              (application) => {

                const applicant =
                  application.userId;

                const isUpdating =
                  updatingApplicationId ===
                  application._id;

                return (
                  <article
                    key={application._id}
                    className="dashboard-application"
                  >

                    {/* APPLICATION HEADER */}

                    <div className="application-header">

                      <div>

                        <p className="application-opportunity">
                          {
                            application
                              .opportunityId
                              ?.title
                          }
                        </p>

                        <h3>
                          {applicant?.name ||
                            application.fullName}
                        </h3>

                      </div>

                      <span
                        className={`status-badge status-${application.status.toLowerCase()}`}
                      >
                        {application.status}
                      </span>

                    </div>

                    {/* BASIC APPLICATION INFO */}

                    <div className="application-info">

                      <p>
                        <strong>
                          Email:
                        </strong>{" "}
                        {application.email}
                      </p>

                      <p>
                        <strong>
                          Phone:
                        </strong>{" "}
                        {application.phone}
                      </p>

                      {applicant?.department && (
                        <p>
                          <strong>
                            Department:
                          </strong>{" "}
                          {applicant.department}
                        </p>
                      )}

                      {applicant?.education && (
                        <p>
                          <strong>
                            Education:
                          </strong>{" "}
                          {applicant.education}
                        </p>
                      )}

                    </div>

                    {/* VIEW APPLICANT */}

                    <button
                      type="button"
                      className="secondary-button applicant-view-button"
                      onClick={() =>
                        viewApplicant(
                          application._id
                        )
                      }
                    >
                      View Applicant
                    </button>

                    {/* ACCEPT / REJECT */}

                    {application.status ===
                      "Pending" && (
                      <div className="application-actions">

                        <button
                          type="button"
                          className="accept-button"
                          onClick={() =>
                            updateApplicationStatus(
                              application._id,
                              "Accepted"
                            )
                          }
                          disabled={isUpdating}
                        >
                          {isUpdating
                            ? "Updating..."
                            : "✓ Accept"}
                        </button>

                        <button
                          type="button"
                          className="reject-button"
                          onClick={() =>
                            updateApplicationStatus(
                              application._id,
                              "Rejected"
                            )
                          }
                          disabled={isUpdating}
                        >
                          {isUpdating
                            ? "Updating..."
                            : "✕ Reject"}
                        </button>

                      </div>
                    )}

                  </article>
                );
              }
            )}

          </div>
        )}

      </section>

    </div>
  );
}

export default RecruiterDashboard;