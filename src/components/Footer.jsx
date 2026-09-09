import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-main">

          <div className="footer-brand">
            <Link
              to="/"
              className="footer-logo"
            >
              Campus<span>Connect</span>
            </Link>

            <p>
              Connecting students, talent and
              opportunities in one powerful
              campus ecosystem.
            </p>

            <div className="footer-brand-badge">
              <span></span>
              Built for ambitious students
            </div>
          </div>

          <div className="footer-links-group">
            <h3>Explore</h3>

            <Link to="/">
              Home
            </Link>

            <Link to="/students">
              Discover Students
            </Link>

            <Link to="/opportunities">
              Opportunities
            </Link>
          </div>

          <div className="footer-links-group">
            <h3>CampusConnect</h3>

            <Link to="/register">
              Create Account
            </Link>

            <Link to="/login">
              Sign In
            </Link>

            <Link to="/opportunities">
              Find Opportunities
            </Link>
          </div>

          <div className="footer-links-group footer-recruiter-links">
            <h3>For Recruiters</h3>

            <Link to="/students">
              Discover Talent
            </Link>

            <Link to="/recruiter-dashboard">
              Recruiter Dashboard
            </Link>

            <Link to="/create-opportunity">
              Create Opportunity
            </Link>
          </div>

        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p>
            © {currentYear} CampusConnect.
            All rights reserved.
          </p>

          <div className="footer-bottom-links">
            <span>
              Student • Recruiter • Community
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;