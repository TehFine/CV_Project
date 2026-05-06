import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { employerService } from '../../services/employerService'

const STATUS_CONFIG = {
  pending:   { label: 'Chờ xem',    color: '#F59E0B', bg: '#FEF3C7' },
  reviewing: { label: 'Đang xét',   color: '#3B82F6', bg: '#DBEAFE' },
  interview: { label: 'Phỏng vấn',  color: '#8B5CF6', bg: '#EDE9FE' },
  offered:   { label: 'Đã offer',   color: '#10B981', bg: '#D1FAE5' },
  rejected:  { label: 'Từ chối',    color: '#EF4444', bg: '#FEE2E2' },
}

function StatCard({ icon, label, value, sub, color = '#3B82F6', to }) {
  const content = (
    <div style={{
      background: 'white', borderRadius: 16, border: '1.5px solid #E2E8F0',
      padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16,
      transition: 'box-shadow 0.2s, transform 0.2s', cursor: to ? 'pointer' : 'default',
    }}
      onMouseEnter={e => { if (to) { e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)' } }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}
    >
      <div style={{ width: 52, height: 52, borderRadius: 14, backgroundColor: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 900, color: '#0F172A', lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 13, color: '#64748B', marginTop: 3, fontWeight: 500 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: color, fontWeight: 600, marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  )
  return to ? <Link to={to} style={{ textDecoration: 'none' }}>{content}</Link> : content
}

function MiniBar({ value, max, color }) {
  return (
    <div style={{ flex: 1, height: 6, backgroundColor: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
      <div style={{ width: `${(value / max) * 100}%`, height: '100%', backgroundColor: color, borderRadius: 4, transition: 'width 0.8s ease' }} />
    </div>
  )
}

export default function EmployerDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    employerService.getDashboardStats()
      .then(setStats)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 36, marginBottom: 12, animation: 'spin 1s linear infinite', display: 'inline-block' }}>⚙️</div>
        <p style={{ color: '#64748B', fontSize: 14 }}>Đang tải dữ liệu...</p>
      </div>
    </div>
  )

  const maxChart = Math.max(...(stats?.applications_chart?.map(d => d.count) || [1]))
  const totalStatus = Object.values(stats?.status_breakdown || {}).reduce((a, b) => a + b, 0) || 1

  return (
    <div style={{ padding: '32px 0', maxWidth: 960, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0F172A', marginBottom: 4 }}>📊 Dashboard</h1>
          <p style={{ fontSize: 14, color: '#64748B' }}>Tổng quan hoạt động tuyển dụng của bạn</p>
        </div>
        <Link to="/employer/jobs/new" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px',
          background: 'linear-gradient(135deg, #1E40AF, #3B82F6)', color: 'white',
          borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 14,
          boxShadow: '0 4px 12px rgba(59,130,246,0.35)',
        }}>
          ＋ Đăng tin mới
        </Link>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard icon="📋" label="Tin tuyển dụng" value={stats.total_jobs} sub={`${stats.active_jobs} đang hoạt động`} color="#3B82F6" to="/employer/jobs" />
        <StatCard icon="📩" label="Tổng ứng tuyển" value={stats.total_applications} sub={`${stats.pending_applications} chờ xử lý`} color="#8B5CF6" />
        <StatCard icon="👁️" label="Lượt xem JD" value={stats.total_views.toLocaleString()} color="#10B981" />
        <StatCard icon="⏳" label="Chờ xem xét" value={stats.pending_applications} sub="Cần xử lý" color="#F59E0B" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Chart */}
        <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #E2E8F0', padding: 24 }}>
          <h3 style={{ fontWeight: 700, fontSize: 15, color: '#0F172A', marginBottom: 20 }}>📈 Ứng tuyển 7 ngày qua</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120 }}>
            {stats.applications_chart.map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 10, color: '#64748B', fontWeight: 600 }}>{d.count}</span>
                <div style={{
                  width: '100%', borderRadius: '4px 4px 0 0',
                  height: `${(d.count / maxChart) * 90}px`,
                  background: 'linear-gradient(180deg, #3B82F6, #1E40AF)',
                  transition: 'height 0.6s ease',
                  minHeight: 4,
                }} />
                <span style={{ fontSize: 10, color: '#94A3B8' }}>{d.date.split('/')[0]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status breakdown */}
        <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #E2E8F0', padding: 24 }}>
          <h3 style={{ fontWeight: 700, fontSize: 15, color: '#0F172A', marginBottom: 20 }}>📂 Trạng thái ứng viên</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {Object.entries(stats.status_breakdown).map(([key, count]) => {
              const cfg = STATUS_CONFIG[key]
              return (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: cfg.color, width: 80, flexShrink: 0 }}>{cfg.label}</span>
                  <MiniBar value={count} max={totalStatus} color={cfg.color} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', width: 24, textAlign: 'right', flexShrink: 0 }}>{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div style={{ background: 'linear-gradient(135deg, #0F172A, #1E3A6E)', borderRadius: 16, padding: 24, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>Thao tác nhanh</p>
          <h3 style={{ color: 'white', fontWeight: 800, fontSize: 16 }}>Quản lý tuyển dụng hiệu quả hơn</h3>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[
            { label: '📋 Xem tin đã đăng', to: '/employer/jobs' },
            { label: '📩 Hồ sơ ứng tuyển', to: '/employer/jobs' },
          ].map(link => (
            <Link key={link.to + link.label} to={link.to} style={{
              padding: '10px 18px', borderRadius: 10, fontSize: 13, fontWeight: 700,
              backgroundColor: 'rgba(255,255,255,0.12)', color: 'white',
              border: '1px solid rgba(255,255,255,0.2)', textDecoration: 'none',
              transition: 'background 0.2s',
            }}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
