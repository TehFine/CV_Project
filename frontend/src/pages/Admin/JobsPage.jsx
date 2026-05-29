import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminService } from '../../services/adminService'
import { connectSocket, onJobViewsUpdated, onJobApplicationsUpdated } from '../../services/socket'
import {
  Search, Building2, Star, CheckCircle2, PauseCircle, RefreshCw,
  Ban, Trash2, CircleAlert, CircleCheck, CircleX, ClipboardList,
  DollarSign, BarChart3, FolderOpen, Briefcase, AlertTriangle, X
} from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'

/* ── Configs ───────────────────────────────────────────────────────────────── */
const STATUS_CONFIG = {
  active:   { label: 'Đang tuyển', color: '#10B981', bg: '#D1FAE5' },
  pending:  { label: 'Chờ duyệt',  color: '#D97706', bg: '#FEF3C7' },
  reported: { label: 'Bị báo cáo', color: '#EF4444', bg: '#FEE2E2' },
  closed:   { label: 'Đã đóng',    color: '#94A3B8', bg: '#F1F5F9' },
}

const TABS = [
  { key: 'all',      label: 'Tất cả' },
  { key: 'pending',  label: 'Chờ duyệt', icon: CircleAlert },
  { key: 'active',   label: 'Đang tuyển', icon: CircleCheck },
  { key: 'reported', label: 'Bị báo cáo', icon: CircleX },
  { key: 'closed',   label: 'Đã đóng', icon: PauseCircle },
]

/* ── Job Card ──────────────────────────────────────────────────────────────── */
function AdminJobCard({ job, onStatusChange, onDelete, onToggleFeatured }) {
  const navigate = useNavigate()
  const [actionLoading, setActionLoading] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const cfg = STATUS_CONFIG[job.status] || STATUS_CONFIG.active

  const handleAction = async (action, ...args) => {
    setActionLoading(true)
    try { await action(...args) }
    finally { setActionLoading(false); setMenuOpen(false) }
  }

  const JOB_INFO_ICONS = [
    { icon: DollarSign, text: job.salary },
    { icon: BarChart3, text: job.level },
    { icon: FolderOpen, text: job.category },
    { icon: Briefcase, text: job.type },
  ]

  return (
    <div style={{
      background: 'white', borderRadius: 14, border: '1.5px solid #E2E8F0',
      padding: 20, transition: 'box-shadow 0.2s',
      opacity: actionLoading ? 0.6 : 1,
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.07)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Title + status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0 }}>{job.title}</h3>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 20, backgroundColor: cfg.bg, color: cfg.color }}>
              {cfg.label}
            </span>
            {job.featured && (
              <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 20, backgroundColor: '#FEF3C7', color: '#D97706', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Star size={12} fill="#D97706" /> Nổi bật
              </span>
            )}
          </div>

          {/* Company + meta */}
          <p style={{ fontSize: 13, color: '#475569', fontWeight: 500, marginBottom: 8, margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Building2 size={14} style={{ color: '#94A3B8' }} /> {job.company} <span style={{ color: '#94A3B8', marginLeft: 4 }}>· {job.location}</span>
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
            {JOB_INFO_ICONS.map(item => {
              const ItemIcon = item.icon
              return (
                <span key={item.text} style={{ fontSize: 12, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <ItemIcon size={14} style={{ color: '#94A3B8' }} /> {item.text}
                </span>
              )
            })}
          </div>

          {/* Tags */}
          {job.tags?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {job.tags.map(tag => (
                <span key={tag} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, backgroundColor: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE', fontWeight: 500 }}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Report warning */}
          {job.reportCount > 0 && (
            <div style={{ marginTop: 8, padding: '8px 12px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, fontSize: 12, color: '#DC2626', display: 'flex', alignItems: 'center', gap: 6 }}>
              <AlertTriangle size={14} className="shrink-0" />
              <span><strong>{job.reportCount} lượt báo cáo</strong> từ người dùng</span>
            </div>
          )}
        </div>

        {/* Stats + Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#0F172A' }}>{job.applied}</div>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>Ứng tuyển</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#0F172A' }}>{job.views}</div>
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
                style={{ position: 'absolute', right: 0, top: 44, zIndex: 50, background: 'white', borderRadius: 10, border: '1.5px solid #E2E8F0', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', minWidth: 200, overflow: 'hidden' }}
                onMouseLeave={() => setMenuOpen(false)}
              >
                {job.status === 'pending' && (
                  <MenuBtn icon={<CheckCircle2 size={14} />} label="Duyệt tin" onClick={() => handleAction(onStatusChange, job.id, 'active')} />
                )}
                {job.status === 'active' && (
                  <MenuBtn icon={<PauseCircle size={14} />} label="Đóng tin" onClick={() => handleAction(onStatusChange, job.id, 'closed')} />
                )}
                {job.status === 'closed' && (
                  <MenuBtn icon={<RefreshCw size={14} />} label="Mở lại" onClick={() => handleAction(onStatusChange, job.id, 'active')} />
                )}
                {job.status === 'reported' && (
                  <>
                    <MenuBtn icon={<CheckCircle2 size={14} />} label="Bỏ qua báo cáo" onClick={() => handleAction(onStatusChange, job.id, 'active')} />
                    <MenuBtn icon={<Ban size={14} />} label="Gỡ tin" onClick={() => handleAction(onStatusChange, job.id, 'closed')} danger />
                  </>
                )}
                <MenuBtn
                  icon={job.featured ? <Star size={14} fill="#D97706" /> : <Star size={14} />}
                  label={job.featured ? 'Bỏ nổi bật' : 'Đánh dấu nổi bật'}
                  onClick={() => handleAction(onToggleFeatured, job.id, !job.featured)}
                />
                <div style={{ borderTop: '1px solid #F1F5F9' }} />
                <MenuBtn icon={<Trash2 size={14} />} label="Xóa vĩnh viễn" danger onClick={() => {
                  if (confirm(`Xóa vĩnh viễn tin "${job.title}"?`)) handleAction(onDelete, job.id)
                }} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid #F1F5F9', marginTop: 14, paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <span style={{ fontSize: 12, color: '#94A3B8' }}>
          Đăng {new Date(job.postedAt).toLocaleDateString('vi-VN')}
          {job.deadline && ` · Hạn ${new Date(job.deadline).toLocaleDateString('vi-VN')}`}
        </span>
        <button
          onClick={() => navigate(`/admin/jobs/${job.id}`)}
          style={{ fontSize: 12, fontWeight: 700, color: '#3B82F6', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          Chi tiết →
        </button>
      </div>
    </div>
  )
}

/* ── Reusable menu button ──────────────────────────────────────────────────── */
function MenuBtn({ icon, label, onClick, danger }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', padding: '10px 16px', background: 'none', border: 'none',
      cursor: 'pointer', fontSize: 13, fontWeight: 500, textAlign: 'left',
      color: danger ? '#EF4444' : '#0F172A',
      display: 'flex', alignItems: 'center', gap: 10,
      fontFamily: 'inherit', transition: 'background 0.15s',
    }}
      onMouseEnter={e => e.currentTarget.style.background = danger ? '#FEF2F2' : '#F8FAFC'}
      onMouseLeave={e => e.currentTarget.style.background = 'none'}
    >
      <span style={{ width: 16, display: 'inline-flex', justifyContent: 'center', color: danger ? '#EF4444' : '#94A3B8' }}>{icon}</span>
      {label}
    </button>
  )
}

/* ── Main Page ─────────────────────────────────────────────────────────────── */
export default function AdminJobsPage() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const loadJobs = async () => {
    setLoading(true)
    try {
      const params = {}
      if (activeTab !== 'all') params.status = activeTab
      if (search) params.keyword = search
      const res = await adminService.getJobs(params)
      setJobs(res.data)
    } finally { setLoading(false) }
  }

  useEffect(() => { loadJobs() }, [activeTab])

  // Realtime: listen for view count & application count updates via WebSocket
  useEffect(() => {
    connectSocket()
    const cleanupViews = onJobViewsUpdated(({ jobId, views }) => {
      setJobs(prev => prev.map(j =>
        j.id === jobId ? { ...j, views } : j
      ))
    })
    const cleanupApps = onJobApplicationsUpdated(({ jobId, applied }) => {
      setJobs(prev => prev.map(j =>
        j.id === jobId ? { ...j, applied } : j
      ))
    })
    return () => {
      cleanupViews()
      cleanupApps()
    }
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    loadJobs()
  }

  const handleStatusChange = async (id, newStatus) => {
    await adminService.updateJobStatus(id, newStatus)
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status: newStatus } : j))
    const labels = { active: 'Đã duyệt', closed: 'Đã đóng' }
    showToast(`${labels[newStatus] || 'Cập nhật'} tin thành công`)
  }

  const handleDelete = async (id) => {
    await adminService.deleteJob(id)
    setJobs(prev => prev.filter(j => j.id !== id))
    showToast('Đã xóa tin tuyển dụng')
  }

  const handleToggleFeatured = async (id, featured) => {
    await adminService.toggleJobFeatured(id, featured)
    setJobs(prev => prev.map(j => j.id === id ? { ...j, featured } : j))
    showToast(featured ? 'Đã đánh dấu nổi bật' : 'Đã bỏ nổi bật')
  }

  const pendingCount = jobs.filter(j => j.status === 'pending').length
  const reportedCount = jobs.filter(j => j.status === 'reported').length

  return (
    <div style={{ padding: 24, maxWidth: 960, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0F172A', marginBottom: 4 }}>Quản lý tin tuyển dụng</h1>
        <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>
          Duyệt, quản lý và kiểm soát chất lượng tin đăng từ nhà tuyển dụng
        </p>
      </div>

      {/* Quick stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { label: 'Tổng tin', value: jobs.length, color: '#1549B8', bg: '#EEF2FF' },
          { label: 'Chờ duyệt', value: pendingCount, color: '#D97706', bg: '#FEF3C7' },
          { label: 'Bị báo cáo', value: reportedCount, color: '#EF4444', bg: '#FEE2E2' },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, minWidth: 120, background: 'white', borderRadius: 12, border: '1.5px solid #E2E8F0', padding: 14, textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Tìm theo tên tin hoặc công ty..."
            style={{
              width: '100%', padding: '9px 14px 9px 36px', borderRadius: 10, border: '1.5px solid #E2E8F0',
              fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
            }}
            onFocus={e => e.target.style.borderColor = '#3B82F6'}
            onBlur={e => e.target.style.borderColor = '#E2E8F0'}
          />
        </div>
        <button type="submit" style={{
          padding: '9px 18px', borderRadius: 10, border: 'none',
          background: '#1549B8', color: 'white', fontWeight: 700, fontSize: 13,
          cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <Search size={14} /> Tìm
        </button>
      </form>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {TABS.map(tab => {
          const TabIcon = tab.icon
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              padding: '7px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600,
              border: '1.5px solid', cursor: 'pointer', fontFamily: 'inherit',
              display: 'inline-flex', alignItems: 'center', gap: 6,
              borderColor: activeTab === tab.key ? '#3B82F6' : '#E2E8F0',
              backgroundColor: activeTab === tab.key ? '#EFF6FF' : 'white',
              color: activeTab === tab.key ? '#2563EB' : '#64748B',
              transition: 'all 0.15s',
            }}>
              {TabIcon && <TabIcon size={14} />}
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          marginBottom: 16, padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600,
          border: '1.5px solid', display: 'flex', alignItems: 'center', gap: 8,
          background: toast.type === 'error' ? '#FEF2F2' : '#F0FDF4',
          borderColor: toast.type === 'error' ? '#FECACA' : '#BBF7D0',
          color: toast.type === 'error' ? '#DC2626' : '#16A34A',
        }}>
          {toast.type === 'error' ? <X size={14} /> : <CheckCircle2 size={14} />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Job list */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#94A3B8' }}>
          <div style={{ width: 32, height: 32, border: '4px solid #E2E8F0', borderTopColor: '#1549B8', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 1s linear infinite' }} />
          Đang tải...
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="Không có tin tuyển dụng nào"
          description={activeTab === 'pending' ? 'Không có tin nào chờ duyệt' : 'Chưa có tin nào trong danh mục này'}
          className="rounded-2xl border border-[#E2E8F0]"
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {jobs.map(job => (
            <AdminJobCard
              key={job.id}
              job={job}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              onToggleFeatured={handleToggleFeatured}
            />
          ))}
        </div>
      )}
    </div>
  )
}
