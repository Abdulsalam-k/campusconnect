import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import API_URL from "../config/api";

function Notifications() {
  const { token } = useAuth();

  const {
    decreaseUnreadCount,
    clearUnreadCount,
  } = useNotifications();

  const [notifications, setNotifications] =
    useState([]);

  // ==========================================
  // SEARCH / FILTER / SORT
  // ==========================================

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("All");

  const [typeFilter, setTypeFilter] =
    useState("All");

  const [sortBy, setSortBy] =
    useState("newest");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==========================================
  // FETCH NOTIFICATIONS
  // ==========================================

  useEffect(() => {
    async function fetchNotifications() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/notifications`,
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
              "Failed to fetch notifications."
          );
        }

        setNotifications(
          result.data || []
        );
      } catch (error) {
        console.error(
          "Fetching notifications failed:",
          error.message
        );

        setError(
          error.message ||
            "Failed to fetch notifications."
        );
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setLoading(false);
    }
  }, [token]);

  // ==========================================
  // NOTIFICATION COUNTS
  // ==========================================

  const totalNotifications =
    notifications.length;

  const localUnreadCount =
    notifications.filter(
      (notification) =>
        !notification.isRead
    ).length;

  const readCount =
    notifications.filter(
      (notification) =>
        notification.isRead
    ).length;

  // ==========================================
  // AVAILABLE TYPES
  // ==========================================

  const availableTypes = useMemo(() => {
    const values = notifications
      .map(
        (notification) =>
          notification.type
      )
      .filter(Boolean);

    return [...new Set(values)].sort(
      (a, b) =>
        a.localeCompare(b)
    );
  }, [notifications]);

  // ==========================================
  // FILTER + SORT NOTIFICATIONS
  // ==========================================

  const filteredNotifications =
    useMemo(() => {
      const searchValue =
        search.trim().toLowerCase();

      const filtered =
        notifications.filter(
          (notification) => {
            const searchableText = [
              notification.title,
              notification.message,
              notification.type,
            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();

            const matchesSearch =
              !searchValue ||
              searchableText.includes(
                searchValue
              );

            const matchesReadStatus =
              filter === "All" ||
              (filter === "Unread" &&
                !notification.isRead) ||
              (filter === "Read" &&
                notification.isRead);

            const matchesType =
              typeFilter === "All" ||
              notification.type ===
                typeFilter;

            return (
              matchesSearch &&
              matchesReadStatus &&
              matchesType
            );
          }
        );

      return [...filtered].sort(
        (first, second) => {
          if (sortBy === "newest") {
            return (
              new Date(
                second.createdAt || 0
              ) -
              new Date(
                first.createdAt || 0
              )
            );
          }

          if (sortBy === "oldest") {
            return (
              new Date(
                first.createdAt || 0
              ) -
              new Date(
                second.createdAt || 0
              )
            );
          }

          return 0;
        }
      );
    }, [
      notifications,
      search,
      filter,
      typeFilter,
      sortBy,
    ]);

  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  function clearFilters() {
    setSearch("");
    setFilter("All");
    setTypeFilter("All");
    setSortBy("newest");
  }

  const hasActiveFilters =
    Boolean(search) ||
    filter !== "All" ||
    typeFilter !== "All" ||
    sortBy !== "newest";

  // ==========================================
  // FORMAT DATE
  // ==========================================

  function formatDate(dateValue) {
    if (!dateValue) {
      return "Date unavailable";
    }

    const date = new Date(dateValue);

    if (
      Number.isNaN(date.getTime())
    ) {
      return "Date unavailable";
    }

    return date.toLocaleDateString(
      "en-NG",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  }

  // ==========================================
  // NOTIFICATION ICON
  // ==========================================

  function getNotificationIcon(type) {
    switch (type) {
      case "application":
        return "📄";

      case "success":
        return "✅";

      case "warning":
        return "⚠️";

      case "message":
        return "💬";

      case "system":
        return "⚙️";

      default:
        return "🔔";
    }
  }

  // ==========================================
  // MARK ONE AS READ
  // ==========================================

  async function handleMarkAsRead(
    notificationId
  ) {
    const notification =
      notifications.find(
        (item) =>
          item._id === notificationId
      );

    if (
      !notification ||
      notification.isRead
    ) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `${API_URL}/api/notifications/${notificationId}/read`,
        {
          method: "PUT",
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
            "Failed to mark notification as read."
        );
      }

      setNotifications((current) =>
        current.map((item) =>
          item._id === notificationId
            ? {
                ...item,
                isRead: true,
              }
            : item
        )
      );

      decreaseUnreadCount();
    } catch (error) {
      console.error(
        "Mark as read failed:",
        error.message
      );

      setError(error.message);
    }
  }

  // ==========================================
  // MARK ALL AS READ
  // ==========================================

  async function handleMarkAllAsRead() {
    if (localUnreadCount === 0) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `${API_URL}/api/notifications/read-all`,
        {
          method: "PUT",
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
            "Failed to mark all notifications as read."
        );
      }

      setNotifications((current) =>
        current.map(
          (notification) => ({
            ...notification,
            isRead: true,
          })
        )
      );

      clearUnreadCount();
    } catch (error) {
      console.error(
        "Mark all as read failed:",
        error.message
      );

      setError(error.message);
    }
  }

  // ==========================================
  // DELETE NOTIFICATION
  // ==========================================

  async function handleDelete(
    notificationId
  ) {
    try {
      setError("");

      const notificationToDelete =
        notifications.find(
          (notification) =>
            notification._id ===
            notificationId
        );

      const response = await fetch(
        `${API_URL}/api/notifications/${notificationId}`,
        {
          method: "DELETE",
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
            "Failed to delete notification."
        );
      }

      setNotifications((current) =>
        current.filter(
          (notification) =>
            notification._id !==
            notificationId
        )
      );

      if (
        notificationToDelete &&
        !notificationToDelete.isRead
      ) {
        decreaseUnreadCount();
      }
    } catch (error) {
      console.error(
        "Delete notification failed:",
        error.message
      );

      setError(error.message);
    }
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="notifications-page">
        <div className="notifications-container">

          <div className="notifications-loading">
            <p className="page-label">
              STAY UPDATED
            </p>

            <h1>
              Notifications
            </h1>

            <p>
              Loading your notifications...
            </p>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (
    error &&
    notifications.length === 0
  ) {
    return (
      <div className="notifications-page">
        <div className="notifications-container">

          <div className="notifications-error">

            <p className="page-label">
              NOTIFICATIONS
            </p>

            <h1>
              Unable to load notifications
            </h1>

            <p>
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
            >
              Try Again
            </button>

          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <div className="notifications-container">

        {/* =====================================
            HEADER
        ====================================== */}

        <div className="notifications-header">

          <div>
            <p className="page-label">
              STAY UPDATED
            </p>

            <h1>
              Notifications
            </h1>

            <p>
              Keep track of important updates
              from CampusConnect.
            </p>
          </div>

          <div className="notification-summary">

            <strong>
              {localUnreadCount}
            </strong>

            <span>
              Unread
            </span>

          </div>

        </div>

        {/* =====================================
            SUMMARY STATS
        ====================================== */}

        <div className="notifications-stats">

          <div className="notification-stat-card">
            <span>
              Total
            </span>

            <strong>
              {totalNotifications}
            </strong>
          </div>

          <div className="notification-stat-card">
            <span>
              Unread
            </span>

            <strong>
              {localUnreadCount}
            </strong>
          </div>

          <div className="notification-stat-card">
            <span>
              Read
            </span>

            <strong>
              {readCount}
            </strong>
          </div>

        </div>

        {/* =====================================
            FILTERS + ACTIONS
        ====================================== */}

        {totalNotifications > 0 && (
          <div className="notifications-toolbar">

            <div className="notification-search-wrapper">

              <label htmlFor="notificationSearch">
                Search Notifications
              </label>

              <input
                id="notificationSearch"
                type="text"
                placeholder="Search title, message or type..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
              />

            </div>

            <div className="notification-filters">

              <button
                type="button"
                className={
                  filter === "All"
                    ? "notification-filter active"
                    : "notification-filter"
                }
                onClick={() =>
                  setFilter("All")
                }
              >
                All
                <span>
                  {totalNotifications}
                </span>
              </button>

              <button
                type="button"
                className={
                  filter === "Unread"
                    ? "notification-filter active"
                    : "notification-filter"
                }
                onClick={() =>
                  setFilter("Unread")
                }
              >
                Unread
                <span>
                  {localUnreadCount}
                </span>
              </button>

              <button
                type="button"
                className={
                  filter === "Read"
                    ? "notification-filter active"
                    : "notification-filter"
                }
                onClick={() =>
                  setFilter("Read")
                }
              >
                Read
                <span>
                  {readCount}
                </span>
              </button>

            </div>

            <div className="notification-type-sort-controls">

              <div>
                <label htmlFor="notificationType">
                  Type
                </label>

                <select
                  id="notificationType"
                  value={typeFilter}
                  onChange={(event) =>
                    setTypeFilter(
                      event.target.value
                    )
                  }
                >
                  <option value="All">
                    All Types
                  </option>

                  {availableTypes.map(
                    (type) => (
                      <option
                        key={type}
                        value={type}
                      >
                        {type}
                      </option>
                    )
                  )}

                </select>
              </div>

              <div>
                <label htmlFor="notificationSort">
                  Sort by
                </label>

                <select
                  id="notificationSort"
                  value={sortBy}
                  onChange={(event) =>
                    setSortBy(
                      event.target.value
                    )
                  }
                >
                  <option value="newest">
                    Newest First
                  </option>

                  <option value="oldest">
                    Oldest First
                  </option>
                </select>
              </div>

            </div>

            <div className="notification-toolbar-actions">

              {hasActiveFilters && (
                <button
                  type="button"
                  className="notification-clear-filters"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              )}

              {localUnreadCount > 0 && (
                <button
                  type="button"
                  className="mark-all-read-button"
                  onClick={
                    handleMarkAllAsRead
                  }
                >
                  ✓ Mark all as read
                </button>
              )}

            </div>

          </div>
        )}

        {/* =====================================
            ERROR ALERT
        ====================================== */}

        {error && (
          <div className="notifications-inline-error">
            {error}
          </div>
        )}

        {/* =====================================
            RESULTS
        ====================================== */}

        {totalNotifications > 0 && (
          <div className="notifications-result-info">

            <p>
              Showing{" "}
              <strong>
                {filteredNotifications.length}
              </strong>{" "}
              of{" "}
              <strong>
                {totalNotifications}
              </strong>{" "}
              {totalNotifications === 1
                ? "notification"
                : "notifications"}
            </p>

          </div>
        )}

        {/* =====================================
            EMPTY STATE
        ====================================== */}

        {totalNotifications === 0 ? (
          <div className="notifications-empty">

            <div className="notifications-empty-icon">
              🔔
            </div>

            <h2>
              No notifications yet
            </h2>

            <p>
              You're all caught up. New
              updates will appear here.
            </p>

          </div>
        ) : filteredNotifications.length ===
          0 ? (
          <div className="notifications-empty">

            <div className="notifications-empty-icon">
              🔎
            </div>

            <h2>
              No matching notifications
            </h2>

            <p>
              No notifications match your
              current search or filters.
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={clearFilters}
            >
              Clear Filters
            </button>

          </div>
        ) : (
          /* =====================================
             NOTIFICATION LIST
          ====================================== */

          <div className="notifications-list">

            {filteredNotifications.map(
              (notification) => (
                <article
                  className={`notification-card ${
                    notification.isRead
                      ? "read"
                      : "unread"
                  }`}
                  key={notification._id}
                >

                  {/* UNREAD INDICATOR */}

                  {!notification.isRead && (
                    <span className="notification-unread-dot"></span>
                  )}

                  {/* ICON */}

                  <div className="notification-icon">
                    {getNotificationIcon(
                      notification.type
                    )}
                  </div>

                  {/* CONTENT */}

                  <div className="notification-main">

                    <div className="notification-heading">

                      <h2>
                        {notification.title}
                      </h2>

                      {!notification.isRead && (
                        <span className="notification-new-label">
                          New
                        </span>
                      )}

                    </div>

                    <p className="notification-message">
                      {notification.message}
                    </p>

                    <div className="notification-meta">

                      <small>
                        {formatDate(
                          notification.createdAt
                        )}
                      </small>

                      {notification.type && (
                        <span>
                          {notification.type}
                        </span>
                      )}

                    </div>

                    {/* ACTIONS */}

                    <div className="notification-card-actions">

                      {!notification.isRead && (
                        <button
                          type="button"
                          onClick={() =>
                            handleMarkAsRead(
                              notification._id
                            )
                          }
                        >
                          Mark as read
                        </button>
                      )}

                      <button
                        type="button"
                        className="notification-delete"
                        onClick={() =>
                          handleDelete(
                            notification._id
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </article>
              )
            )}

          </div>
        )}

      </div>
    </div>
  );
}

export default Notifications;