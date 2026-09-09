import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute() {
  const {
    isAuthenticated,
    authLoading,
  } = useAuth();

  if (authLoading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          <h2>
            Checking your session...
          </h2>

          <p>
            Please wait while we securely
            verify your account.
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;