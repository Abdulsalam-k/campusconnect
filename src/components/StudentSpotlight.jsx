import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import API_URL from "../config/api";

function StudentSpotlight() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStudents() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/students`
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to fetch students."
          );
        }

        const data = result.data || [];

        const spotlightStudents = [...data]
          .sort(
            (first, second) =>
              new Date(second.createdAt || 0) -
              new Date(first.createdAt || 0)
          )
          .slice(0, 4);

        setStudents(spotlightStudents);
      } catch (error) {
        console.error(
          "Fetching student spotlight failed:",
          error.message
        );

        setError(
          error.message ||
            "Failed to load student spotlight."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
  }, []);

  function getInitials(name) {
    if (!name) {
      return "CC";
    }

    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  }

  return (
    <section className="student-spotlight">
      <div className="student-spotlight-container">

        <div className="student-spotlight-heading">
          <div>
            <p>MEET THE TALENT</p>

            <h2>
              Discover the people
              <span> behind the profiles.</span>
            </h2>
          </div>

          <div className="student-spotlight-heading-action">
            <p>
              Explore students with different skills,
              backgrounds and ambitions across the
              CampusConnect community.
            </p>

            <Link
              to="/students"
              className="student-spotlight-view-all"
            >
              Explore all students →
            </Link>
          </div>
        </div>

        {loading && (
          <div className="student-spotlight-grid">
            {[1, 2, 3, 4].map((item) => (
              <div
                className="student-spotlight-loading-card"
                key={item}
              ></div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="student-spotlight-message">
            <strong>
              Unable to load students
            </strong>

            <p>{error}</p>
          </div>
        )}

        {!loading &&
          !error &&
          students.length === 0 && (
            <div className="student-spotlight-message">
              <div className="student-spotlight-empty-icon">
                ✦
              </div>

              <h3>
                Student profiles are coming soon
              </h3>

              <p>
                Students will appear here as they
                build their CampusConnect profiles.
              </p>

              <Link
                to="/students"
                className="primary-button"
              >
                Browse Students
              </Link>
            </div>
          )}

        {!loading &&
          !error &&
          students.length > 0 && (
            <div className="student-spotlight-grid">
              {students.map((student) => (
                <article
                  className="student-spotlight-card"
                  key={
                    student.id ||
                    student._id
                  }
                >
                  <div className="student-spotlight-card-top">
                    {student.profileImage ? (
                      <img
                        src={student.profileImage}
                        alt={student.name}
                        className="student-spotlight-avatar-image"
                      />
                    ) : (
                      <div className="student-spotlight-avatar">
                        {getInitials(
                          student.name
                        )}
                      </div>
                    )}

                    <span className="student-spotlight-status">
                      Student
                    </span>
                  </div>

                  <h3>
                    {student.name}
                  </h3>

                  <p className="student-spotlight-department">
                    {student.department ||
                      "Department not provided"}
                  </p>

                  <div className="student-spotlight-info">
                    {student.education && (
                      <span>
                        🎓 {student.education}
                      </span>
                    )}

                    {student.location && (
                      <span>
                        📍 {student.location}
                      </span>
                    )}
                  </div>

                  {student.bio && (
                    <p className="student-spotlight-bio">
                      {student.bio}
                    </p>
                  )}

                  {student.skills?.length > 0 && (
                    <div className="student-spotlight-skills">
                      {student.skills
                        .slice(0, 4)
                        .map((skill) => (
                          <span key={skill}>
                            {skill}
                          </span>
                        ))}
                    </div>
                  )}

                  <div className="student-spotlight-footer">
                    <Link
                      to={`/students/${
                        student.id ||
                        student._id
                      }`}
                      className="student-spotlight-link"
                    >
                      View profile →
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

export default StudentSpotlight;