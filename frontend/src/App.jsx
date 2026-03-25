// import Home from "./pages/Home"

// function App() {

//   return <Home />

// }

// export default App




import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
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

function App() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  )
}

export default App
