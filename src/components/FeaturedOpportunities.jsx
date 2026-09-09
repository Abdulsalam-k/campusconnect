import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function FeaturedOpportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchFeaturedOpportunities() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/opportunities"
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to fetch opportunities."
          );
        }

        const data = result.data || [];

        const sortedOpportunities = [...data]
          .sort(
            (first, second) =>
              new Date(second.createdAt || 0) -
              new Date(first.createdAt || 0)
          )
          .slice(0, 3);

        setOpportunities(sortedOpportunities);
      } catch (error) {
        console.error(
          "Fetching featured opportunities failed:",
          error.message
        );

        setError(
          error.message ||
            "Failed to load featured opportunities."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedOpportunities();
  }, []);

  function formatDeadline(deadline) {
    if (!deadline) {
      return "Deadline unavailable";
    }

    const date = new Date(deadline);

    if (Number.isNaN(date.getTime())) {
      return deadline;
    }

    return date.toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function getOpportunityTypeClass(type) {
    return type
      ?.toLowerCase()
      .replace(/\s+/g, "-") || "";
  }

  return (
    <section className="featured-opportunities">
      <div className="featured-opportunities-container">

        <div className="featured-opportunities-heading">
          <div>
            <p>EXPLORE OPPORTUNITIES</p>

            <h2>
              Find your next
              <span> opportunity.</span>
            </h2>
          </div>

          <div className="featured-opportunities-heading-action">
            <p>
              Discover internships, jobs and projects
              designed to help you take your next step.
            </p>

            <Link
              to="/opportunities"
              className="featured-opportunities-view-all"
            >
              View all opportunities →
            </Link>
          </div>
        </div>

        {loading && (
          <div className="featured-opportunities-loading">
            <div className="featured-loading-card"></div>
            <div className="featured-loading-card"></div>
            <div className="featured-loading-card"></div>
          </div>
        )}

        {!loading && error && (
          <div className="featured-opportunities-error">
            <strong>
              Unable to load opportunities
            </strong>

            <p>{error}</p>
          </div>
        )}

        {!loading &&
          !error &&
          opportunities.length === 0 && (
            <div className="featured-opportunities-empty">
              <div className="featured-empty-icon">
                ✦
              </div>

              <h3>
                No opportunities available yet
              </h3>

              <p>
                New opportunities will appear here
                as they are added to CampusConnect.
              </p>

              <Link
                to="/opportunities"
                className="primary-button"
              >
                Browse Opportunities
              </Link>
            </div>
          )}

        {!loading &&
          !error &&
          opportunities.length > 0 && (
            <div className="featured-opportunities-grid">
              {opportunities.map((opportunity) => (
                <article
                  className="featured-opportunity-card"
                  key={opportunity._id}
                >
                  <div className="featured-opportunity-top">
                    <span
                      className={`featured-opportunity-type ${getOpportunityTypeClass(
                        opportunity.type
                      )}`}
                    >
                      {opportunity.type}
                    </span>

                    <span className="featured-opportunity-arrow">
                      →
                    </span>
                  </div>

                  <h3>
                    {opportunity.title}
                  </h3>

                  <p className="featured-opportunity-company">
                    {opportunity.company}
                  </p>

                  <p className="featured-opportunity-description">
                    {opportunity.description}
                  </p>

                  <div className="featured-opportunity-meta">
                    <span>
                      📍 {opportunity.location}
                    </span>

                    <span>
                      ◉ {opportunity.mode}
                    </span>
                  </div>

                  {opportunity.skills?.length > 0 && (
                    <div className="featured-opportunity-skills">
                      {opportunity.skills
                        .slice(0, 4)
                        .map((skill) => (
                          <span
                            key={skill}
                          >
                            {skill}
                          </span>
                        ))}
                    </div>
                  )}

                  <div className="featured-opportunity-footer">
                    <div>
                      <small>
                        Application deadline
                      </small>

                      <strong>
                        {formatDeadline(
                          opportunity.deadline
                        )}
                      </strong>
                    </div>

                    <Link
                      to={`/opportunities/${opportunity._id}`}
                      className="featured-opportunity-link"
                    >
                      View opportunity
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
      </div>
    </section>
  );
}

export default FeaturedOpportunities;