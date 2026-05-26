import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { employerService } from '../../services/employerService'

const STATUS_CONFIG = {
  pending: { label: 'Chờ xem', color: '#F59E0B', bg: '#FEF3C7', next: 'reviewing' },
  reviewing: { label: 'Đang xét', color: '#3B82F6', bg: '#DBEAFE', next: 'interview' },
  interview: { label: 'Phỏng vấn', color: '#8B5CF6', bg: '#EDE9FE', next: 'offered' },
  offered: { label: 'Đã offer', color: '#10B981', bg: '#D1FAE5', next: null },
  rejected: { label: 'Từ chối', color: '#EF4444', bg: '#FEE2E2', next: null },
}

function ScoreBar({ label, value, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
      <span style={{ fontSize: 12.5, color: '#64748B', width: 90, flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: 6, backgroundColor: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', backgroundColor: color, borderRadius: 4, transition: 'width 0.8s ease' }} />
      </div>
      <span style={{ fontSize: 12.5, fontWeight: 700, color: '#0F172A', width: 28, textAlign: 'right' }}>{value}</span>
    </div>
  )
}

function RadarChart({ skills, experience, education, keywords }) {
  const size = 260;
  const center = size / 2;
  const rMax = size * 0.34;

  const categories = [
    { label: 'Kỹ năng', value: skills || 0 },
    { label: 'Kinh nghiệm', value: experience || 0 },
    { label: 'Học vấn', value: education || 0 },
    { label: 'Từ khóa', value: keywords || 0 }
  ];

  const angles = [-Math.PI / 2, 0, Math.PI / 2, Math.PI];

  const getCoordinates = (index, value) => {
    const angle = angles[index];
    const r = (value / 100) * rMax;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const gridLevels = [25, 50, 75, 100];

  const getGridPath = (level) => {
    return angles.map((angle, i) => {
      const r = (level / 100) * rMax;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ') + ' Z';
  };

  const scorePath = categories.map((cat, i) => {
    const { x, y } = getCoordinates(i, cat.value);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ') + ' Z';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#F8FAFC', borderRadius: 12, padding: '20px 28px', border: '1.5px solid #E2E8F0', width: '100%', maxWidth: 340 }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} style={{ maxWidth: size, maxHeight: size }}>
        {/* Draw background grids */}
        {gridLevels.map(level => (
          <path
            key={level}
            d={getGridPath(level)}
            fill="none"
            stroke="#CBD5E1"
            strokeWidth="0.8"
            strokeDasharray={level === 100 ? "0" : "2,2"}
          />
        ))}

        {/* Draw axis lines */}
        {angles.map((angle, i) => {
          const xMax = center + rMax * Math.cos(angle);
          const yMax = center + rMax * Math.sin(angle);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={xMax}
              y2={yMax}
              stroke="#E2E8F0"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Draw labels */}
        {categories.map((cat, i) => {
          const angle = angles[i];
          const labelDist = rMax + 20;
          const x = center + labelDist * Math.cos(angle);
          const y = center + labelDist * Math.sin(angle);

          let textAnchor = "middle";
          let transform = undefined;
          let dy = "0.3em";

          if (i === 1) { // Kinh nghiệm (right)
            textAnchor = "middle";
            transform = `rotate(-90, ${x}, ${y})`;
            dy = "0.3em";
          } else if (i === 3) { // Từ khóa (left)
            textAnchor = "middle";
            transform = `rotate(-90, ${x}, ${y})`;
            dy = "0.3em";
          } else { // Top (Kỹ năng) & Bottom (Học vấn)
            if (Math.cos(angle) > 0.1) textAnchor = "start";
            else if (Math.cos(angle) < -0.1) textAnchor = "end";

            if (Math.sin(angle) > 0.5) dy = "1em";
            else if (Math.sin(angle) < -0.5) dy = "-0.3em";
          }

          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor={textAnchor}
              dy={dy}
              transform={transform}
              style={{ fontSize: 11.5, fontWeight: 700, fill: '#475569' }}
            >
              {cat.label} ({cat.value})
            </text>
          );
        })}

        {/* Draw score area */}
        <path
          d={scorePath}
          fill="rgba(59, 130, 246, 0.2)"
          stroke="#3B82F6"
          strokeWidth="2"
        />

        {/* Draw score dots */}
        {categories.map((cat, i) => {
          const { x, y } = getCoordinates(i, cat.value);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              fill="#3B82F6"
              stroke="white"
              strokeWidth="2"
            />
          );
        })}
      </svg>
    </div>
  );
}

function ApplicantCard({ app, onStatusChange, onScore, isSelected, onSelect, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const [updating, setUpdating] = useState(false)
  const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending
  const score = app.ai_score?.overall_score || 0
  const scoreColor = score >= 85 ? '#10B981' : score >= 70 ? '#3B82F6' : score >= 55 ? '#F59E0B' : '#EF4444'

  const initials = app.seeker?.full_name ? app.seeker.full_name.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase() : 'CV'

  const getCvUrl = (path) => {
    if (!path || path === '#') return '#';
    if (path.startsWith('http')) return path;
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    const host = baseUrl.replace(/\/api\/?$/, ''); // Remove trailing /api
    const token = localStorage.getItem('nexcv_token');
    const separator = path.includes('?') ? '&' : '?';
    return `${host}${path}${token ? `${separator}token=${token}` : ''}`;
  };

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
        {/* Bulk Action Checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#3B82F6', marginRight: 4 }}
        />
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
          <button onClick={onScore} style={{
            padding: '7px 12px', borderRadius: 8, border: '1.5px solid #FBCFE8',
            background: '#FDF2F8', color: '#DB2777', cursor: 'pointer', fontSize: 12, fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: 4
          }}>
            <span>✨</span> {app.ai_score ? 'Chấm lại' : 'Chấm điểm'}
          </button>
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
          {/* Delete Button */}
          <button onClick={onDelete} style={{
            padding: '7px 10px', borderRadius: 8, border: '1.5px solid #FCA5A5',
            background: '#FEF2F2', color: '#EF4444', cursor: 'pointer', fontSize: 13,
            transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#EF4444'; e.currentTarget.style.color = 'white' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.color = '#EF4444' }}
            title="Xóa hồ sơ này"
          >
            🗑️
          </button>
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
        <div style={{ borderTop: '1.5px solid #F1F5F9', padding: '24px 28px', background: '#FAFAFA' }}>
          <div style={{ display: 'grid', gridTemplateColumns: app.ai_score ? '1.1fr 2fr' : '1fr', gap: 32, alignItems: 'start' }}>
            {/* Left Column: Scores & Radar Chart */}
            {app.ai_score && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24, background: '#F8FAFC', padding: 20, borderRadius: 12, border: '1.5px solid #E2E8F0' }}>
                {/* 1. Score bars */}
                <div>
                  <h4 style={{ fontSize: 14.5, fontWeight: 700, color: '#0F172A', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>📊</span> Điểm chi tiết
                  </h4>
                  <ScoreBar label="Kỹ năng" value={app.ai_score.breakdown.skills} color="#3B82F6" />
                  <ScoreBar label="Kinh nghiệm" value={app.ai_score.breakdown.experience} color="#8B5CF6" />
                  <ScoreBar label="Học vấn" value={app.ai_score.breakdown.education} color="#10B981" />
                  <ScoreBar label="Từ khóa" value={app.ai_score.breakdown.keywords} color="#F59E0B" />
                </div>

                {/* 2. Spider Chart */}
                <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <h4 style={{ fontSize: 14.5, fontWeight: 700, color: '#0F172A', marginBottom: 12, width: '100%', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>🕸️</span> Biểu đồ năng lực
                  </h4>
                  <RadarChart
                    skills={app.ai_score.breakdown.skills}
                    experience={app.ai_score.breakdown.experience}
                    education={app.ai_score.breakdown.education}
                    keywords={app.ai_score.breakdown.keywords}
                  />
                </div>
              </div>
            )}

            {/* Right Column: Cover letter & Recruiter Review */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Recruiter Review or Placeholder */}
              <div>
                <h4 style={{ fontSize: 14.5, fontWeight: 700, color: '#0F172A', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>✨</span> Đánh giá góc nhìn tuyển dụng (AI):
                </h4>
                {app.ai_score?.review ? (
                  <p style={{
                    fontSize: 14, color: '#B45309', lineHeight: 1.6, margin: 0, padding: '14px 16px',
                    background: '#FFFBEB', borderRadius: 10, border: '1.5px solid #FDE68A',
                    fontStyle: 'italic', whiteSpace: 'pre-wrap'
                  }}>
                    {app.ai_score.review}
                  </p>
                ) : (
                  <div style={{
                    fontSize: 13, color: '#475569', lineHeight: 1.6, padding: '14px 16px',
                    background: '#F1F5F9', borderRadius: 10, border: '1.5px solid #E2E8F0',
                    display: 'flex', gap: 8, alignItems: 'center'
                  }}>
                    <span>💡</span>
                    <span>Hãy nhấn nút <b>Chấm điểm</b> hoặc <b>Chấm lại</b> để AI tự động phân tích CV này dưới góc nhìn nhà tuyển dụng!</span>
                  </div>
                )}
              </div>

              {/* Strengths & Improvements */}
              {app.ai_score?.analysis?.strengths?.length > 0 && (
                <div style={{
                  background: '#ECFDF5', border: '1.5px solid #A7F3D0', borderRadius: 10, padding: '14px 16px'
                }}>
                  <h5 style={{ margin: '0 0 8px 0', fontSize: 13.5, fontWeight: 700, color: '#065F46', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span>✅</span> Ưu điểm nổi bật (ATS):
                  </h5>
                  <ul style={{ margin: 0, paddingLeft: 16, fontSize: 13, color: '#065F46', lineHeight: 1.6 }}>
                    {app.ai_score.analysis.strengths.map((str, idx) => (
                      <li key={idx} style={{ marginBottom: 4 }}>{str}</li>
                    ))}
                  </ul>
                </div>
              )}

              {app.ai_score?.analysis?.improvements?.length > 0 && (
                <div style={{
                  background: '#FFF5F5', border: '1.5px solid #FED7D7', borderRadius: 10, padding: '14px 16px'
                }}>
                  <h5 style={{ margin: '0 0 8px 0', fontSize: 13.5, fontWeight: 700, color: '#9B2C2C', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span>⚠️</span> Điểm cần cải thiện (ATS):
                  </h5>
                  <ul style={{ margin: 0, paddingLeft: 16, fontSize: 13, color: '#9B2C2C', lineHeight: 1.6 }}>
                    {app.ai_score.analysis.improvements.map((imp, idx) => (
                      <li key={idx} style={{ marginBottom: 4 }}>{imp}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h4 style={{ fontSize: 14.5, fontWeight: 700, color: '#0F172A', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>💬</span> Thư giới thiệu
                </h4>
                {app.cover_letter ? (
                  <p style={{
                    fontSize: 14, color: '#475569', lineHeight: 1.6, margin: 0,
                    padding: '14px 16px', background: 'white', borderRadius: 10,
                    border: '1.5px solid #E2E8F0', whiteSpace: 'pre-wrap'
                  }}>
                    {app.cover_letter}
                  </p>
                ) : (
                  <p style={{ fontSize: 14, color: '#94A3B8', fontStyle: 'italic', margin: 0 }}>Không có thư giới thiệu</p>
                )}
              </div>

              <div style={{ marginTop: 8, display: 'flex', gap: 10, borderTop: '1px solid #E2E8F0', paddingTop: 16 }}>
                <a href={getCvUrl(app.resume.pdf_url)} target="_blank" rel="noopener noreferrer" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '9px 18px', borderRadius: 8, fontSize: 13.5, fontWeight: 600,
                  background: '#EFF6FF', color: '#2563EB', border: '1.5px solid #BFDBFE',
                  textDecoration: 'none',
                }}>
                  📄 Xem CV ứng viên
                </a>
              </div>
            </div>
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
  const [search, setSearch] = useState('')

  // CV Scoring Modal state
  const [showScoringModal, setShowScoringModal] = useState(false)
  const [scoringFile, setScoringFile] = useState(null)
  const [scoringLoading, setScoringLoading] = useState(false)
  const [scoringResult, setScoringResult] = useState(null)
  const [scoringError, setScoringError] = useState('')
  const [scoringTargetApplicant, setScoringTargetApplicant] = useState(null)

  // Selection & deletion states
  const [selectedIds, setSelectedIds] = useState([])

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filtered.map(app => app.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectOne = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const handleDeleteOne = async (appId, candidateName) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa hồ sơ ứng tuyển của "${candidateName || 'Ứng viên'}" không?`)) {
      return
    }
    try {
      await employerService.deleteApplication(appId)
      setApplications(prev => prev.filter(app => app.id !== appId))
      setSelectedIds(prev => prev.filter(id => id !== appId))
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Lỗi khi xóa hồ sơ')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return
    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} hồ sơ đã chọn không?`)) {
      return
    }
    try {
      await employerService.bulkDeleteApplications(selectedIds)
      setApplications(prev => prev.filter(app => !selectedIds.includes(app.id)))
      setSelectedIds([])
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Lỗi khi xóa hàng loạt hồ sơ')
    }
  }

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
    .filter(a => {
      if (!search) return true
      const term = search.toLowerCase()
      return a.candidate_name?.toLowerCase().includes(term) ||
        a.candidate_email?.toLowerCase().includes(term) ||
        a.seeker?.full_name?.toLowerCase().includes(term) ||
        a.seeker?.email?.toLowerCase().includes(term)
    })
    .sort((a, b) => {
      if (sortBy === 'score') {
        const scoreDiff = (b.ai_score?.overall_score || 0) - (a.ai_score?.overall_score || 0)
        if (scoreDiff !== 0) return scoreDiff
        return new Date(b.applied_at) - new Date(a.applied_at)
      }
      return new Date(b.applied_at) - new Date(a.applied_at)
    })

  const countByStatus = (status) => applications.filter(a => a.status === status).length

  const handleScoreCv = async () => {
    // Allow scoring if either a new file is selected OR applicant already has a CV in DB
    if (!scoringFile && !scoringTargetApplicant) {
      setScoringError('Vui lòng chọn file PDF CV')
      return
    }
    setScoringError('')
    setScoringLoading(true)
    setScoringResult(null)

    try {
      const candidateId = scoringTargetApplicant?.seeker_id || scoringTargetApplicant?.seeker?.id || scoringTargetApplicant?.seeker?._id;
      // Pass scoringFile only if user explicitly uploaded a new one, otherwise pass null
      // so the backend auto-fetches the candidate's existing CV from MongoDB
      const res = await employerService.scoreCv(jobId, scoringFile || null, candidateId)
      setScoringResult(res.data)

      // Refresh the application list on the page so the scores, AI reviews, and spider charts update instantly!
      const appRes = await employerService.getApplications(jobId)
      setApplications(appRes.data)
    } catch (err) {
      setScoringError(err.response?.data?.message || err.message || 'Lỗi khi chấm điểm CV')
    } finally {
      setScoringLoading(false)
    }
  }

  return (
    <div style={{ padding: '32px 0', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
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
        <button
          onClick={() => {
            setScoringTargetApplicant(null);
            setShowScoringModal(true);
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          style={{
            padding: '14px 28px', borderRadius: 12, border: 'none',
            background: 'linear-gradient(135deg, #6366F1, #A855F7, #EC4899)',
            color: 'white',
            cursor: 'pointer', fontSize: 15, fontWeight: 800, fontFamily: 'inherit',
            boxShadow: '0 10px 25px -5px rgba(168, 85, 247, 0.5), 0 8px 10px -6px rgba(168, 85, 247, 0.3)',
            display: 'flex', alignItems: 'center', gap: 10,
            textTransform: 'uppercase', letterSpacing: '0.5px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: 'translateY(0)'
          }}
        >
          <span style={{ fontSize: '1.3em' }}>✨</span>
          <span>Chấm Điểm CV Bằng AI</span>
        </button>
      </div>

      {/* Filter + Sort */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 300 }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}>🔍</span>
          <input
            type="text"
            placeholder="Tìm kiếm ứng viên theo tên hoặc email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '12px 14px 12px 42px', border: '1.5px solid #E2E8F0', borderRadius: 12,
              fontSize: 14, fontFamily: 'inherit', color: '#0F172A', boxSizing: 'border-box',
              outline: 'none', transition: 'all 0.2s', backgroundColor: 'white'
            }}
          />
        </div>
      </div>

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
          {/* Bulk Selection Header Bar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 18px', background: '#F8FAFC', borderRadius: 12,
            border: '1.5px solid #E2E8F0', marginBottom: 4, boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input
                type="checkbox"
                checked={filtered.length > 0 && selectedIds.length === filtered.length}
                onChange={handleSelectAll}
                style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#3B82F6' }}
              />
              <span style={{ fontSize: 13.5, color: '#475569', fontWeight: 700 }}>
                Chọn tất cả ({filtered.length} hồ sơ)
              </span>
            </div>
            {selectedIds.length > 0 && (
              <button onClick={handleBulkDelete} style={{
                padding: '6px 14px', borderRadius: 8, border: 'none',
                background: '#EF4444', color: 'white', cursor: 'pointer',
                fontSize: 12.5, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6,
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)', transition: 'background 0.2s'
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#DC2626'}
                onMouseLeave={e => e.currentTarget.style.background = '#EF4444'}
              >
                🗑️ Xóa đã chọn ({selectedIds.length})
              </button>
            )}
          </div>

          {filtered.map(app => (
            <ApplicantCard
              key={app.id}
              app={app}
              isSelected={selectedIds.includes(app.id)}
              onSelect={() => handleSelectOne(app.id)}
              onDelete={() => handleDeleteOne(app.id, app.seeker?.full_name || app.candidate_name)}
              onStatusChange={handleStatusChange}
              onScore={() => {
                setScoringTargetApplicant(app);
                setShowScoringModal(true);
              }}
            />
          ))}
        </div>
      )}

      {/* CV Scoring Modal */}
      {showScoringModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20
        }}>
          <div style={{
            background: 'white', borderRadius: 16, width: '100%', maxWidth: 500,
            overflow: 'hidden', display: 'flex', flexDirection: 'column',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: 18, color: '#0F172A' }}>✨ Chấm điểm CV Bằng AI</h3>
              <button onClick={() => { setShowScoringModal(false); setScoringResult(null); setScoringFile(null); }} style={{
                background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#94A3B8'
              }}>×</button>
            </div>

            <div style={{ padding: 24, flex: 1, overflowY: 'auto' }}>
              <p style={{ fontSize: 14, color: '#64748B', marginTop: 0, marginBottom: 16 }}>
                Hệ thống AI sẽ đánh giá mức độ phù hợp {scoringTargetApplicant ? `của ứng viên ${scoringTargetApplicant.seeker.full_name}` : ''} với tin tuyển dụng <b>{jobTitle}</b>.
              </p>

              {scoringTargetApplicant && (
                <div style={{
                  background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 12,
                  padding: '14px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12
                }}>
                  <div style={{ fontSize: 24 }}>📄</div>
                  <div style={{ flex: 1 }}>
                    <h5 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1E40AF' }}>
                      Đã tìm thấy CV của ứng viên trong hệ thống
                    </h5>
                    <p style={{ margin: '2px 0 0 0', fontSize: 11, color: '#3B82F6', fontWeight: 600 }}>
                      File: {scoringTargetApplicant.resume?.title || 'CV_Ung_Vien.pdf'}
                    </p>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, background: '#DBEAFE', color: '#1E40AF', padding: '3px 8px', borderRadius: 20 }}>
                    Sẵn sàng
                  </span>
                </div>
              )}

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                  {scoringTargetApplicant ? 'Hoặc tải lên CV khác (Tùy chọn)' : 'Tải lên file CV (PDF)'}
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setScoringFile(e.target.files[0])}
                  style={{
                    display: 'block', width: '100%', padding: '10px 14px',
                    border: '1.5px dashed #CBD5E1', borderRadius: 8,
                    fontSize: 14, color: '#475569'
                  }}
                />
              </div>

              {scoringError && (
                <div style={{ padding: 12, background: '#FEF2F2', color: '#EF4444', borderRadius: 8, fontSize: 13, marginBottom: 20 }}>
                  {scoringError}
                </div>
              )}

              {scoringResult && (
                <div style={{ padding: 20, background: '#F8FAFC', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                  <div style={{ textAlign: 'center', marginBottom: 16 }}>
                    <div style={{
                      fontSize: 48, fontWeight: 900, lineHeight: 1,
                      color: (scoringResult.score >= 8 || scoringResult.overall >= 80) ? '#10B981' : (scoringResult.score >= 5 || scoringResult.overall >= 60) ? '#F59E0B' : '#EF4444'
                    }}>
                      {scoringResult.score || scoringResult.overall}/100
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#64748B', marginTop: 4 }}>ĐIỂM PHÙ HỢP</div>
                    {scoringResult.reused && (
                      <div style={{ marginTop: 8 }}>
                        <span style={{ fontSize: 10, padding: '2px 8px', background: '#DBEAFE', color: '#1E40AF', borderRadius: 4, fontWeight: 700 }}>
                          ♻️ TÁI SỬ DỤNG ĐIỂM SỐ CỦA ỨNG VIÊN (TIẾT KIỆM TOKEN)
                        </span>
                      </div>
                    )}
                  </div>

                  <h4 style={{ margin: '0 0 8px 0', fontSize: 14, color: '#0F172A' }}>📝 Nhận xét chi tiết:</h4>
                  <p style={{ margin: 0, fontSize: 14, color: '#475569', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                    {scoringResult.review}
                  </p>
                </div>
              )}
            </div>

            <div style={{ padding: '16px 24px', borderTop: '1px solid #E2E8F0', background: '#F8FAFC', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button
                onClick={() => { setShowScoringModal(false); setScoringResult(null); setScoringFile(null); }}
                style={{ padding: '10px 16px', borderRadius: 8, border: '1.5px solid #E2E8F0', background: 'white', color: '#64748B', fontWeight: 600, cursor: 'pointer' }}
              >
                Đóng
              </button>
              <button
                onClick={handleScoreCv}
                disabled={scoringLoading || (!scoringFile && !scoringTargetApplicant)}
                style={{
                  padding: '10px 20px', borderRadius: 8, border: 'none',
                  background: 'linear-gradient(135deg, #10B981, #059669)', color: 'white',
                  fontWeight: 700, cursor: (scoringLoading || (!scoringFile && !scoringTargetApplicant)) ? 'not-allowed' : 'pointer',
                  opacity: (scoringLoading || (!scoringFile && !scoringTargetApplicant)) ? 0.7 : 1
                }}
              >
                {scoringLoading ? 'Đang phân tích AI...' : (scoringFile ? 'Chấm điểm bằng CV mới' : 'Bắt đầu chấm điểm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
