import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function PasswordStrength({ password }) {
  const checks = [password.length >= 8, /[A-Z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password)]
  const score = checks.filter(Boolean).length
  const colors = ['#EF4444', '#F97316', '#EAB308', '#22C55E']
  const labels = ['Rất yếu', 'Yếu', 'Trung bình', 'Mạnh']
  if (!password) return null
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: i <= score ? colors[score - 1] : 'var(--border)', transition: 'background 0.3s' }} />
        ))}
      </div>
      <p style={{ fontSize: 11, color: score <= 1 ? '#EF4444' : score <= 2 ? '#F97316' : score <= 3 ? '#EAB308' : '#22C55E', margin: 0 }}>
        Độ mạnh: {labels[score - 1] || ''}
      </p>
    </div>
  )
}

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [agreed, setAgreed] = useState(false)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Vui lòng nhập họ tên'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Email không hợp lệ'
    if (form.phone && !form.phone.match(/^(0[3-9]\d{8})$/)) errs.phone = 'Số điện thoại không hợp lệ'
    if (form.password.length < 6) errs.password = 'Mật khẩu ít nhất 6 ký tự'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Mật khẩu xác nhận không khớp'
    if (!agreed) errs.agreed = 'Vui lòng đồng ý điều khoản'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await register({ name: form.name, email: form.email, phone: form.phone, password: form.password })
      navigate('/')
    } catch (err) {
      setErrors({ submit: err?.message || 'Đăng ký thất bại. Vui lòng thử lại.' })
    } finally {
      setLoading(false)
    }
  }

  const Field = ({ name, label, type = 'text', placeholder, extra }) => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          type={name === 'password' || name === 'confirmPassword' ? (showPass ? 'text' : 'password') : type}
          name={name} value={form[name]} onChange={handleChange}
          placeholder={placeholder} autoComplete={name === 'password' ? 'new-password' : name === 'email' ? 'email' : undefined}
          style={{ width: '100%', padding: `10px ${(name === 'password' || name === 'confirmPassword') ? '44px' : '14px'} 10px 14px`, border: `1.5px solid ${errors[name] ? 'var(--danger)' : 'var(--border)'}`, borderRadius: 10, fontSize: 14, fontFamily: 'inherit', color: 'var(--text-primary)', backgroundColor: 'white', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
        />
        {(name === 'password' || name === 'confirmPassword') && (
          <button type="button" onClick={() => setShowPass(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}>
            {showPass ? '🙈' : '👁️'}
          </button>
        )}
      </div>
      {name === 'password' && <PasswordStrength password={form.password} />}
      {errors[name] && <p style={{ fontSize: 12, color: 'var(--danger)', margin: '4px 0 0' }}>⚠️ {errors[name]}</p>}
      {extra}
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: 'var(--bg-base)' }}>
      {/* Left panel */}
      <div style={{ flex: 1, background: 'linear-gradient(160deg, #1E1B4B 0%, #4C1D95 100%)', display: 'none', flexDirection: 'column', justifyContent: 'center', padding: 60, position: 'relative', overflow: 'hidden' }} className="show-desktop">
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(21,73,184,0.3)' }} />
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 48 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'var(--primary)', fontWeight: 900, fontSize: 16 }}>N</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 22, color: 'white', letterSpacing: '-0.5px' }}>Nex<span style={{ color: '#A78BFA' }}>CV</span></span>
        </Link>
        <div style={{ position: 'relative' }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: 16 }}>Tạo tài khoản<br />hoàn toàn miễn phí ✨</h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
            Tham gia cùng 50,000+ ứng viên đang sử dụng NexCV để tối ưu hóa CV và tìm kiếm cơ hội việc làm tốt hơn.
          </p>
          {[
            { emoji: '✨', title: 'AI Chấm điểm CV', desc: 'Nhận phân tích chi tiết trong 30 giây' },
            { emoji: '🎯', title: 'Gợi ý việc làm phù hợp', desc: 'Dựa trên kỹ năng và kinh nghiệm của bạn' },
            { emoji: '📊', title: 'Theo dõi ứng tuyển', desc: 'Quản lý mọi đơn ứng tuyển ở một nơi' },
          ].map(feat => (
            <div key={feat.title} style={{ display: 'flex', gap: 14, marginBottom: 16, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '14px 16px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>{feat.emoji}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: 'white', marginBottom: 2 }}>{feat.title}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{feat.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 440 }} className="animate-fade-in">
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 24 }} className="hide-desktop">
            <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontWeight: 900, fontSize: 13 }}>N</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--primary)' }}>Nex<span style={{ color: '#7C3AED' }}>CV</span></span>
          </Link>

          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>Đăng ký tài khoản</h1>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              Đã có tài khoản? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Đăng nhập</Link>
            </p>
          </div>

          {errors.submit && (
            <div style={{ backgroundColor: 'var(--danger-light)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 16 }}>
              <p style={{ fontSize: 13, color: 'var(--danger)', margin: 0 }}>⚠️ {errors.submit}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Field name="name" label="Họ và tên *" placeholder="Nguyễn Văn An" />
            <Field name="email" label="Email *" type="email" placeholder="your@email.com" />
            <Field name="phone" label="Số điện thoại" placeholder="0901 234 567" />
            <Field name="password" label="Mật khẩu *" placeholder="Tối thiểu 6 ký tự" />
            <Field name="confirmPassword" label="Xác nhận mật khẩu *" placeholder="Nhập lại mật khẩu" />

            {/* Terms */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 2, width: 16, height: 16, accentColor: 'var(--primary)', flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Tôi đồng ý với <a href="#" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>Điều khoản dịch vụ</a> và <a href="#" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>Chính sách bảo mật</a> của NexCV
                </span>
              </label>
              {errors.agreed && <p style={{ fontSize: 12, color: 'var(--danger)', margin: '4px 0 0 26px' }}>⚠️ {errors.agreed}</p>}
            </div>

            <button
              type="submit" disabled={loading}
              style={{ width: '100%', padding: '12px', borderRadius: 10, fontSize: 15, fontWeight: 700, backgroundColor: loading ? '#93C5FD' : 'var(--primary)', color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              {loading ? (
                <><svg style={{ animation: 'spin 1s linear infinite' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg> Đang tạo tài khoản...</>
              ) : '🚀 Tạo tài khoản miễn phí'}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) { .show-desktop { display: flex !important; } .hide-desktop { display: none !important; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}