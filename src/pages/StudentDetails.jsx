import { Link, useParams } from "react-router-dom";

import useFetch from "../hooks/useFetch";

function StudentDetails() {
  const { id } = useParams();

  const {
    data: response,
    loading,
    error,
  } = useFetch(
    `http://localhost:5000/api/students/${id}`
  );

  const student = response?.data;

  if (loading) {
    return (
      <div className="student-details-page">
        <div className="student-details-container">
          <div className="student-details-skeleton">
            <div className="student-details-skeleton-back"></div>

            <div className="student-details-skeleton-hero">
              <div className="student-details-skeleton-avatar"></div>

              <div className="student-details-skeleton-content">
                <div className="student-details-skeleton-line short"></div>
                <div className="student-details-skeleton-line title"></div>
                <div className="student-details-skeleton-line"></div>
                <div className="student-details-skeleton-line"></div>
              </div>
            </div>

            <div className="student-details-skeleton-grid">
              <div className="student-details-skeleton-box"></div>
              <div className="student-details-skeleton-box"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="student-details-page">
        <div className="student-details-container">
          <div className="student-details-not-found">
            <div className="student-details-state-icon">
              !
            </div>

            <p className="page-label">
              STUDENT PROFILE
            </p>

            <h1>
              Student not found
            </h1>

            <p>
              We couldn't find the student you're
              looking for. The profile may have been
              removed or the link may be incorrect.
            </p>

            <Link
              to="/students"
              className="student-details-back-button"
            >
              ← Back to Students
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const skills = Array.isArray(student.skills)
    ? student.skills.filter(Boolean)
    : [];

  const initials = student.name
    ? student.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="student-details-page">
      <div className="student-details-container">

        {/* BACK */}
        <Link
          to="/students"
          className="student-details-back-link"
        >
          ← Back to Students
        </Link>

        {/* ======================================
            PROFILE HERO
        ======================================= */}

        <section className="student-profile-hero">
          <div className="student-profile-hero-main">

            {student.profileImage ? (
              <img
                src={student.profileImage}
                alt={student.name || "Student"}
                className="student-profile-avatar-image"
              />
            ) : (
              <div className="student-profile-avatar">
                {initials}
              </div>
            )}

            <div className="student-profile-identity">
              <div className="student-profile-label-row">
                <p className="page-label">
                  STUDENT PROFILE
                </p>

                <span className="student-profile-status">
                  Student
                </span>
              </div>

              <h1>
                {student.name || "Unnamed Student"}
              </h1>

              {student.department && (
                <p className="student-profile-department">
                  {student.department}
                </p>
              )}

              <div className="student-profile-quick-info">
                {student.location && (
                  <span>
                    📍 {student.location}
                  </span>
                )}

                {student.education && (
                  <span>
                    🎓 {student.education}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="student-profile-hero-side">
            <div className="student-profile-hero-icon">
              ✦
            </div>

            <strong>
              Campus talent
            </strong>

            <span>
              Discover, connect and collaborate.
            </span>
          </div>
        </section>

        {/* ======================================
            PROFILE CONTENT
        ======================================= */}

        <section className="student-profile-content">

          {/* LEFT COLUMN */}

          <div className="student-profile-main-column">

            {/* ABOUT */}

            <article className="student-profile-section">
              <div className="student-profile-section-heading">
                <div>
                  <p>
                    ABOUT
                  </p>

                  <h2>
                    Get to know this student.
                  </h2>
                </div>
              </div>

              <p className="student-full-bio">
                {student.bio ||
                  "This student has not added a biography yet."}
              </p>
            </article>

            {/* SKILLS */}

            <article className="student-profile-section">
              <div className="student-profile-section-heading">
                <div>
                  <p>
                    EXPERTISE
                  </p>

                  <h2>
                    Skills & capabilities
                  </h2>
                </div>

                <span className="student-profile-count">
                  {skills.length}{" "}
                  {skills.length === 1
                    ? "skill"
                    : "skills"}
                </span>
              </div>

              {skills.length > 0 ? (
                <div className="student-profile-skills">
                  {skills.map((skill, index) => (
                    <span
                      className="student-profile-skill"
                      key={`${skill}-${index}`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="student-profile-empty">
                  No skills have been added yet.
                </div>
              )}
            </article>

          </div>

          {/* RIGHT COLUMN */}

          <aside className="student-profile-sidebar">

            {/* PROFILE INFO */}

            <article className="student-profile-section student-profile-info-card">
              <div className="student-profile-section-heading">
                <div>
                  <p>
                    PROFILE DETAILS
                  </p>

                  <h2>
                    Background
                  </h2>
                </div>
              </div>

              <div className="student-profile-info-list">

                {student.education && (
                  <div className="student-profile-info-item">
                    <span>Education</span>
                    <strong>
                      {student.education}
                    </strong>
                  </div>
                )}

                {student.department && (
                  <div className="student-profile-info-item">
                    <span>Department</span>
                    <strong>
                      {student.department}
                    </strong>
                  </div>
                )}

                {student.location && (
                  <div className="student-profile-info-item">
                    <span>Location</span>
                    <strong>
                      {student.location}
                    </strong>
                  </div>
                )}

              </div>
            </article>

            {/* CONTACT */}

            <article className="student-profile-section student-profile-contact-card">
              <div className="student-profile-section-heading">
                <div>
                  <p>
                    CONNECT
                  </p>

                  <h2>
                    Contact
                  </h2>
                </div>
              </div>

              <div className="student-profile-contact">

                <div className="student-profile-contact-icon">
                  @
                </div>

                <div>
                  <span>Email</span>

                  <strong>
                    {student.email ||
                      "Email not available"}
                  </strong>
                </div>

              </div>
            </article>

          </aside>

        </section>

        {/* BOTTOM CTA */}

        <section className="student-profile-bottom-cta">
          <div>
            <p>
              CAMPUSCONNECT COMMUNITY
            </p>

            <h2>
              Discover more talented students.
            </h2>

            <span>
              Explore the directory and find people
              with skills that match your goals.
            </span>
          </div>

          <Link
            to="/students"
            className="student-profile-directory-button"
          >
            Explore Students →
          </Link>
        </section>

      </div>
    </div>
  );
}

export default StudentDetails;