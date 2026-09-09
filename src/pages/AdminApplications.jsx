import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function AdminApplications() {
  const { token } = useAuth();

  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  // ==========================================
  // FETCH ALL APPLICATIONS
  // ==========================================

  useEffect(() => {
    async function fetchApplications() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/applications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to fetch applications."
          );
        }

        setApplications(result.data || []);
      } catch (error) {
        console.error(
          "Fetching admin applications failed:",
          error.message
        );

        setError(
          error.message || "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchApplications();
    }
  }, [token]);

  // ==========================================
  // CHANGE APPLICATION STATUS
  // ==========================================

  async function handleStatusChange(applicationId, status) {
    try {
      setUpdatingId(applicationId);
      setActionError("");

      const response = await fetch(
        `http://localhost:5000/api/applications/${applicationId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to update application status."
        );
      }

      setApplications((currentApplications) =>
        currentApplications.map((application) =>
          application._id === applicationId
            ? {
                ...application,
                status,
              }
            : application
        )
      );
    } catch (error) {
      console.error(
        "Updating application status failed:",
        error.message
      );

      setActionError(
        error.message ||
          "Failed to update application status."
      );
    } finally {
      setUpdatingId("");
    }
  }

  // ==========================================
  // FILTER APPLICATIONS
  // ==========================================

  const filteredApplications = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return applications.filter((application) => {
      const applicantName =
        typeof application.userId === "object"
          ? application.userId?.name || ""
          : application.fullName || "";

      const applicantEmail =
        typeof application.userId === "object"
          ? application.userId?.email || ""
          : application.email || "";

      const opportunityTitle =
        typeof application.opportunityId === "object"
          ? application.opportunityId?.title || ""
          : "";

      const company =
        typeof application.opportunityId === "object"
          ? application.opportunityId?.company || ""
          : "";

      const matchesSearch =
        !searchTerm ||
        applicantName.toLowerCase().includes(searchTerm) ||
        applicantEmail.toLowerCase().includes(searchTerm) ||
        opportunityTitle.toLowerCase().includes(searchTerm) ||
        company.toLowerCase().includes(searchTerm);

      const matchesStatus =
        statusFilter === "All" ||
        application.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  function clearFilters() {
    setSearch("");
    setStatusFilter("All");
  }

  // ==========================================
  // HELPERS
  // ==========================================

  function formatDate(date) {
    if (!date) {
      return "Not available";
    }

    return new Date(date).toLocaleDateString(
      "en-NG",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  }

  function getApplicantName(application) {
    if (
      application.userId &&
      typeof application.userId === "object"
    ) {
      return application.userId.name || "Unknown applicant";
    }

    return application.fullName || "Unknown applicant";
  }

  function getApplicantEmail(application) {
    if (
      application.userId &&
      typeof application.userId === "object"
    ) {
      return application.userId.email || "No email";
    }

    return application.email || "No email";
  }

  function getOpportunityTitle(application) {
    if (
      application.opportunityId &&
      typeof application.opportunityId === "object"
    ) {
      return (
        application.opportunityId.title ||
        "Unknown opportunity"
      );
    }

    return "Unknown opportunity";
  }

  function getCompany(application) {
    if (
      application.opportunityId &&
      typeof application.opportunityId === "object"
    ) {
      return (
        application.opportunityId.company ||
        "Unknown company"
      );
    }

    return "Unknown company";
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <section className="admin-applications-page">
        <div className="admin-applications-container">
          <div className="admin-applications-state">
            <h2>Loading applications...</h2>
            <p>
              Please wait while we retrieve all platform
              applications.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <section className="admin-applications-page">
        <div className="admin-applications-container">
          <div className="admin-applications-state admin-error-state">
            <h2>Unable to load applications</h2>
            <p>{error}</p>

            <Link
              to="/admin-dashboard"
              className="admin-back-button"
            >
              Back to Admin Dashboard
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-applications-page">
      <div className="admin-applications-container">

        {/* HEADER */}

        <div className="admin-applications-header">
          <div>
            <p className="admin-dashboard-eyebrow">
              ADMIN PORTAL
            </p>

            <h1>Application Management</h1>

            <p>
              Review and manage applications submitted
              across CampusConnect.
            </p>
          </div>

          <Link
            to="/admin-dashboard"
            className="secondary-button"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* SUMMARY */}

        <div className="admin-application-summary">
          <div>
            <span>Total Applications</span>
            <strong>{applications.length}</strong>
          </div>

          <div>
            <span>Pending</span>
            <strong>
              {
                applications.filter(
                  (application) =>
                    application.status === "Pending"
                ).length
              }
            </strong>
          </div>

          <div>
            <span>Accepted</span>
            <strong>
              {
                applications.filter(
                  (application) =>
                    application.status === "Accepted"
                ).length
              }
            </strong>
          </div>

          <div>
            <span>Rejected</span>
            <strong>
              {
                applications.filter(
                  (application) =>
                    application.status === "Rejected"
                ).length
              }
            </strong>
          </div>
        </div>

        {/* FILTERS */}

        <div className="admin-application-toolbar">

          <input
            type="text"
            placeholder="Search applicant, email, opportunity or company..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            className="admin-application-search"
          />

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="admin-application-filter"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>

          {(search || statusFilter !== "All") && (
            <button
              type="button"
              onClick={clearFilters}
              className="admin-clear-application-filters"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* RESULT BAR */}

        <div className="admin-application-results">
          <span>
            Showing{" "}
            <strong>
              {filteredApplications.length}
            </strong>{" "}
            of{" "}
            <strong>
              {applications.length}
            </strong>{" "}
            applications
          </span>
        </div>

        {actionError && (
          <div className="admin-inline-error">
            {actionError}
          </div>
        )}

        {/* APPLICATIONS */}

        {filteredApplications.length === 0 ? (
          <div className="admin-applications-state">
            <h2>No applications found</h2>
            <p>
              Try changing your search or filter.
            </p>
          </div>
        ) : (
          <div className="admin-applications-grid">

            {filteredApplications.map(
              (application) => {

                const applicantName =
                  getApplicantName(application);

                const applicantEmail =
                  getApplicantEmail(application);

                const opportunityTitle =
                  getOpportunityTitle(application);

                const company =
                  getCompany(application);

                return (
                  <article
                    key={application._id}
                    className="admin-application-card"
                  >

                    {/* CARD HEADER */}

                    <div className="admin-application-card-header">

                      <div className="admin-applicant-avatar">
                        {applicantName
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="admin-application-applicant">
                        <h2>{applicantName}</h2>
                        <p>{applicantEmail}</p>
                      </div>

                      <span
                        className={`admin-application-status status-${application.status.toLowerCase()}`}
                      >
                        {application.status}
                      </span>

                    </div>

                    {/* OPPORTUNITY */}

                    <div className="admin-application-opportunity">

                      <span>
                        Applied For
                      </span>

                      <h3>
                        {opportunityTitle}
                      </h3>

                      <p>{company}</p>

                    </div>

                    {/* DETAILS */}

                    <div className="admin-application-meta">

                      <div>
                        <span>Applied</span>
                        <strong>
                          {formatDate(
                            application.createdAt
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>Application ID</span>
                        <strong>
                          {application._id}
                        </strong>
                      </div>

                    </div>

                    {/* ACTIONS */}

                    <div className="admin-application-actions">

                      {application.status ===
                        "Pending" && (
                        <>
                          <button
                            type="button"
                            disabled={
                              updatingId ===
                              application._id
                            }
                            className="admin-accept-button"
                            onClick={() =>
                              handleStatusChange(
                                application._id,
                                "Accepted"
                              )
                            }
                          >
                            {updatingId ===
                            application._id
                              ? "Updating..."
                              : "Accept"}
                          </button>

                          <button
                            type="button"
                            disabled={
                              updatingId ===
                              application._id
                            }
                            className="admin-reject-button"
                            onClick={() =>
                              handleStatusChange(
                                application._id,
                                "Rejected"
                              )
                            }
                          >
                            Reject
                          </button>
                        </>
                      )}

                      <Link
                        to={`/recruiter/applications/${application._id}`}
                        className="admin-view-application-button"
                      >
                        View Details
                      </Link>

                    </div>

                  </article>
                );
              }
            )}

          </div>
        )}

      </div>
    </section>
  );
}

export default AdminApplications;