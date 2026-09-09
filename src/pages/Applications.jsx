import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Applications() {
  const { token } = useAuth();

  const [applications, setApplications] =
    useState([]);

  // ==========================================
  // SEARCH / FILTER / SORT
  // ==========================================

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [opportunityFilter, setOpportunityFilter] =
    useState("All");

  const [sortBy, setSortBy] =
    useState("newest");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==========================================
  // FETCH APPLICATIONS
  // ==========================================

  useEffect(() => {
    async function fetchApplications() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/applications/my",
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
              "Failed to load applications."
          );
        }

        setApplications(result.data || []);
      } catch (error) {
        console.error(
          "Fetching applications error:",
          error.message
        );

        setError(
          error.message ||
            "Failed to load applications."
        );
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchApplications();
    } else {
      setApplications([]);
      setLoading(false);
    }
  }, [token]);

  // ==========================================
  // APPLICATION COUNTS
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
  // OPPORTUNITY FILTER OPTIONS
  // ==========================================

  const availableOpportunities = useMemo(() => {
    const opportunities = applications
      .map(
        (application) =>
          application.opportunityId
      )
      .filter(
        (opportunity) =>
          opportunity &&
          typeof opportunity === "object" &&
          opportunity._id
      );

    const uniqueOpportunities = [];

    const seenIds = new Set();

    opportunities.forEach(
      (opportunity) => {
        if (!seenIds.has(opportunity._id)) {
          seenIds.add(opportunity._id);
          uniqueOpportunities.push(
            opportunity
          );
        }
      }
    );

    return uniqueOpportunities.sort(
      (first, second) =>
        (first.title || "").localeCompare(
          second.title || ""
        )
    );
  }, [applications]);

  // ==========================================
  // FILTER + SORT APPLICATIONS
  // ==========================================

  const filteredApplications = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    const filtered = applications.filter(
      (application) => {
        const opportunity =
          application.opportunityId &&
          typeof application.opportunityId ===
            "object"
            ? application.opportunityId
            : null;

        const searchableText = [
          application.fullName,
          application.email,
          application.phone,
          application.coverLetter,
          application.status,
          opportunity?.title,
          opportunity?.company,
          opportunity?.category,
          opportunity?.location,
          opportunity?.type,
          opportunity?.mode,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const matchesSearch =
          !searchValue ||
          searchableText.includes(
            searchValue
          );

        const matchesStatus =
          statusFilter === "All" ||
          application.status === statusFilter;

        const matchesOpportunity =
          opportunityFilter === "All" ||
          opportunity?._id ===
            opportunityFilter;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesOpportunity
        );
      }
    );

    // ========================================
    // SORT
    // ========================================

    return [...filtered].sort(
      (first, second) => {
        if (sortBy === "newest") {
          return (
            new Date(
              second.createdAt || 0
            ) -
            new Date(
              first.createdAt || 0
            )
          );
        }

        if (sortBy === "oldest") {
          return (
            new Date(
              first.createdAt || 0
            ) -
            new Date(
              second.createdAt || 0
            )
          );
        }

        return 0;
      }
    );
  }, [
    applications,
    search,
    statusFilter,
    opportunityFilter,
    sortBy,
  ]);

  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  function clearFilters() {
    setSearch("");
    setStatusFilter("All");
    setOpportunityFilter("All");
    setSortBy("newest");
  }

  // ==========================================
  // CHECK FILTER STATE
  // ==========================================

  const hasActiveFilters =
    Boolean(search) ||
    statusFilter !== "All" ||
    opportunityFilter !== "All" ||
    sortBy !== "newest";

  // ==========================================
  // FORMAT DATE
  // ==========================================

  function formatDate(dateValue) {
    if (!dateValue) {
      return "Date unavailable";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return date.toLocaleDateString(
      "en-NG",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  }

  // ==========================================
  // GET STATUS MESSAGE
  // ==========================================

  function getStatusMessage(status) {
    if (status === "Accepted") {
      return "Application accepted";
    }

    if (status === "Rejected") {
      return "Application rejected";
    }

    return "Waiting for recruiter review";
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="applications-page">
        <div className="applications-container">

          <div className="applications-loading">
            <h2>
              Loading your applications...
            </h2>

            <p>
              Please wait while we retrieve
              your applications.
            </p>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="applications-page">
        <div className="applications-container">

          <div className="applications-error">

            <h2>
              Unable to load applications
            </h2>

            <p>
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
            >
              Try Again
            </button>

          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="applications-page">
      <div className="applications-container">

        {/* =====================================
            HEADER
        ====================================== */}

        <div className="applications-header">

          <div>
            <p className="page-label">
              MY APPLICATIONS
            </p>

            <h1>
              Track Your Applications
            </h1>

            <p>
              Keep track of the opportunities
              you've applied for and monitor
              their progress.
            </p>
          </div>

        </div>

        {/* =====================================
            SUMMARY
        ====================================== */}

        <div className="applications-summary">

          <div className="application-summary-card">
            <span>
              Total Applications
            </span>

            <strong>
              {totalApplications}
            </strong>
          </div>

          <div className="application-summary-card">
            <span>
              Pending
            </span>

            <strong>
              {pendingApplications}
            </strong>
          </div>

          <div className="application-summary-card">
            <span>
              Accepted
            </span>

            <strong>
              {acceptedApplications}
            </strong>
          </div>

          <div className="application-summary-card">
            <span>
              Rejected
            </span>

            <strong>
              {rejectedApplications}
            </strong>
          </div>

        </div>

        {/* =====================================
            SEARCH / FILTER / SORT
        ====================================== */}

        {applications.length > 0 && (
          <div className="applications-filters">

            {/* SEARCH */}

            <div className="application-filter-search">

              <label htmlFor="applicationSearch">
                Search Applications
              </label>

              <input
                id="applicationSearch"
                type="text"
                placeholder="Search by opportunity, company, email..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
              />

            </div>

            {/* STATUS */}

            <div>
              <label htmlFor="statusFilter">
                Filter by status
              </label>

              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
              >
                <option value="All">
                  All Applications
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
            </div>

            {/* OPPORTUNITY */}

            <div>
              <label htmlFor="opportunityFilter">
                Filter by opportunity
              </label>

              <select
                id="opportunityFilter"
                value={opportunityFilter}
                onChange={(event) =>
                  setOpportunityFilter(
                    event.target.value
                  )
                }
              >
                <option value="All">
                  All Opportunities
                </option>

                {availableOpportunities.map(
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
            </div>

            {/* SORT */}

            <div>
              <label htmlFor="applicationSort">
                Sort by
              </label>

              <select
                id="applicationSort"
                value={sortBy}
                onChange={(event) =>
                  setSortBy(
                    event.target.value
                  )
                }
              >
                <option value="newest">
                  Newest First
                </option>

                <option value="oldest">
                  Oldest First
                </option>
              </select>
            </div>

            {/* CLEAR */}

            {hasActiveFilters && (
              <button
                type="button"
                className="clear-application-filter-button"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            )}

          </div>
        )}

        {/* =====================================
            RESULT COUNT
        ====================================== */}

        {applications.length > 0 && (
          <div className="applications-result-info">

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
        )}

        {/* =====================================
            APPLICATION LIST
        ====================================== */}

        {applications.length > 0 ? (

          filteredApplications.length > 0 ? (

            <div className="applications-list">

              {filteredApplications.map(
                (application) => {

                  const opportunity =
                    application.opportunityId;

                  const status =
                    application.status ||
                    "Pending";

                  const submittedDate =
                    formatDate(
                      application.createdAt
                    );

                  const updatedDate =
                    formatDate(
                      application.updatedAt
                    );

                  return (
                    <article
                      key={application._id}
                      className="application-card"
                    >

                      {/* =================================
                          CARD HEADER
                      ================================== */}

                      <div className="application-card-header">

                        <div className="application-card-title">

                          <p className="application-label">
                            APPLICATION
                          </p>

                          <h2>
                            {opportunity?.title ||
                              "Opportunity unavailable"}
                          </h2>

                          <p className="application-company">
                            {opportunity?.company ||
                              "Company information unavailable"}
                          </p>

                        </div>

                        <span
                          className={`application-status status-${status.toLowerCase()}`}
                        >
                          {status}
                        </span>

                      </div>

                      {/* =================================
                          STATUS PROGRESS
                      ================================== */}

                      <div className="application-status-tracker">

                        <div
                          className={
                            "tracker-step active"
                          }
                        >
                          <span>
                            1
                          </span>

                          <p>
                            Submitted
                          </p>
                        </div>

                        <div
                          className={
                            status ===
                              "Accepted" ||
                            status ===
                              "Rejected"
                              ? "tracker-line active"
                              : "tracker-line"
                          }
                        />

                        <div
                          className={
                            status ===
                              "Accepted" ||
                            status ===
                              "Rejected"
                              ? "tracker-step active"
                              : "tracker-step"
                          }
                        >
                          <span>
                            2
                          </span>

                          <p>
                            Reviewed
                          </p>
                        </div>

                        <div
                          className={
                            status ===
                            "Accepted"
                              ? "tracker-line active"
                              : "tracker-line"
                          }
                        />

                        <div
                          className={
                            status ===
                            "Accepted"
                              ? "tracker-step accepted active"
                              : status ===
                                "Rejected"
                              ? "tracker-step rejected active"
                              : "tracker-step"
                          }
                        >
                          <span>
                            3
                          </span>

                          <p>
                            {status ===
                            "Rejected"
                              ? "Rejected"
                              : "Decision"}
                          </p>
                        </div>

                      </div>

                      {/* =================================
                          OPPORTUNITY DETAILS
                      ================================== */}

                      {opportunity && (
                        <div className="application-details">

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

                      {/* =================================
                          APPLICATION INFORMATION
                      ================================== */}

                      <div className="application-information">

                        <div className="application-info-grid">

                          <div>
                            <span>
                              Name
                            </span>

                            <strong>
                              {application.fullName ||
                                "Not provided"}
                            </strong>
                          </div>

                          <div>
                            <span>
                              Email
                            </span>

                            <strong>
                              {application.email ||
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
                              Submitted
                            </span>

                            <strong>
                              {submittedDate}
                            </strong>
                          </div>

                          <div>
                            <span>
                              Last Updated
                            </span>

                            <strong>
                              {updatedDate}
                            </strong>
                          </div>

                          <div>
                            <span>
                              Deadline
                            </span>

                            <strong>
                              {opportunity?.deadline ||
                                "Not available"}
                            </strong>
                          </div>

                        </div>

                        {/* =================================
                            COVER LETTER
                        ================================== */}

                        <div className="cover-letter-section">

                          <span>
                            Cover Letter
                          </span>

                          <p>
                            {application.coverLetter ||
                              "No cover letter provided."}
                          </p>

                        </div>

                      </div>

                      {/* =================================
                          CARD FOOTER
                      ================================== */}

                      <div className="application-card-footer">

                        {opportunity?._id ? (
                          <Link
                            to={`/opportunities/${opportunity._id}`}
                            className="application-view-link"
                          >
                            View Opportunity →
                          </Link>
                        ) : (
                          <span>
                            Opportunity unavailable
                          </span>
                        )}

                        <span className="application-footer-status">
                          {getStatusMessage(
                            status
                          )}
                        </span>

                      </div>

                    </article>
                  );
                }
              )}

            </div>

          ) : (

            /* =====================================
               NO FILTER RESULTS
            ====================================== */

            <div className="applications-empty">

              <div className="empty-icon">
                🔎
              </div>

              <h2>
                No matching applications
              </h2>

              <p>
                No applications match your current
                search or filters.
              </p>

              <button
                type="button"
                className="primary-button"
                onClick={clearFilters}
              >
                Clear Filters
              </button>

            </div>
          )

        ) : (

          /* =====================================
             NO APPLICATIONS
          ====================================== */

          <div className="applications-empty">

            <div className="empty-icon">
              📄
            </div>

            <h2>
              No applications yet
            </h2>

            <p>
              You haven't submitted any
              applications yet. Explore
              available opportunities and
              find your next opportunity.
            </p>

            <Link
              to="/opportunities"
              className="primary-button"
            >
              Explore Opportunities
            </Link>

          </div>
        )}

      </div>
    </div>
  );
}

export default Applications;