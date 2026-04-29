import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { MapPin, DollarSign, Clock, BarChart2, Bookmark, Share2, CheckCircle2, Sparkles, ChevronRight, Eye, Users2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { jobService, MOCK_JOBS } from '@/services/jobService'

const LEVEL_BADGE = {
  Intern:         { bg: '#F1F5F9', text: '#64748B', border: '#E2E8F0' },
  Junior:         { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' },
  Middle:         { bg: '#EEF2FF', text: '#1549B8', border: '#C7D2FE' },
  Senior:         { bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA' },
  'Lead/Manager': { bg: '#FDF4FF', text: '#7E22CE', border: '#E9D5FF' },
}

export default function JobDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [job,         setJob]         = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [saved,       setSaved]       = useState(false)
  const [applied,     setApplied]     = useState(false)
  const [applying,    setApplying]    = useState(false)
  const [showApply,   setShowApply]   = useState(false)
  const [coverLetter, setCoverLetter] = useState('')

  useEffect(() => {
    jobService.getJob(id).then(setJob).catch(() => navigate('/jobs')).finally(() => setLoading(false))
  }, [id])

  const handleApply = async () => {
    if (!isAuthenticated) { navigate('/login', { state: { from: `/jobs/${id}` } }); return }
    setApplying(true)
    try {
      await jobService.applyJob(id, { coverLetter })
      setApplied(true); setShowApply(false)
    } catch (err) { alert(err?.message) }
    finally { setApplying(false) }
  }

  const handleSave = () => {
    if (!isAuthenticated) { navigate('/login', { state: { from: `/jobs/${id}` } }); return }
    setSaved(v => !v)
  }

  if (loading) return (
    <div className="container-app py-8 grid lg:grid-cols-[1fr_300px] gap-6">
      {[1,2].map(i => <div key={i} className="h-64 shimmer-bg" />)}
    </div>
  )
  if (!job) return null

  const daysAgo   = Math.floor((Date.now() - new Date(job.postedAt)) / 86400000)
  const related   = MOCK_JOBS.filter(j => j.id !== job.id && j.category === job.category).slice(0, 3)
  const levelStyle = LEVEL_BADGE[job.level] || LEVEL_BADGE.Middle

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#E2E8F0] sticky top-16 z-10 shadow-sm" style={{ top: 'var(--header-height)'}}>
        <div className="container-app py-2.5 flex gap-1.5 items-center text-xs text-[#94A3B8]">
          <Link to="/"     className="hover:text-[#0F172A] transition-colors">Trang chủ</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/jobs" className="hover:text-[#0F172A] transition-colors">Việc làm</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-[#0F172A] font-medium truncate">{job.title}</span>
        </div>
      </div>

      <div className="min-h-screen bg-[#F8FAFC] pb-16">
        <div className="container-app pt-5 grid lg:grid-cols-[1fr_300px] gap-5">

          {/* ── Main content ────────────────────────────────────── */}
          <div className="space-y-4">

            {/* Job header card */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 overflow-hidden relative">
              {/* Featured ribbon */}
              {job.featured && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1549B8] to-[#7C3AED]" />
              )}
              <div className="flex gap-4 mb-5">
                <div className="w-16 h-16 rounded-2xl bg-[#EEF2FF] flex items-center justify-center font-black text-xl text-[#1549B8] flex-shrink-0 shadow-sm">
                  {job.company.slice(0,2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h1 className="text-xl font-black text-[#0F172A] mb-1">{job.title}</h1>
                  <p className="text-[#1549B8] font-semibold text-sm mb-3">{job.company}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="flex items-center gap-1 text-xs text-[#475569] bg-[#F1F5F9] px-2.5 py-1 rounded-lg">
                      <MapPin className="h-3 w-3 text-[#94A3B8]" />{job.location}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-[#059669] bg-[#ECFDF5] border border-[#A7F3D0] px-2.5 py-1 rounded-lg">
                      <DollarSign className="h-3 w-3" />{job.salary}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[#475569] bg-[#F1F5F9] px-2.5 py-1 rounded-lg">
                      <Clock className="h-3 w-3 text-[#94A3B8]" />{job.type}
                    </span>
                    <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border font-medium"
                      style={{ backgroundColor: levelStyle.bg, color: levelStyle.text, borderColor: levelStyle.border }}>
                      <BarChart2 className="h-3 w-3" />{job.level}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {job.tags.map(t => (
                  <span key={t} className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-[#EEF2FF] text-[#1549B8] border border-[#C7D2FE]">
                    {t}
                  </span>
                ))}
              </div>

              <Separator className="mb-4" />

              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-4 text-xs text-[#94A3B8]">
                  <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{job.views} lượt xem</span>
                  <span className="flex items-center gap-1"><Users2 className="h-3.5 w-3.5" />{job.applied} ứng tuyển</span>
                  <span>{daysAgo === 0 ? 'Đăng hôm nay' : `${daysAgo} ngày trước`}</span>
                </div>
                <div className="flex gap-2">
                  {applied ? (
                    <div className="flex items-center gap-1.5 px-4 py-2 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl text-xs font-bold text-[#059669]">
                      <CheckCircle2 className="h-3.5 w-3.5" />Đã ứng tuyển thành công
                    </div>
                  ) : (
                    <Button
                      onClick={() => isAuthenticated ? setShowApply(true) : navigate('/login', { state: { from: `/jobs/${id}` } })}
                      className="bg-[#1549B8] hover:bg-[#1240A0] text-white font-bold gap-2 shadow-sm">
                      🚀 {isAuthenticated ? 'Ứng tuyển ngay' : 'Đăng nhập để ứng tuyển'}
                    </Button>
                  )}
                  <Button variant="outline" size="icon" onClick={handleSave}
                    className={saved ? 'border-amber-300 bg-amber-50 text-amber-500' : 'border-[#E2E8F0] text-[#475569]'}>
                    <Bookmark className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
                  </Button>
                  <Button variant="outline" size="icon" className="border-[#E2E8F0] text-[#475569]">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Description card */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-6">
              <div>
                <h2 className="font-bold text-[#0F172A] mb-3 flex items-center gap-2 text-base">
                  <span className="text-lg">📋</span> Mô tả công việc
                </h2>
                <p className="text-sm text-[#475569] leading-relaxed whitespace-pre-line">{job.description}</p>
              </div>

              <Separator />

              <div>
                <h2 className="font-bold text-[#0F172A] mb-3 flex items-center gap-2 text-base">
                  <span className="text-lg">✅</span> Yêu cầu công việc
                </h2>
                <ul className="space-y-2.5">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="flex gap-3 text-sm text-[#475569]">
                      <div className="w-5 h-5 rounded-full bg-[#EEF2FF] border border-[#C7D2FE] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="h-3 w-3 text-[#1549B8]" />
                      </div>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              <div>
                <h2 className="font-bold text-[#0F172A] mb-3 flex items-center gap-2 text-base">
                  <span className="text-lg">🎁</span> Phúc lợi
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.benefits.map((b, i) => (
                    <span key={i} className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                      ✨ {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Deadline */}
            <div className="flex items-center gap-2.5 p-4 bg-[#FFFBEB] border border-amber-200 rounded-xl">
              <span className="text-xl">⏰</span>
              <p className="text-sm text-amber-800">
                <strong>Hạn nộp hồ sơ:</strong> {new Date(job.deadline).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>

          {/* ── Sidebar ──────────────────────────────────────────── */}
          <div  className="space-y-4 sticky self-start" style={{ top: 'calc(var(--header-height) + 64px)' }}>
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 top-20">
              <h3 className="font-bold text-sm text-[#0F172A] mb-4">Tổng quan công việc</h3>
              {[
                ['Cấp bậc',   job.level],
                ['Ngành nghề',job.category],
                ['Hình thức', job.type],
                ['Lương',     job.salary],
                ['Địa điểm',  job.location],
                ['Hạn nộp',   new Date(job.deadline).toLocaleDateString('vi-VN')],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-2 border-b border-[#F1F5F9] last:border-0 text-xs">
                  <span className="text-[#94A3B8]">{label}</span>
                  <span className="font-semibold text-[#0F172A] text-right max-w-[55%]">{value}</span>
                </div>
              ))}

              <Link to="/cv-upload"
                className="flex items-center gap-2.5 mt-4 p-3 bg-[#F5F3FF] border border-[#DDD6FE] rounded-xl hover:bg-[#EDE9FE] transition-colors no-underline group">
                <Sparkles className="h-4 w-4 text-[#7C3AED] flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-[#7C3AED]">Kiểm tra CV phù hợp?</p>
                  <p className="text-[11px] text-[#A78BFA]">Chấm điểm AI ngay — Miễn phí</p>
                </div>
              </Link>
            </div>

            {related.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
                <h3 className="font-bold text-sm text-[#0F172A] mb-3">Việc làm tương tự</h3>
                {related.map(rj => (
                  <Link key={rj.id} to={`/jobs/${rj.id}`}
                    className="block py-3 border-b border-[#F1F5F9] last:border-0 hover:text-[#1549B8] transition-colors no-underline">
                    <p className="font-semibold text-sm text-[#0F172A] hover:text-[#1549B8]">{rj.title}</p>
                    <p className="text-xs text-[#94A3B8] mt-0.5">{rj.company} · <span className="text-[#059669] font-medium">{rj.salary}</span></p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Apply Dialog */}
      <Dialog open={showApply} onOpenChange={setShowApply}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ứng tuyển vào</DialogTitle>
            <p className="text-sm text-[#1549B8] font-semibold">{job.title}</p>
            <p className="text-xs text-[#94A3B8]">{job.company}</p>
          </DialogHeader>
          <div className="p-3 bg-[#F5F3FF] border border-[#DDD6FE] rounded-xl text-xs text-[#7C3AED]">
            💡 <Link to="/cv-upload" className="font-bold hover:underline text-[#7C3AED]">Chấm điểm CV</Link> trước để tăng tỷ lệ đậu
          </div>
          <div className="space-y-1.5">
            <Label>Thư giới thiệu (tuỳ chọn)</Label>
            <Textarea rows={4} placeholder="Viết vài câu giới thiệu bản thân..." value={coverLetter} onChange={e => setCoverLetter(e.target.value)} />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowApply(false)}>Hủy</Button>
            <Button onClick={handleApply} disabled={applying} className="bg-[#1549B8] hover:bg-[#1240A0] gap-2">
              {applying ? '⏳ Đang xử lý...' : '🚀 Xác nhận ứng tuyển'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}