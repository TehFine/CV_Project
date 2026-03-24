import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { MapPin, DollarSign, Clock, BarChart2, Bookmark, Share2, CheckCircle2, Sparkles, ChevronRight, Eye, Users2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { jobService, MOCK_JOBS } from '@/services/jobService'

export default function JobDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [showApply, setShowApply] = useState(false)
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

  if (loading) return (
    <div className="max-w-[1200px] mx-auto px-6 py-8 grid lg:grid-cols-[1fr_300px] gap-6">
      {[1,2].map(i => <div key={i} className="h-64 rounded-xl shimmer-bg" />)}
    </div>
  )
  if (!job) return null

  const daysAgo = Math.floor((Date.now() - new Date(job.postedAt)) / 86400000)
  const related = MOCK_JOBS.filter(j => j.id !== job.id && j.category === job.category).slice(0, 3)

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-background border-b">
        <div className="max-w-[1200px] mx-auto px-6 py-2.5 flex gap-1.5 items-center text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Trang chủ</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/jobs" className="hover:text-foreground">Việc làm</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium truncate">{job.title}</span>
        </div>
      </div>

      <div className="min-h-screen bg-muted/30 pb-16">
        <div className="max-w-[1200px] mx-auto px-6 pt-6 grid lg:grid-cols-[1fr_300px] gap-5">
          {/* Main */}
          <div className="space-y-4">
            {/* Header card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4 mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-xl text-primary flex-shrink-0">
                    {job.company.slice(0,2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-xl font-black text-foreground mb-1">{job.title}</h1>
                    <p className="text-primary font-semibold text-sm mb-3">{job.company}</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { icon: MapPin, text: job.location },
                        { icon: DollarSign, text: job.salary },
                        { icon: BarChart2, text: job.level },
                        { icon: Clock, text: job.type },
                      ].map(({ icon: Icon, text }) => (
                        <Badge key={text} variant="outline" className="gap-1 font-normal text-xs">
                          <Icon className="h-3 w-3" />{text}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {job.tags.map(t => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
                </div>
                <Separator className="mb-4" />
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{job.views} lượt xem</span>
                    <span className="flex items-center gap-1"><Users2 className="h-3.5 w-3.5" />{job.applied} ứng tuyển</span>
                    <span>{daysAgo === 0 ? 'Đăng hôm nay' : `${daysAgo} ngày trước`}</span>
                  </div>
                  <div className="flex gap-2">
                    {applied ? (
                      <Badge variant="success" className="gap-1.5 px-3 py-1.5 text-xs">
                        <CheckCircle2 className="h-3.5 w-3.5" />Đã ứng tuyển
                      </Badge>
                    ) : (
                      <Button onClick={() => isAuthenticated ? setShowApply(true) : navigate('/login', { state: { from: `/jobs/${id}` } })} className="gap-2">
                        🚀 {isAuthenticated ? 'Ứng tuyển ngay' : 'Đăng nhập để ứng tuyển'}
                      </Button>
                    )}
                    <Button variant="outline" size="icon" onClick={() => setSaved(v => !v)}
                      className={saved ? 'border-amber-300 bg-amber-50 text-amber-600' : ''}>
                      <Bookmark className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
                    </Button>
                    <Button variant="outline" size="icon"><Share2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h2 className="font-bold text-foreground mb-3 flex items-center gap-2">📋 Mô tả công việc</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{job.description}</p>
                </div>
                <Separator />
                <div>
                  <h2 className="font-bold text-foreground mb-3">✅ Yêu cầu công việc</h2>
                  <ul className="space-y-2.5">
                    {job.requirements.map((req, i) => (
                      <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
                <Separator />
                <div>
                  <h2 className="font-bold text-foreground mb-3">🎁 Phúc lợi</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.benefits.map((b, i) => (
                      <Badge key={i} variant="success" className="gap-1">✨ {b}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Deadline */}
            <div className="flex items-center gap-2.5 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm">
              <span className="text-xl">⏰</span>
              <span className="text-amber-800">
                <strong>Hạn nộp hồ sơ:</strong> {new Date(job.deadline).toLocaleDateString('vi-VN')}
              </span>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card className="sticky top-20">
              <CardContent className="p-5">
                <h3 className="font-bold text-sm mb-4">Tổng quan công việc</h3>
                {[
                  ['Cấp bậc', job.level], ['Ngành nghề', job.category],
                  ['Hình thức', job.type], ['Lương', job.salary],
                  ['Địa điểm', job.location],
                  ['Hạn nộp', new Date(job.deadline).toLocaleDateString('vi-VN')],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between py-2 border-b text-xs last:border-0">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-semibold text-right max-w-[55%]">{value}</span>
                  </div>
                ))}
                <Link to="/cv-upload" className="flex items-center gap-2.5 mt-4 p-3 bg-violet-50 border border-violet-200 rounded-xl hover:bg-violet-100 transition-colors no-underline">
                  <Sparkles className="h-4 w-4 text-violet-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-violet-700">Kiểm tra CV phù hợp?</p>
                    <p className="text-[11px] text-violet-500">Chấm điểm AI ngay</p>
                  </div>
                </Link>
              </CardContent>
            </Card>

            {related.length > 0 && (
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">Việc làm tương tự</CardTitle></CardHeader>
                <CardContent className="p-5 pt-0">
                  {related.map(rj => (
                    <Link key={rj.id} to={`/jobs/${rj.id}`} className="block py-3 border-b last:border-0 hover:text-primary transition-colors no-underline">
                      <p className="font-semibold text-sm text-foreground hover:text-primary">{rj.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{rj.company} · {rj.salary}</p>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Apply Dialog */}
      <Dialog open={showApply} onOpenChange={setShowApply}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ứng tuyển vào</DialogTitle>
            <p className="text-sm text-primary font-semibold">{job.title}</p>
            <p className="text-xs text-muted-foreground">{job.company}</p>
          </DialogHeader>
          <div className="p-3 bg-violet-50 border border-violet-200 rounded-xl text-xs text-violet-700">
            💡 <Link to="/cv-upload" className="font-bold text-violet-700 hover:underline">Chấm điểm CV</Link> trước để tăng tỷ lệ đậu
          </div>
          <div className="space-y-1.5">
            <Label>Thư giới thiệu (tuỳ chọn)</Label>
            <Textarea rows={4} placeholder="Viết vài câu giới thiệu bản thân và lý do bạn phù hợp..." value={coverLetter} onChange={e => setCoverLetter(e.target.value)} />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowApply(false)}>Hủy</Button>
            <Button onClick={handleApply} disabled={applying} className="gap-2">
              {applying ? '⏳ Đang xử lý...' : '🚀 Xác nhận ứng tuyển'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}