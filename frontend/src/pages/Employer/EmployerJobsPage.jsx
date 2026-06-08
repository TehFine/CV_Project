import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapPin, Briefcase, BarChart3, DollarSign, Edit3, Users, CheckCircle2, PauseCircle, Trash2, Inbox, MoreHorizontal, Plus } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'
import { SkeletonPage } from '@/components/ui/Skeleton'
import { employerService } from '../../services/employerService'

const STATUS_CONFIG = {
  active:  { label: 'Đang tuyển', color: '#10B981', bg: '#D1FAE5' },
  pending: { label: 'Chờ duyệt',  color: '#D97706', bg: '#FEF3C7' },
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
              { icon: <MapPin size={14} />, text: job.location },
              { icon: <Briefcase size={14} />, text: JOB_TYPE_LABEL[job.job_type] },
              { icon: <BarChart3 size={14} />, text: LEVEL_LABEL[job.level] },
              { icon: <DollarSign size={14} />, text: formatSalary(job.salary_min, job.salary_max) },
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
              style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: 8, width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            ><MoreHorizontal size={16} /></button>
            {menuOpen && (
              <div
                style={{ position: 'absolute', right: 0, top: 44, zIndex: 50, background: 'white', borderRadius: 10, border: '1.5px solid #E2E8F0', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', minWidth: 180, overflow: 'hidden' }}
                onMouseLeave={() => setMenuOpen(false)}
              >
                {[
                  { icon: <Edit3 size={14} />, label: 'Chỉnh sửa', action: () => navigate(`/employer/jobs/${job.id}/edit`) },
                  { icon: <Users size={14} />, label: 'Xem ứng viên', action: () => navigate(`/employer/jobs/${job.id}/applicants`) },
                  job.status === 'draft'
                    ? { icon: <CheckCircle2 size={14} />, label: 'Gửi duyệt tin', action: () => { onStatusChange(job.id, 'pending'); setMenuOpen(false) } }
                    : job.status === 'pending'
                    ? null
                    : { icon: <PauseCircle size={14} />, label: 'Tạm đóng', action: () => { onStatusChange(job.id, 'closed'); setMenuOpen(false) } },
                  { icon: <Trash2 size={14} />, label: 'Xóa tin', action: handleDelete, danger: true },
                ].filter(Boolean).map(item => (
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
    <div className="px-4 sm:px-6 py-8 max-w-[960px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 mb-1">Tin tuyển dụng</h1>
          <p className="text-sm text-slate-500">{jobs.length} tin đã đăng</p>
        </div>
        <Link to="/employer/jobs/new" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/30 hover:opacity-90 transition-opacity no-underline">
          <Plus size={16} /> Đăng tin mới
        </Link>
      </div>

      {/* Filter tabs - scrollable on mobile */}
      <div className="flex gap-2 mb-5 -mx-4 px-4 overflow-x-auto pb-1 scrollbar-hide">
        {[
          { key: 'all', label: 'Tất cả', count: jobs.length },
          { key: 'pending', label: 'Chờ duyệt', count: jobs.filter(j => j.status === 'pending').length },
          { key: 'active', label: 'Đang tuyển', count: jobs.filter(j => j.status === 'active').length },
          { key: 'draft', label: 'Bản nháp', count: jobs.filter(j => j.status === 'draft').length },
          { key: 'expired', label: 'Hết hạn', count: jobs.filter(j => j.status === 'expired').length },
          { key: 'closed', label: 'Đã đóng', count: jobs.filter(j => j.status === 'closed').length },
        ].map(tab => (
          <button key={tab.key} onClick={() => setFilterStatus(tab.key)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm font-semibold border transition-all whitespace-nowrap ${
              filterStatus === tab.key
                ? 'border-blue-500 bg-blue-50 text-blue-600'
                : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
            }`}>
            {tab.label} {tab.count > 0 && <span className="font-extrabold">({tab.count})</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <SkeletonPage cards={3} cardType="job-card" />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="Chưa có tin tuyển dụng"
          description="Hãy đăng tin đầu tiên để tìm ứng viên phù hợp"
          action={
            <Link to="/employer/jobs/new" className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm">
              <Plus size={16} /> Đăng tin ngay
            </Link>
          }
        />
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
