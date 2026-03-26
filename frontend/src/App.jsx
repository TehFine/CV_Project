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

// ── Ứng viên (Job Seeker) ────────────────────────────────────────────────────
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/JobSeeker/LoginPage";
import RegisterPage from "./pages/JobSeeker/RegisterPage";
import JobsPage from "./pages/JobSeeker/JobsPage";
import JobDetailPage from "./pages/JobSeeker/JobDetailPage";
import ProfilePage from "./pages/JobSeeker/ProfilePage";
import CVUploadPage from "./pages/CV_AIScore/CVUploadPage";
import CVBuilderPage from "./pages/CVBuilder/CVBuilderPage";

// ── Nhà tuyển dụng (Employer) ─────────────────────────────────────────────────
import EmployerHomePage from "./pages/employer/EmployerHomePage";
import EmployerLoginPage from "./pages/employer/EmployerLoginPage";
import EmployerRegisterPage from "./pages/employer/EmployerRegisterPage";
import EmployerDashboard from "./pages/employer/EmployerDashboard";
import EmployerJobsPage from "./pages/employer/EmployerJobsPage";
import EmployerJobFormPage from "./pages/employer/EmployerJobFormPage";
import EmployerApplicantsPage from "./pages/employer/EmployerApplicantsPage";

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
  const { isAuthenticated, isEmployer, loading } = useAuth();

  if (loading) return <Spinner />;

  // ❌ chưa đăng nhập
  if (!isAuthenticated) {
    return (
      <Navigate
        to={requireRole === "employer" ? "/employer/login" : "/login"}
        replace
      />
    );
  }

  // ❌ sai role (employer nhưng lại là candidate)
  if (requireRole === "employer" && !isEmployer) {
    return <Navigate to="/" replace />;
  }

  // ❌ candidate nhưng lại là employer
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

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ── Ứng viên — SeekerLayout ── */}
          <Route
            path="/"
            element={
              <SeekerLayout>
                <HomePage />
              </SeekerLayout>
            }
          />
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

          {/* ── Nhà tuyển dụng — auth pages (không cần layout) ── */}
          <Route path="/employer/login" element={<EmployerLoginPage />} />
          <Route path="/employer/register" element={<EmployerRegisterPage />} />

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

          {/* ── Fallback ── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
