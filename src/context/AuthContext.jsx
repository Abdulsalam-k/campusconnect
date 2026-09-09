import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import API_URL from "../config/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser =
        localStorage.getItem(
          "campusconnect_user"
        );

      return savedUser
        ? JSON.parse(savedUser)
        : null;
    } catch (error) {
      console.error(
        "Failed to restore saved user:",
        error
      );

      localStorage.removeItem(
        "campusconnect_user"
      );

      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem(
      "campusconnect_token"
    );
  });

  const [authLoading, setAuthLoading] =
    useState(true);

  // ==========================================
  // LOGIN
  // ==========================================

  function login(userData, userToken) {
    setUser(userData);
    setToken(userToken);

    localStorage.setItem(
      "campusconnect_user",
      JSON.stringify(userData)
    );

    localStorage.setItem(
      "campusconnect_token",
      userToken
    );
  }

  // ==========================================
  // LOGOUT
  // ==========================================

  function logout() {
    setUser(null);
    setToken(null);

    localStorage.removeItem(
      "campusconnect_user"
    );

    localStorage.removeItem(
      "campusconnect_token"
    );
  }

  // ==========================================
  // VALIDATE SAVED SESSION
  // ==========================================

  useEffect(() => {
    async function validateSession() {
      const savedToken =
        localStorage.getItem(
          "campusconnect_token"
        );

      if (!savedToken) {
        setAuthLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${savedToken}`,
            },
          }
        );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Session is no longer valid."
          );
        }

        const freshUser =
          result.data;

        setUser(freshUser);

        localStorage.setItem(
          "campusconnect_user",
          JSON.stringify(freshUser)
        );
      } catch (error) {
        console.error(
          "Session validation failed:",
          error.message
        );

        // Clear invalid or expired session.
        logout();
      } finally {
        setAuthLoading(false);
      }
    }

    validateSession();
  }, []);

  const isAuthenticated =
    Boolean(token && user);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        authLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}