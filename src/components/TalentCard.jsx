import { Link } from "react-router-dom";

function TalentCard({ talent }) {
  const skills = Array.isArray(talent.skills)
    ? talent.skills.filter(Boolean)
    : [];

  const studentId = talent.id || talent._id;

  const initials = talent.name
    ? talent.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase()
    : "U";

  const visibleSkills = skills.slice(0, 4);
  const remainingSkills =
    skills.length - visibleSkills.length;

  return (
    <article className="talent-card">

      {/* TOP */}
      <div className="talent-card-top">
        <div className="talent-avatar-wrapper">
          {talent.profileImage ? (
            <img
              src={talent.profileImage}
              alt={talent.name || "Student"}
              className="talent-avatar-image"
            />
          ) : (
            <div className="talent-avatar">
              {initials}
            </div>
          )}
        </div>

        <span className="talent-status">
          Student
        </span>
      </div>

      {/* INFORMATION */}
      <div className="talent-info">

        <h3>
          {talent.name || "Unnamed Student"}
        </h3>

        {talent.department && (
          <p className="talent-role">
            {talent.department}
          </p>
        )}

        <div className="talent-meta">
          {talent.education && (
            <span>
              🎓 {talent.education}
            </span>
          )}

          {talent.location && (
            <span>
              📍 {talent.location}
            </span>
          )}
        </div>

        {talent.bio && (
          <p className="talent-bio">
            {talent.bio}
          </p>
        )}

        {/* SKILLS */}
        {skills.length > 0 && (
          <div className="skills">
            {visibleSkills.map(
              (skill, index) => (
                <span
                  className="skill-tag"
                  key={`${skill}-${index}`}
                >
                  {skill}
                </span>
              )
            )}

            {remainingSkills > 0 && (
              <span className="skill-tag skill-tag-more">
                +{remainingSkills} more
              </span>
            )}
          </div>
        )}

      </div>

      {/* FOOTER */}
      <div className="talent-card-footer">
        <Link
          to={`/students/${studentId}`}
          className="view-profile-button"
        >
          View Profile
          <span>→</span>
        </Link>
      </div>

    </article>
  );
}

export default TalentCard;