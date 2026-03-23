import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#0F172A', color: 'rgba(255,255,255,0.7)', marginTop: 'auto' }}>
      <div className="container-app" style={{ paddingTop: 48, paddingBottom: 48 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 40 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontWeight: 900, fontSize: 12 }}>N</span>
              </div>
              <span style={{ fontWeight: 800, fontSize: 18, color: 'white', letterSpacing: '-0.5px' }}>
                Nex<span style={{ color: '#A78BFA' }}>CV</span>
              </span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, maxWidth: 220 }}>
              Nền tảng tuyển dụng thông minh với AI, giúp ứng viên tối ưu CV và nhà tuyển dụng tìm kiếm nhân tài phù hợp.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              {['facebook', 'linkedin', 'youtube'].map(s => (
                <a key={s} href="#" style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'}
                >
                  <span style={{ fontSize: 14 }}>{s === 'facebook' ? 'f' : s === 'linkedin' ? 'in' : '▶'}</span>
                </a>
              ))}
            </div>
          </div>

          {/* For candidates */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 600, fontSize: 14, marginBottom: 14 }}>Ứng viên</h4>
            {[
              { to: '/jobs', label: 'Tìm việc làm' },
              { to: '/cv-upload', label: 'Chấm điểm CV bằng AI' },
              { to: '/register', label: 'Tạo tài khoản' },
              { to: '/profile', label: 'Hồ sơ cá nhân' },
            ].map(l => (
              <Link key={l.to} to={l.to} style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.6)', textDecoration: 'none', marginBottom: 8, transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'white'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
              >{l.label}</Link>
            ))}
          </div>

          {/* For employers */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 600, fontSize: 14, marginBottom: 14 }}>Nhà tuyển dụng</h4>
            {['Đăng tin tuyển dụng', 'Tìm kiếm ứng viên', 'Giải pháp tuyển dụng', 'Báo giá dịch vụ'].map(l => (
              <a key={l} href="#" style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.6)', textDecoration: 'none', marginBottom: 8, transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'white'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
              >{l}</a>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 600, fontSize: 14, marginBottom: 14 }}>Liên hệ</h4>
            {[
              { icon: '📍', text: '123 Nguyễn Văn Linh, Q7, TP.HCM' },
              { icon: '📞', text: '0901 234 567' },
              { icon: '✉️', text: 'support@nexcv.vn' },
              { icon: '🕐', text: 'T2 - T6: 8:00 - 18:00' },
            ].map(item => (
              <div key={item.text} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 10, fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                <span style={{ flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
            © 2025 NexCV. Bảo lưu mọi quyền.
          </p>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Điều khoản', 'Chính sách bảo mật', 'Cookie'].map(l => (
              <a key={l} href="#" style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
              >{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}