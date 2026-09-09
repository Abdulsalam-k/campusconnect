import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import API_URL from "../config/api";

function SavedOpportunities() {
  const { token } = useAuth();

  const [savedOpportunities, setSavedOpportunities] =
    useState([]);

  const [search, setSearch] = useState("");

  const [typeFilter, setTypeFilter] =
    useState("All");

  const [modeFilter, setModeFilter] =
    useState("All");

  // ==========================================
  // SORTING
  // ==========================================

  const [sortBy, setSortBy] =
    useState("newest");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [removingId, setRemovingId] =
    useState(null);

  // ==========================================
  // FETCH SAVED OPPORTUNITIES
  // ==========================================

  useEffect(() => {
    async function fetchSavedOpportunities() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/saved-opportunities`,
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
              "Failed to fetch saved opportunities."
          );
        }

        setSavedOpportunities(
          result.data || []
        );
      } catch (error) {
        console.error(
          "Fetching saved opportunities failed:",
          error.message
        );

        setError(
          error.message ||
            "Failed to fetch saved opportunities."
        );
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchSavedOpportunities();
    } else {
      setSavedOpportunities([]);
      setLoading(false);
    }
  }, [token]);

  // ==========================================
  // DYNAMIC FILTER OPTIONS
  // ==========================================

  const availableTypes = useMemo(() => {
    const values = savedOpportunities
      .map(
        (opportunity) =>
          opportunity.type
      )
      .filter(Boolean);

    return [...new Set(values)].sort(
      (a, b) => a.localeCompare(b)
    );
  }, [savedOpportunities]);

  const availableModes = useMemo(() => {
    const values = savedOpportunities
      .map(
        (opportunity) =>
          opportunity.mode
      )
      .filter(Boolean);

    return [...new Set(values)].sort(
      (a, b) => a.localeCompare(b)
    );
  }, [savedOpportunities]);

  // ==========================================
  // FILTER + SORT
  // ==========================================

  const filteredOpportunities = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    const filtered =
      savedOpportunities.filter(
        (opportunity) => {
          const skills = Array.isArray(
            opportunity.skills
          )
            ? opportunity.skills
            : [];

          const searchableText = [
            opportunity.title,
            opportunity.company,
            opportunity.category,
            opportunity.location,
            opportunity.mode,
            opportunity.type,
            opportunity.description,
            ...skills,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          const matchesSearch =
            !searchValue ||
            searchableText.includes(
              searchValue
            );

          const matchesType =
            typeFilter === "All" ||
            opportunity.type === typeFilter;

          const matchesMode =
            modeFilter === "All" ||
            opportunity.mode === modeFilter;

          return (
            matchesSearch &&
            matchesType &&
            matchesMode
          );
        }
      );

    // ========================================
    // SORT RESULTS
    // ========================================

    return [...filtered].sort(
      (first, second) => {
        // Newest saved / created first
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

        // Oldest saved / created first
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

        // Closest deadline first
        if (sortBy === "deadline-closest") {
          return (
            new Date(
              first.deadline || "9999-12-31"
            ) -
            new Date(
              second.deadline || "9999-12-31"
            )
          );
        }

        // Furthest deadline first
        if (sortBy === "deadline-furthest") {
          return (
            new Date(
              second.deadline || "0001-01-01"
            ) -
            new Date(
              first.deadline || "0001-01-01"
            )
          );
        }

        return 0;
      }
    );
  }, [
    savedOpportunities,
    search,
    typeFilter,
    modeFilter,
    sortBy,
  ]);

  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  function clearFilters() {
    setSearch("");
    setTypeFilter("All");
    setModeFilter("All");
    setSortBy("newest");
  }

  // ==========================================
  // REMOVE SAVED OPPORTUNITY
  // ==========================================

  async function handleRemove(opportunityId) {
    try {
      setRemovingId(opportunityId);
      setError("");

      const response = await fetch(
        `${API_URL}/api/saved-opportunities/${opportunityId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to remove opportunity."
        );
      }

      setSavedOpportunities(
        (current) =>
          current.filter(
            (opportunity) =>
              opportunity._id !==
              opportunityId
          )
      );
    } catch (error) {
      console.error(
        "Removing saved opportunity failed:",
        error.message
      );

      setError(
        error.message ||
          "Failed to remove opportunity."
      );
    } finally {
      setRemovingId(null);
    }
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="saved-opportunities-page">
        <div className="saved-opportunities-container">

          <div className="saved-loading">
            <p className="page-label">
              SAVED OPPORTUNITIES
            </p>

            <h1>
              Saved Opportunities
            </h1>

            <p>
              Loading your saved opportunities...
            </p>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (
    error &&
    savedOpportunities.length === 0
  ) {
    return (
      <div className="saved-opportunities-page">
        <div className="saved-opportunities-container">

          <div className="saved-error">

            <p className="page-label">
              SAVED OPPORTUNITIES
            </p>

            <h1>
              Unable to load saved opportunities
            </h1>

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
    <div className="saved-opportunities-page">
      <div className="saved-opportunities-container">

        {/* =====================================
            HEADER
        ====================================== */}

        <div className="saved-opportunities-header">

          <div>
            <p className="page-label">
              SAVED OPPORTUNITIES
            </p>

            <h1>
              Saved Opportunities
            </h1>

            <p>
              Keep track of opportunities you
              want to explore later.
            </p>
          </div>

          <div className="saved-count-card">

            <strong>
              {savedOpportunities.length}
            </strong>

            <span>
              Saved
            </span>

          </div>

        </div>

        {/* =====================================
            ERROR
        ====================================== */}

        {error && (
          <div className="saved-inline-error">
            {error}
          </div>
        )}

        {/* =====================================
            FILTERS + SORT
        ====================================== */}

        {savedOpportunities.length > 0 && (
          <div className="saved-opportunities-toolbar">

            {/* SEARCH */}

            <input
              type="text"
              placeholder="Search saved opportunities..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />

            {/* TYPE */}

            <select
              value={typeFilter}
              onChange={(event) =>
                setTypeFilter(
                  event.target.value
                )
              }
            >
              <option value="All">
                All Types
              </option>

              {availableTypes.map(
                (type) => (
                  <option
                    key={type}
                    value={type}
                  >
                    {type}
                  </option>
                )
              )}

            </select>

            {/* MODE */}

            <select
              value={modeFilter}
              onChange={(event) =>
                setModeFilter(
                  event.target.value
                )
              }
            >
              <option value="All">
                All Modes
              </option>

              {availableModes.map(
                (mode) => (
                  <option
                    key={mode}
                    value={mode}
                  >
                    {mode}
                  </option>
                )
              )}

            </select>

            {/* SORT */}

            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(
                  event.target.value
                )
              }
            >
              <option value="newest">
                Newest Saved
              </option>

              <option value="oldest">
                Oldest Saved
              </option>

              <option value="deadline-closest">
                Closest Deadline
              </option>

              <option value="deadline-furthest">
                Furthest Deadline
              </option>
            </select>

          </div>
        )}

        {/* =====================================
            RESULTS
        ====================================== */}

        {savedOpportunities.length > 0 && (
          <div className="saved-results-bar">

            <p>
              Showing{" "}
              <strong>
                {filteredOpportunities.length}
              </strong>{" "}
              {filteredOpportunities.length ===
              1
                ? "opportunity"
                : "opportunities"}
            </p>

            {(search ||
              typeFilter !== "All" ||
              modeFilter !== "All" ||
              sortBy !== "newest") && (
              <button
                type="button"
                className="saved-clear-filters"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            )}

          </div>
        )}

        {/* =====================================
            EMPTY STATE
        ====================================== */}

        {savedOpportunities.length === 0 ? (
          <div className="saved-opportunities-empty">

            <div className="saved-empty-icon">
              ♡
            </div>

            <h2>
              No saved opportunities yet
            </h2>

            <p>
              When you find an opportunity
              you'd like to come back to, save
              it and it will appear here.
            </p>

            <Link
              to="/opportunities"
              className="primary-button"
            >
              Browse Opportunities
            </Link>

          </div>
        ) : filteredOpportunities.length ===
          0 ? (
          <div className="saved-opportunities-empty">

            <div className="saved-empty-icon">
              🔎
            </div>

            <h2>
              No matching opportunities
            </h2>

            <p>
              No saved opportunities match your
              current search or filters.
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={clearFilters}
            >
              Clear Filters
            </button>

          </div>
        ) : (

          /* ===================================
             SAVED OPPORTUNITY GRID
          ==================================== */

          <div className="saved-opportunities-grid">

            {filteredOpportunities.map(
              (opportunity) => {

                const skills = Array.isArray(
                  opportunity.skills
                )
                  ? opportunity.skills
                  : [];

                return (
                  <article
                    className="saved-opportunity-card"
                    key={opportunity._id}
                  >

                    {/* CARD TOP */}

                    <div className="saved-card-top">

                      <div className="saved-company-logo">
                        {opportunity.company
                          ? opportunity.company
                              .charAt(0)
                              .toUpperCase()
                          : "C"}
                      </div>

                      <span className="opportunity-type">
                        {opportunity.type}
                      </span>

                    </div>

                    {/* CATEGORY */}

                    <p className="page-label">
                      {opportunity.category ||
                        "OPPORTUNITY"}
                    </p>

                    {/* TITLE */}

                    <h2>
                      {opportunity.title ||
                        "Untitled Opportunity"}
                    </h2>

                    {/* COMPANY */}

                    <h3>
                      {opportunity.company ||
                        "Company unavailable"}
                    </h3>

                    {/* DESCRIPTION */}

                    <p className="saved-opportunity-description">
                      {opportunity.description ||
                        "No description available."}
                    </p>

                    {/* META */}

                    <div className="saved-opportunity-meta">

                      {opportunity.location && (
                        <span>
                          📍{" "}
                          {opportunity.location}
                        </span>
                      )}

                      {opportunity.mode && (
                        <span>
                          🌐{" "}
                          {opportunity.mode}
                        </span>
                      )}

                      {opportunity.deadline && (
                        <span>
                          📅{" "}
                          {opportunity.deadline}
                        </span>
                      )}

                    </div>

                    {/* SKILLS */}

                    {skills.length > 0 && (
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
                    )}

                    {/* ACTIONS */}

                    <div className="saved-opportunity-actions">

                      <Link
                        to={`/opportunities/${opportunity._id}`}
                        className="saved-view-button"
                      >
                        View Details
                      </Link>

                      <button
                        type="button"
                        className="saved-remove-button"
                        disabled={
                          removingId ===
                          opportunity._id
                        }
                        onClick={() =>
                          handleRemove(
                            opportunity._id
                          )
                        }
                      >
                        {removingId ===
                        opportunity._id
                          ? "Removing..."
                          : "♥ Remove"}
                      </button>

                    </div>

                  </article>
                );
              }
            )}

          </div>
        )}

      </div>
    </div>
  );
}

export default SavedOpportunities;