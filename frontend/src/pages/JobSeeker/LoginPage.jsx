import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Sparkles, Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const set = k => e => { setForm(p => ({ ...p, [k]: e.target.value })); setError('') }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.email || !form.password) { setError('Vui lòng điền đầy đủ thông tin'); return }
    setLoading(true)
    try {
      const res = await login(form.email, form.password)
      navigate(res.user.role === 'employer' ? '/employer/dashboard' : from, { replace: true })
    } catch (err) {
      setError(err?.message || 'Đăng nhập thất bại')
    } finally { setLoading(false) }
  }

  const DEMO_ACCOUNTS = [
    { label: 'Demo ứng viên', email: 'demo@nexcv.vn', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-slate-900 via-blue-950 to-primary flex-col justify-center p-14 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        <Link to="/" className="flex items-center gap-2 mb-14 relative w-max">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center">
            <span className="text-primary font-black text-base">N</span>
          </div>
          <span className="text-white font-black text-2xl tracking-tight">Nex<span className="text-violet-400">CV</span></span>
        </Link>
        <div className="relative">
          <h2 className="text-4xl font-black text-white mb-4 leading-tight">Chào mừng<br />trở lại! 👋</h2>
          <p className="text-slate-300 text-base leading-relaxed mb-10">
            Đăng nhập để tiếp tục hành trình sự nghiệp. AI của chúng tôi luôn sẵn sàng giúp bạn hoàn thiện CV.
          </p>
          {['Chấm điểm CV bằng AI trong 30 giây', 'Tiếp cận 12,000+ việc làm mới nhất', 'Nhận gợi ý cải thiện CV chuyên sâu'].map(f => (
            <div key={f} className="flex items-center gap-3 mb-3">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">
                <span className="text-emerald-400 text-[10px] font-bold">✓</span>
              </div>
              <span className="text-slate-300 text-sm">{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-muted/30">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8 w-max">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">N</span>
            </div>
            <span className="font-black text-xl text-primary tracking-tight">Nex<span className="text-violet-500">CV</span></span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-foreground mb-2">Đăng nhập</h1>
            <p className="text-muted-foreground text-sm">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="text-primary font-semibold hover:underline">Đăng ký ngay</Link>
            </p>
          </div>

          {/* Demo shortcuts */}
          <div className="grid grid-cols-1 gap-2 mb-5">
            {DEMO_ACCOUNTS.map(acc => (
              <button key={acc.email} onClick={() => setForm({ email: acc.email, password: 'demo123' })}
                className={`text-xs px-3 py-2 rounded-lg border font-medium transition-colors hover:opacity-80 ${acc.color}`}>
                💡 {acc.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="your@email.com" autoComplete="email"
                value={form.email} onChange={set('email')} />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Mật khẩu</Label>
                <a href="#" className="text-xs text-primary hover:underline font-medium">Quên mật khẩu?</a>
              </div>
              <div className="relative">
                <Input id="password" type={showPass ? 'text' : 'password'} placeholder="Nhập mật khẩu"
                  autoComplete="current-password" value={form.password} onChange={set('password')} className="pr-10" />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Bằng cách đăng nhập, bạn đồng ý với{' '}
            <a href="#" className="text-primary hover:underline">Điều khoản</a> và{' '}
            <a href="#" className="text-primary hover:underline">Chính sách bảo mật</a>
          </p>
        </div>
      </div>
    </div>
  )
}