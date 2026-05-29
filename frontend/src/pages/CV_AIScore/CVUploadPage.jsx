import { useState, useRef, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts'
import { Upload, Sparkles, FileText, X, ArrowRight, CheckCircle2, AlertCircle, Target, Briefcase, Radar as RadarIcon, BarChart2, Lightbulb, Rocket, GraduationCap, Search, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cvService } from '@/services/cvService'
import { cn } from '@/lib/utils'
import ScoreRing from '@/components/ui/ScoreRing'

function ScoreResult({ result, onReset }) {
  const gradeColor = { A: 'success', B: 'new', C: 'warning', D: 'destructive' }[result.grade] || 'secondary'
  const catColor = pct => pct >= 80 ? '#10B981' : pct >= 65 ? '#3B82F6' : pct >= 50 ? '#F59E0B' : '#EF4444'

  const chartData = result.categories.map(c => ({
    subject: c.label,
    A: c.score,
    fullMark: 100
  }))

  return (
    <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in-up">
      <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
        <Card className="overflow-hidden shadow-lg">
          <div className="bg-linear-to-br from-slate-900 via-blue-950 to-indigo-900 p-7 flex flex-col items-center text-center">
            <div className="text-center text-white mb-6">
              <ScoreRing score={result.overall} size={140} />
              <Badge variant={gradeColor} className="mt-4 text-sm px-3 py-1">Loại {result.grade} — {result.gradeLabel}</Badge>
            </div>
            <div className="w-full">
              <p className="text-violet-300 text-xs font-bold uppercase tracking-wide mb-2">Kết quả phân tích AI</p>
              <h2 className="text-white text-2xl font-black mb-3 leading-snug flex items-center justify-center gap-2">
                {result.overall >= 85 ? <><Sparkles className="h-6 w-6 text-yellow-400" /> CV rất ấn tượng!</> : result.overall >= 70 ? <><CheckCircle2 className="h-6 w-6 text-emerald-400" /> CV tốt, còn cải thiện được</> : <><Target className="h-6 w-6 text-amber-400" /> CV cần được cải thiện thêm</>}
              </h2>
              <p className="text-slate-400 text-sm mb-5 truncate px-2">{result.fileName}</p>

              <div className="flex flex-col gap-2">
                {result.strengths.map(s => (
                  <span key={s} className="text-xs px-3 py-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 whitespace-normal text-left leading-relaxed">
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-3">
          <Button variant="outline" size="lg" onClick={onReset} className="w-full gap-2 justify-center">
            <Upload className="h-4 w-4" />Upload CV khác
          </Button>
          <Button size="lg" asChild className="w-full gap-2 justify-center">
            <Link to="/jobs"><Briefcase className="h-4 w-4" /> Tìm việc phù hợp <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div >
      </div >

      {/* Right Column - Scrollable Details */}
      <div className="lg:col-span-7 space-y-5">
        {/* Visual Chart */}
        <Card className="shadow-md">
          <CardContent className="p-6 md:p-8">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2 text-lg border-b pb-4">
              <RadarIcon className="h-5 w-5 text-primary" /> Phân tích tổng quan
            </h3>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 13, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Điểm số" dataKey="A" stroke="#8b5cf6" strokeWidth={2} fill="#8b5cf6" fillOpacity={0.4} />
                  <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category breakdown */}
        <Card className="shadow-md">
          <CardContent className="p-6 md:p-8">
            <h3 className="font-bold text-foreground mb-6 flex items-center gap-2 text-lg border-b pb-4">
              <BarChart2 className="h-5 w-5 text-primary" /> Chi tiết theo tiêu chí
            </h3>
            <div className="space-y-6">
              {result.categories.map(cat => (
                <div key={cat.key}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="flex items-center gap-2 font-semibold">
                      <span className="text-xl">{cat.icon}</span>{cat.label}
                    </span>
                    <span className="font-black text-lg" style={{ color: catColor(cat.score) }}>{cat.score}/100</span>
                  </div>
                  <div className="h-2.5 bg-muted rounded-full overflow-hidden mb-3">
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${cat.score}%`, backgroundColor: catColor(cat.score) }} />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{cat.feedback}</p>
                  <div className="flex flex-wrap gap-2">
                    {cat.suggestions.map(s => (
                      <Badge key={s} variant="ai" className="text-xs font-normal whitespace-normal text-left h-auto py-1.5 px-3 leading-relaxed">
                        <Lightbulb className="h-3 w-3 mr-1" />{s}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Improvements */}
        <Card className="shadow-md">
          <CardContent className="p-6 md:p-8">
            <h3 className="font-bold text-foreground mb-5 text-lg border-b pb-4 flex items-center gap-2"><Rocket className="h-5 w-5 text-primary" /> Cần cải thiện ngay</h3>
            <div className="space-y-4">
              {result.improvements.map((imp, i) => (
                <div key={i} className="flex gap-4 items-start py-3 border-b last:border-0">
                  <div className="w-7 h-7 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-sm font-black text-amber-700 shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{imp}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div >
    </div >
  )
}

export default function CVUploadPage() {
  const [searchParams] = useSearchParams()
  const jobId = searchParams.get('jobId')
  const paramJobTitle = searchParams.get('jobTitle')

  const [file, setFile] = useState(null)
  const [targetPos, setTargetPos] = useState(paramJobTitle || '')
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('idle') // idle | uploading | result | error
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef()

  const handleFile = useCallback(f => {
    if (!f.name.match(/\.(pdf|doc|docx)$/i)) { setError('Chỉ hỗ trợ PDF, DOC, DOCX'); return }
    if (f.size > 10 * 1024 * 1024) { setError('File không vượt quá 10MB'); return }
    setFile(f); setError('')
  }, [])

  const handleDrop = useCallback(e => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }, [handleFile])

  const handleSubmit = async () => {
    if (!file) return
    setStatus('uploading'); setProgress(0)
    try {
      const res = await cvService.scoreCV(file, { targetPosition: targetPos, jobId, jobTitle: paramJobTitle }, setProgress)
      setResult(res); setStatus('result')
    } catch (err) { setError(err?.message || 'Lỗi phân tích'); setStatus('idle') }
  }

  const reset = () => { setFile(null); setResult(null); setStatus('idle'); setError(''); setProgress(0) }

  return (
    <div className="min-h-screen bg-muted/30 pb-16">
      {/* Hero */}
      <div className="bg-linear-to-br from-slate-900 via-indigo-950 to-violet-900 pt-12 pb-10 mb-8">
        <div className="max-w-[1400px] mx-auto px-6 text-center">
          <Badge variant="ai" className="mb-4 gap-1.5 text-white"><Sparkles className="h-3.5 w-3.5 " />AI-Powered Analysis</Badge>
          <h1 className="text-4xl font-black text-white mb-3">
            {jobId ? 'Xem mức độ phù hợp' : 'Phân tích CV bằng AI'}
          </h1>
          <p className="text-slate-300 max-w-md mx-auto">
            {jobId ? `So sánh 1:1 CV của bạn với công việc: ${paramJobTitle}` : 'Upload CV và nhận phân tích chi tiết trong 30 giây — Hoàn toàn miễn phí'}
          </p>
          <div className="flex justify-center gap-8 mt-6">
            {[['50K+', 'CV đã chấm'], ['30s', 'Tốc độ AI'], ['5', 'Tiêu chí'], ['100%', 'Miễn phí']].map(([v, l]) => (
              <div key={l} className="text-center">
                <div className="text-xl font-black text-white">{v}</div>
                <div className="text-xs text-slate-400">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6">
        {status === 'result' ? (
          <ScoreResult result={result} onReset={reset} />
        ) : (
          <div className="max-w-xl mx-auto space-y-4">
            {status === 'uploading' ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-linear-to-br from-primary to-violet-600 flex items-center justify-center mx-auto mb-5 animate-pulse">
                    <Sparkles className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-1">AI đang phân tích CV</h3>
                  <p className="text-sm text-muted-foreground mb-6">{file?.name}</p>
                  <div className="h-2 bg-muted rounded-full overflow-hidden mb-2 max-w-xs mx-auto">
                    <div className="h-full rounded-full bg-linear-to-r from-primary to-violet-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="text-sm font-semibold text-violet-600">{progress}%</p>
                  <p className="text-xs text-muted-foreground mt-2">Thường mất khoảng 30 giây...</p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Upload zone */}
                <Card>
                  <CardContent className="p-2">
                    <div
                      className={cn('border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200',
                        dragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50')}
                      onDrop={handleDrop}
                      onDragOver={e => { e.preventDefault(); setDragging(true) }}
                      onDragLeave={() => setDragging(false)}
                      onClick={() => inputRef.current?.click()}
                    >
                      <input ref={inputRef} type="file" accept=".pdf,.doc,.docx" onChange={e => e.target.files[0] && handleFile(e.target.files[0])} className="hidden" />
                      {file ? (
                        <div className="flex items-center justify-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg max-w-xs mx-auto">
                          <FileText className="h-5 w-5 text-emerald-600 shrink-0" />
                          <div className="text-left flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                          </div>
                          <button onClick={e => { e.stopPropagation(); setFile(null) }} className="text-muted-foreground hover:text-foreground">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                            {dragging ? <Upload className="h-6 w-6 text-primary" /> : <FileText className="h-6 w-6 text-primary" />}
                          </div>
                          <p className="font-bold text-foreground mb-1">{dragging ? 'Thả file vào đây!' : 'Kéo thả CV vào đây'}</p>
                          <p className="text-sm text-muted-foreground mb-3">Hoặc nhấn để chọn từ máy tính</p>
                          <div className="flex justify-center gap-2">
                            {['PDF', 'DOC', 'DOCX'].map(f => <Badge key={f} variant="outline" className="text-xs">{f}</Badge>)}
                            <span className="text-xs text-muted-foreground self-center">· Tối đa 10MB</span>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Target position */}
                <Card>
                  <CardContent className="p-5">
                    <Label className="mb-2 block flex items-center gap-1.5"><Target className="h-4 w-4 text-primary" /> Vị trí ứng tuyển <span className="text-muted-foreground font-normal text-xs ml-1">(tuỳ chọn — AI sẽ đánh giá chính xác hơn)</span></Label>
                    <Input value={targetPos} onChange={e => setTargetPos(e.target.value)} placeholder="VD: Frontend Developer, Product Manager..." />
                  </CardContent>
                </Card>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 shrink-0" />{error}
                  </div>
                )}

                <Button variant="ai" size="xl" className="w-full gap-2" onClick={handleSubmit} disabled={!file}>
                  <Sparkles className="h-5 w-5" /><span>{jobId ? 'Xem mức độ phù hợp' : 'Phân tích CV ngay — Miễn phí'}</span>
                </Button>

                <p className="text-center text-xs text-muted-foreground"><Lock className="inline-block h-3 w-3 mr-1" /> File được bảo mật và không lưu trữ lâu dài</p>

                {/* What AI checks */}
                <Card>
                  <CardContent className="p-5">
                    <h4 className="font-bold text-sm mb-3">AI đánh giá 5 tiêu chí:</h4>
                    {[
                      { icon: Target, title: 'Kỹ năng phù hợp', desc: 'So sánh với yêu cầu thị trường' },
                      { icon: Briefcase, title: 'Kinh nghiệm', desc: 'Chất lượng và tính liên quan' },
                      { icon: GraduationCap, title: 'Học vấn & Chứng chỉ', desc: 'Bằng cấp, chứng chỉ chuyên môn' },
                      { icon: FileText, title: 'Định dạng & Trình bày', desc: 'Bố cục, dễ đọc, chuyên nghiệp' },
                      { icon: Search, title: 'Từ khóa & ATS', desc: 'Tối ưu cho hệ thống lọc tự động' },
                    ].map(item => {
                      const IconComp = item.icon
                      return (
                        <div key={item.title} className="flex gap-3 py-2.5 border-b last:border-0 items-start">
                          <IconComp className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold">{item.title}</p>
                            <p className="text-xs text-muted-foreground">{item.desc}</p>
                          </div>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}