import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sparkles, Bot, Mail, User, Building2, Lock, Rocket, AlertTriangle, Info, Eye, EyeOff } from 'lucide-react'

function PasswordStrength({ password }) {
  const checks = [password.length >= 8, /[A-Z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password)]
  const score = checks.filter(Boolean).length
  const barColors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500']
  const textColors = ['', 'text-red-500', 'text-orange-500', 'text-yellow-400', 'text-green-500']
  const labels = ['Rất yếu', 'Yếu', 'Trung bình', 'Mạnh']
  if (!password) return null
  return (
    <div className="mt-1.5">
      <div className="flex gap-1 mb-1">
        {[1,2,3,4].map(i => (
          <div
            key={i}
            className={`flex-1 h-1 rounded-sm transition-all duration-300 ${i <= score ? barColors[score] : 'bg-slate-200'}`}
          />
        ))}
      </div>
      <p className={`text-[11px] m-0 ${score ? textColors[score] : ''}`}>
        Độ mạnh: {labels[score-1] || ''}
      </p>
    </div>
  )
}

const Field = ({ name, label, type = 'text', placeholder, required, form, errors, set, showPass, setShowPass }) => (
  <div>
    <label className="block text-[13px] font-semibold text-slate-900 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <Input
        type={name === 'password' || name === 'confirmPassword' ? (showPass ? 'text' : 'password') : type}
        name={name} value={form[name]} onChange={set} placeholder={placeholder}
        className={`${errors[name] ? 'border-red-500!' : ''} ${(name === 'password' || name === 'confirmPassword') ? 'pr-11' : ''}`}
      />
      {(name === 'password' || name === 'confirmPassword') && (
        <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-slate-400 p-0">
          {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      )}
    </div>
    {name === 'password' && <PasswordStrength password={form.password} />}
    {errors[name] && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3 shrink-0" />{errors[name]}</p>}
  </div>
)

export default function EmployerRegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  // Đọc dữ liệu prefill từ sessionStorage (do HomePage lưu trước khi logout)
  const prefill = (() => {
    try {
      const raw = sessionStorage.getItem('employer_register_prefill')
      if (raw) {
        sessionStorage.removeItem('employer_register_prefill') // Xóa sau khi đọc
        return JSON.parse(raw)
      }
    } catch { /* empty */ }
    return {}
  })()

  const [form, setForm] = useState({
    name: prefill.name || '', email: prefill.email || '', phone: prefill.phone || '',
    password: '', confirmPassword: '',
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
        password: form.password, role: 'employer',
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

  const fieldProps = { form, errors, set, showPass, setShowPass }

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* Left panel */}
      <div className="flex-1 bg-linear-to-br from-[#1E1B4B] via-[#4C1D95] to-[#6D28D9] hidden md:flex flex-col justify-center p-15 relative overflow-hidden">
        <div className="absolute -top-25 -right-25 w-100 h-100 rounded-full bg-[#7C3AED]/20 pointer-events-none" />
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2.5 no-underline mb-10 font-extrabold text-[22px] text-white">
            <div className="w-9.5 h-9.5 rounded-xl bg-white flex items-center justify-center font-black text-[17px] text-[#7C3AED] shrink-0">N</div>
            <span>Nex<span className="text-[#A78BFA]">CV</span></span>
          </Link>
          <h2 className="text-[32px] font-extrabold text-white leading-tight mb-3">Bắt đầu tuyển dụng<br />thông minh hơn{' '}<Sparkles className="inline-block h-6 w-6 text-yellow-300" /></h2>
          <p className="text-[15px] text-white/65 leading-relaxed mb-7">
            Tham gia cùng 2,000+ nhà tuyển dụng đang dùng NexCV để tìm ứng viên chất lượng nhanh hơn với AI.
          </p>
          <div className="flex flex-col gap-3 mb-7">
            {[
              { icon: <Sparkles className="h-5 w-5" />, title: 'Miễn phí hoàn toàn', desc: 'Không mất phí để đăng ký và sử dụng' },
              { icon: <Bot className="h-5 w-5" />, title: 'AI matching tự động', desc: 'Tìm ứng viên phù hợp trong vài giây' },
              { icon: <Mail className="h-5 w-5" />, title: 'Quản lý hồ sơ dễ dàng', desc: 'Xem, lọc và liên hệ ứng viên tiện lợi' },
            ].map(f => (
              <div key={f.title} className="flex gap-3.5 items-start bg-white/7 rounded-xl p-3.5 border border-white/10">
                <span className="text-[#A78BFA] text-xl shrink-0">{f.icon}</span>
                <div>
                  <div className="text-[13px] font-semibold text-white mb-0.5">{f.title}</div>
                  <div className="text-xs text-white/55">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-5 border-t border-white/15">
            <Link to="/register" className="text-[13px] text-white/60 no-underline hover:text-white">
              <User className="inline-block h-3.5 w-3.5 mr-1" /> Bạn là ứng viên? Đăng ký tại đây
            </Link>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex justify-center p-8 md:p-6 items-start pt-10 overflow-y-auto">
        <div className="w-full max-w-115">
          <Link to="/" className="flex items-center gap-2.5 no-underline mb-6 font-extrabold text-[22px] text-white md:hidden">
            <div className="w-9.5 h-9.5 rounded-xl bg-white flex items-center justify-center font-black text-[17px] text-[#7C3AED] shrink-0">N</div>
            <span className="font-extrabold text-xl text-[#7C3AED]">NexCV</span>
          </Link>

          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/20 rounded-full px-3 py-1 text-xs font-semibold mb-2.5"><Building2 className="h-3.5 w-3.5" /> Đăng ký nhà tuyển dụng</div>
            <h1 className="text-[26px] font-extrabold text-slate-900 mb-1.5">Tạo tài khoản</h1>
            <p className="text-sm text-slate-500">
              Đã có tài khoản?{' '}
              <Link to="/employer/login" className="text-[#7C3AED] font-semibold no-underline">Đăng nhập</Link>
            </p>
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200/25 rounded-xl px-3.5 py-2.5 text-[13px] text-red-600 mb-4 flex items-center gap-1.5"><AlertTriangle className="h-3.5 w-3.5 shrink-0" />{errors.submit}</div>
          )}

          {/* Thông báo nếu được điền sẵn từ trang chủ */}
          {(prefill.name || prefill.email) && (
            <div className="bg-[#EEF2FF] border border-[#C7D2FE] rounded-xl px-3.5 py-2.5 text-[13px] text-[#3730A3] mb-4 flex items-center gap-2">
              <Info className="h-4 w-4 shrink-0" />
              <span>Thông tin cá nhân đã được điền sẵn từ tài khoản ứng viên của bạn. Vui lòng kiểm tra lại trước khi gửi.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            {/* Thông tin cá nhân */}
            <div className="p-4 bg-[#F8FAFC] rounded-xl border border-slate-200 flex flex-col gap-3.5">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest m-0 flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> Thông tin cá nhân</p>
              <Field {...fieldProps} name="name" label="Họ và tên" placeholder="Nguyễn Văn An" required />
              <div className="grid grid-cols-2 gap-3">
                <Field {...fieldProps} name="email" label="Email" type="email" placeholder="hr@company.com" required />
                <Field {...fieldProps} name="phone" label="Số điện thoại" placeholder="0901 234 567" />
              </div>
            </div>

            {/* Thông tin công ty */}
            <div className="p-4 bg-[#F8FAFC] rounded-xl border border-slate-200 flex flex-col gap-3.5">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest m-0 flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" /> Thông tin công ty</p>
              <Field {...fieldProps} name="companyName" label="Tên công ty" placeholder="Công ty TNHH ABC" required />
              <div className="grid grid-cols-2 gap-3">
                <Field {...fieldProps} name="companyWebsite" label="Website" placeholder="https://company.com" />
                <div>
                  <label className="block text-[13px] font-semibold text-slate-900 mb-1.5">Lĩnh vực</label>
                  <select name="industry" value={form.industry} onChange={set}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-inherit text-slate-900 bg-white outline-none focus:border-[#7C3AED] transition-colors">
                    <option value="">Chọn lĩnh vực</option>
                    {['Công nghệ thông tin', 'Tài chính - Ngân hàng', 'Thương mại điện tử', 'Marketing', 'Giáo dục', 'Y tế', 'Xây dựng', 'Sản xuất', 'Khác'].map(i => (
                      <option key={i} value={i}>{i}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Mật khẩu */}
            <div className="p-4 bg-[#F8FAFC] rounded-xl border border-slate-200 flex flex-col gap-3.5">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest m-0 flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> Bảo mật</p>
              <Field {...fieldProps} name="password" label="Mật khẩu" placeholder="Tối thiểu 6 ký tự" required />
              <Field {...fieldProps} name="confirmPassword" label="Xác nhận mật khẩu" placeholder="Nhập lại mật khẩu" required />
            </div>

            {/* Terms */}
            <div>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-[#7C3AED] shrink-0" />
                <span className="text-[13px] text-slate-500 leading-relaxed">
                  Tôi đồng ý với <a href="#" className="text-[#7C3AED] no-underline font-medium">Điều khoản dịch vụ</a> và <a href="#" className="text-[#7C3AED] no-underline font-medium">Chính sách bảo mật</a>
                </span>
              </label>
              {errors.agreed && <p className="text-xs text-red-500 ml-7 mt-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3 shrink-0" />{errors.agreed}</p>}
            </div>

            <Button type="submit" disabled={loading}
              className={`h-11 text-[15px] font-bold ${loading ? 'bg-[#A78BFA]' : 'bg-linear-to-r from-[#7C3AED] to-[#5B21B6]'}`}
            >
              {loading ? (
                <><svg className="animate-spin mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>Đang tạo tài khoản...</>
              ) : <><Rocket className="h-4 w-4" /> Tạo tài khoản nhà tuyển dụng</>}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
