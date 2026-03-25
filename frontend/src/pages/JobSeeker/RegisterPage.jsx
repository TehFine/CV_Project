import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, Loader2, User, Building2, Check } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

function StrengthBar({ password }) {
  if (!password) return null
  const checks = [password.length >= 8, /[A-Z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password)]
  const score = checks.filter(Boolean).length
  const colors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-emerald-400']
  const labels = ['Rất yếu', 'Yếu', 'Trung bình', 'Mạnh']
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1,2,3,4].map(i => <div key={i} className={cn('h-1 flex-1 rounded-full transition-colors', i <= score ? colors[score-1] : 'bg-border')} />)}
      </div>
      <p className={cn('text-xs', colors[score-1]?.replace('bg-','text-'))}>{labels[score-1] || ''}</p>
    </div>
  )
}

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [role, setRole] = useState(searchParams.get('role') === 'employer' ? 'employer' : 'candidate')
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', companyName: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)

  const set = k => e => { setForm(p => ({ ...p, [k]: e.target.value })); setErrors(p => ({ ...p, [k]: '' })) }
  const [showPass, setShowPass] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Vui lòng nhập họ tên'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Email không hợp lệ'
    if (form.phone && !form.phone.match(/^0[3-9]\d{8}$/)) e.phone = 'Số điện thoại không hợp lệ'
    if (form.password.length < 6) e.password = 'Mật khẩu ít nhất 6 ký tự'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Mật khẩu không khớp'
    if (role === 'employer' && !form.companyName.trim()) e.companyName = 'Vui lòng nhập tên công ty'
    if (!agreed) e.agreed = 'Vui lòng đồng ý điều khoản'
    return e
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await register({ ...form, role })
      navigate(role === 'employer' ? '/employer/dashboard' : '/')
    } catch (err) {
      setErrors({ submit: err?.message || 'Đăng ký thất bại' })
    } finally { setLoading(false) }
  }

  const ROLE_OPTIONS = [
    { value: 'candidate', label: 'Ứng viên', desc: 'Tìm việc & chấm điểm CV', icon: User, color: 'border-primary bg-primary/5' },
    { value: 'employer', label: 'Nhà tuyển dụng', desc: 'Đăng tuyển & tìm hồ sơ', icon: Building2, color: 'border-violet-500 bg-violet-50' },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Left */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-indigo-950 via-violet-950 to-slate-900 flex-col justify-center p-14 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <Link to="/" className="flex items-center gap-2 mb-14 relative">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center">
            <span className="text-primary font-black text-base">N</span>
          </div>
          <span className="text-white font-black text-2xl tracking-tight">Nex<span className="text-violet-400">CV</span></span>
        </Link>
        <div className="relative">
          <h2 className="text-4xl font-black text-white mb-4 leading-tight">Tạo tài khoản<br />hoàn toàn miễn phí ✨</h2>
          <p className="text-slate-300 leading-relaxed mb-8">
            Tham gia 50,000+ người dùng đang dùng NexCV để tối ưu CV và kết nối nhân tài.
          </p>
          {[
            { icon: '✨', title: 'AI Chấm điểm CV', desc: 'Phân tích chi tiết trong 30 giây' },
            { icon: '🎯', title: 'Gợi ý việc làm phù hợp', desc: 'Dựa trên kỹ năng và kinh nghiệm' },
            { icon: '🏢', title: 'Kết nối nhà tuyển dụng', desc: 'Hàng nghìn công ty hàng đầu VN' },
          ].map(f => (
            <div key={f.title} className="flex gap-3 p-3.5 bg-white/5 rounded-xl border border-white/10 mb-3">
              <span className="text-xl flex-shrink-0">{f.icon}</span>
              <div>
                <div className="text-white font-semibold text-sm">{f.title}</div>
                <div className="text-slate-400 text-xs mt-0.5">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right */}
      <div className="flex-1 flex items-start justify-center p-8 bg-muted/30 overflow-y-auto">
        <div className="w-full max-w-md py-4">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">N</span>
            </div>
            <span className="font-black text-xl text-primary">Nex<span className="text-violet-500">CV</span></span>
          </Link>

          <div className="mb-6">
            <h1 className="text-3xl font-black text-foreground mb-2">Đăng ký tài khoản</h1>
            <p className="text-muted-foreground text-sm">
              Đã có tài khoản? <Link to="/login" className="text-primary font-semibold hover:underline">Đăng nhập</Link>
            </p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {ROLE_OPTIONS.map(opt => (
              <button key={opt.value} onClick={() => setRole(opt.value)}
                className={cn(
                  'relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center',
                  role === opt.value ? opt.color + ' shadow-sm' : 'border-border bg-background hover:border-muted-foreground/30'
                )}>
                {role === opt.value && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
                <opt.icon className={cn('h-6 w-6', role === opt.value ? 'text-primary' : 'text-muted-foreground')} />
                <div>
                  <div className={cn('font-bold text-sm', role === opt.value ? 'text-foreground' : 'text-muted-foreground')}>{opt.label}</div>
                  <div className="text-xs text-muted-foreground">{opt.desc}</div>
                </div>
              </button>
            ))}
          </div>

          {errors.submit && (
            <div className="mb-4 px-4 py-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              ⚠️ {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Họ và tên *</Label>
              <Input placeholder="Nguyễn Văn An" value={form.name} onChange={set('name')} className={errors.name ? 'border-destructive' : ''} />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>
            {role === 'employer' && (
              <div className="space-y-1.5">
                <Label>Tên công ty *</Label>
                <Input placeholder="VNG Corporation" value={form.companyName} onChange={set('companyName')} className={errors.companyName ? 'border-destructive' : ''} />
                {errors.companyName && <p className="text-xs text-destructive">{errors.companyName}</p>}
              </div>
            )}
            <div className="space-y-1.5">
              <Label>Email *</Label>
              <Input type="email" placeholder="your@email.com" value={form.email} onChange={set('email')} className={errors.email ? 'border-destructive' : ''} />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Số điện thoại</Label>
              <Input placeholder="0901 234 567" value={form.phone} onChange={set('phone')} className={errors.phone ? 'border-destructive' : ''} />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Mật khẩu *</Label>
              <div className="relative">
                <Input type={showPass ? 'text' : 'password'} placeholder="Tối thiểu 6 ký tự" value={form.password}
                  onChange={set('password')} className={cn('pr-10', errors.password ? 'border-destructive' : '')} />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <StrengthBar password={form.password} />
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Xác nhận mật khẩu *</Label>
              <Input type={showPass ? 'text' : 'password'} placeholder="Nhập lại mật khẩu" value={form.confirmPassword}
                onChange={set('confirmPassword')} className={errors.confirmPassword ? 'border-destructive' : ''} />
              {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
            </div>

            <div>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-primary flex-shrink-0" />
                <span className="text-xs text-muted-foreground leading-relaxed">
                  Tôi đồng ý với <a href="#" className="text-primary font-medium hover:underline">Điều khoản dịch vụ</a> và <a href="#" className="text-primary font-medium hover:underline">Chính sách bảo mật</a>
                </span>
              </label>
              {errors.agreed && <p className="text-xs text-destructive mt-1">{errors.agreed}</p>}
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? 'Đang tạo tài khoản...' : '🚀 Tạo tài khoản miễn phí'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}