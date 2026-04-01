import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
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

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
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
    if (!agreed) e.agreed = 'Vui lòng đồng ý điều khoản'
    return e
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await register({ ...form, role: 'candidate' })
      navigate('/')
    } catch (err) {
      setErrors({ submit: err?.message || 'Đăng ký thất bại' })
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-slate-900 via-blue-950 to-primary flex-col justify-center p-14 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />
        <Link to="/" className="flex items-center gap-2 mb-14 relative w-max">
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
            'Chấm điểm CV bằng AI trong 30 giây',
            'Gợi ý việc làm phù hợp theo kỹ năng',
            'Kết nối hàng nghìn nhà tuyển dụng hàng đầu VN',
          ].map(f => (
            <div key={f} className="flex items-center gap-3 mb-3">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">
                <span className="text-emerald-400 text-[10px] font-bold">✓</span>
              </div>
              <span className="text-slate-300 text-sm">{f}</span>
            </div>
          ))}
          <div className="flex gap-3 mt-10">
            {[
              { value: '50K+', label: 'Ứng viên' },
              { value: '12K+', label: 'Việc làm' },
              { value: '98%', label: 'Hài lòng' },
            ].map(s => (
              <div key={s.label} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-center backdrop-blur-sm">
                <div className="text-white font-black text-lg leading-none">{s.value}</div>
                <div className="text-slate-400 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex-1 flex items-center justify-center p-8 bg-muted/30 overflow-y-auto">
        <div className="w-full max-w-md py-8">
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

            <Button type="submit" size="lg" disabled={loading}
              className={`
                w-full h-[44px] text-[15px] font-bold
                bg-linear-to-r from-blue-500 to-primary
                hover:opacity-90 transition
                ${loading ? 'opacity-70 cursor-not-allowed' : ''}
              `}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {loading ? 'Đang tạo tài khoản...' : '🚀 Tạo tài khoản miễn phí'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}