import { createContext, useContext, useEffect, useState } from "react";

import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const { token, isAuthenticated } = useAuth();

  const [unreadCount, setUnreadCount] = useState(0);

  async function fetchUnreadCount() {
    if (!token || !isAuthenticated) {
      setUnreadCount(0);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/notifications",
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
            "Failed to fetch notification count."
        );
      }

      setUnreadCount(result.unreadCount);
    } catch (error) {
      console.error(
        "Fetching notification count failed:",
        error.message
      );
    }
  }

  useEffect(() => {
    fetchUnreadCount();
  }, [token, isAuthenticated]);

  function decreaseUnreadCount() {
    setUnreadCount((current) =>
      Math.max(current - 1, 0)
    );
  }

  function clearUnreadCount() {
    setUnreadCount(0);
  }

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        setUnreadCount,
        fetchUnreadCount,
        decreaseUnreadCount,
        clearUnreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}