import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function EmployerLoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/employer/dashboard'

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
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

  return (
    <div className="employer-auth-page">
      {/* Left panel */}
      <div className="employer-auth-left">
        <div className="employer-auth-left-content">
          <Link to="/" className="employer-auth-logo">
            <div className="employer-auth-logo-icon">N</div>
            <span>Nex<span style={{ color: '#A78BFA' }}>CV</span></span>
          </Link>

          <div style={{ marginBottom: 40 }}>
            <h2 className="employer-auth-title">Chào mừng nhà<br />tuyển dụng trở lại 🏢</h2>
            <p className="employer-auth-subtitle">
              Đăng nhập để quản lý tin tuyển dụng và tìm kiếm ứng viên phù hợp với AI.
            </p>
          </div>

          <div className="employer-auth-features">
            {[
              { icon: '📋', title: 'Quản lý tin tuyển dụng', desc: 'Đăng, chỉnh sửa và theo dõi hiệu quả' },
              { icon: '🤖', title: 'AI chấm điểm CV tự động', desc: 'Lọc ứng viên chất lượng trong vài giây' },
              { icon: '📊', title: 'Dashboard thống kê', desc: 'Theo dõi toàn bộ quá trình tuyển dụng' },
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
            <Link to="/login" className="employer-auth-switch-link">
              👤 Bạn là ứng viên? Đăng nhập tại đây
            </Link>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="employer-auth-right">
        <div className="employer-auth-form-wrap">
          {/* Mobile logo */}
          <Link to="/" className="employer-auth-logo mobile-logo">
            <div className="employer-auth-logo-icon">N</div>
            <span style={{ fontWeight: 800, fontSize: 20, color: '#7C3AED' }}>Nex<span style={{ color: '#1E40AF' }}>CV</span></span>
          </Link>

          <div style={{ marginBottom: 28 }}>
            <div className="employer-auth-tag">🏢 Cổng nhà tuyển dụng</div>
            <h1 className="employer-auth-form-title">Đăng nhập</h1>
            <p className="employer-auth-form-sub">
              Chưa có tài khoản?{' '}
              <Link to="/employer/register" className="employer-auth-form-link">
                Đăng ký ngay — miễn phí
              </Link>
            </p>
          </div>

          {error && (
            <div className="employer-auth-error">⚠️ {error}</div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="employer-auth-label">Email công ty</label>
              <Input
                type="email" name="email" value={form.email}
                onChange={handleChange} placeholder="hr@company.com"
                className="employer-auth-input"
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label className="employer-auth-label" style={{ marginBottom: 0 }}>Mật khẩu</label>
                <a href="#" className="employer-auth-forgot">Quên mật khẩu?</a>
              </div>
              <div style={{ position: 'relative' }}>
                <Input
                  type={showPass ? 'text' : 'password'} name="password" value={form.password}
                  onChange={handleChange} placeholder="Nhập mật khẩu"
                  className="employer-auth-input"
                  style={{ paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowPass(v => !v)} className="employer-auth-eye">
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <Button
              type="submit" disabled={loading}
              className="employer-auth-submit-btn"
              style={{ background: loading ? '#A78BFA' : 'linear-gradient(135deg, #7C3AED, #5B21B6)', height: 44 }}
            >
              {loading ? (
                <><svg style={{ animation: 'spin 1s linear infinite', marginRight: 8 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>Đang đăng nhập...</>
              ) : '🏢 Đăng nhập nhà tuyển dụng'}
            </Button>
          </form>

          <p className="employer-auth-terms">
            Bằng cách đăng nhập, bạn đồng ý với{' '}
            <a href="#">Điều khoản dịch vụ</a> và <a href="#">Chính sách bảo mật</a>
          </p>
        </div>
      </div>

      <style>{`
        .employer-auth-page {
          min-height: 100vh; display: flex; background: #F8FAFC;
        }
        .employer-auth-left {
          flex: 1; background: linear-gradient(145deg, #1E1B4B 0%, #4C1D95 60%, #6D28D9 100%);
          display: none; flex-direction: column; justify-content: center; padding: 60px;
          position: relative; overflow: hidden;
        }
        .employer-auth-left::before {
          content: ''; position: absolute; top: -100px; right: -100px;
          width: 400px; height: 400px; border-radius: 50%;
          background: rgba(124,58,237,0.2);
        }
        .employer-auth-left::after {
          content: ''; position: absolute; bottom: -80px; left: -60px;
          width: 300px; height: 300px; border-radius: 50%;
          background: rgba(30,27,75,0.4);
        }
        .employer-auth-left-content { position: relative; z-index: 1; }
        .employer-auth-logo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; margin-bottom: 48px;
          font-weight: 800; font-size: 22px; color: white;
        }
        .employer-auth-logo-icon {
          width: 38px; height: 38px; border-radius: 10px; background: white;
          display: flex; align-items: center; justify-content: center;
          font-weight: 900; font-size: 17px; color: #7C3AED; flex-shrink: 0;
        }
        .employer-auth-title {
          font-size: 34px; font-weight: 800; color: white;
          line-height: 1.25; margin-bottom: 14px;
        }
        .employer-auth-subtitle {
          color: rgba(255,255,255,0.65); font-size: 15px; line-height: 1.7;
        }
        .employer-auth-features { display: flex; flex-direction: column; gap: 14px; margin-bottom: 32px; }
        .employer-auth-feature-item {
          display: flex; gap: 14px; align-items: flex-start;
          background: rgba(255,255,255,0.07); border-radius: 12px;
          padding: 14px 16px; border: 1px solid rgba(255,255,255,0.1);
        }
        .employer-auth-feature-icon { font-size: 22px; flex-shrink: 0; margin-top: 1px; }
        .employer-auth-feature-title { font-size: 14px; font-weight: 600; color: white; margin-bottom: 2px; }
        .employer-auth-feature-desc { font-size: 12px; color: rgba(255,255,255,0.55); }
        .employer-auth-divider-note { padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.15); }
        .employer-auth-switch-link {
          font-size: 13px; color: rgba(255,255,255,0.6); text-decoration: none;
          transition: color 0.15s;
        }
        .employer-auth-switch-link:hover { color: white; }

        .employer-auth-right {
          flex: 1; display: flex; align-items: center; justify-content: center;
          padding: 32px 24px;
        }
        .employer-auth-form-wrap { width: 100%; max-width: 420px; }
        .mobile-logo { margin-bottom: 24px; }
        .employer-auth-tag {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(124,58,237,0.1); color: #7C3AED;
          border: 1px solid rgba(124,58,237,0.2); border-radius: 20px;
          padding: 4px 12px; font-size: 12px; font-weight: 600;
          margin-bottom: 12px;
        }
        .employer-auth-form-title {
          font-size: 26px; font-weight: 800; color: #0F172A; margin-bottom: 6px;
        }
        .employer-auth-form-sub { font-size: 14px; color: #64748B; }
        .employer-auth-form-link { color: #7C3AED; font-weight: 600; text-decoration: none; }
        .employer-auth-form-link:hover { text-decoration: underline; }
        .employer-auth-error {
          background: #FEF2F2; border: 1px solid rgba(239,68,68,0.25);
          border-radius: 10px; padding: 10px 14px;
          font-size: 13px; color: #DC2626; margin-bottom: 4px;
        }
        .employer-auth-label {
          display: block; font-size: 13px; font-weight: 600;
          color: #0F172A; margin-bottom: 6px;
        }
        .employer-auth-input { border-radius: 10px !important; font-size: 14px !important; }
        .employer-auth-forgot { font-size: 12px; color: #7C3AED; text-decoration: none; font-weight: 500; }
        .employer-auth-eye {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: #94A3B8; padding: 0;
          font-size: 16px;
        }
        .employer-auth-submit-btn { width: 100%; font-size: 15px !important; font-weight: 700 !important; }
        .employer-auth-terms {
          text-align: center; margin-top: 20px; font-size: 12px; color: #94A3B8;
        }
        .employer-auth-terms a { color: #7C3AED; text-decoration: none; }

        @media (min-width: 768px) {
          .employer-auth-left { display: flex; }
          .mobile-logo { display: none; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
