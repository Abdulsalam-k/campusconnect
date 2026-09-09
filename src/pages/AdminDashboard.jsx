import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
  const { token, user } = useAuth();

  const [dashboard, setDashboard] =
    useState(null);

  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] =
    useState("All");
  const [statusFilter, setStatusFilter] =
    useState("All");

  const [loading, setLoading] =
    useState(true);

  const [usersLoading, setUsersLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [usersError, setUsersError] =
    useState("");

  const [updatingUserId, setUpdatingUserId] =
    useState(null);

  // ==========================================
  // FETCH ADMIN DASHBOARD
  // ==========================================

  useEffect(() => {
    async function fetchAdminDashboard() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/admin/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to fetch admin dashboard."
          );
        }

        setDashboard(result.data);
      } catch (error) {
        console.error(
          "Fetching admin dashboard error:",
          error.message
        );

        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchAdminDashboard();
    }
  }, [token]);

  // ==========================================
  // FETCH ALL USERS
  // ==========================================

  useEffect(() => {
    async function fetchUsers() {
      try {
        setUsersLoading(true);
        setUsersError("");

        const response = await fetch(
          "http://localhost:5000/api/admin/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to fetch users."
          );
        }

        setUsers(result.data || []);
      } catch (error) {
        console.error(
          "Fetching users error:",
          error.message
        );

        setUsersError(error.message);
      } finally {
        setUsersLoading(false);
      }
    }

    if (token) {
      fetchUsers();
    }
  }, [token]);

  // ==========================================
  // FILTER USERS
  // ==========================================

  const filteredUsers = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    return users.filter((account) => {
      const searchableText = [
        account.name,
        account.email,
        account.department,
        account.location,
        account.education,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !searchValue ||
        searchableText.includes(searchValue);

      const matchesRole =
        roleFilter === "All" ||
        account.role === roleFilter;

      const isActive =
        account.isActive !== false;

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Active" &&
          isActive) ||
        (statusFilter === "Inactive" &&
          !isActive);

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [
    users,
    search,
    roleFilter,
    statusFilter,
  ]);

  // ==========================================
  // CLEAR USER FILTERS
  // ==========================================

  function clearUserFilters() {
    setSearch("");
    setRoleFilter("All");
    setStatusFilter("All");
  }

  // ==========================================
  // CHANGE USER ROLE
  // ==========================================

  async function handleRoleChange(
    userId,
    newRole
  ) {
    const targetUser = users.find(
      (account) => account._id === userId
    );

    if (!targetUser) {
      return;
    }

    if (targetUser.role === newRole) {
      return;
    }

    const confirmed = window.confirm(
      `Change ${targetUser.name}'s role from ${targetUser.role} to ${newRole}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingUserId(userId);
      setUsersError("");

      const response = await fetch(
        `http://localhost:5000/api/admin/users/${userId}/role`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            role: newRole,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to update user role."
        );
      }

      setUsers((currentUsers) =>
        currentUsers.map((account) =>
          account._id === userId
            ? {
                ...account,
                role: result.data.role,
              }
            : account
        )
      );

      setDashboard((currentDashboard) => {
        if (!currentDashboard) {
          return currentDashboard;
        }

        const previousRole =
          targetUser.role;

        const updatedStats = {
          ...currentDashboard.stats,
        };

        if (previousRole === "student") {
          updatedStats.totalStudents -= 1;
        }

        if (previousRole === "recruiter") {
          updatedStats.totalRecruiters -= 1;
        }

        if (previousRole === "admin") {
          updatedStats.totalAdmins -= 1;
        }

        if (newRole === "student") {
          updatedStats.totalStudents += 1;
        }

        if (newRole === "recruiter") {
          updatedStats.totalRecruiters += 1;
        }

        if (newRole === "admin") {
          updatedStats.totalAdmins += 1;
        }

        return {
          ...currentDashboard,
          stats: updatedStats,
          recentUsers:
            currentDashboard.recentUsers.map(
              (account) =>
                account._id === userId
                  ? {
                      ...account,
                      role:
                        result.data.role,
                    }
                  : account
            ),
        };
      });
    } catch (error) {
      console.error(
        "Changing user role error:",
        error.message
      );

      setUsersError(error.message);
    } finally {
      setUpdatingUserId(null);
    }
  }

  // ==========================================
  // CHANGE USER STATUS
  // ==========================================

  async function handleStatusChange(
    userId,
    newStatus
  ) {
    const targetUser = users.find(
      (account) => account._id === userId
    );

    if (!targetUser) {
      return;
    }

    const actionText = newStatus
      ? "activate"
      : "deactivate";

    const confirmed = window.confirm(
      `Are you sure you want to ${actionText} ${targetUser.name}'s account?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingUserId(userId);
      setUsersError("");

      const response = await fetch(
        `http://localhost:5000/api/admin/users/${userId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            isActive: newStatus,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to update account status."
        );
      }

      setUsers((currentUsers) =>
        currentUsers.map((account) =>
          account._id === userId
            ? {
                ...account,
                isActive:
                  result.data.isActive,
              }
            : account
        )
      );

      setDashboard((currentDashboard) => {
        if (!currentDashboard) {
          return currentDashboard;
        }

        return {
          ...currentDashboard,
          recentUsers:
            currentDashboard.recentUsers.map(
              (account) =>
                account._id === userId
                  ? {
                      ...account,
                      isActive:
                        result.data
                          .isActive,
                    }
                  : account
            ),
        };
      });
    } catch (error) {
      console.error(
        "Changing account status error:",
        error.message
      );

      setUsersError(error.message);
    } finally {
      setUpdatingUserId(null);
    }
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="admin-dashboard-page">
        <div className="admin-dashboard-container">

          <div className="admin-dashboard-loading">
            <h2>
              Loading admin dashboard...
            </h2>

            <p>
              Please wait while we retrieve
              platform information.
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
      <div className="admin-dashboard-page">
        <div className="admin-dashboard-container">

          <div className="admin-dashboard-error">

            <h2>
              Unable to load admin dashboard
            </h2>

            <p>{error}</p>

          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // NO DATA
  // ==========================================

  if (!dashboard) {
    return (
      <div className="admin-dashboard-page">
        <div className="admin-dashboard-container">
          <p>
            No dashboard data available.
          </p>
        </div>
      </div>
    );
  }

  const {
    stats,
    recentOpportunities,
    recentApplications,
  } = dashboard;

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-container">

        {/* =====================================
            HEADER
        ====================================== */}

        <div className="admin-dashboard-header">

          <div>
            <p className="admin-dashboard-eyebrow">
              ADMIN PORTAL
            </p>

            <h1>
              Admin Dashboard
            </h1>

            <p>
              Welcome back,{" "}
              <strong>{user?.name}</strong>.
              Monitor and manage the
              CampusConnect platform.
            </p>
          </div>

          {/* APPLICATION MANAGEMENT */}

          <Link
            to="/admin-applications"
            className="admin-application-management-link"
          >
            📄 Application Management
          </Link>

        </div>

        {/* =====================================
            STATISTICS
        ====================================== */}

        <section className="admin-section">

          <div className="admin-section-heading">

            <div>
              <p className="admin-section-eyebrow">
                PLATFORM OVERVIEW
              </p>

              <h2>
                Statistics
              </h2>
            </div>

          </div>

          <div className="admin-stats-grid">

            <div className="admin-stat-card">
              <span>👥</span>

              <div>
                <p>Total Users</p>

                <h2>
                  {stats.totalUsers}
                </h2>
              </div>
            </div>

            <div className="admin-stat-card">
              <span>🎓</span>

              <div>
                <p>Students</p>

                <h2>
                  {stats.totalStudents}
                </h2>
              </div>
            </div>

            <div className="admin-stat-card">
              <span>💼</span>

              <div>
                <p>Recruiters</p>

                <h2>
                  {stats.totalRecruiters}
                </h2>
              </div>
            </div>

            <div className="admin-stat-card">
              <span>🛡️</span>

              <div>
                <p>Admins</p>

                <h2>
                  {stats.totalAdmins}
                </h2>
              </div>
            </div>

            <div className="admin-stat-card">
              <span>📢</span>

              <div>
                <p>Opportunities</p>

                <h2>
                  {stats.totalOpportunities}
                </h2>
              </div>
            </div>

            <div className="admin-stat-card">
              <span>📄</span>

              <div>
                <p>Applications</p>

                <h2>
                  {stats.totalApplications}
                </h2>
              </div>
            </div>

            <div className="admin-stat-card">
              <span>⏳</span>

              <div>
                <p>Pending</p>

                <h2>
                  {stats.pendingApplications}
                </h2>
              </div>
            </div>

            <div className="admin-stat-card">
              <span>✅</span>

              <div>
                <p>Accepted</p>

                <h2>
                  {stats.acceptedApplications}
                </h2>
              </div>
            </div>

            <div className="admin-stat-card">
              <span>❌</span>

              <div>
                <p>Rejected</p>

                <h2>
                  {stats.rejectedApplications}
                </h2>
              </div>
            </div>

            <div className="admin-stat-card">
              <span>🔔</span>

              <div>
                <p>Notifications</p>

                <h2>
                  {stats.totalNotifications}
                </h2>
              </div>
            </div>

          </div>
        </section>

        {/* =====================================
            USER MANAGEMENT
        ====================================== */}

        <section className="admin-section">

          <div className="admin-section-heading">

            <div>
              <p className="admin-section-eyebrow">
                USER MANAGEMENT
              </p>

              <h2>
                All Users
              </h2>

              <p>
                View and manage registered
                CampusConnect users.
              </p>
            </div>

          </div>

          {/* USER FILTERS */}

          {!usersLoading &&
            users.length > 0 && (
              <div className="admin-user-filters">

                <input
                  type="text"
                  placeholder="Search by name, email, department..."
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                />

                <select
                  value={roleFilter}
                  onChange={(event) =>
                    setRoleFilter(
                      event.target.value
                    )
                  }
                >
                  <option value="All">
                    All Roles
                  </option>

                  <option value="student">
                    Student
                  </option>

                  <option value="recruiter">
                    Recruiter
                  </option>

                  <option value="admin">
                    Admin
                  </option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value
                    )
                  }
                >
                  <option value="All">
                    All Statuses
                  </option>

                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>
                </select>

              </div>
            )}

          {!usersLoading &&
            users.length > 0 && (
              <div className="admin-users-result-bar">

                <p>
                  Showing{" "}
                  <strong>
                    {filteredUsers.length}
                  </strong>{" "}
                  {filteredUsers.length === 1
                    ? "user"
                    : "users"}
                </p>

                {(search ||
                  roleFilter !== "All" ||
                  statusFilter !== "All") && (
                  <button
                    type="button"
                    className="admin-clear-user-filters"
                    onClick={
                      clearUserFilters
                    }
                  >
                    Clear Filters
                  </button>
                )}

              </div>
            )}

          {/* USER ERROR */}

          {usersError && (
            <div className="admin-inline-error">
              {usersError}
            </div>
          )}

          {/* USER CONTENT */}

          {usersLoading ? (
            <div className="admin-empty-state">
              <p>
                Loading users...
              </p>
            </div>
          ) : usersError ? (
            <div className="admin-empty-state">
              <p>
                Unable to load users.
              </p>
            </div>
          ) : users.length === 0 ? (
            <div className="admin-empty-state">
              <p>
                No users found.
              </p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="admin-empty-state">
              <h3>
                No matching users
              </h3>

              <p>
                No users match the current
                search or filters.
              </p>

              <button
                type="button"
                className="primary-button"
                onClick={
                  clearUserFilters
                }
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="admin-table-wrapper">

              <table className="admin-table">

                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Department</th>
                    <th>Location</th>
                    <th>Joined</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredUsers.map(
                    (account) => {

                      const isCurrentAdmin =
                        account._id ===
                          user?.id ||
                        account._id ===
                          user?._id;

                      const isUpdating =
                        updatingUserId ===
                        account._id;

                      const isActive =
                        account.isActive !==
                        false;

                      return (
                        <tr
                          key={
                            account._id
                          }
                        >

                          {/* NAME */}

                          <td>
                            <strong>
                              {account.name}
                            </strong>

                            {isCurrentAdmin && (
                              <span className="current-user-label">
                                You
                              </span>
                            )}
                          </td>

                          {/* EMAIL */}

                          <td>
                            {account.email}
                          </td>

                          {/* ROLE */}

                          <td>

                            {isCurrentAdmin ? (
                              <span
                                className={`admin-role-badge role-${account.role}`}
                              >
                                {account.role}
                              </span>
                            ) : (
                              <select
                                className="role-select"
                                value={
                                  account.role
                                }
                                onChange={(
                                  event
                                ) =>
                                  handleRoleChange(
                                    account._id,
                                    event
                                      .target
                                      .value
                                  )
                                }
                                disabled={
                                  isUpdating
                                }
                              >

                                <option value="student">
                                  Student
                                </option>

                                <option value="recruiter">
                                  Recruiter
                                </option>

                                <option value="admin">
                                  Admin
                                </option>

                              </select>
                            )}

                            {isUpdating && (
                              <span className="role-updating">
                                Updating...
                              </span>
                            )}

                          </td>

                          {/* STATUS */}

                          <td>

                            <span
                              className={`admin-user-status ${
                                isActive
                                  ? "user-active"
                                  : "user-inactive"
                              }`}
                            >
                              {isActive
                                ? "Active"
                                : "Inactive"}
                            </span>

                          </td>

                          {/* DEPARTMENT */}

                          <td>
                            {account.department ||
                              "—"}
                          </td>

                          {/* LOCATION */}

                          <td>
                            {account.location ||
                              "—"}
                          </td>

                          {/* JOINED */}

                          <td>
                            {account.createdAt
                              ? new Date(
                                  account.createdAt
                                ).toLocaleDateString()
                              : "—"}
                          </td>

                          {/* ACTIONS */}

                          <td>

                            <div className="admin-user-actions">

                              <Link
                                to={`/admin/users/${account._id}`}
                                className="admin-view-button"
                              >
                                View
                              </Link>

                              {!isCurrentAdmin && (
                                <button
                                  type="button"
                                  className={
                                    isActive
                                      ? "admin-deactivate-button"
                                      : "admin-activate-button"
                                  }
                                  onClick={() =>
                                    handleStatusChange(
                                      account._id,
                                      !isActive
                                    )
                                  }
                                  disabled={
                                    isUpdating
                                  }
                                >
                                  {isUpdating
                                    ? "Updating..."
                                    : isActive
                                    ? "Deactivate"
                                    : "Activate"}
                                </button>
                              )}

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>
          )}

        </section>

        {/* =====================================
            RECENT OPPORTUNITIES
        ====================================== */}

        <section className="admin-section">

          <div className="admin-section-heading">

            <div>
              <p className="admin-section-eyebrow">
                OPPORTUNITY ACTIVITY
              </p>

              <h2>
                Recent Opportunities
              </h2>
            </div>

          </div>

          {recentOpportunities.length ===
          0 ? (
            <div className="admin-empty-state">
              <p>
                No opportunities found.
              </p>
            </div>
          ) : (
            <div className="admin-cards-grid">

              {recentOpportunities.map(
                (opportunity) => (
                  <div
                    key={opportunity._id}
                    className="admin-opportunity-card"
                  >

                    <span className="admin-category">
                      {opportunity.category}
                    </span>

                    <h3>
                      {opportunity.title}
                    </h3>

                    <p>
                      {opportunity.company}
                    </p>

                    <div className="admin-opportunity-info">

                      <span>
                        📍{" "}
                        {opportunity.location}
                      </span>

                      <span>
                        💼{" "}
                        {opportunity.type}
                      </span>

                      <span>
                        🌐{" "}
                        {opportunity.mode}
                      </span>

                    </div>

                    <p className="admin-created-by">
                      Created by:{" "}
                      <strong>
                        {opportunity
                          .createdBy
                          ?.name ||
                          "Unknown"}
                      </strong>
                    </p>

                  </div>
                )
              )}

            </div>
          )}

        </section>

        {/* =====================================
            RECENT APPLICATIONS
        ====================================== */}

        <section className="admin-section">

          <div className="admin-section-heading">

            <div>
              <p className="admin-section-eyebrow">
                APPLICATION ACTIVITY
              </p>

              <h2>
                Recent Applications
              </h2>
            </div>

          </div>

          {recentApplications.length ===
          0 ? (
            <div className="admin-empty-state">
              <p>
                No applications found.
              </p>
            </div>
          ) : (
            <div className="admin-table-wrapper">

              <table className="admin-table">

                <thead>
                  <tr>
                    <th>Applicant</th>
                    <th>Opportunity</th>
                    <th>Company</th>
                    <th>Status</th>
                    <th>Submitted</th>
                  </tr>
                </thead>

                <tbody>

                  {recentApplications.map(
                    (application) => (
                      <tr
                        key={
                          application._id
                        }
                      >

                        <td>
                          <strong>
                            {application
                              .userId
                              ?.name ||
                              application.fullName}
                          </strong>
                        </td>

                        <td>
                          {application
                            .opportunityId
                            ?.title ||
                            "Unavailable"}
                        </td>

                        <td>
                          {application
                            .opportunityId
                            ?.company ||
                            "Unavailable"}
                        </td>

                        <td>
                          <span
                            className={`admin-status-badge status-${application.status.toLowerCase()}`}
                          >
                            {
                              application.status
                            }
                          </span>
                        </td>

                        <td>
                          {application.createdAt
                            ? new Date(
                                application.createdAt
                              ).toLocaleDateString()
                            : "—"}
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

        </section>

      </div>
    </div>
  );
}

export default AdminDashboard;