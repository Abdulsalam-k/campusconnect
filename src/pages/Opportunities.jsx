import { useMemo, useState } from "react";

import OpportunityCard from "../components/OpportunityCard";
import useFetch from "../hooks/useFetch";
import API_URL from "../config/api";

function Opportunities() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [type, setType] = useState("All");
  const [mode, setMode] = useState("All");

  const {
    data: response,
    loading,
    error,
  } = useFetch(
    `${API_URL}/api/opportunities`
  );

  const opportunities = response?.data || [];

  // DYNAMIC FILTER OPTIONS
  const categories = useMemo(() => {
    const values = opportunities
      .map((opportunity) => opportunity.category)
      .filter(Boolean);

    return [...new Set(values)].sort((a, b) =>
      a.localeCompare(b)
    );
  }, [opportunities]);

  const types = useMemo(() => {
    const values = opportunities
      .map((opportunity) => opportunity.type)
      .filter(Boolean);

    return [...new Set(values)].sort((a, b) =>
      a.localeCompare(b)
    );
  }, [opportunities]);

  const modes = useMemo(() => {
    const values = opportunities
      .map((opportunity) => opportunity.mode)
      .filter(Boolean);

    return [...new Set(values)].sort((a, b) =>
      a.localeCompare(b)
    );
  }, [opportunities]);

  // SEARCH + FILTER
  const filteredOpportunities = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    return opportunities.filter(
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

        const matchesCategory =
          category === "All" ||
          opportunity.category === category;

        const matchesType =
          type === "All" ||
          opportunity.type === type;

        const matchesMode =
          mode === "All" ||
          opportunity.mode === mode;

        return (
          matchesSearch &&
          matchesCategory &&
          matchesType &&
          matchesMode
        );
      }
    );
  }, [
    opportunities,
    search,
    category,
    type,
    mode,
  ]);

  // CLEAR ALL FILTERS
  function clearFilters() {
    setSearch("");
    setCategory("All");
    setType("All");
    setMode("All");
  }

  if (loading) {
    return (
      <div className="opportunities-page">
        <p>Loading opportunities...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="opportunities-page">
        <p className="empty-state">
          Failed to load opportunities.
        </p>
      </div>
    );
  }

  return (
    <div className="opportunities-page">

      {/* HEADER */}
      <div className="opportunities-header">
        <p className="page-label">
          CAMPUS OPPORTUNITIES
        </p>

        <h1>
          Find your next opportunity
        </h1>

        <p>
          Discover internships, jobs, projects and
          other opportunities designed to help you
          grow your career.
        </p>
      </div>

      {/* FILTER CONTROLS */}
      <div className="opportunities-controls">

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search by title, company, skill, location..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />

        {/* CATEGORY */}
        <select
          value={category}
          onChange={(event) =>
            setCategory(event.target.value)
          }
        >
          <option value="All">
            All Categories
          </option>

          {categories.map((value) => (
            <option
              value={value}
              key={value}
            >
              {value}
            </option>
          ))}
        </select>

        {/* TYPE */}
        <select
          value={type}
          onChange={(event) =>
            setType(event.target.value)
          }
        >
          <option value="All">
            All Types
          </option>

          {types.map((value) => (
            <option
              value={value}
              key={value}
            >
              {value}
            </option>
          ))}
        </select>

        {/* MODE */}
        <select
          value={mode}
          onChange={(event) =>
            setMode(event.target.value)
          }
        >
          <option value="All">
            All Modes
          </option>

          {modes.map((value) => (
            <option
              value={value}
              key={value}
            >
              {value}
            </option>
          ))}
        </select>

      </div>

      {/* RESULT INFORMATION */}
      <div className="opportunities-result-info">
        <p>
          Showing{" "}
          <strong>
            {filteredOpportunities.length}
          </strong>{" "}
          {filteredOpportunities.length === 1
            ? "opportunity"
            : "opportunities"}
        </p>

        {(search ||
          category !== "All" ||
          type !== "All" ||
          mode !== "All") && (
          <button
            type="button"
            onClick={clearFilters}
            className="clear-filters-button"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* OPPORTUNITY GRID */}
      <div className="opportunity-grid">
        {filteredOpportunities.length > 0 ? (
          filteredOpportunities.map(
            (opportunity) => (
              <OpportunityCard
                key={
                  opportunity._id ||
                  opportunity.id
                }
                opportunity={opportunity}
              />
            )
          )
        ) : (
          <div className="empty-state">
            <p>
              No opportunities found.
            </p>

            {(search ||
              category !== "All" ||
              type !== "All" ||
              mode !== "All") && (
              <button
                type="button"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

    </div>
  );
}

export default Opportunities;