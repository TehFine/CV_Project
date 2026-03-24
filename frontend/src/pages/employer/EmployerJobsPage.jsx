import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { employerService } from '../../services/employerService'

const STATUS_CONFIG = {
  active:  { label: 'Đang tuyển', color: '#10B981', bg: '#D1FAE5' },
  draft:   { label: 'Bản nháp',   color: '#64748B', bg: '#F1F5F9' },
  expired: { label: 'Hết hạn',    color: '#EF4444', bg: '#FEE2E2' },
  closed:  { label: 'Đã đóng',    color: '#94A3B8', bg: '#F8FAFC' },
}

const JOB_TYPE_LABEL = {
  'full-time': 'Toàn thời gian',
  'part-time': 'Bán thời gian',
  'remote': 'Remote',
  'internship': 'Thực tập',
}

const LEVEL_LABEL = {
  intern: 'Intern', fresher: 'Fresher', junior: 'Junior', mid: 'Mid-level', senior: 'Senior',
}

function formatSalary(min, max) {
  const fmt = (n) => n >= 1000000 ? (n / 1000000).toFixed(0) + 'tr' : n.toLocaleString()
  if (!min && !max) return 'Thỏa thuận'
  if (!max) return `Từ ${fmt(min)}`
  if (!min) return `Đến ${fmt(max)}`
  return `${fmt(min)} – ${fmt(max)}`
}

function JobCard({ job, onDelete, onStatusChange }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const cfg = STATUS_CONFIG[job.status] || STATUS_CONFIG.draft
  const navigate = useNavigate()

  const handleDelete = async () => {
    if (!confirm(`Xóa tin "${job.title}"?`)) return
    setDeleting(true)
    await onDelete(job.id)
  }

  return (
    <div style={{
      background: 'white', borderRadius: 14, border: '1.5px solid #E2E8F0',
      padding: 20, transition: 'box-shadow 0.2s',
      opacity: deleting ? 0.5 : 1,
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.07)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0 }}>{job.title}</h3>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 20, backgroundColor: cfg.bg, color: cfg.color }}>
              {cfg.label}
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 10 }}>
            {[
              { icon: '📍', text: job.location },
              { icon: '💼', text: JOB_TYPE_LABEL[job.job_type] },
              { icon: '📊', text: LEVEL_LABEL[job.level] },
              { icon: '💰', text: formatSalary(job.salary_min, job.salary_max) },
            ].map(item => (
              <span key={item.text} style={{ fontSize: 12, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4 }}>
                {item.icon} {item.text}
              </span>
            ))}
          </div>

          {job.required_skills?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {job.required_skills.slice(0, 5).map(skill => (
                <span key={skill} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, backgroundColor: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE', fontWeight: 500 }}>
                  {skill}
                </span>
              ))}
              {job.required_skills.length > 5 && (
                <span style={{ fontSize: 11, color: '#94A3B8' }}>+{job.required_skills.length - 5}</span>
              )}
            </div>
          )}
        </div>

        {/* Stats + menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#0F172A' }}>{job.application_count}</div>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>Ứng tuyển</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#0F172A' }}>{job.view_count}</div>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>Lượt xem</div>
          </div>

          {/* Action menu */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setMenuOpen(o => !o)}
              style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: 8, width: 36, height: 36, cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >⋯</button>
            {menuOpen && (
              <div
                style={{ position: 'absolute', right: 0, top: 44, zIndex: 50, background: 'white', borderRadius: 10, border: '1.5px solid #E2E8F0', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', minWidth: 180, overflow: 'hidden' }}
                onMouseLeave={() => setMenuOpen(false)}
              >
                {[
                  { icon: '✏️', label: 'Chỉnh sửa', action: () => navigate(`/employer/jobs/${job.id}/edit`) },
                  { icon: '👥', label: 'Xem ứng viên', action: () => navigate(`/employer/jobs/${job.id}/applicants`) },
                  job.status === 'draft'
                    ? { icon: '✅', label: 'Đăng tin', action: () => { onStatusChange(job.id, 'active'); setMenuOpen(false) } }
                    : { icon: '⏸️', label: 'Tạm đóng', action: () => { onStatusChange(job.id, 'closed'); setMenuOpen(false) } },
                  { icon: '🗑️', label: 'Xóa tin', action: handleDelete, danger: true },
                ].map(item => (
                  <button key={item.label} onClick={() => { item.action(); setMenuOpen(false) }} style={{
                    width: '100%', padding: '10px 16px', background: 'none', border: 'none',
                    cursor: 'pointer', fontSize: 13, fontWeight: 500, textAlign: 'left',
                    color: item.danger ? '#EF4444' : '#0F172A',
                    display: 'flex', alignItems: 'center', gap: 10,
                    fontFamily: 'inherit',
                    transition: 'background 0.15s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = item.danger ? '#FEF2F2' : '#F8FAFC'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    {item.icon} {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid #F1F5F9', marginTop: 14, paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <span style={{ fontSize: 12, color: '#94A3B8' }}>
          Đăng {new Date(job.created_at).toLocaleDateString('vi-VN')}
          {job.expired_at && ` • Hết hạn ${new Date(job.expired_at).toLocaleDateString('vi-VN')}`}
        </span>
        <Link
          to={`/employer/jobs/${job.id}/applicants`}
          style={{ fontSize: 12, fontWeight: 700, color: '#3B82F6', textDecoration: 'none' }}
        >
          Xem {job.application_count} ứng viên →
        </Link>
      </div>
    </div>
  )
}

export default function EmployerJobsPage() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')

  const loadJobs = async () => {
    setLoading(true)
    const params = filterStatus !== 'all' ? { status: filterStatus } : {}
    const res = await employerService.getMyJobs(params)
    setJobs(res.data)
    setLoading(false)
  }

  useEffect(() => { loadJobs() }, [filterStatus])

  const handleDelete = async (id) => {
    await employerService.deleteJob(id)
    setJobs(prev => prev.filter(j => j.id !== id))
  }

  const handleStatusChange = async (id, status) => {
    const updated = await employerService.updateJobStatus(id, status)
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status: updated.status } : j))
  }

  const filtered = filterStatus === 'all' ? jobs : jobs.filter(j => j.status === filterStatus)

  return (
    <div style={{ padding: '32px 0', maxWidth: 960, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0F172A', marginBottom: 4 }}>📋 Tin tuyển dụng</h1>
          <p style={{ fontSize: 13, color: '#64748B' }}>{jobs.length} tin đã đăng</p>
        </div>
        <Link to="/employer/jobs/new" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px',
          background: 'linear-gradient(135deg, #1E40AF, #3B82F6)', color: 'white',
          borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 14,
          boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
        }}>
          ＋ Đăng tin mới
        </Link>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { key: 'all', label: 'Tất cả', count: jobs.length },
          { key: 'active', label: 'Đang tuyển', count: jobs.filter(j => j.status === 'active').length },
          { key: 'draft', label: 'Bản nháp', count: jobs.filter(j => j.status === 'draft').length },
          { key: 'expired', label: 'Hết hạn', count: jobs.filter(j => j.status === 'expired').length },
          { key: 'closed', label: 'Đã đóng', count: jobs.filter(j => j.status === 'closed').length },
        ].map(tab => (
          <button key={tab.key} onClick={() => setFilterStatus(tab.key)} style={{
            padding: '7px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600,
            border: '1.5px solid', cursor: 'pointer', fontFamily: 'inherit',
            borderColor: filterStatus === tab.key ? '#3B82F6' : '#E2E8F0',
            backgroundColor: filterStatus === tab.key ? '#EFF6FF' : 'white',
            color: filterStatus === tab.key ? '#2563EB' : '#64748B',
            transition: 'all 0.15s',
          }}>
            {tab.label} {tab.count > 0 && <span style={{ fontWeight: 800 }}>({tab.count})</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#94A3B8' }}>Đang tải...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, background: 'white', borderRadius: 16, border: '1.5px solid #E2E8F0' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
          <h3 style={{ color: '#0F172A', fontWeight: 700, marginBottom: 8 }}>Chưa có tin tuyển dụng</h3>
          <p style={{ color: '#64748B', fontSize: 14, marginBottom: 20 }}>Hãy đăng tin đầu tiên để tìm ứng viên phù hợp</p>
          <Link to="/employer/jobs/new" style={{
            padding: '10px 24px', background: '#3B82F6', color: 'white',
            borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 14,
          }}>
            ＋ Đăng tin ngay
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtered.map(job => (
            <JobCard key={job.id} job={job} onDelete={handleDelete} onStatusChange={handleStatusChange} />
          ))}
        </div>
      )}
    </div>
  )
}
