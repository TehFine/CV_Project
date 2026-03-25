import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import LoginPage from './pages/JobSeeker/LoginPage'
import RegisterPage from './pages/JobSeeker/RegisterPage'
import JobsPage from './pages/JobSeeker/JobsPage'
import JobDetailPage from './pages/JobSeeker/JobDetailPage'
import CVUploadPage from './pages/CV_AIScore/CVUploadPage'
import ProfilePage from './pages/JobSeeker/ProfilePage'
import CVBuilderPage from './pages/CVBuilder/CVBuilderPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import JobsPage from './pages/JobsPage'
import JobDetailPage from './pages/JobDetailPage'
import CVUploadPage from './pages/CVUploadPage'
import CVBuilderPage from './pages/CVBuilderPage'
import ProfilePage from './pages/ProfilePage'
import EmployerDashboard from './pages/employer/DashboardPage'
import PostJobPage from './pages/employer/PostJobPage'
import ManageJobsPage from './pages/employer/ManageJobsPage'
import CandidatesPage from './pages/employer/CandidatesPage'

function Spinner() {
  return (
    <><AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-base)', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/jobs/:id" element={<JobDetailPage />} />
              <Route path="/cv-upload" element={<CVUploadPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/cv-builder" element={<CVBuilderPage />} />
              <Route path="/cv-builder/:id" element={<CVBuilderPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider><div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="w-8 h-8 border-4 border-[#1549B8] border-t-transparent rounded-full animate-spin" />
      </div></>
  )
}

function ProtectedRoute({ children, requireRole }) {
  const { isAuthenticated, isEmployer, loading } = useAuth()
  if (loading) return <Spinner />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (requireRole === 'employer' && !isEmployer) return <Navigate to="/" replace />
  if (requireRole === 'candidate' && isEmployer) return <Navigate to="/employer/dashboard" replace />
  return children
}

function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/"          element={<HomePage />} />
          <Route path="/login"     element={<LoginPage />} />
          <Route path="/register"  element={<RegisterPage />} />
          <Route path="/jobs"      element={<JobsPage />} />
          <Route path="/jobs/:id"  element={<JobDetailPage />} />
          <Route path="/cv-upload" element={<CVUploadPage />} />
          <Route path="/cv-builder" element={
            <ProtectedRoute requireRole="candidate"><CVBuilderPage /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute requireRole="candidate"><ProfilePage /></ProtectedRoute>
          } />
          {/* Employer */}
          <Route path="/employer/dashboard"  element={<ProtectedRoute requireRole="employer"><EmployerDashboard /></ProtectedRoute>} />
          <Route path="/employer/post-job"   element={<ProtectedRoute requireRole="employer"><PostJobPage /></ProtectedRoute>} />
          <Route path="/employer/jobs"       element={<ProtectedRoute requireRole="employer"><ManageJobsPage /></ProtectedRoute>} />
          <Route path="/employer/candidates" element={<ProtectedRoute requireRole="employer"><CandidatesPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  )
}