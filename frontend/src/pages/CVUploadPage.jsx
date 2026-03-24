import { useState, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Upload, Sparkles, FileText, X, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cvService } from '@/services/cvService'
import { cn } from '@/lib/utils'

function ScoreRing({ score, size = 120 }) {
  const r = (size - 14) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 85 ? '#10B981' : score >= 70 ? '#3B82F6' : score >= 55 ? '#F59E0B' : '#EF4444'
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E2E8F0" strokeWidth="7" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="7"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-black text-foreground" style={{ fontSize: size * 0.27 }}>{score}</span>
        <span className="text-muted-foreground" style={{ fontSize: size * 0.1 }}>/100</span>
      </div>
    </div>
  )
}

function ScoreResult({ result, onReset }) {
  const gradeColor = { A: 'success', B: 'new', C: 'warning', D: 'destructive' }[result.grade] || 'secondary'
  const catColor = pct => pct >= 80 ? '#10B981' : pct >= 65 ? '#3B82F6' : pct >= 50 ? '#F59E0B' : '#EF4444'

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-fade-in-up">
      {/* Overall */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 p-7">
          <div className="flex gap-6 items-center flex-wrap">
            <div className="text-center">
              <ScoreRing score={result.overall} size={120} />
              <Badge variant={gradeColor} className="mt-2">Loại {result.grade} — {result.gradeLabel}</Badge>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-violet-300 text-xs font-bold uppercase tracking-wide mb-1">Kết quả phân tích AI</p>
              <h2 className="text-white text-xl font-black mb-2 leading-snug">
                {result.overall >= 85 ? '🎉 CV rất ấn tượng!' : result.overall >= 70 ? '👍 CV tốt, còn cải thiện được' : '💪 CV cần được cải thiện thêm'}
              </h2>
              <p className="text-slate-400 text-xs mb-3">{result.fileName}</p>
              <div className="flex flex-wrap gap-1.5">
                {result.strengths.map(s => (
                  <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">✓ {s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Category breakdown */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-bold text-foreground mb-5 flex items-center gap-2">📊 Chi tiết theo tiêu chí</h3>
          <div className="space-y-5">
            {result.categories.map(cat => (
              <div key={cat.key}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="flex items-center gap-2 text-sm font-semibold"><span>{cat.icon}</span>{cat.label}</span>
                  <span className="font-black text-base" style={{ color: catColor(cat.score) }}>{cat.score}/100</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden mb-2">
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${cat.score}%`, backgroundColor: catColor(cat.score) }} />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2">{cat.feedback}</p>
                <div className="flex flex-wrap gap-1.5">
                  {cat.suggestions.map(s => (
                    <Badge key={s} variant="ai" className="text-[11px] font-normal">💡 {s}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Improvements */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-bold text-foreground mb-4">🚀 Cần cải thiện ngay</h3>
          <div className="space-y-3">
            {result.improvements.map((imp, i) => (
              <div key={i} className="flex gap-3 items-start py-2.5 border-b last:border-0">
                <div className="w-6 h-6 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-xs font-black text-amber-700 flex-shrink-0 mt-0.5">{i + 1}</div>
                <p className="text-sm text-muted-foreground leading-relaxed">{imp}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 flex-wrap">
        <Button variant="outline" onClick={onReset} className="gap-2"><Upload className="h-4 w-4" />Upload CV khác</Button>
        <Button asChild className="gap-2"><Link to="/jobs">💼 Tìm việc phù hợp <ArrowRight className="h-4 w-4" /></Link></Button>
      </div>
    </div>
  )
}

export default function CVUploadPage() {
  const [file, setFile] = useState(null)
  const [targetPos, setTargetPos] = useState('')
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
      const res = await cvService.scoreCV(file, { targetPosition: targetPos }, setProgress)
      setResult(res); setStatus('result')
    } catch (err) { setError(err?.message || 'Lỗi phân tích'); setStatus('idle') }
  }

  const reset = () => { setFile(null); setResult(null); setStatus('idle'); setError(''); setProgress(0) }

  return (
    <div className="min-h-screen bg-muted/30 pb-16">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-900 pt-12 pb-10 mb-8">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <Badge variant="ai" className="mb-4 gap-1.5"><Sparkles className="h-3.5 w-3.5" />AI-Powered Analysis</Badge>
          <h1 className="text-4xl font-black text-white mb-3">Chấm điểm CV bằng AI</h1>
          <p className="text-slate-300 max-w-md mx-auto">Upload CV và nhận phân tích chi tiết trong 30 giây — Hoàn toàn miễn phí</p>
          <div className="flex justify-center gap-8 mt-6">
            {[['50K+','CV đã chấm'],['30s','Tốc độ AI'],['5','Tiêu chí'],['100%','Miễn phí']].map(([v,l]) => (
              <div key={l} className="text-center">
                <div className="text-xl font-black text-white">{v}</div>
                <div className="text-xs text-slate-400">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6">
        {status === 'result' ? (
          <ScoreResult result={result} onReset={reset} />
        ) : (
          <div className="max-w-xl mx-auto space-y-4">
            {status === 'uploading' ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center mx-auto mb-5 animate-pulse">
                    <Sparkles className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-1">AI đang phân tích CV</h3>
                  <p className="text-sm text-muted-foreground mb-6">{file?.name}</p>
                  <div className="h-2 bg-muted rounded-full overflow-hidden mb-2 max-w-xs mx-auto">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary to-violet-500 transition-all duration-300" style={{ width: `${progress}%` }} />
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
                          <FileText className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                          <div className="text-left flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{(file.size/1024).toFixed(1)} KB</p>
                          </div>
                          <button onClick={e => { e.stopPropagation(); setFile(null) }} className="text-muted-foreground hover:text-foreground">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                            {dragging ? '📥' : '📄'}
                          </div>
                          <p className="font-bold text-foreground mb-1">{dragging ? 'Thả file vào đây!' : 'Kéo thả CV vào đây'}</p>
                          <p className="text-sm text-muted-foreground mb-3">Hoặc nhấn để chọn từ máy tính</p>
                          <div className="flex justify-center gap-2">
                            {['PDF','DOC','DOCX'].map(f => <Badge key={f} variant="outline" className="text-xs">{f}</Badge>)}
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
                    <Label className="mb-2 block">🎯 Vị trí ứng tuyển <span className="text-muted-foreground font-normal text-xs ml-1">(tuỳ chọn — AI sẽ đánh giá chính xác hơn)</span></Label>
                    <Input value={targetPos} onChange={e => setTargetPos(e.target.value)} placeholder="VD: Frontend Developer, Product Manager..." />
                  </CardContent>
                </Card>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />{error}
                  </div>
                )}

                <Button variant="ai" size="xl" className="w-full gap-2" onClick={handleSubmit} disabled={!file}>
                  <Sparkles className="h-5 w-5" />Chấm điểm CV ngay — Miễn phí
                </Button>

                <p className="text-center text-xs text-muted-foreground">🔒 File được bảo mật và không lưu trữ lâu dài</p>

                {/* What AI checks */}
                <Card>
                  <CardContent className="p-5">
                    <h4 className="font-bold text-sm mb-3">AI đánh giá 5 tiêu chí:</h4>
                    {[
                      { icon: '🎯', title: 'Kỹ năng phù hợp', desc: 'So sánh với yêu cầu thị trường' },
                      { icon: '💼', title: 'Kinh nghiệm', desc: 'Chất lượng và tính liên quan' },
                      { icon: '🎓', title: 'Học vấn & Chứng chỉ', desc: 'Bằng cấp, chứng chỉ chuyên môn' },
                      { icon: '📄', title: 'Định dạng & Trình bày', desc: 'Bố cục, dễ đọc, chuyên nghiệp' },
                      { icon: '🔍', title: 'Từ khóa & ATS', desc: 'Tối ưu cho hệ thống lọc tự động' },
                    ].map(item => (
                      <div key={item.title} className="flex gap-3 py-2.5 border-b last:border-0 items-start">
                        <span className="text-lg flex-shrink-0">{item.icon}</span>
                        <div>
                          <p className="text-sm font-semibold">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                    ))}
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