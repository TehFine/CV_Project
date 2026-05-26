import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import EmployerLayout from "./components/layout/EmployerLayout";
import AdminLayout from "./components/layout/AdminLayout";

// ── Ứng viên (Job Seeker) ────────────────────────────────────────────────────
import HomePage from "./pages/Home/HomePage";
import LoginPage from "./pages/JobSeeker/LoginPage";
import RegisterPage from "./pages/JobSeeker/RegisterPage";
import JobsPage from "./pages/JobSeeker/JobsPage";
import JobDetailPage from "./pages/JobSeeker/JobDetailPage";
import ProfilePage from "./pages/JobSeeker/ProfilePage";
import CVUploadPage from "./pages/CV_AIScore/CVUploadPage";
import CVBuilderPage from "./pages/CVBuilder/CVBuilderPage";
import CVHistoryPage from "./pages/JobSeeker/CVHistoryPage";
import ForgotPasswordPage from "./pages/JobSeeker/ForgotPasswordPage";
import ResetPasswordPage from "./pages/JobSeeker/ResetPasswordPage";

// ── Nhà tuyển dụng (Employer) ─────────────────────────────────────────────────
import EmployerHomePage from "./pages/Employer/EmployerHomePage";
import EmployerLoginPage from "./pages/Employer/EmployerLoginPage";
import EmployerRegisterPage from "./pages/Employer/EmployerRegisterPage";
import EmployerProfilePage from "./pages/Employer/EmployerProfilePage";
import EmployerDashboard from "./pages/Employer/EmployerDashboard";
import EmployerJobsPage from "./pages/Employer/EmployerJobsPage";
import EmployerJobFormPage from "./pages/Employer/EmployerJobFormPage";
import EmployerApplicantsPage from "./pages/Employer/EmployerApplicantsPage";

// ── Quản trị viên (Admin) ─────────────────────────────────────────────────────
import AdminLoginPage from "./pages/Admin/LoginPage";
import AdminDashboard from "./pages/Admin/DashboardPage";
import AdminUsersPage from "./pages/Admin/UsersPage";
import AdminJobsPage from "./pages/Admin/JobsPage";
import AdminJobDetailsPage from "./pages/Admin/AdminJobDetailsPage";
import AdminCVScoresPage from "./pages/Admin/AdminCVScoresPage";
import AdminNotificationsPage from "./pages/Admin/AdminNotificationsPage";
import AdminReportsPage from "./pages/Admin/AdminReportsPage";
import AdminSettingsPage from "./pages/Admin/AdminSettingsPage";
import NotFoundPage from "./pages/NotFoundPage";

// ── Spinner ───────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="w-8 h-8 border-4 border-[#1549B8] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// ── Protected Route ───────────────────────────────────────────────────────────
function ProtectedRoute({ children, requireRole }) {
  const { isAuthenticated, isEmployer, isAdmin, loading } = useAuth();

  if (loading) return <Spinner />;

  // ❌ Chưa đăng nhập
  if (!isAuthenticated) {
    if (requireRole === "admin") return <Navigate to="/admin/login" replace />;
    return (
      <Navigate
        to={requireRole === "employer" ? "/employer/login" : "/login"}
        replace
      />
    );
  }

  // ❌ Nếu yêu cầu Admin nhưng không phải Admin → ẩn trang, hiển thị 404
  if (requireRole === "admin" && !isAdmin) {
    return <Navigate to="/404" replace />;
  }

  // ❌ Nếu là Admin nhưng cố truy cập trang của Candidate/Employer
  if (isAdmin && requireRole !== "admin") {
    return <Navigate to="/admin" replace />;
  }

  // ❌ Nếu yêu cầu Employer nhưng là Candidate
  if (requireRole === "employer" && !isEmployer) {
    return <Navigate to="/" replace />;
  }

  // ❌ Nếu yêu cầu Candidate nhưng là Employer
  if (requireRole === "candidate" && isEmployer) {
    return <Navigate to="/employer/dashboard" replace />;
  }

  return children;
}

// ── Guest Route (Chỉ cho phép khi chưa đăng nhập) ─────────────────────────────
function GuestRoute({ children }) {
  const { isAuthenticated, isEmployer, isAdmin, loading } = useAuth();

  if (loading) return <Spinner />;

  if (isAuthenticated) {
    if (isAdmin) return <Navigate to="/admin" replace />;
    if (isEmployer) return <Navigate to="/employer/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}

// ── Layout ứng viên — dùng Header/Footer cũ ──────────────────────────────────
function SeekerLayout({ children }) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: "var(--bg-base)",
        fontFamily: "'Be Vietnam Pro', sans-serif",
      }}
    >
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function HomeRoute() {
  const { isEmployer, isAdmin, loading } = useAuth();
  if (loading) return <Spinner />;
  if (isAdmin) return <Navigate to="/admin" replace />;
  if (isEmployer) return <Navigate to="/employer/dashboard" replace />;
  return (
    <SeekerLayout>
      <HomePage />
    </SeekerLayout>
  );
}

function EmployerHomeRoute() {
  const { isEmployer, isAdmin, loading } = useAuth();
  if (loading) return <Spinner />;
  if (isAdmin) return <Navigate to="/admin" replace />;
  if (isEmployer) return <Navigate to="/employer/dashboard" replace />;
  return (
    <EmployerLayout>
      <EmployerHomePage />
    </EmployerLayout>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
function EmployerLoginRoute() {
  return (
    <GuestRoute>
      <EmployerLayout>
        <EmployerLoginPage />
      </EmployerLayout>
    </GuestRoute>
  );
}

function EmployerRegisterRoute() {
  const { isAuthenticated, isEmployer, isAdmin, loading, user, logout } = useAuth();

  useEffect(() => {
    // Chỉ thực hiện logout cho candidate muốn đăng ký employer
    // KHÔNG logout admin
    if (!loading && isAuthenticated && !isEmployer && !isAdmin) {
      sessionStorage.setItem('employer_register_prefill', JSON.stringify({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
      }));
      logout();
    }
  }, [isAuthenticated, isEmployer, isAdmin, loading, user, logout]);

  if (loading) return <Spinner />;

  // Admin -> về admin portal
  if (isAdmin) return <Navigate to="/admin" replace />;

  // Employer -> về dashboard
  if (isAuthenticated && isEmployer) {
    return <Navigate to="/employer/dashboard" replace />;
  }

  // Nếu là candidate đang trong quá trình logout
  if (isAuthenticated && !isEmployer) return <Spinner />;

  return (
    <EmployerLayout>
      <EmployerRegisterPage />
    </EmployerLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ── Ứng viên — SeekerLayout ── */}
          <Route path="/" element={<HomeRoute />} />
          <Route
            path="/login"
            element={
              <GuestRoute>
                <SeekerLayout>
                  <LoginPage />
                </SeekerLayout>
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <SeekerLayout>
                  <RegisterPage />
                </SeekerLayout>
              </GuestRoute>
            }
          />
          <Route
            path="/jobs"
            element={
              <SeekerLayout>
                <JobsPage />
              </SeekerLayout>
            }
          />
          <Route
            path="/jobs/:id"
            element={
              <SeekerLayout>
                <JobDetailPage />
              </SeekerLayout>
            }
          />
          <Route
            path="/cv-upload"
            element={
              <SeekerLayout>
                <CVUploadPage />
              </SeekerLayout>
            }
          />
          <Route
            path="/cv-builder"
            element={
              <SeekerLayout>
                <ProtectedRoute requireRole="candidate">
                  <CVBuilderPage />
                </ProtectedRoute>
              </SeekerLayout>
            }
          />
          <Route
            path="/cv-builder/:id"
            element={
              <SeekerLayout>
                <ProtectedRoute requireRole="candidate">
                  <CVBuilderPage />
                </ProtectedRoute>
              </SeekerLayout>
            }
          />
          <Route
            path="/profile"
            element={
              <SeekerLayout>
                <ProtectedRoute requireRole="candidate">
                  <ProfilePage />
                </ProtectedRoute>
              </SeekerLayout>
            }
          />
          <Route
            path="/cv-history"
            element={
              <SeekerLayout>
                <ProtectedRoute requireRole="candidate">
                  <CVHistoryPage />
                </ProtectedRoute>
              </SeekerLayout>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <GuestRoute>
                <SeekerLayout>
                  <ForgotPasswordPage />
                </SeekerLayout>
              </GuestRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <GuestRoute>
                <SeekerLayout>
                  <ResetPasswordPage />
                </SeekerLayout>
              </GuestRoute>
            }
          />

          {/* ── Nhà tuyển dụng — auth pages ── */}
          <Route path="/employer/login" element={<EmployerLoginRoute />} />
          <Route path="/employer/register" element={<EmployerRegisterRoute />} />

          {/* ── Nhà tuyển dụng — EmployerLayout (header riêng) ── */}
          <Route
            path="/employer"
            element={<EmployerHomeRoute />}
          />
          <Route
            path="/employer/dashboard"
            element={
              <EmployerLayout>
                <ProtectedRoute requireRole="employer">
                  <EmployerDashboard />
                </ProtectedRoute>
              </EmployerLayout>
            }
          />
          <Route
            path="/employer/jobs"
            element={
              <EmployerLayout>
                <ProtectedRoute requireRole="employer">
                  <EmployerJobsPage />
                </ProtectedRoute>
              </EmployerLayout>
            }
          />
          <Route
            path="/employer/profile"
            element={
              <EmployerLayout>
                <ProtectedRoute requireRole="employer">
                  <EmployerProfilePage />
                </ProtectedRoute>
              </EmployerLayout>
            }
          />
          <Route
            path="/employer/jobs/new"
            element={
              <EmployerLayout>
                <ProtectedRoute requireRole="employer">
                  <EmployerJobFormPage />
                </ProtectedRoute>
              </EmployerLayout>
            }
          />
          <Route
            path="/employer/jobs/:id/edit"
            element={
              <EmployerLayout>
                <ProtectedRoute requireRole="employer">
                  <EmployerJobFormPage />
                </ProtectedRoute>
              </EmployerLayout>
            }
          />
          <Route
            path="/employer/jobs/:id/applicants"
            element={
              <EmployerLayout>
                <ProtectedRoute requireRole="employer">
                  <EmployerApplicantsPage />
                </ProtectedRoute>
              </EmployerLayout>
            }
          />

          {/* ── Quản trị viên (Admin) ── */}
          <Route
            path="/admin/login"
            element={
              <GuestRoute>
                <AdminLoginPage />
              </GuestRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="jobs" element={<AdminJobsPage />} />
            <Route path="jobs/:id" element={<AdminJobDetailsPage />} />
            <Route path="cv-scores" element={<AdminCVScoresPage />} />
            <Route path="notifications" element={<AdminNotificationsPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          {/* ── 404 & Fallback ── */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
