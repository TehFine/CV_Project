import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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

  // ❌ Nếu yêu cầu Admin nhưng không phải Admin
  if (requireRole === "admin" && !isAdmin) {
    return <Navigate to="/" replace />;
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
  const { isEmployer, loading } = useAuth();
  if (loading) return <Spinner />;
  if (isEmployer) return <Navigate to="/employer/dashboard" replace />;
  return (
    <SeekerLayout>
      <HomePage />
    </SeekerLayout>
  );
}
// ── App ───────────────────────────────────────────────────────────────────────
function EmployerLoginRoute() {
  const { isAuthenticated, isEmployer, loading } = useAuth();
  if (loading) return <Spinner />;
  if (isAuthenticated) {
    return isEmployer ? <Navigate to="/employer/dashboard" replace /> : <Navigate to="/" replace />;
  }
  return (
    <EmployerLayout>
      <EmployerLoginPage />
    </EmployerLayout>
  );
}

function EmployerRegisterRoute() {
  const { isAuthenticated, isEmployer, loading } = useAuth();
  if (loading) return <Spinner />;
  if (isAuthenticated) {
    return isEmployer ? <Navigate to="/employer/dashboard" replace /> : <Navigate to="/" replace />;
  }
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
              <SeekerLayout>
                <LoginPage />
              </SeekerLayout>
            }
          />
          <Route
            path="/register"
            element={
              <SeekerLayout>
                <RegisterPage />
              </SeekerLayout>
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

          {/* ── Nhà tuyển dụng — auth pages ── */}
          <Route path="/employer/login" element={<EmployerLoginRoute />} />
          <Route path="/employer/register" element={<EmployerRegisterRoute />} />

          {/* ── Nhà tuyển dụng — EmployerLayout (header riêng) ── */}
          <Route
            path="/employer"
            element={
              <EmployerLayout>
                <EmployerHomePage />
              </EmployerLayout>
            }
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
          <Route path="/admin/login" element={<AdminLoginPage />} />
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
            {/* Các trang khác có thể thêm sau */}
            <Route path="jobs" element={<AdminJobsPage />} />
            <Route path="cv-scores" element={<div className="p-6">Lịch sử chấm CV (Comming Soon)</div>} />
            <Route path="reports" element={<div className="p-6">Báo cáo (Comming Soon)</div>} />
            <Route path="settings" element={<div className="p-6">Cài đặt (Comming Soon)</div>} />
          </Route>

          {/* ── Fallback ── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
