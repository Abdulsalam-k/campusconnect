function Features() {
  const features = [
    {
      number: "01",
      icon: "◉",
      title: "Discover Talent",
      description:
        "Find talented students based on their skills, interests, education and experience.",
    },
    {
      number: "02",
      icon: "↗",
      title: "Find Opportunities",
      description:
        "Discover internships, jobs, projects and other opportunities that match your goals.",
    },
    {
      number: "03",
      icon: "◎",
      title: "Build Your Network",
      description:
        "Connect with students, recruiters and collaborators within the campus community.",
    },
    {
      number: "04",
      icon: "✓",
      title: "Track Applications",
      description:
        "Keep your applications organized and monitor their progress from one dashboard.",
    },
    {
      number: "05",
      icon: "◇",
      title: "Showcase Your Skills",
      description:
        "Build a professional student profile that highlights your skills, education and experience.",
    },
    {
      number: "06",
      icon: "✦",
      title: "Grow Your Career",
      description:
        "Turn campus connections and opportunities into meaningful professional growth.",
    },
  ];

  return (
    <section className="features">
      <div className="section-heading">
        <p>WHY CAMPUSCONNECT?</p>

        <h2>
          Everything you need to
          <span> grow and get discovered.</span>
        </h2>

        <span>
          One connected platform for students, recruiters,
          opportunities and meaningful professional growth.
        </span>
      </div>

      <div className="feature-grid">
        {features.map((feature) => (
          <article
            className="feature-card"
            key={feature.title}
          >
            <div className="feature-card-top">
              <div className="feature-icon">
                {feature.icon}
              </div>

              <span className="feature-number">
                {feature.number}
              </span>
            </div>

            <div className="feature-card-content">
              <h3>
                {feature.title}
              </h3>

              <p>
                {feature.description}
              </p>
            </div>

            <div className="feature-card-line"></div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Features;