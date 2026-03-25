import { useState, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { cvService } from '../../services/cvService'

// ─── Score Ring ────────────────────────────────────────────────────────────────
function ScoreRing({ score, size = 120 }) {
  const radius = (size - 16) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference
  const color = score >= 85 ? '#10B981' : score >= 70 ? '#3B82F6' : score >= 55 ? '#F59E0B' : '#EF4444'

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#E2E8F0" strokeWidth="8" />
        <circle
          cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: size * 0.28, fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: size * 0.1, color: 'var(--text-muted)', fontWeight: 500 }}>/100</span>
      </div>
    </div>
  )
}

// ─── Score Result ─────────────────────────────────────────────────────────────
function ScoreResult({ result, onReset }) {
  const gradeColors = { A: '#10B981', B: '#3B82F6', C: '#F59E0B', D: '#EF4444' }
  const color = gradeColors[result.grade] || '#3B82F6'

  return (
    <div className="animate-fade-in" style={{ maxWidth: 760, margin: '0 auto' }}>
      {/* Overall score card */}
      <div style={{ background: 'linear-gradient(135deg, #0F172A, #1E3A6E)', borderRadius: 20, padding: 32, marginBottom: 20, color: 'white', display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center' }}>
          <ScoreRing score={result.overall} size={130} />
          <div style={{ marginTop: 8 }}>
            <span style={{ display: 'inline-block', backgroundColor: color, color: 'white', fontWeight: 800, fontSize: 13, padding: '3px 12px', borderRadius: 20 }}>
              Loại {result.grade} — {result.gradeLabel}
            </span>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, marginBottom: 4, textTransform: 'uppercase' }}>Kết quả phân tích AI</p>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8, lineHeight: 1.2 }}>
            {result.overall >= 85 ? '🎉 CV của bạn rất ấn tượng!' :
             result.overall >= 70 ? '👍 CV khá tốt, còn cải thiện được' :
             result.overall >= 55 ? '💪 CV cần được cải thiện thêm' :
             '⚠️ CV cần cải thiện đáng kể'}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>
            File: <strong style={{ color: 'white' }}>{result.fileName}</strong>
          </p>

          {/* Quick strengths */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {result.strengths.map(s => (
              <span key={s} style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20, backgroundColor: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.3)', color: '#6EE7B7' }}>
                ✓ {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      <div style={{ backgroundColor: 'white', borderRadius: 16, border: '1.5px solid var(--border)', padding: 24, marginBottom: 16 }}>
        <h3 style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)', marginBottom: 20 }}>📊 Chi tiết theo tiêu chí</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {result.categories.map(cat => {
            const catColor = cat.score >= 80 ? '#10B981' : cat.score >= 65 ? '#3B82F6' : cat.score >= 50 ? '#F59E0B' : '#EF4444'
            return (
              <div key={cat.key} className="animate-fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{cat.icon}</span>
                    <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{cat.label}</span>
                  </div>
                  <span style={{ fontWeight: 800, fontSize: 16, color: catColor }}>{cat.score}/100</span>
                </div>
                <div className="progress-bar" style={{ marginBottom: 8 }}>
                  <div className="progress-bar-fill" style={{ width: `${cat.score}%`, background: catColor }} />
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, lineHeight: 1.5 }}>{cat.feedback}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {cat.suggestions.map(s => (
                    <span key={s} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, backgroundColor: 'var(--ai-light)', color: 'var(--ai)', border: '1px solid rgba(124,58,237,0.15)', fontWeight: 500 }}>
                      💡 {s}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Improvements */}
      <div style={{ backgroundColor: 'white', borderRadius: 16, border: '1.5px solid var(--border)', padding: 24, marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)', marginBottom: 16 }}>🚀 Các điểm cần cải thiện ngay</h3>
        {result.improvements.map((imp, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 0', borderBottom: i < result.improvements.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: 'var(--warning-light)', border: '2px solid #F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#92400E', flexShrink: 0, fontWeight: 800, marginTop: 1 }}>
              {i + 1}
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{imp}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button onClick={onReset} style={{ padding: '12px 24px', borderRadius: 10, border: '1.5px solid var(--border)', backgroundColor: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit', flex: '0 0 auto', transition: 'all 0.2s' }}>
          📤 Upload CV khác
        </button>
        <Link to="/jobs" className="btn-primary" style={{ padding: '12px 24px', borderRadius: 10, textDecoration: 'none', fontSize: 14, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6, border: 'none', cursor: 'pointer' }}>
          💼 Tìm việc làm phù hợp
        </Link>
      </div>
    </div>
  )
}

// ─── Upload Zone ───────────────────────────────────────────────────────────────
function UploadZone({ onFile }) {
  const inputRef = useRef()
  const [dragging, setDragging] = useState(false)

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) onFile(file)
  }, [onFile])

  const handleDragOver = (e) => { e.preventDefault(); setDragging(true) }
  const handleDragLeave = () => setDragging(false)

  return (
    <div
      className={`upload-zone ${dragging ? 'drag-over' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => inputRef.current?.click()}
      style={{ padding: '60px 40px', textAlign: 'center', cursor: 'pointer', backgroundColor: dragging ? 'var(--primary-light)' : 'white', transition: 'all 0.2s' }}
    >
      <input ref={inputRef} type="file" accept=".pdf,.doc,.docx" onChange={e => e.target.files[0] && onFile(e.target.files[0])} style={{ display: 'none' }} />
      <div style={{ fontSize: 56, marginBottom: 16, lineHeight: 1 }}>{dragging ? '📥' : '📄'}</div>
      <h3 style={{ fontWeight: 700, fontSize: 18, color: 'var(--text-primary)', marginBottom: 8 }}>
        {dragging ? 'Thả file vào đây!' : 'Kéo thả CV của bạn vào đây'}
      </h3>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
        Hoặc nhấn để chọn file từ máy tính
      </p>
      <div style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
        {['PDF', 'DOC', 'DOCX'].map(fmt => (
          <span key={fmt} style={{ fontSize: 12, padding: '3px 10px', borderRadius: 6, backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)', border: '1px solid var(--border)', fontWeight: 600 }}>
            {fmt}
          </span>
        ))}
        <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 4 }}>• Tối đa 10MB</span>
      </div>
    </div>
  )
}

// ─── Uploading State ───────────────────────────────────────────────────────────
function UploadingState({ progress, fileName }) {
  const steps = [
    { label: 'Đang tải file lên...', threshold: 33 },
    { label: 'AI đang phân tích nội dung...', threshold: 66 },
    { label: 'Đang tính điểm và tạo gợi ý...', threshold: 100 },
  ]
  const currentStep = steps.findIndex(s => progress < s.threshold)
  const activeLabel = steps[Math.max(0, currentStep === -1 ? steps.length - 1 : currentStep)].label

  return (
    <div style={{ textAlign: 'center', padding: '48px 24px', maxWidth: 440, margin: '0 auto' }}>
      <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--ai))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', animation: 'pulse-ring 2s infinite' }}>
        <span style={{ fontSize: 32 }}>✨</span>
      </div>
      <h3 style={{ fontWeight: 700, fontSize: 18, color: 'var(--text-primary)', marginBottom: 6 }}>AI đang phân tích CV</h3>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>{fileName}</p>
      <div className="progress-bar" style={{ marginBottom: 8 }}>
        <div className="progress-bar-fill" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, var(--primary), var(--ai))' }} />
      </div>
      <p style={{ fontSize: 13, color: 'var(--ai)', fontWeight: 600 }}>{progress}% — {activeLabel}</p>
      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>Thường mất khoảng 30 giây...</p>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function CVUploadPage() {
  const [file, setFile] = useState(null)
  const [targetPosition, setTargetPosition] = useState('')
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('idle') // idle | uploading | result | error
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleFile = (f) => {
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(f.type) && !f.name.match(/\.(pdf|doc|docx)$/i)) {
      setError('Chỉ hỗ trợ file PDF, DOC, DOCX'); return
    }
    if (f.size > maxSize) { setError('File không được vượt quá 10MB'); return }
    setFile(f)
    setError('')
  }

  const handleSubmit = async () => {
    if (!file) return
    setStatus('uploading')
    setProgress(0)
    try {
      const res = await cvService.scoreCV(file, { targetPosition }, (p) => setProgress(p))
      setResult(res)
      setStatus('result')
    } catch (err) {
      setError(err?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.')
      setStatus('idle')
    }
  }

  const handleReset = () => {
    setFile(null)
    setResult(null)
    setStatus('idle')
    setError('')
    setProgress(0)
    setTargetPosition('')
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-base)', minHeight: '100vh', paddingBottom: 80 }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)', padding: '48px 0 36px', marginBottom: 32 }}>
        <div className="container-app" style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: 'rgba(124,58,237,0.25)', border: '1px solid rgba(124,58,237,0.4)', borderRadius: 20, padding: '5px 14px', marginBottom: 16 }}>
            <span>✨</span>
            <span style={{ fontSize: 13, color: '#C4B5FD', fontWeight: 500 }}>AI-Powered CV Analysis</span>
          </div>
          <h1 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 900, color: 'white', marginBottom: 10, lineHeight: 1.2 }}>
            Chấm điểm CV bằng AI
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', maxWidth: 500, margin: '0 auto' }}>
            Upload CV và nhận phân tích chi tiết trong 30 giây — hoàn toàn miễn phí
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 24, flexWrap: 'wrap' }}>
            {[{ val: '50K+', label: 'CV đã chấm' }, { val: '30s', label: 'Tốc độ phân tích' }, { val: '5', label: 'Tiêu chí đánh giá' }, { val: '100%', label: 'Miễn phí' }].map(s => (
              <div key={s.val} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>{s.val}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-app">
        {status === 'result' ? (
          <ScoreResult result={result} onReset={handleReset} />
        ) : (
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            {status === 'uploading' ? (
              <div style={{ backgroundColor: 'white', borderRadius: 20, border: '1.5px solid var(--border)', overflow: 'hidden' }}>
                <UploadingState progress={progress} fileName={file?.name} />
              </div>
            ) : (
              <div className="animate-fade-in">
                {/* Upload zone */}
                <div style={{ backgroundColor: 'white', borderRadius: 20, border: '1.5px solid var(--border)', overflow: 'hidden', marginBottom: 16 }}>
                  <UploadZone onFile={handleFile} />
                  {file && (
                    <div style={{ padding: '0 24px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', backgroundColor: 'var(--success-light)', border: '1px solid rgba(5,150,105,0.2)', borderRadius: 10 }}>
                        <span style={{ fontSize: 20 }}>📄</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{(file.size / 1024).toFixed(1)} KB</div>
                        </div>
                        <button onClick={() => setFile(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 18, padding: 0, flexShrink: 0 }}>×</button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Target position input */}
                <div style={{ backgroundColor: 'white', borderRadius: 14, border: '1.5px solid var(--border)', padding: 20, marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
                    🎯 Vị trí ứng tuyển <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(tuỳ chọn — giúp AI đánh giá chính xác hơn)</span>
                  </label>
                  <input
                    value={targetPosition}
                    onChange={e => setTargetPosition(e.target.value)}
                    placeholder="VD: Frontend Developer, Product Manager, Data Analyst..."
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', color: 'var(--text-primary)', boxSizing: 'border-box' }}
                  />
                </div>

                {error && (
                  <div style={{ backgroundColor: 'var(--danger-light)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 16 }}>
                    <p style={{ fontSize: 13, color: 'var(--danger)', margin: 0 }}>⚠️ {error}</p>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={!file}
                  className="btn-ai"
                  style={{ width: '100%', padding: '14px', border: 'none', cursor: file ? 'pointer' : 'not-allowed', fontSize: 15, borderRadius: 12, fontFamily: 'inherit', fontWeight: 800, opacity: file ? 1 : 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                >
                  ✨ Chấm điểm CV ngay — Miễn phí
                </button>

                <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 12 }}>
                  🔒 File của bạn được bảo mật và không được lưu trữ lâu dài
                </p>

                {/* What AI checks */}
                <div style={{ backgroundColor: 'white', borderRadius: 14, border: '1.5px solid var(--border)', padding: 20, marginTop: 16 }}>
                  <h4 style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', marginBottom: 12 }}>AI sẽ đánh giá CV của bạn theo 5 tiêu chí:</h4>
                  {[
                    { icon: '🎯', title: 'Kỹ năng phù hợp', desc: 'So sánh kỹ năng với yêu cầu thị trường' },
                    { icon: '💼', title: 'Kinh nghiệm làm việc', desc: 'Chất lượng và tính liên quan của kinh nghiệm' },
                    { icon: '🎓', title: 'Học vấn & Chứng chỉ', desc: 'Bằng cấp và các chứng chỉ chuyên môn' },
                    { icon: '📄', title: 'Định dạng & Trình bày', desc: 'Bố cục, dễ đọc, chuyên nghiệp' },
                    { icon: '🔍', title: 'Từ khóa & ATS', desc: 'Tối ưu cho hệ thống lọc CV tự động' },
                  ].map(item => (
                    <div key={item.title} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>{item.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}