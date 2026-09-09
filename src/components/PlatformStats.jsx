function PlatformStats() {
  const stats = [
    {
      value: "1",
      label: "Connected Platform",
      description:
        "Students, recruiters and opportunities in one ecosystem.",
    },
    {
      value: "3",
      label: "User Roles",
      description:
        "Student, recruiter and admin experiences built into the platform.",
    },
    {
      value: "4",
      label: "Opportunity Types",
      description:
        "Internships, part-time, full-time and contract opportunities.",
    },
    {
      value: "3",
      label: "Application Statuses",
      description:
        "Track applications from pending to accepted or rejected.",
    },
  ];

  return (
    <section className="platform-stats">
      <div className="platform-stats-container">
        <div className="platform-stats-heading">
          <p>THE CAMPUSCONNECT ECOSYSTEM</p>

          <h2>
            Built to connect every
            <span> part of the journey.</span>
          </h2>

          <p className="platform-stats-description">
            From discovering talent to finding opportunities
            and tracking applications, CampusConnect keeps
            the experience connected in one place.
          </p>
        </div>

        <div className="platform-stats-grid">
          {stats.map((stat) => (
            <article
              className="platform-stat-card"
              key={stat.label}
            >
              <div className="platform-stat-top">
                <span className="platform-stat-value">
                  {stat.value}
                </span>

                <span className="platform-stat-mark">
                  +
                </span>
              </div>

              <h3>{stat.label}</h3>

              <p>{stat.description}</p>

              <div className="platform-stat-line"></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PlatformStats;