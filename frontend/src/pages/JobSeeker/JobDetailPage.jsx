import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { jobService, MOCK_JOBS } from '../../services/jobService'
import { useAuth } from '../../context/AuthContext'

export default function JobDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [showApplyModal, setShowApplyModal] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const data = await jobService.getJob(id)
        setJob(data)
      } catch {
        navigate('/jobs')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  const handleApply = async () => {
    if (!isAuthenticated) { navigate('/login', { state: { from: `/jobs/${id}` } }); return }
    setApplying(true)
    try {
      await jobService.applyJob(id)
      setApplied(true)
      setShowApplyModal(false)
    } catch (err) {
      alert(err?.message || 'Ứng tuyển thất bại')
    } finally {
      setApplying(false)
    }
  }

  const handleSave = async () => {
    if (!isAuthenticated) { navigate('/login'); return }
    setSaved(v => !v)
    await jobService.toggleSaveJob(id).catch(() => setSaved(v => !v))
  }

  if (loading) return (
    <div className="section container-app">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
        <div>
          <div className="shimmer" style={{ height: 180, borderRadius: 14, marginBottom: 16 }} />
          <div className="shimmer" style={{ height: 400, borderRadius: 14 }} />
        </div>
        <div className="shimmer" style={{ height: 350, borderRadius: 14 }} />
      </div>
    </div>
  )

  if (!job) return null

  const daysAgo = Math.floor((Date.now() - new Date(job.postedAt)) / 86400000)
  const initials = job.company.slice(0, 2).toUpperCase()
  const relatedJobs = MOCK_JOBS.filter(j => j.id !== job.id && j.category === job.category).slice(0, 3)

  return (
    <>
      <div style={{ backgroundColor: 'var(--bg-base)', paddingBottom: 80 }}>
        {/* Breadcrumb */}
        <div style={{ backgroundColor: 'white', borderBottom: '1px solid var(--border)', padding: '10px 0' }}>
          <div className="container-app" style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
            <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Trang chủ</Link>
            <span>›</span>
            <Link to="/jobs" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Việc làm</Link>
            <span>›</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{job.title}</span>
          </div>
        </div>

        <div className="container-app" style={{ paddingTop: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
            {/* Main content */}
            <div>
              {/* Job header */}
              <div style={{ backgroundColor: 'white', borderRadius: 16, border: '1.5px solid var(--border)', padding: 28, marginBottom: 16 }} className="animate-fade-in">
                <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 20 }}>
                  <div style={{ width: 72, height: 72, borderRadius: 16, backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 20, color: 'var(--primary)', flexShrink: 0 }}>
                    {initials}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6, lineHeight: 1.2 }}>{job.title}</h1>
                    <p style={{ fontSize: 15, color: 'var(--primary)', fontWeight: 600, marginBottom: 12 }}>{job.company}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {[{ icon: '📍', text: job.location }, { icon: '💰', text: job.salary }, { icon: '📊', text: job.level }, { icon: '⏱️', text: job.type }].map(i => (
                        <span key={i.text} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--text-secondary)', backgroundColor: 'var(--bg-subtle)', padding: '5px 12px', borderRadius: 8 }}>
                          <span>{i.icon}</span> {i.text}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingTop: 16, borderTop: '1px solid var(--border)', alignItems: 'center' }}>
                  {job.tags.map(t => <span key={t} style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20, backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 500 }}>{t}</span>)}
                  <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)' }}>
                    Đăng {daysAgo === 0 ? 'hôm nay' : `${daysAgo} ngày trước`} · {job.views} lượt xem · {job.applied} ứng tuyển
                  </span>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                  {applied ? (
                    <div style={{ flex: 1, padding: '12px', backgroundColor: 'var(--success-light)', border: '1.5px solid rgba(5,150,105,0.3)', borderRadius: 10, textAlign: 'center', fontWeight: 700, color: 'var(--success)', fontSize: 14 }}>
                      ✅ Đã ứng tuyển thành công
                    </div>
                  ) : (
                    <button
                      onClick={() => isAuthenticated ? setShowApplyModal(true) : navigate('/login', { state: { from: `/jobs/${id}` } })}
                      className="btn-primary"
                      style={{ flex: 1, padding: '12px', border: 'none', cursor: 'pointer', fontSize: 14, borderRadius: 10, fontFamily: 'inherit', fontWeight: 700 }}
                    >
                      {isAuthenticated ? '🚀 Ứng tuyển ngay' : '🔒 Đăng nhập để ứng tuyển'}
                    </button>
                  )}
                  <button
                    onClick={handleSave}
                    style={{ padding: '12px 16px', borderRadius: 10, border: `1.5px solid ${saved ? 'var(--warning)' : 'var(--border)'}`, backgroundColor: saved ? 'var(--warning-light)' : 'white', cursor: 'pointer', fontSize: 16, transition: 'all 0.2s' }}
                    title={saved ? 'Bỏ lưu' : 'Lưu công việc'}
                  >
                    {saved ? '🔖' : '📌'}
                  </button>
                  <button style={{ padding: '12px 16px', borderRadius: 10, border: '1.5px solid var(--border)', backgroundColor: 'white', cursor: 'pointer', fontSize: 16 }} title="Chia sẻ">
                    🔗
                  </button>
                </div>
              </div>

              {/* Job description */}
              <div style={{ backgroundColor: 'white', borderRadius: 16, border: '1.5px solid var(--border)', padding: 28, marginBottom: 16 }} className="animate-fade-in delay-100">
                <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  📋 Mô tả công việc
                </h2>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                  {job.description}
                </div>

                <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: '24px 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  ✅ Yêu cầu công việc
                </h2>
                <ul style={{ paddingLeft: 0, listStyle: 'none', margin: 0 }}>
                  {job.requirements.map((req, i) => (
                    <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      <span style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: 'var(--primary-light)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'var(--primary)', flexShrink: 0, marginTop: 2 }}>✓</span>
                      {req}
                    </li>
                  ))}
                </ul>

                <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: '24px 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  🎁 Phúc lợi
                </h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {job.benefits.map((b, i) => (
                    <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, padding: '7px 14px', borderRadius: 8, backgroundColor: 'var(--success-light)', color: 'var(--success)', border: '1px solid rgba(5,150,105,0.15)', fontWeight: 500 }}>
                      ✨ {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Deadline */}
              <div style={{ backgroundColor: 'var(--warning-light)', border: '1px solid rgba(217,119,6,0.2)', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18 }}>⏰</span>
                <div>
                  <span style={{ fontWeight: 600, fontSize: 13, color: '#92400E' }}>Hạn nộp hồ sơ:</span>
                  <span style={{ fontSize: 13, color: '#92400E', marginLeft: 6 }}>{new Date(job.deadline).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div>
              {/* Apply box */}
              <div style={{ backgroundColor: 'white', borderRadius: 14, border: '1.5px solid var(--border)', padding: 20, marginBottom: 16, position: 'sticky', top: 80 }}>
                <h3 style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 16 }}>Tổng quan công việc</h3>
                {[
                  { label: 'Cấp bậc', value: job.level },
                  { label: 'Ngành nghề', value: job.category },
                  { label: 'Hình thức', value: job.type },
                  { label: 'Lương', value: job.salary },
                  { label: 'Địa điểm', value: job.location },
                  { label: 'Hạn nộp', value: new Date(job.deadline).toLocaleDateString('vi-VN') },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                    <span style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', textAlign: 'right', maxWidth: '60%' }}>{item.value}</span>
                  </div>
                ))}

                <Link
                  to="/cv-upload"
                  style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, padding: '10px 14px', borderRadius: 10, backgroundColor: 'var(--ai-light)', border: '1px solid rgba(124,58,237,0.2)', textDecoration: 'none', transition: 'all 0.2s' }}
                >
                  <span style={{ fontSize: 18 }}>✨</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ai)' }}>Kiểm tra CV phù hợp?</div>
                    <div style={{ fontSize: 11, color: 'rgba(124,58,237,0.7)' }}>Chấm điểm CV bằng AI ngay</div>
                  </div>
                </Link>
              </div>

              {/* Related jobs */}
              {relatedJobs.length > 0 && (
                <div style={{ backgroundColor: 'white', borderRadius: 14, border: '1.5px solid var(--border)', padding: 20 }}>
                  <h3 style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', marginBottom: 14 }}>Việc làm tương tự</h3>
                  {relatedJobs.map(rj => (
                    <Link key={rj.id} to={`/jobs/${rj.id}`} style={{ display: 'block', padding: '10px 0', borderBottom: '1px solid var(--border)', textDecoration: 'none', transition: 'all 0.15s' }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)', marginBottom: 2 }}>{rj.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{rj.company} · {rj.salary}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Apply modal */}
      {showApplyModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}>
          <div style={{ backgroundColor: 'white', borderRadius: 20, padding: 32, width: '100%', maxWidth: 440, animation: 'fadeInUp 0.2s ease' }}>
            <h3 style={{ fontWeight: 800, fontSize: 20, color: 'var(--text-primary)', marginBottom: 8 }}>Ứng tuyển vào</h3>
            <p style={{ fontSize: 15, color: 'var(--primary)', fontWeight: 600, marginBottom: 4 }}>{job.title}</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>{job.company}</p>

            <div style={{ backgroundColor: 'var(--ai-light)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 10, padding: '12px 14px', marginBottom: 20 }}>
              <p style={{ fontSize: 13, color: 'var(--ai)', fontWeight: 500, margin: 0 }}>
                💡 Tip: <Link to="/cv-upload" style={{ color: 'var(--ai)', fontWeight: 700 }}>Chấm điểm CV</Link> trước để tăng tỷ lệ đậu
              </p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Thư giới thiệu (tuỳ chọn)</label>
              <textarea
                rows={4}
                placeholder="Viết vài câu giới thiệu bản thân và lý do bạn phù hợp với vị trí này..."
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: 13, fontFamily: 'inherit', color: 'var(--text-primary)', resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowApplyModal(false)} style={{ flex: 1, padding: '11px', borderRadius: 10, border: '1.5px solid var(--border)', backgroundColor: 'white', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit', fontWeight: 600 }}>
                Hủy
              </button>
              <button onClick={handleApply} disabled={applying} className="btn-primary" style={{ flex: 2, padding: '11px', border: 'none', cursor: applying ? 'not-allowed' : 'pointer', fontSize: 14, borderRadius: 10, fontFamily: 'inherit', fontWeight: 700, opacity: applying ? 0.7 : 1 }}>
                {applying ? '⏳ Đang xử lý...' : '🚀 Xác nhận ứng tuyển'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .container-app > div > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}