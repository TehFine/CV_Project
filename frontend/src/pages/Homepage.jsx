import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, MapPin, Sparkles, ArrowRight, Building2, TrendingUp, Users, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { JOB_CATEGORIES, MOCK_JOBS } from '@/services/jobService'

const STATS = [
  { value: '50,000+', label: 'CV đã chấm điểm', icon: '📄' },
  { value: '12,000+', label: 'Việc làm đang tuyển', icon: '💼' },
  { value: '3,500+', label: 'Công ty đối tác', icon: '🏢' },
  { value: '95%', label: 'Tỷ lệ hài lòng', icon: '⭐' },
]

const HOW_IT_WORKS = [
  { num: '01', icon: '📤', title: 'Upload CV', desc: 'Tải lên CV dạng PDF hoặc DOCX từ máy tính của bạn.' },
  { num: '02', icon: '🤖', title: 'AI Phân tích', desc: 'Hệ thống AI phân tích CV theo 5 tiêu chí trong 30 giây.' },
  { num: '03', icon: '📊', title: 'Nhận kết quả', desc: 'Xem điểm số chi tiết và các gợi ý cải thiện cụ thể.' },
  { num: '04', icon: '🚀', title: 'Ứng tuyển', desc: 'Cải thiện CV và tự tin ứng tuyển vào vị trí mơ ước.' },
]

function JobCard({ job }) {
  const navigate = useNavigate()
  const daysAgo = Math.floor((Date.now() - new Date(job.postedAt)) / 86400000)
  return (
    <Card
      className="cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all duration-200 border"
      onClick={() => navigate(`/jobs/${job.id}`)}
    >
      <CardContent className="p-5">
        <div className="flex gap-3 mb-3">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center font-black text-sm text-primary flex-shrink-0">
            {job.company.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-sm text-foreground leading-snug truncate">{job.title}</h3>
              {job.featured && <Badge variant="new" className="flex-shrink-0 text-[10px]">Nổi bật</Badge>}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{job.company}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          <Badge variant="outline" className="text-[11px] font-normal gap-1"><MapPin className="h-2.5 w-2.5" />{job.location}</Badge>
          <Badge variant="outline" className="text-[11px] font-normal">💰 {job.salary}</Badge>
          <Badge variant="outline" className="text-[11px] font-normal">{job.type}</Badge>
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {job.tags.map(t => <Badge key={t} variant="secondary" className="text-[11px]">{t}</Badge>)}
        </div>
        <Separator className="mb-2.5" />
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>{daysAgo === 0 ? 'Hôm nay' : `${daysAgo} ngày trước`}</span>
          <span>{job.applied} ứng tuyển</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default function HomePage() {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [location, setLocation] = useState('')

  const handleSearch = e => {
    e.preventDefault()
    const p = new URLSearchParams()
    if (keyword) p.set('keyword', keyword)
    if (location) p.set('location', location)
    navigate(`/jobs?${p}`)
  }

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-primary overflow-hidden pt-28 pb-0">
        {/* Decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-primary/20 blur-3xl" />
          <svg className="absolute right-10 top-24 opacity-10" width="180" height="180" viewBox="0 0 200 200">
            {Array.from({ length: 6 }).flatMap((_, r) => Array.from({ length: 6 }).map((_, c) => (
              <circle key={`${r}${c}`} cx={c * 35 + 10} cy={r * 35 + 10} r="2.5" fill="white" />
            )))}
          </svg>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 relative">
          <Badge variant="ai" className="mb-5 gap-1.5 text-sm px-3 py-1">
            <Sparkles className="h-3.5 w-3.5" /> Tích hợp AI chấm điểm CV thông minh
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.1] mb-5 max-w-3xl">
            Tìm việc làm mơ ước<br />
            <span className="bg-gradient-to-r from-blue-300 to-violet-400 bg-clip-text text-transparent">
              với sức mạnh AI
            </span>
          </h1>
          <p className="text-slate-300 text-lg mb-8 max-w-lg leading-relaxed">
            Upload CV và nhận đánh giá chi tiết từ AI trong 30 giây. Khám phá hàng nghìn cơ hội từ các công ty hàng đầu Việt Nam.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-0 bg-white rounded-2xl p-2 shadow-2xl max-w-2xl mb-5">
            <div className="flex items-center gap-2 flex-1 px-3 py-1">
              <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Input
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                placeholder="Tên công việc, kỹ năng, công ty..."
                className="border-0 shadow-none focus-visible:ring-0 p-0 text-sm"
              />
            </div>
            <Separator orientation="vertical" className="hidden sm:block h-8 self-center mx-1" />
            <div className="flex items-center gap-2 px-3 py-1">
              <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Input
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Địa điểm"
                className="border-0 shadow-none focus-visible:ring-0 p-0 text-sm w-36"
              />
            </div>
            <Button type="submit" size="lg" className="rounded-xl sm:ml-1 flex-shrink-0">
              Tìm kiếm
            </Button>
          </form>

          {/* Hot tags */}
          <div className="flex flex-wrap gap-2 items-center mb-10">
            <span className="text-slate-400 text-sm">Phổ biến:</span>
            {['React Developer', 'UI/UX Designer', 'Data Analyst', 'Product Manager', 'DevOps'].map(tag => (
              <button key={tag} onClick={() => navigate(`/jobs?keyword=${encodeURIComponent(tag)}`)}
                className="text-xs px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 hover:bg-white/20 transition-colors">
                {tag}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="border-t border-white/10 pt-8 pb-10 grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(s => (
              <div key={s.value} className="flex items-center gap-3">
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <div className="text-2xl font-black text-white">{s.value}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────── */}
      <section className="section bg-muted/40">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-foreground mb-2">Khám phá theo ngành nghề</h2>
            <p className="text-muted-foreground">Hàng nghìn công việc trong tất cả lĩnh vực</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {JOB_CATEGORIES.map(cat => (
              <Card key={cat.id} className="cursor-pointer hover:-translate-y-1 hover:shadow-md hover:border-primary/30 transition-all duration-200"
                onClick={() => navigate(`/jobs?category=${cat.name}`)}>
                <CardContent className="p-4 flex items-center gap-3">
                  <span className="text-2xl">{cat.icon}</span>
                  <div>
                    <div className="font-semibold text-sm text-foreground">{cat.name}</div>
                    <div className="text-xs text-muted-foreground">{cat.count.toLocaleString()} việc</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Jobs ────────────────────────────────────── */}
      <section className="section">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-black text-foreground mb-1">Việc làm mới nhất</h2>
              <p className="text-muted-foreground">Cập nhật mỗi ngày từ các công ty hàng đầu</p>
            </div>
            <Button variant="ghost" asChild className="gap-1 text-primary">
              <Link to="/jobs">Xem tất cả <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOCK_JOBS.slice(0, 6).map(job => <JobCard key={job.id} job={job} />)}
          </div>
        </div>
      </section>

      {/* ── AI Promo ─────────────────────────────────────────── */}
      <section className="section-sm">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-900 p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="flex-1 relative">
              <Badge variant="ai" className="mb-4 gap-1.5"><Sparkles className="h-3 w-3" /> AI-Powered CV Scoring</Badge>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                CV của bạn có đủ<br />sức cạnh tranh?
              </h2>
              <p className="text-slate-300 leading-relaxed mb-6">
                AI của NexCV phân tích CV trong 30 giây, đưa ra điểm số chi tiết và gợi ý cụ thể để cải thiện cơ hội được tuyển dụng lên đến 3 lần.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="ai" size="lg" asChild className="gap-2">
                  <Link to="/cv-upload"><Sparkles className="h-4 w-4" />Chấm điểm CV — Miễn phí</Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="border-white/20 text-white hover:bg-white/10 hover:text-white">
                  <Link to="/register">Tìm hiểu thêm <ArrowRight className="h-4 w-4 ml-1" /></Link>
                </Button>
              </div>
            </div>

            {/* Score preview */}
            <div className="w-full md:w-72 bg-white/8 backdrop-blur border border-white/15 rounded-2xl p-6 flex-shrink-0 relative">
              <div className="text-center mb-5">
                <div className="w-20 h-20 mx-auto rounded-full border-4 border-violet-400 bg-violet-500/20 flex items-center justify-center mb-2">
                  <span className="text-3xl font-black text-white">82</span>
                </div>
                <p className="text-violet-300 text-sm font-semibold">Điểm CV của bạn</p>
              </div>
              {[
                { label: 'Kỹ năng phù hợp', pct: 85, color: '#34D399' },
                { label: 'Kinh nghiệm', pct: 78, color: '#60A5FA' },
                { label: 'Định dạng & ATS', pct: 72, color: '#FCD34D' },
                { label: 'Từ khóa', pct: 65, color: '#F87171' },
              ].map(item => (
                <div key={item.label} className="mb-2.5">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">{item.label}</span>
                    <span className="text-white font-bold">{item.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="section bg-muted/40">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-foreground mb-2">Cách hoạt động</h2>
            <p className="text-muted-foreground">Chỉ 4 bước đơn giản để có CV hoàn hảo</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {HOW_IT_WORKS.map((step, i) => (
              <Card key={step.num} className="text-center relative overflow-hidden animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <CardContent className="p-6">
                  <div className="absolute top-3 right-4 text-5xl font-black text-muted/40 leading-none">{step.num}</div>
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                    {step.icon}
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Employer CTA ─────────────────────────────────────── */}
      <section className="section">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-5">
            <Card className="bg-gradient-to-br from-primary to-blue-700 border-0 text-white">
              <CardContent className="p-8">
                <Users className="h-8 w-8 mb-4 opacity-80" />
                <h3 className="text-2xl font-black mb-2">Dành cho ứng viên</h3>
                <p className="text-blue-100 text-sm leading-relaxed mb-5">
                  Tạo hồ sơ, upload CV và để AI giúp bạn tối ưu để nổi bật trước nhà tuyển dụng.
                </p>
                <Button variant="outline" asChild className="border-white/40 text-white hover:bg-white hover:text-primary">
                  <Link to="/register">Tạo tài khoản miễn phí <ArrowRight className="h-4 w-4 ml-1" /></Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-0 text-white">
              <CardContent className="p-8">
                <Building2 className="h-8 w-8 mb-4 opacity-80" />
                <h3 className="text-2xl font-black mb-2">Dành cho nhà tuyển dụng</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-5">
                  Đăng tin tuyển dụng, tìm kiếm ứng viên phù hợp và quản lý toàn bộ quy trình tuyển dụng.
                </p>
                <Button variant="outline" asChild className="border-white/30 text-white hover:bg-white hover:text-slate-900">
                  <Link to="/register?role=employer">Đăng ký nhà tuyển dụng <ArrowRight className="h-4 w-4 ml-1" /></Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
}