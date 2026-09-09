import { useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { unreadCount } = useNotifications();

  const [menuOpen, setMenuOpen] = useState(false);

  const role = user?.role;

  const isStudent = role === "student";
  const isRecruiter = role === "recruiter";
  const isAdmin = role === "admin";

  function handleLogout() {
    logout();
    setMenuOpen(false);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* LOGO */}

        <Link
          to="/"
          className="navbar-logo"
          onClick={closeMenu}
        >
          CampusConnect
        </Link>

        {/* MOBILE MENU BUTTON */}

        <button
          type="button"
          className="mobile-menu-button"
          onClick={() =>
            setMenuOpen((previous) => !previous)
          }
          aria-label={
            menuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* NAVIGATION */}

        <div
          className={`navbar-links ${
            menuOpen ? "navbar-links-open" : ""
          }`}
        >

          {/* PUBLIC LINKS */}

          <Link
            to="/"
            onClick={closeMenu}
          >
            Home
          </Link>

          <Link
            to="/students"
            onClick={closeMenu}
          >
            Students
          </Link>

          <Link
            to="/opportunities"
            onClick={closeMenu}
          >
            Opportunities
          </Link>

          {isAuthenticated ? (
            <>
              {/* STUDENT */}

              {isStudent && (
                <>
                  <Link
                    to="/applications"
                    onClick={closeMenu}
                  >
                    Applications
                  </Link>

                  <Link
                    to="/saved-opportunities"
                    onClick={closeMenu}
                  >
                    Saved
                  </Link>

                  <Link
                    to="/dashboard"
                    onClick={closeMenu}
                  >
                    Dashboard
                  </Link>
                </>
              )}

              {/* RECRUITER */}

              {isRecruiter && (
                <Link
                  to="/recruiter-dashboard"
                  onClick={closeMenu}
                >
                  Recruiter Dashboard
                </Link>
              )}

              {/* ADMIN */}

              {isAdmin && (
                <Link
                  to="/admin-dashboard"
                  onClick={closeMenu}
                >
                  Admin Dashboard
                </Link>
              )}

              {/* NOTIFICATIONS */}

              <Link
                to="/notifications"
                className="notification-link"
                onClick={closeMenu}
              >
                <span>
                  🔔 Notifications
                </span>

                {unreadCount > 0 && (
                  <span className="notification-badge">
                    {unreadCount > 9
                      ? "9+"
                      : unreadCount}
                  </span>
                )}
              </Link>

              {/* PROFILE */}

              <Link
                to="/profile"
                onClick={closeMenu}
              >
                Profile
              </Link>

              {/* GREETING */}

              <span className="navbar-greeting">
                Hi, {user?.name}
              </span>

              {/* LOGOUT */}

              <button
                type="button"
                onClick={handleLogout}
                className="logout-button"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* GUEST */}

              <Link
                to="/login"
                onClick={closeMenu}
              >
                Login
              </Link>

              <Link
                to="/register"
                className="navbar-cta"
                onClick={closeMenu}
              >
                Get Started
              </Link>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;