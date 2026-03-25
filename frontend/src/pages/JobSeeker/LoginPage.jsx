import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) { setError('Vui lòng điền đầy đủ thông tin'); return }
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err?.message || 'Đăng nhập thất bại. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = () => setForm({ email: 'demo@nexcv.vn', password: 'demo123' })

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: 'var(--bg-base)' }}>
      {/* Left panel */}
      <div style={{ flex: 1, background: 'linear-gradient(160deg, #0F172A 0%, #1549B8 100%)', display: 'none', position: 'relative', overflow: 'hidden', flexDirection: 'column', justifyContent: 'center', padding: 60 }} className="show-desktop">
        <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(124,58,237,0.25)' }} />
        <div style={{ position: 'relative' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 48 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'var(--primary)', fontWeight: 900, fontSize: 16 }}>N</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: 22, color: 'white', letterSpacing: '-0.5px' }}>Nex<span style={{ color: '#A78BFA' }}>CV</span></span>
          </Link>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: 16 }}>
            Chào mừng<br />trở lại! 👋
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15, lineHeight: 1.7, marginBottom: 40 }}>
            Đăng nhập để tiếp tục hành trình sự nghiệp của bạn. AI của chúng tôi luôn sẵn sàng giúp bạn hoàn thiện CV.
          </p>
          {/* Features */}
          {['Chấm điểm CV bằng AI trong 30 giây', 'Tiếp cận 12,000+ việc làm mới nhất', 'Nhận gợi ý cải thiện CV chuyên sâu'].map(feat => (
            <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: 'rgba(52,211,153,0.2)', border: '1px solid rgba(52,211,153,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 10, color: '#34D399' }}>✓</span>
              </div>
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)' }}>{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', minWidth: 0 }}>
        <div style={{ width: '100%', maxWidth: 420 }} className="animate-fade-in">
          <div style={{ marginBottom: 32 }}>
            {/* Mobile logo */}
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 24 }} className="hide-desktop">
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontWeight: 900, fontSize: 14 }}>N</span>
              </div>
              <span style={{ fontWeight: 800, fontSize: 20, color: 'var(--primary)', letterSpacing: '-0.5px' }}>Nex<span style={{ color: '#7C3AED' }}>CV</span></span>
            </Link>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>Đăng nhập</h1>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              Chưa có tài khoản? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Đăng ký ngay</Link>
            </p>
          </div>

          {/* Demo hint */}
          <div onClick={fillDemo} style={{ backgroundColor: 'var(--ai-light)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 20, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#EDE9FE'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--ai-light)'}
          >
            <p style={{ fontSize: 12, color: 'var(--ai)', fontWeight: 500, margin: 0 }}>
              💡 Demo: click để điền tài khoản test — <code style={{ backgroundColor: 'rgba(124,58,237,0.1)', padding: '1px 5px', borderRadius: 4 }}>demo@nexcv.vn / demo123</code>
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{ backgroundColor: 'var(--danger-light)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 16 }}>
              <p style={{ fontSize: 13, color: 'var(--danger)', margin: 0 }}>⚠️ {error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>Email</label>
              <input
                type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="your@email.com" autoComplete="email"
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', color: 'var(--text-primary)', backgroundColor: 'white', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Mật khẩu</label>
                <a href="#" style={{ fontSize: 12, color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>Quên mật khẩu?</a>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                  placeholder="Nhập mật khẩu" autoComplete="current-password"
                  style={{ width: '100%', padding: '10px 44px 10px 14px', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', color: 'var(--text-primary)', backgroundColor: 'white', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                />
                <button type="button" onClick={() => setShowPass(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              style={{ width: '100%', padding: '12px', borderRadius: 10, fontSize: 15, fontWeight: 700, backgroundColor: loading ? '#93C5FD' : 'var(--primary)', color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              {loading ? (
                <><svg style={{ animation: 'spin 1s linear infinite' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg> Đang đăng nhập...</>
              ) : 'Đăng nhập'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: 'var(--text-muted)' }}>
            Bằng cách đăng nhập, bạn đồng ý với{' '}
            <a href="#" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Điều khoản dịch vụ</a>
            {' '}và{' '}
            <a href="#" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Chính sách bảo mật</a>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .show-desktop { display: flex !important; }
          .hide-desktop { display: none !important; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}