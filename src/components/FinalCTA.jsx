import { Link } from "react-router-dom";

function FinalCTA() {
  return (
    <section className="final-cta">
      <div className="final-cta-glow final-cta-glow-one"></div>
      <div className="final-cta-glow final-cta-glow-two"></div>

      <div className="final-cta-container">
        <div className="final-cta-card">
          <div className="final-cta-content">
            <p className="final-cta-label">
              YOUR NEXT STEP STARTS HERE
            </p>

            <h2>
              Your next opportunity could be
              <span> one connection away.</span>
            </h2>

            <p className="final-cta-description">
              Build your profile, discover talented people,
              explore opportunities and take the next step
              in your professional journey with CampusConnect.
            </p>

            <div className="final-cta-actions">
              <Link
                to="/register"
                className="final-cta-primary"
              >
                Create Your Profile
                <span>→</span>
              </Link>

              <Link
                to="/opportunities"
                className="final-cta-secondary"
              >
                Explore Opportunities
              </Link>
            </div>
          </div>

          <div className="final-cta-side">
            <div className="final-cta-side-icon">
              ✦
            </div>

            <strong>
              Build. Connect. Grow.
            </strong>

            <p>
              Everything you need to move from
              campus to career.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FinalCTA;