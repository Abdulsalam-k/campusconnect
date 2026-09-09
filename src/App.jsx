import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";


import Home from "./pages/Home";
import Students from "./pages/Students";
import StudentDetails from "./pages/StudentDetails";
import Opportunities from "./pages/Opportunities";
import OpportunityDetails from "./pages/OpportunityDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";


import Apply from "./pages/Apply";
import Dashboard from "./pages/Dashboard";
import Applications from "./pages/Applications";
import Profile from "./pages/Profile";
import SavedOpportunities from "./pages/SavedOpportunities";
import Notifications from "./pages/Notifications";


import RecruiterDashboard from "./pages/RecruiterDashboard";
import CreateOpportunity from "./pages/CreateOpportunity";
import EditOpportunity from "./pages/EditOpportunity";
import ApplicantDetails from "./pages/ApplicantDetails";


import AdminDashboard from "./pages/AdminDashboard";
import AdminUserDetails from "./pages/AdminUserDetails";
import AdminApplications from "./pages/AdminApplications";


import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/students" element={<Students />} />
        <Route path="/students/:id" element={<StudentDetails />} />

        <Route path="/opportunities" element={<Opportunities />} />
        <Route
          path="/opportunities/:id"
          element={<OpportunityDetails />}
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />

        {/* Authenticated */}
        <Route element={<ProtectedRoute />}>
          {/* Student */}
          <Route
            element={<RoleRoute allowedRoles={["student"]} />}
          >
            <Route
              path="/opportunities/:id/apply"
              element={<Apply />}
            />

            <Route path="/applications" element={<Applications />} />

            <Route path="/dashboard" element={<Dashboard />} />

            <Route
              path="/saved-opportunities"
              element={<SavedOpportunities />}
            />
          </Route>

          {/* All authenticated users */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />

          {/* Recruiter + Admin */}
          <Route
            element={
              <RoleRoute allowedRoles={["recruiter", "admin"]} />
            }
          >
            <Route
              path="/recruiter-dashboard"
              element={<RecruiterDashboard />}
            />

            <Route
              path="/create-opportunity"
              element={<CreateOpportunity />}
            />

            <Route
              path="/opportunities/:id/edit"
              element={<EditOpportunity />}
            />

            <Route
              path="/recruiter/applications/:id"
              element={<ApplicantDetails />}
            />
          </Route>

          {/* Admin */}
          <Route element={<RoleRoute allowedRoles={["admin"]} />}>
            <Route
              path="/admin-dashboard"
              element={<AdminDashboard />}
            />

            <Route
              path="/admin/users/:id"
              element={<AdminUserDetails />}
            />

            <Route
              path="/admin-applications"
              element={<AdminApplications />}
            />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
