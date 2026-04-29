import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { employerService } from '../../services/employerService'

const STATUS_CONFIG = {
  pending:   { label: 'Chờ xem',    color: '#F59E0B', bg: '#FEF3C7', next: 'reviewing' },
  reviewing: { label: 'Đang xét',   color: '#3B82F6', bg: '#DBEAFE', next: 'interview' },
  interview: { label: 'Phỏng vấn',  color: '#8B5CF6', bg: '#EDE9FE', next: 'offered' },
  offered:   { label: 'Đã offer',   color: '#10B981', bg: '#D1FAE5', next: null },
  rejected:  { label: 'Từ chối',    color: '#EF4444', bg: '#FEE2E2', next: null },
}

function ScoreBar({ label, value, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
      <span style={{ fontSize: 11, color: '#64748B', width: 80, flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: 5, backgroundColor: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', backgroundColor: color, borderRadius: 4, transition: 'width 0.8s ease' }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color: '#0F172A', width: 28, textAlign: 'right' }}>{value}</span>
    </div>
  )
}

function ApplicantCard({ app, onStatusChange }) {
  const [expanded, setExpanded] = useState(false)
  const [updating, setUpdating] = useState(false)
  const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending
  const score = app.ai_score?.overall_score || 0
  const scoreColor = score >= 85 ? '#10B981' : score >= 70 ? '#3B82F6' : score >= 55 ? '#F59E0B' : '#EF4444'

  const initials = app.seeker.full_name.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase()

  const handleStatus = async (newStatus) => {
    setUpdating(true)
    await onStatusChange(app.id, newStatus)
    setUpdating(false)
  }

  return (
    <div style={{
      background: 'white', borderRadius: 14, border: '1.5px solid #E2E8F0',
      overflow: 'hidden', transition: 'box-shadow 0.2s',
      opacity: updating ? 0.6 : 1,
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.07)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      {/* Main row */}
      <div style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        {/* Avatar */}
        <div style={{
          width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #1E40AF, #7C3AED)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: 800, fontSize: 15,
        }}>
          {initials}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: '#0F172A' }}>{app.seeker.full_name}</span>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 9px', borderRadius: 20, backgroundColor: cfg.bg, color: cfg.color }}>
              {cfg.label}
            </span>
          </div>
          <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
            {app.seeker.email} • Nộp {new Date(app.applied_at).toLocaleDateString('vi-VN')}
          </div>
          <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 1 }}>📄 {app.resume.title}</div>
        </div>

        {/* AI Score */}
        <div style={{ textAlign: 'center', flexShrink: 0, minWidth: 64 }}>
          <div style={{
            fontSize: 22, fontWeight: 900, color: scoreColor, lineHeight: 1,
            background: scoreColor + '18', borderRadius: 10, padding: '6px 14px',
          }}>
            {score.toFixed(0)}
          </div>
          <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 3, fontWeight: 600 }}>AI Score</div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap', alignItems: 'center' }}>
          {cfg.next && (
            <button onClick={() => handleStatus(cfg.next)} disabled={updating} style={{
              padding: '7px 14px', borderRadius: 8, border: 'none',
              background: 'linear-gradient(135deg, #1E40AF, #3B82F6)', color: 'white',
              cursor: updating ? 'not-allowed' : 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'inherit',
            }}>
              → {STATUS_CONFIG[cfg.next]?.label}
            </button>
          )}
          {app.status !== 'rejected' && app.status !== 'offered' && (
            <button onClick={() => handleStatus('rejected')} disabled={updating} style={{
              padding: '7px 14px', borderRadius: 8, border: '1.5px solid #FCA5A5',
              background: '#FEF2F2', color: '#EF4444',
              cursor: updating ? 'not-allowed' : 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'inherit',
            }}>
              Từ chối
            </button>
          )}
          <button onClick={() => setExpanded(e => !e)} style={{
            padding: '7px 12px', borderRadius: 8, border: '1.5px solid #E2E8F0',
            background: expanded ? '#F1F5F9' : 'white', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit',
          }}>
            {expanded ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div style={{ borderTop: '1.5px solid #F1F5F9', padding: '18px 20px', background: '#FAFAFA' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* AI score breakdown */}
            {app.ai_score && (
              <div>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 12 }}>📊 Phân tích AI</h4>
                <ScoreBar label="Kỹ năng" value={app.ai_score.breakdown.skills} color="#3B82F6" />
                <ScoreBar label="Kinh nghiệm" value={app.ai_score.breakdown.experience} color="#8B5CF6" />
                <ScoreBar label="Học vấn" value={app.ai_score.breakdown.education} color="#10B981" />
                <ScoreBar label="Từ khóa" value={app.ai_score.breakdown.keywords} color="#F59E0B" />
              </div>
            )}

            {/* Cover letter */}
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>💬 Thư giới thiệu</h4>
              {app.cover_letter ? (
                <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, margin: 0, padding: '12px 14px', background: 'white', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                  {app.cover_letter}
                </p>
              ) : (
                <p style={{ fontSize: 13, color: '#94A3B8', fontStyle: 'italic' }}>Không có thư giới thiệu</p>
              )}
            </div>
          </div>

          <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
            <a href={app.resume.pdf_url} target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: '#EFF6FF', color: '#2563EB', border: '1.5px solid #BFDBFE',
              textDecoration: 'none',
            }}>
              📄 Xem CV
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default function EmployerApplicantsPage() {
  const { id: jobId } = useParams()
  const navigate = useNavigate()
  const [applications, setApplications] = useState([])
  const [jobTitle, setJobTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('score') // score | date

  useEffect(() => {
    Promise.all([
      employerService.getApplications(jobId),
      employerService.getJob(jobId),
    ]).then(([appRes, job]) => {
      setApplications(appRes.data)
      setJobTitle(job.title)
      setLoading(false)
    })
  }, [jobId])

  const handleStatusChange = async (appId, newStatus) => {
    await employerService.updateApplicationStatus(appId, newStatus)
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a))
  }

  const filtered = applications
    .filter(a => filterStatus === 'all' || a.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === 'score') return (b.ai_score?.overall_score || 0) - (a.ai_score?.overall_score || 0)
      return new Date(b.applied_at) - new Date(a.applied_at)
    })

  const countByStatus = (s) => applications.filter(a => a.status === s).length

  return (
    <div style={{ padding: '32px 0', maxWidth: 960, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <button onClick={() => navigate('/employer/jobs')} style={{
          background: 'none', border: 'none', cursor: 'pointer', color: '#64748B',
          fontSize: 13, fontFamily: 'inherit', fontWeight: 600, padding: 0, marginBottom: 12,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          ← Quay lại danh sách tin
        </button>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0F172A', marginBottom: 4 }}>
          👥 Ứng viên — {jobTitle}
        </h1>
        <p style={{ fontSize: 13, color: '#64748B' }}>{applications.length} hồ sơ ứng tuyển</p>
      </div>

      {/* Status summary */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <div key={key} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
            borderRadius: 20, background: cfg.bg, border: `1.5px solid ${cfg.color}33`,
          }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: cfg.color }}>{cfg.label}</span>
            <span style={{ fontSize: 13, fontWeight: 900, color: cfg.color }}>{countByStatus(key)}</span>
          </div>
        ))}
      </div>

      {/* Filter + Sort */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[{ key: 'all', label: `Tất cả (${applications.length})` }, ...Object.entries(STATUS_CONFIG).map(([key, cfg]) => ({ key, label: cfg.label }))].map(tab => (
            <button key={tab.key} onClick={() => setFilterStatus(tab.key)} style={{
              padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
              border: '1.5px solid', cursor: 'pointer', fontFamily: 'inherit',
              borderColor: filterStatus === tab.key ? '#3B82F6' : '#E2E8F0',
              backgroundColor: filterStatus === tab.key ? '#EFF6FF' : 'white',
              color: filterStatus === tab.key ? '#2563EB' : '#64748B',
            }}>
              {tab.label}
            </button>
          ))}
        </div>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
          padding: '7px 12px', borderRadius: 8, border: '1.5px solid #E2E8F0',
          fontSize: 13, fontFamily: 'inherit', color: '#0F172A', background: 'white', cursor: 'pointer',
        }}>
          <option value="score">Sắp xếp: AI Score cao nhất</option>
          <option value="date">Sắp xếp: Mới nhất</option>
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#94A3B8' }}>Đang tải...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, background: 'white', borderRadius: 16, border: '1.5px solid #E2E8F0' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
          <h3 style={{ color: '#0F172A', fontWeight: 700 }}>Chưa có ứng viên nào</h3>
          <p style={{ color: '#64748B', fontSize: 14 }}>Hãy chờ ứng viên nộp hồ sơ nhé!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(app => (
            <ApplicantCard key={app.id} app={app} onStatusChange={handleStatusChange} />
          ))}
        </div>
      )}
    </div>
  )
}
