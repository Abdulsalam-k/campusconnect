import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "./AuthContext";
import API_URL from "../config/api";

const NotificationContext = createContext();

export function NotificationProvider({
  children,
}) {
  const {
    token,
    isAuthenticated,
  } = useAuth();

  const [unreadCount, setUnreadCount] =
    useState(0);

  // ==========================================
  // FETCH UNREAD NOTIFICATION COUNT
  // ==========================================

  async function fetchUnreadCount() {
    if (
      !token ||
      !isAuthenticated
    ) {
      setUnreadCount(0);
      return;
    }

    try {
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
            "Failed to fetch notification count."
        );
      }

      setUnreadCount(
        result.unreadCount
      );
    } catch (error) {
      console.error(
        "Fetching notification count failed:",
        error.message
      );
    }
  }

  // ==========================================
  // REFRESH COUNT WHEN AUTH CHANGES
  // ==========================================

  useEffect(() => {
    fetchUnreadCount();
  }, [
    token,
    isAuthenticated,
  ]);

  // ==========================================
  // DECREASE UNREAD COUNT
  // ==========================================

  function decreaseUnreadCount() {
    setUnreadCount((current) =>
      Math.max(current - 1, 0)
    );
  }

  // ==========================================
  // CLEAR UNREAD COUNT
  // ==========================================

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
  return useContext(
    NotificationContext
  );
}