import { Link } from 'react-router-dom'
import { Separator } from '@/components/ui/separator'

const FOOTER_LINKS = {
  candidate: [
    { to: '/jobs', label: 'Tìm việc làm' },
    { to: '/cv-upload', label: 'Chấm điểm CV bằng AI' },
    { to: '/register', label: 'Tạo tài khoản' },
    { to: '/profile', label: 'Hồ sơ cá nhân' },
  ],
  employer: [
    { to: '/register?role=employer', label: 'Đăng ký nhà tuyển dụng' },
    { to: '/employer/post-job', label: 'Đăng tin tuyển dụng' },
    { to: '/employer/candidates', label: 'Tìm kiếm ứng viên' },
    { to: '/employer/dashboard', label: 'Quản lý tuyển dụng' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-[1200px] mx-auto px-6 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-xs">N</span>
              </div>
              <span className="font-black text-lg text-white tracking-tight">
                Nex<span className="text-violet-400">CV</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-500 mb-4">
              Nền tảng tuyển dụng thông minh với AI, giúp ứng viên tối ưu CV và nhà tuyển dụng tìm kiếm nhân tài phù hợp.
            </p>
            <div className="flex gap-2">
              {['FB', 'in', '▶'].map((s, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-400 hover:text-white transition-colors">
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Candidate links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Ứng viên</h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.candidate.map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-slate-500 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Employer links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Nhà tuyển dụng</h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.employer.map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-slate-500 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Liên hệ</h4>
            <ul className="space-y-2.5">
              {[
                { icon: '📍', text: '123 Nguyễn Văn Linh, Q7, TP.HCM' },
                { icon: '📞', text: '0901 234 567' },
                { icon: '✉️', text: 'support@nexcv.vn' },
                { icon: '🕐', text: 'T2 - T6: 8:00 - 18:00' },
              ].map(item => (
                <li key={item.text} className="flex items-start gap-2 text-sm text-slate-500">
                  <span className="mt-0.5 flex-shrink-0">{item.icon}</span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="bg-slate-800 mb-6" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-slate-600">© 2025 NexCV. Bảo lưu mọi quyền.</p>
          <div className="flex gap-5">
            {['Điều khoản', 'Bảo mật', 'Cookie'].map(l => (
              <a key={l} href="#" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}