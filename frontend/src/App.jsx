import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import JobsPage from './pages/JobsPage'
import JobDetailPage from './pages/JobDetailPage'
import CVUploadPage from './pages/CVUploadPage'
import ProfilePage from './pages/ProfilePage'

// ── Employer pages ──────────────────────────────────────────────────────────
import EmployerDashboard from './pages/employer/EmployerDashboard'
import EmployerJobsPage from './pages/employer/EmployerJobsPage'
import EmployerJobFormPage from './pages/employer/EmployerJobFormPage'
import EmployerApplicantsPage from './pages/employer/EmployerApplicantsPage'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-base)', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
          <Header />
          <main className="flex-1">
            <Routes>
              {/* ── Người tìm việc ── */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/jobs/:id" element={<JobDetailPage />} />
              <Route path="/cv-upload" element={<CVUploadPage />} />
              <Route path="/profile" element={<ProfilePage />} />

              {/* ── Nhà tuyển dụng ── */}
              <Route path="/employer/dashboard" element={<EmployerDashboard />} />
              <Route path="/employer/jobs" element={<EmployerJobsPage />} />
              <Route path="/employer/jobs/new" element={<EmployerJobFormPage />} />
              <Route path="/employer/jobs/:id/edit" element={<EmployerJobFormPage />} />
              <Route path="/employer/jobs/:id/applicants" element={<EmployerApplicantsPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
