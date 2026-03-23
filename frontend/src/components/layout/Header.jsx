import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NAV_LINKS = [
  { href: '/jobs', label: 'Việc làm' },
  { href: '/cv-upload', label: 'Chấm điểm CV' },
]

function AvatarFallback({ name, size = 36 }) {
  const initials = name
    ?.split(' ')
    .slice(-2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || 'U'

  return (
    <div
      style={{ width: size, height: size, backgroundColor: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.38, fontWeight: 700, color: 'white', flexShrink: 0 }}
    >
      {initials}
    </div>
  )
}

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const isHome = location.pathname === '/'

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const close = (e) => {
      if (!e.target.closest('#user-dropdown')) setDropdownOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
    navigate('/')
  }

  const isActive = (href) => location.pathname === href || location.pathname.startsWith(href + '/')

  const headerBg = scrolled || !isHome
    ? 'rgba(255,255,255,0.97)'
    : 'transparent'

  const headerStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0,
    zIndex: 50,
    backgroundColor: headerBg,
    boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
    backdropFilter: scrolled || !isHome ? 'blur(12px)' : 'none',
    transition: 'all 0.25s ease',
    borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
  }

  const logoColor = !scrolled && isHome ? 'white' : 'var(--primary)'
  const linkColor = !scrolled && isHome ? 'rgba(255,255,255,0.9)' : 'var(--text-secondary)'
  const linkActiveColor = !scrolled && isHome ? 'white' : 'var(--primary)'

  return (
    <>
      <header style={headerStyle}>
        <div className="container-app" style={{ display: 'flex', alignItems: 'center', height: 64, gap: 32 }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontWeight: 900, fontSize: 14 }}>N</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: 20, color: logoColor, transition: 'color 0.25s', letterSpacing: '-0.5px' }}>
              Nex<span style={{ color: '#7C3AED' }}>CV</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1 }} className="hidden-mobile">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                style={{
                  padding: '6px 14px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: isActive(l.href) ? 600 : 500,
                  color: isActive(l.href) ? linkActiveColor : linkColor,
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  backgroundColor: isActive(l.href) ? (scrolled || !isHome ? 'var(--primary-light)' : 'rgba(255,255,255,0.15)') : 'transparent',
                }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }} className="hidden-mobile">
            {isAuthenticated ? (
              <div id="user-dropdown" style={{ position: 'relative' }}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px', borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = scrolled || !isHome ? 'var(--bg-subtle)' : 'rgba(255,255,255,0.15)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <AvatarFallback name={user?.name} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: scrolled || !isHome ? 'var(--text-primary)' : 'white', lineHeight: 1.2 }}>{user?.name?.split(' ').slice(-1)[0]}</div>
                    <div style={{ fontSize: 11, color: scrolled || !isHome ? 'var(--text-muted)' : 'rgba(255,255,255,0.7)' }}>Ứng viên</div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={scrolled || !isHome ? '#94A3B8' : 'rgba(255,255,255,0.7)'} strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                </button>

                {dropdownOpen && (
                  <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: 200, backgroundColor: 'white', borderRadius: 12, boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)', overflow: 'hidden', animation: 'fadeInUp 0.15s ease' }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{user?.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{user?.email}</div>
                    </div>
                    {[
                      { href: '/profile', icon: '👤', label: 'Hồ sơ của tôi' },
                      { href: '/cv-upload', icon: '📄', label: 'Chấm điểm CV' },
                      { href: '/profile?tab=saved', icon: '🔖', label: 'Việc làm đã lưu' },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setDropdownOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none', transition: 'background 0.15s' }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-subtle)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <span>{item.icon}</span> {item.label}
                      </Link>
                    ))}
                    <div style={{ borderTop: '1px solid var(--border)' }}>
                      <button
                        onClick={handleLogout}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 16px', fontSize: 13, color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s' }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--danger-light)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <span>🚪</span> Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  style={{ padding: '7px 16px', borderRadius: 8, fontSize: 14, fontWeight: 500, color: scrolled || !isHome ? 'var(--text-primary)' : 'white', textDecoration: 'none', border: '1.5px solid', borderColor: scrolled || !isHome ? 'var(--border)' : 'rgba(255,255,255,0.5)', transition: 'all 0.2s' }}
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  style={{ padding: '7px 16px', borderRadius: 8, fontSize: 14, fontWeight: 600, backgroundColor: 'var(--primary)', color: 'white', textDecoration: 'none', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(21,73,184,0.3)' }}
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            style={{ display: 'none', marginLeft: 'auto', border: 'none', background: 'transparent', cursor: 'pointer', padding: 4 }}
            className="show-mobile"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={scrolled || !isHome ? 'var(--text-primary)' : 'white'} strokeWidth="2">
              {menuOpen ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></> : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ backgroundColor: 'white', borderTop: '1px solid var(--border)', padding: '16px 24px 24px', animation: 'fadeIn 0.2s ease' }}>
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                onClick={() => setMenuOpen(false)}
                style={{ display: 'block', padding: '12px 0', fontSize: 15, fontWeight: 500, color: isActive(l.href) ? 'var(--primary)' : 'var(--text-secondary)', textDecoration: 'none', borderBottom: '1px solid var(--border)' }}
              >
                {l.label}
              </Link>
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              {isAuthenticated ? (
                <>
                  <Link to="/profile" onClick={() => setMenuOpen(false)} style={{ flex: 1, padding: '10px', textAlign: 'center', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', textDecoration: 'none' }}>Hồ sơ</Link>
                  <button onClick={handleLogout} style={{ flex: 1, padding: '10px', backgroundColor: 'var(--danger-light)', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 500, color: 'var(--danger)', cursor: 'pointer' }}>Đăng xuất</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)} style={{ flex: 1, padding: '10px', textAlign: 'center', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', textDecoration: 'none' }}>Đăng nhập</Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} style={{ flex: 1, padding: '10px', textAlign: 'center', backgroundColor: 'var(--primary)', borderRadius: 8, fontSize: 14, fontWeight: 600, color: 'white', textDecoration: 'none' }}>Đăng ký</Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Spacer for fixed header */}
      {!isHome && <div style={{ height: 64 }} />}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }
      `}</style>
    </>
  )
}