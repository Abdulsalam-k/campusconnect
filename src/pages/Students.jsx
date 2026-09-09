import { useMemo, useState } from "react";

import TalentCard from "../components/TalentCard";
import useFetch from "../hooks/useFetch";
import API_URL from "../config/api";

function Students() {
  const [search, setSearch] = useState("");
  const [skillFilter, setSkillFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] =
    useState("All");
  const [locationFilter, setLocationFilter] =
    useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const studentsPerPage = 8;

  const {
    data: response,
    loading,
    error,
  } = useFetch(`${API_URL}/api/students`);

  const talents = response?.data || [];

  // ==========================================
  // AVAILABLE FILTER OPTIONS
  // ==========================================

  const availableSkills = useMemo(() => {
    const skillSet = new Set();

    talents.forEach((talent) => {
      if (Array.isArray(talent.skills)) {
        talent.skills.forEach((skill) => {
          const cleanedSkill = skill?.trim();

          if (cleanedSkill) {
            skillSet.add(cleanedSkill);
          }
        });
      }
    });

    return Array.from(skillSet).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [talents]);

  const availableDepartments = useMemo(() => {
    const values = talents
      .map((talent) => talent.department?.trim())
      .filter(Boolean);

    return [...new Set(values)].sort((a, b) =>
      a.localeCompare(b)
    );
  }, [talents]);

  const availableLocations = useMemo(() => {
    const values = talents
      .map((talent) => talent.location?.trim())
      .filter(Boolean);

    return [...new Set(values)].sort((a, b) =>
      a.localeCompare(b)
    );
  }, [talents]);

  // ==========================================
  // FILTER + SORT
  // ==========================================

  const filteredTalents = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    const filtered = talents.filter((talent) => {
      const skills = Array.isArray(talent.skills)
        ? talent.skills
        : [];

      const searchableText = [
        talent.name,
        talent.department,
        talent.education,
        talent.location,
        talent.bio,
        ...skills,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !searchValue ||
        searchableText.includes(searchValue);

      const matchesSkill =
        skillFilter === "All" ||
        skills.some(
          (skill) =>
            skill.toLowerCase() ===
            skillFilter.toLowerCase()
        );

      const matchesDepartment =
        departmentFilter === "All" ||
        talent.department === departmentFilter;

      const matchesLocation =
        locationFilter === "All" ||
        talent.location === locationFilter;

      return (
        matchesSearch &&
        matchesSkill &&
        matchesDepartment &&
        matchesLocation
      );
    });

    return [...filtered].sort(
      (first, second) => {
        if (sortBy === "name-asc") {
          return (first.name || "").localeCompare(
            second.name || ""
          );
        }

        if (sortBy === "name-desc") {
          return (second.name || "").localeCompare(
            first.name || ""
          );
        }

        if (sortBy === "oldest") {
          return (
            new Date(first.createdAt || 0) -
            new Date(second.createdAt || 0)
          );
        }

        return (
          new Date(second.createdAt || 0) -
          new Date(first.createdAt || 0)
        );
      }
    );
  }, [
    talents,
    search,
    skillFilter,
    departmentFilter,
    locationFilter,
    sortBy,
  ]);

  // ==========================================
  // PAGINATION
  // ==========================================

  const totalPages = Math.ceil(
    filteredTalents.length / studentsPerPage
  );

  const safeCurrentPage =
    totalPages > 0
      ? Math.min(currentPage, totalPages)
      : 1;

  const startIndex =
    (safeCurrentPage - 1) *
    studentsPerPage;

  const currentTalents = filteredTalents.slice(
    startIndex,
    startIndex + studentsPerPage
  );

  const displayStart =
    filteredTalents.length > 0
      ? startIndex + 1
      : 0;

  const displayEnd = Math.min(
    startIndex + studentsPerPage,
    filteredTalents.length
  );

  // ==========================================
  // FILTER HELPERS
  // ==========================================

  function updateSearch(value) {
    setSearch(value);
    setCurrentPage(1);
  }

  function updateSkillFilter(value) {
    setSkillFilter(value);
    setCurrentPage(1);
  }

  function updateDepartmentFilter(value) {
    setDepartmentFilter(value);
    setCurrentPage(1);
  }

  function updateLocationFilter(value) {
    setLocationFilter(value);
    setCurrentPage(1);
  }

  function updateSort(value) {
    setSortBy(value);
    setCurrentPage(1);
  }

  function clearFilters() {
    setSearch("");
    setSkillFilter("All");
    setDepartmentFilter("All");
    setLocationFilter("All");
    setSortBy("newest");
    setCurrentPage(1);
  }

  const hasActiveFilters =
    Boolean(search) ||
    skillFilter !== "All" ||
    departmentFilter !== "All" ||
    locationFilter !== "All" ||
    sortBy !== "newest";

  // ==========================================
  // PAGINATION BUTTONS
  // ==========================================

  function goToPage(page) {
    if (
      page < 1 ||
      page > totalPages ||
      page === safeCurrentPage
    ) {
      return;
    }

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function getPageNumbers() {
    if (totalPages <= 5) {
      return Array.from(
        { length: totalPages },
        (_, index) => index + 1
      );
    }

    if (safeCurrentPage <= 3) {
      return [1, 2, 3, 4, "...", totalPages];
    }

    if (safeCurrentPage >= totalPages - 2) {
      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      safeCurrentPage - 1,
      safeCurrentPage,
      safeCurrentPage + 1,
      "...",
      totalPages,
    ];
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="students-page">
        <div className="students-directory-container">
          <div className="students-loading-header">
            <div className="students-skeleton-line students-skeleton-small"></div>
            <div className="students-skeleton-line students-skeleton-title"></div>
            <div className="students-skeleton-line students-skeleton-description"></div>
          </div>

          <div className="students-loading-grid">
            {Array.from(
              { length: 6 },
              (_, index) => (
                <div
                  className="students-loading-card"
                  key={index}
                >
                  <div className="students-loading-avatar"></div>

                  <div className="students-loading-content">
                    <div className="students-skeleton-line"></div>
                    <div className="students-skeleton-line"></div>
                    <div className="students-skeleton-line students-skeleton-short"></div>
                  </div>
                </div>
              )
            )}
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
      <div className="students-page">
        <div className="students-directory-container">
          <div className="students-error-state">
            <div className="students-state-icon">
              !
            </div>

            <p className="page-label">
              CAMPUS TALENT
            </p>

            <h1>
              Unable to load students
            </h1>

            <p>
              We couldn't retrieve the student
              directory right now. Please try again.
            </p>

            <button
              type="button"
              className="students-retry-button"
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
    <div className="students-page">
      <div className="students-directory-container">

        {/* ======================================
            HEADER
        ======================================= */}

        <header className="students-header">
          <div className="students-header-content">
            <p className="page-label">
              CAMPUS TALENT
            </p>

            <h1>
              Discover talented students.
            </h1>

            <p className="students-header-description">
              Explore students by their skills,
              education, department and location.
              Find the right people to connect,
              collaborate and build with.
            </p>

            <div className="students-header-highlight">
              <span className="students-header-highlight-icon">
                ✦
              </span>

              <span>
                Discover the people behind the talent.
              </span>
            </div>
          </div>

          <div className="students-header-stat">
            <strong>
              {talents.length}
            </strong>

            <span>
              {talents.length === 1
                ? "Student"
                : "Students"}
              <br />
              in the directory
            </span>
          </div>
        </header>

        {/* ======================================
            FILTER PANEL
        ======================================= */}

        <section className="students-filter-panel">

          <div className="students-filter-heading">
            <div>
              <h2>
                Find your match
              </h2>

              <p>
                Search and filter the directory
                by what matters to you.
              </p>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                className="students-clear-button"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            )}
          </div>

          <div className="students-filter-grid">

            <div className="students-filter-field students-search-field">
              <label htmlFor="studentSearch">
                Search
              </label>

              <input
                id="studentSearch"
                type="text"
                placeholder="Name, skill, department..."
                value={search}
                onChange={(event) =>
                  updateSearch(event.target.value)
                }
              />
            </div>

            <div className="students-filter-field">
              <label htmlFor="studentSkill">
                Skill
              </label>

              <select
                id="studentSkill"
                value={skillFilter}
                onChange={(event) =>
                  updateSkillFilter(
                    event.target.value
                  )
                }
              >
                <option value="All">
                  All Skills
                </option>

                {availableSkills.map((skill) => (
                  <option
                    value={skill}
                    key={skill}
                  >
                    {skill}
                  </option>
                ))}
              </select>
            </div>

            <div className="students-filter-field">
              <label htmlFor="studentDepartment">
                Department
              </label>

              <select
                id="studentDepartment"
                value={departmentFilter}
                onChange={(event) =>
                  updateDepartmentFilter(
                    event.target.value
                  )
                }
              >
                <option value="All">
                  All Departments
                </option>

                {availableDepartments.map(
                  (department) => (
                    <option
                      value={department}
                      key={department}
                    >
                      {department}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="students-filter-field">
              <label htmlFor="studentLocation">
                Location
              </label>

              <select
                id="studentLocation"
                value={locationFilter}
                onChange={(event) =>
                  updateLocationFilter(
                    event.target.value
                  )
                }
              >
                <option value="All">
                  All Locations
                </option>

                {availableLocations.map(
                  (location) => (
                    <option
                      value={location}
                      key={location}
                    >
                      {location}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="students-filter-field">
              <label htmlFor="studentSort">
                Sort by
              </label>

              <select
                id="studentSort"
                value={sortBy}
                onChange={(event) =>
                  updateSort(event.target.value)
                }
              >
                <option value="newest">
                  Recently Joined
                </option>

                <option value="oldest">
                  Oldest Joined
                </option>

                <option value="name-asc">
                  Name A–Z
                </option>

                <option value="name-desc">
                  Name Z–A
                </option>
              </select>
            </div>

          </div>
        </section>

        {/* ======================================
            RESULT INFORMATION
        ======================================= */}

        <div className="students-results-bar">
          <div>
            <strong>
              {filteredTalents.length}
            </strong>{" "}
            {filteredTalents.length === 1
              ? "student"
              : "students"}{" "}
            found
          </div>

          {filteredTalents.length > 0 && (
            <span>
              Showing {displayStart}–{displayEnd}
            </span>
          )}
        </div>

        {/* ======================================
            STUDENT GRID
        ======================================= */}

        {filteredTalents.length > 0 ? (
          <>
            <div className="talent-grid students-enhanced-grid">
              {currentTalents.map((talent) => (
                <TalentCard
                  key={talent.id || talent._id}
                  talent={talent}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="students-pagination">
                <button
                  type="button"
                  className="students-pagination-button"
                  onClick={() =>
                    goToPage(safeCurrentPage - 1)
                  }
                  disabled={safeCurrentPage === 1}
                >
                  ← Previous
                </button>

                <div className="students-page-numbers">
                  {getPageNumbers().map(
                    (page, index) =>
                      page === "..." ? (
                        <span
                          className="students-pagination-dots"
                          key={`dots-${index}`}
                        >
                          ...
                        </span>
                      ) : (
                        <button
                          type="button"
                          key={page}
                          className={`students-page-number ${
                            page === safeCurrentPage
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            goToPage(page)
                          }
                        >
                          {page}
                        </button>
                      )
                  )}
                </div>

                <button
                  type="button"
                  className="students-pagination-button"
                  onClick={() =>
                    goToPage(safeCurrentPage + 1)
                  }
                  disabled={
                    safeCurrentPage === totalPages
                  }
                >
                  Next →
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="students-empty-state">
            <div className="students-state-icon">
              🔎
            </div>

            <p className="page-label">
              NO MATCHES
            </p>

            <h2>
              We couldn't find any students.
            </h2>

            <p>
              Try changing your search or filters
              to discover more people.
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                className="students-retry-button"
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

export default Students;