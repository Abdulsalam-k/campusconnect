import { Link } from "react-router-dom";

function OpportunityCard({ opportunity }) {
  return (
    <article className="opportunity-card">
      <div className="opportunity-top">
        <div className="company-logo">
          {opportunity.company.charAt(0)}
        </div>

        <span className="opportunity-type">
          {opportunity.type}
        </span>
      </div>

      <div className="opportunity-content">
        <p className="opportunity-company">
          {opportunity.company}
        </p>

        <h2>{opportunity.title}</h2>

        <p className="opportunity-description">
          {opportunity.description}
        </p>

        <div className="opportunity-meta">
          <span>📍 {opportunity.location}</span>
          <span>💼 {opportunity.mode}</span>
        </div>

        <div className="skills">
          {opportunity.skills.map((skill) => (
            <span className="skill-tag" key={skill}>
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="opportunity-footer">
        <span>
          Deadline: {opportunity.deadline}
        </span>

        <Link
          to={`/opportunities/${opportunity._id}`}
          className="view-opportunity-button"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}

export default OpportunityCard;