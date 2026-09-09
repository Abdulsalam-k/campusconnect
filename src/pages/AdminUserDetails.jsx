import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import API_URL from "../config/api";

function AdminUserDetails() {
  const { id } = useParams();
  const { token } = useAuth();

  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH USER DETAILS
  // ==========================================

  useEffect(() => {
    async function fetchUserDetails() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/admin/users/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to fetch user details."
          );
        }

        setUserDetails(result.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchUserDetails();
    }
  }, [id, token]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="admin-user-page">
        <div className="admin-user-container">
          <div className="admin-user-state">
            <h2>Loading user details...</h2>
            <p>
              Please wait while we retrieve the account
              information.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="admin-user-page">
        <div className="admin-user-container">
          <div className="admin-user-error">
            <h2>Unable to load user</h2>
            <p>{error}</p>

            <Link
              to="/admin-dashboard"
              className="primary-button"
            >
              Back to Admin Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // NO DATA
  // ==========================================

  if (!userDetails) {
    return (
      <div className="admin-user-page">
        <div className="admin-user-container">
          <p>No user details available.</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // USER DATA
  // ==========================================

  const role =
    userDetails.role?.charAt(0).toUpperCase() +
    userDetails.role?.slice(1);

  const accountStatus = userDetails.isActive
    ? "Active"
    : "Inactive";

  return (
    <div className="admin-user-page">
      <div className="admin-user-container">

        {/* HEADER */}

        <div className="admin-user-header">
          <div>
            <p className="admin-dashboard-eyebrow">
              ADMIN PORTAL
            </p>

            <h1>User Details</h1>

            <p>
              View the complete CampusConnect
              account information.
            </p>
          </div>

          <Link
            to="/admin-dashboard"
            className="secondary-button"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* USER PROFILE */}

        <section className="admin-user-card">

          <div className="admin-user-profile-header">

            {/* AVATAR */}

            <div className="admin-user-avatar">
              {userDetails.profileImage ? (
                <img
                  src={userDetails.profileImage}
                  alt={userDetails.name}
                />
              ) : (
                userDetails.name
                  ?.charAt(0)
                  .toUpperCase()
              )}
            </div>

            {/* BASIC DETAILS */}

            <div className="admin-user-profile-main">
              <h2>{userDetails.name}</h2>

              <p>{userDetails.email}</p>

              <div className="admin-user-profile-badges">

                <span
                  className={`admin-role-badge role-${userDetails.role}`}
                >
                  {role}
                </span>

                <span
                  className={`admin-status-badge ${
                    userDetails.isActive
                      ? "status-active"
                      : "status-inactive"
                  }`}
                >
                  {accountStatus}
                </span>

              </div>
            </div>

          </div>

          {/* ACCOUNT INFORMATION */}

          <div className="admin-user-section">

            <h3>Account Information</h3>

            <div className="admin-user-info-grid">

              <div>
                <span>Full Name</span>

                <strong>
                  {userDetails.name || "—"}
                </strong>
              </div>

              <div>
                <span>Email</span>

                <strong>
                  {userDetails.email || "—"}
                </strong>
              </div>

              <div>
                <span>Role</span>

                <strong>
                  {role || "—"}
                </strong>
              </div>

              <div>
                <span>Status</span>

                <strong>
                  {accountStatus}
                </strong>
              </div>

              <div>
                <span>Joined</span>

                <strong>
                  {userDetails.createdAt
                    ? new Date(
                        userDetails.createdAt
                      ).toLocaleDateString()
                    : "—"}
                </strong>
              </div>

            </div>
          </div>

          {/* EDUCATION */}

          <div className="admin-user-section">

            <h3>Education</h3>

            <p>
              {userDetails.education ||
                "No education information provided."}
            </p>

          </div>

          {/* DEPARTMENT / LOCATION */}

          <div className="admin-user-section">

            <h3>Academic / Location Information</h3>

            <div className="admin-user-info-grid">

              <div>
                <span>Department</span>

                <strong>
                  {userDetails.department ||
                    "Not provided"}
                </strong>
              </div>

              <div>
                <span>Location</span>

                <strong>
                  {userDetails.location ||
                    "Not provided"}
                </strong>
              </div>

            </div>

          </div>

          {/* SKILLS */}

          <div className="admin-user-section">

            <h3>Skills</h3>

            {Array.isArray(userDetails.skills) &&
            userDetails.skills.length > 0 ? (
              <div className="admin-user-skills">

                {userDetails.skills.map(
                  (skill, index) => (
                    <span key={index}>
                      {skill}
                    </span>
                  )
                )}

              </div>
            ) : (
              <p>
                No skills have been added.
              </p>
            )}

          </div>

          {/* BIO */}

          <div className="admin-user-section">

            <h3>Bio</h3>

            <p>
              {userDetails.bio ||
                "No bio provided."}
            </p>

          </div>

          {/* USER ID */}

          <div className="admin-user-section">

            <h3>System Information</h3>

            <div className="admin-user-info-grid">

              <div>
                <span>User ID</span>

                <strong>
                  {userDetails._id}
                </strong>
              </div>

              <div>
                <span>Account Status</span>

                <strong>
                  {accountStatus}
                </strong>
              </div>

            </div>

          </div>

        </section>

      </div>
    </div>
  );
}

export default AdminUserDetails;