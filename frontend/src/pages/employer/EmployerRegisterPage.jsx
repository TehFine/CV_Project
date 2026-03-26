import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

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
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: i <= score ? colors[score-1] : '#E2E8F0', transition: 'background 0.3s' }} />
        ))}
      </div>
      <p style={{ fontSize: 11, color: score <= 1 ? '#EF4444' : score <= 2 ? '#F97316' : score <= 3 ? '#EAB308' : '#22C55E', margin: 0 }}>
        Độ mạnh: {labels[score-1] || ''}
      </p>
    </div>
  )
}

export default function EmployerRegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
    companyName: '', companyWebsite: '', industry: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [agreed, setAgreed] = useState(false)

  const set = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) setErrors(p => ({ ...p, [e.target.name]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Vui lòng nhập họ tên'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Email không hợp lệ'
    if (form.phone && !form.phone.match(/^(0[3-9]\d{8})$/)) errs.phone = 'Số điện thoại không hợp lệ'
    if (!form.companyName.trim()) errs.companyName = 'Vui lòng nhập tên công ty'
    if (form.password.length < 6) errs.password = 'Mật khẩu ít nhất 6 ký tự'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Mật khẩu không khớp'
    if (!agreed) errs.agreed = 'Vui lòng đồng ý điều khoản'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await register({
        name: form.name, email: form.email, phone: form.phone,
        password: form.password, role: 'recruiter',
        companyName: form.companyName, companyWebsite: form.companyWebsite,
        industry: form.industry,
      })
      navigate('/employer/dashboard')
    } catch (err) {
      setErrors({ submit: err?.message || 'Đăng ký thất bại. Vui lòng thử lại.' })
    } finally {
      setLoading(false)
    }
  }

  const Field = ({ name, label, type = 'text', placeholder, required }) => (
    <div>
      <label className="employer-auth-label">
        {label} {required && <span style={{ color: '#EF4444' }}>*</span>}
      </label>
      <div style={{ position: 'relative' }}>
        <Input
          type={name === 'password' || name === 'confirmPassword' ? (showPass ? 'text' : 'password') : type}
          name={name} value={form[name]} onChange={set} placeholder={placeholder}
          style={{ borderColor: errors[name] ? '#EF4444' : undefined, borderRadius: 10, paddingRight: (name === 'password' || name === 'confirmPassword') ? 44 : undefined }}
        />
        {(name === 'password' || name === 'confirmPassword') && (
          <button type="button" onClick={() => setShowPass(v => !v)} className="employer-auth-eye">
            {showPass ? '🙈' : '👁️'}
          </button>
        )}
      </div>
      {name === 'password' && <PasswordStrength password={form.password} />}
      {errors[name] && <p style={{ fontSize: 12, color: '#EF4444', margin: '4px 0 0' }}>⚠️ {errors[name]}</p>}
    </div>
  )

  return (
    <div className="employer-auth-page">
      {/* Left panel */}
      <div className="employer-auth-left">
        <div className="employer-auth-left-content">
          <Link to="/" className="employer-auth-logo">
            <div className="employer-auth-logo-icon">N</div>
            <span>Nex<span style={{ color: '#A78BFA' }}>CV</span></span>
          </Link>
          <h2 className="employer-auth-title">Bắt đầu tuyển dụng<br />thông minh hơn ✨</h2>
          <p className="employer-auth-subtitle">
            Tham gia cùng 2,000+ nhà tuyển dụng đang dùng NexCV để tìm ứng viên chất lượng nhanh hơn với AI.
          </p>
          <div className="employer-auth-features">
            {[
              { icon: '🆓', title: 'Miễn phí hoàn toàn', desc: 'Không mất phí để đăng ký và sử dụng' },
              { icon: '🤖', title: 'AI matching tự động', desc: 'Tìm ứng viên phù hợp trong vài giây' },
              { icon: '📬', title: 'Quản lý hồ sơ dễ dàng', desc: 'Xem, lọc và liên hệ ứng viên tiện lợi' },
            ].map(f => (
              <div key={f.title} className="employer-auth-feature-item">
                <span className="employer-auth-feature-icon">{f.icon}</span>
                <div>
                  <div className="employer-auth-feature-title">{f.title}</div>
                  <div className="employer-auth-feature-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="employer-auth-divider-note">
            <Link to="/register" className="employer-auth-switch-link">
              👤 Bạn là ứng viên? Đăng ký tại đây
            </Link>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="employer-auth-right" style={{ alignItems: 'flex-start', paddingTop: 40, overflowY: 'auto' }}>
        <div className="employer-auth-form-wrap">
          <Link to="/" className="employer-auth-logo mobile-logo">
            <div className="employer-auth-logo-icon">N</div>
            <span style={{ fontWeight: 800, fontSize: 20, color: '#7C3AED' }}>NexCV</span>
          </Link>

          <div style={{ marginBottom: 24 }}>
            <div className="employer-auth-tag">🏢 Đăng ký nhà tuyển dụng</div>
            <h1 className="employer-auth-form-title">Tạo tài khoản</h1>
            <p className="employer-auth-form-sub">
              Đã có tài khoản?{' '}
              <Link to="/employer/login" className="employer-auth-form-link">Đăng nhập</Link>
            </p>
          </div>

          {errors.submit && (
            <div className="employer-auth-error" style={{ marginBottom: 16 }}>⚠️ {errors.submit}</div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Thông tin cá nhân */}
            <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: 12, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>👤 Thông tin cá nhân</p>
              <Field name="name" label="Họ và tên" placeholder="Nguyễn Văn An" required />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field name="email" label="Email" type="email" placeholder="hr@company.com" required />
                <Field name="phone" label="Số điện thoại" placeholder="0901 234 567" />
              </div>
            </div>

            {/* Thông tin công ty */}
            <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: 12, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>🏢 Thông tin công ty</p>
              <Field name="companyName" label="Tên công ty" placeholder="Công ty TNHH ABC" required />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field name="companyWebsite" label="Website" placeholder="https://company.com" />
                <div>
                  <label className="employer-auth-label">Lĩnh vực</label>
                  <select name="industry" value={form.industry} onChange={set}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', color: '#0F172A', background: 'white' }}>
                    <option value="">Chọn lĩnh vực</option>
                    {['Công nghệ thông tin', 'Tài chính - Ngân hàng', 'Thương mại điện tử', 'Marketing', 'Giáo dục', 'Y tế', 'Xây dựng', 'Sản xuất', 'Khác'].map(i => (
                      <option key={i} value={i}>{i}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Mật khẩu */}
            <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: 12, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>🔒 Bảo mật</p>
              <Field name="password" label="Mật khẩu" placeholder="Tối thiểu 6 ký tự" required />
              <Field name="confirmPassword" label="Xác nhận mật khẩu" placeholder="Nhập lại mật khẩu" required />
            </div>

            {/* Terms */}
            <div>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                  style={{ marginTop: 2, width: 16, height: 16, accentColor: '#7C3AED', flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5 }}>
                  Tôi đồng ý với <a href="#" style={{ color: '#7C3AED', textDecoration: 'none', fontWeight: 500 }}>Điều khoản dịch vụ</a> và <a href="#" style={{ color: '#7C3AED', textDecoration: 'none', fontWeight: 500 }}>Chính sách bảo mật</a>
                </span>
              </label>
              {errors.agreed && <p style={{ fontSize: 12, color: '#EF4444', margin: '4px 0 0 26px' }}>⚠️ {errors.agreed}</p>}
            </div>

            <Button type="submit" disabled={loading}
              style={{ background: loading ? '#A78BFA' : 'linear-gradient(135deg, #7C3AED, #5B21B6)', height: 44, fontSize: 15, fontWeight: 700 }}
            >
              {loading ? (
                <><svg style={{ animation: 'spin 1s linear infinite', marginRight: 8 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>Đang tạo tài khoản...</>
              ) : '🚀 Tạo tài khoản nhà tuyển dụng'}
            </Button>
          </form>
        </div>
      </div>

      <style>{`
        .employer-auth-page { min-height: 100vh; display: flex; background: #F8FAFC; }
        .employer-auth-left { flex: 1; background: linear-gradient(145deg, #1E1B4B 0%, #4C1D95 60%, #6D28D9 100%); display: none; flex-direction: column; justify-content: center; padding: 60px; position: relative; overflow: hidden; }
        .employer-auth-left::before { content: ''; position: absolute; top: -100px; right: -100px; width: 400px; height: 400px; border-radius: 50%; background: rgba(124,58,237,0.2); }
        .employer-auth-left-content { position: relative; z-index: 1; }
        .employer-auth-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; margin-bottom: 40px; font-weight: 800; font-size: 22px; color: white; }
        .employer-auth-logo-icon { width: 38px; height: 38px; border-radius: 10px; background: white; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 17px; color: #7C3AED; flex-shrink: 0; }
        .employer-auth-title { font-size: 32px; font-weight: 800; color: white; line-height: 1.25; margin-bottom: 12px; }
        .employer-auth-subtitle { color: rgba(255,255,255,0.65); font-size: 15px; line-height: 1.7; margin-bottom: 28px; }
        .employer-auth-features { display: flex; flex-direction: column; gap: 12px; margin-bottom: 28px; }
        .employer-auth-feature-item { display: flex; gap: 14px; align-items: flex-start; background: rgba(255,255,255,0.07); border-radius: 12px; padding: 14px 16px; border: 1px solid rgba(255,255,255,0.1); }
        .employer-auth-feature-icon { font-size: 20px; flex-shrink: 0; }
        .employer-auth-feature-title { font-size: 13px; font-weight: 600; color: white; margin-bottom: 2px; }
        .employer-auth-feature-desc { font-size: 12px; color: rgba(255,255,255,0.55); }
        .employer-auth-divider-note { padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.15); }
        .employer-auth-switch-link { font-size: 13px; color: rgba(255,255,255,0.6); text-decoration: none; }
        .employer-auth-switch-link:hover { color: white; }
        .employer-auth-right { flex: 1; display: flex; justify-content: center; padding: 32px 24px; }
        .employer-auth-form-wrap { width: 100%; max-width: 460px; }
        .mobile-logo { margin-bottom: 24px; }
        .employer-auth-tag { display: inline-flex; align-items: center; gap: 6px; background: rgba(124,58,237,0.1); color: #7C3AED; border: 1px solid rgba(124,58,237,0.2); border-radius: 20px; padding: 4px 12px; font-size: 12px; font-weight: 600; margin-bottom: 10px; }
        .employer-auth-form-title { font-size: 26px; font-weight: 800; color: #0F172A; margin-bottom: 6px; }
        .employer-auth-form-sub { font-size: 14px; color: #64748B; }
        .employer-auth-form-link { color: #7C3AED; font-weight: 600; text-decoration: none; }
        .employer-auth-error { background: #FEF2F2; border: 1px solid rgba(239,68,68,0.25); border-radius: 10px; padding: 10px 14px; font-size: 13px; color: #DC2626; }
        .employer-auth-label { display: block; font-size: 13px; font-weight: 600; color: #0F172A; margin-bottom: 6px; }
        .employer-auth-eye { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #94A3B8; padding: 0; font-size: 16px; }
        @media (min-width: 768px) { .employer-auth-left { display: flex; } .mobile-logo { display: none; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
