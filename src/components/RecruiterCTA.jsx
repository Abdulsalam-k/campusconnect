import { Link } from "react-router-dom";

function RecruiterCTA() {
  const benefits = [
    {
      number: "01",
      title: "Discover Student Talent",
      description:
        "Find students with the skills, education and experience your organization needs.",
      icon: "◎",
    },
    {
      number: "02",
      title: "Create Opportunities",
      description:
        "Publish internships, jobs, projects and other opportunities for students to discover.",
      icon: "+",
    },
    {
      number: "03",
      title: "Manage Applications",
      description:
        "Review applications, evaluate candidates and manage your recruitment process in one place.",
      icon: "✓",
    },
  ];

  return (
    <section className="recruiter-cta">
      <div className="recruiter-cta-glow recruiter-cta-glow-one"></div>
      <div className="recruiter-cta-glow recruiter-cta-glow-two"></div>

      <div className="recruiter-cta-container">
        <div className="recruiter-cta-content">
          <div className="recruiter-cta-copy">
            <p className="recruiter-cta-label">
              FOR RECRUITERS & ORGANIZATIONS
            </p>

            <h2>
              Find the talent that
              <span> moves your team forward.</span>
            </h2>

            <p className="recruiter-cta-description">
              CampusConnect helps recruiters discover promising
              student talent, create opportunities and manage
              applications through one connected platform.
            </p>

            <div className="recruiter-cta-actions">
              <Link
                to="/recruiter-dashboard"
                className="recruiter-primary-button"
              >
                Explore Recruiter Tools
                <span>→</span>
              </Link>

              <Link
                to="/students"
                className="recruiter-secondary-button"
              >
                Discover Student Talent
              </Link>
            </div>
          </div>

          <div className="recruiter-cta-panel">
            <div className="recruiter-panel-header">
              <div>
                <span>RECRUITER EXPERIENCE</span>
                <strong>One place to find and manage talent</strong>
              </div>

              <div className="recruiter-panel-status">
                <span></span>
                Connected
              </div>
            </div>

            <div className="recruiter-benefits">
              {benefits.map((benefit) => (
                <article
                  className="recruiter-benefit"
                  key={benefit.number}
                >
                  <div className="recruiter-benefit-icon">
                    {benefit.icon}
                  </div>

                  <div className="recruiter-benefit-content">
                    <div className="recruiter-benefit-heading">
                      <h3>{benefit.title}</h3>
                      <span>{benefit.number}</span>
                    </div>

                    <p>{benefit.description}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="recruiter-panel-footer">
              <span>
                Connect with the next generation of talent.
              </span>

              <span>CampusConnect</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RecruiterCTA;