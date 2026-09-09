import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-glow hero-glow-one"></div>
      <div className="hero-glow hero-glow-two"></div>

      <div className="hero-content">
        <div className="hero-copy">
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-dot"></span>
            BUILT FOR THE CAMPUS COMMUNITY
          </div>

          <p className="hero-tag">
            YOUR CAMPUS. YOUR NETWORK. YOUR OPPORTUNITY.
          </p>

          <h1>
            Connect with talent.
            <br />
            <span>Discover your next opportunity.</span>
          </h1>

          <p className="hero-description">
            CampusConnect brings students, recruiters, talents,
            projects and career opportunities together in one
            powerful platform built for the campus community.
          </p>

          <div className="hero-actions">
            <Link
              to="/opportunities"
              className="primary-button"
            >
              Explore Opportunities
              <span>→</span>
            </Link>

            <Link
              to="/students"
              className="secondary-button"
            >
              Discover Students
            </Link>
          </div>

          <div className="hero-highlights">
            <div className="hero-highlight">
              <span className="hero-highlight-number">01</span>
              <div>
                <strong>Discover</strong>
                <span>Talented students</span>
              </div>
            </div>

            <div className="hero-highlight">
              <span className="hero-highlight-number">02</span>
              <div>
                <strong>Connect</strong>
                <span>With the right people</span>
              </div>
            </div>

            <div className="hero-highlight">
              <span className="hero-highlight-number">03</span>
              <div>
                <strong>Grow</strong>
                <span>Your career</span>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-visual-wrapper">
          <div className="hero-floating-badge hero-floating-badge-top">
            <span className="hero-status-dot"></span>
            Active campus network
          </div>

          <div className="hero-visual">
            <div className="hero-visual-card">
              <div className="hero-visual-header">
                <div>
                  <span className="hero-card-label">
                    CAMPUSCONNECT
                  </span>
                  <strong>Student Network</strong>
                </div>

                <span className="hero-card-live">
                  LIVE
                </span>
              </div>

              <div className="hero-profile-preview">
                <div className="hero-avatar">
                  CC
                </div>

                <div className="hero-profile-content">
                  <strong>
                    Your professional campus network
                  </strong>

                  <p>
                    Skills, opportunities and connections
                    in one place.
                  </p>
                </div>
              </div>

              <div className="hero-card-divider"></div>

              <div className="hero-mini-stats">
                <div className="hero-mini-stat">
                  <div className="hero-mini-stat-icon">
                    ✓
                  </div>

                  <div>
                    <strong>Skills</strong>
                    <span>
                      Showcase what you can do
                    </span>
                  </div>
                </div>

                <div className="hero-mini-stat">
                  <div className="hero-mini-stat-icon">
                    ↗
                  </div>

                  <div>
                    <strong>Opportunities</strong>
                    <span>
                      Find your next role
                    </span>
                  </div>
                </div>

                <div className="hero-mini-stat">
                  <div className="hero-mini-stat-icon">
                    +
                  </div>

                  <div>
                    <strong>Connections</strong>
                    <span>
                      Build your network
                    </span>
                  </div>
                </div>
              </div>

              <div className="hero-card-footer">
                <span>
                  One platform. Many possibilities.
                </span>

                <span className="hero-card-arrow">
                  →
                </span>
              </div>
            </div>
          </div>

          <div className="hero-floating-badge hero-floating-badge-bottom">
            <span className="hero-floating-icon">✦</span>
            Built for ambitious students
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;