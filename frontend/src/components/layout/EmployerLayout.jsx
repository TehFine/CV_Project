import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import EmployerHeader from './EmployerHeader'
import Footer from './Footer'

// Route công khai — không cần đăng nhập
const PUBLIC_ROUTES = [
  '/employer',
  '/employer/login',
  '/employer/register',
]

export default function EmployerLayout({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const isPublic = PUBLIC_ROUTES.includes(location.pathname)

  useEffect(() => {
    if (!loading && !isAuthenticated && !isPublic) {
      navigate('/employer/login', {
        state: { from: location.pathname },
        replace: true,
      })
    }
  }, [isAuthenticated, loading, isPublic])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid #E2E8F0', borderTopColor: '#7C3AED', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ fontSize: 14, color: '#94A3B8' }}>Đang tải...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      <EmployerHeader />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <Footer />
    </div>
  )
}
