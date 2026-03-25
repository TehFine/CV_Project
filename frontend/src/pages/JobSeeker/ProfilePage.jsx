import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { MOCK_JOBS } from '../../services/jobService'

const MOCK_CV_HISTORY = [
  { id: 1, fileName: 'CV_NguyenVanAn_2025.pdf', overall: 85, grade: 'A', gradeLabel: 'Xuất sắc', scoredAt: '2025-01-20T10:30:00Z', size: '245 KB' },
  { id: 2, fileName: 'CV_Frontend_Updated.pdf', overall: 78, grade: 'B', gradeLabel: 'Tốt', scoredAt: '2025-01-15T14:20:00Z', size: '198 KB' },
]

const SAVED_JOB_IDS = [1, 3]

function GradeBadge({ grade }) {
  const colors = { A: { bg: '#ECFDF5', color: '#059669', border: 'rgba(5,150,105,0.2)' }, B: { bg: '#EFF6FF', color: '#1D4ED8', border: 'rgba(29,78,216,0.2)' }, C: { bg: '#FFFBEB', color: '#D97706', border: 'rgba(217,119,6,0.2)' }, D: { bg: '#FEF2F2', color: '#DC2626', border: 'rgba(220,38,38,0.2)' } }
  const s = colors[grade] || colors.C
  return (
    <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20, backgroundColor: s.bg, color: s.color, border: `1px solid ${s.border}`, fontWeight: 700 }}>
      Loại {grade}
    </span>
  )
}

function AvatarFallback({ name, size = 80 }) {
  const initials = name?.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase() || 'U'
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--ai))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.35, fontWeight: 800, color: 'white', flexShrink: 0 }}>
      {initials}
    </div>
  )
}

function ProfileInfo({ user, updateUser }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', location: user?.location || '', title: user?.title || '', bio: user?.bio || '' })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    updateUser(form)
    setEditing(false)
    setSaving(false)
  }

  return (
    <div className="animate-fade-in">
      {/* Profile card */}
      <div style={{ backgroundColor: 'white', borderRadius: 16, border: '1.5px solid var(--border)', padding: 28, marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 24 }}>
          <div style={{ position: 'relative' }}>
            <AvatarFallback name={user?.name} />
            <button style={{ position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: '50%', backgroundColor: 'var(--primary)', border: '2px solid white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>
              ✏️
            </button>
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontWeight: 800, fontSize: 20, color: 'var(--text-primary)', marginBottom: 4 }}>{user?.name}</h2>
            <p style={{ fontSize: 14, color: 'var(--primary)', fontWeight: 600, marginBottom: 4 }}>{user?.title || 'Chưa cập nhật chức danh'}</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>📍 {user?.location || 'Chưa cập nhật'} · 📧 {user?.email}</p>
          </div>
          <button
            onClick={() => editing ? handleSave() : setEditing(true)}
            disabled={saving}
            style={{ padding: '8px 16px', borderRadius: 8, border: '1.5px solid', borderColor: editing ? 'var(--primary)' : 'var(--border)', backgroundColor: editing ? 'var(--primary)' : 'white', color: editing ? 'white' : 'var(--text-primary)', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit', transition: 'all 0.2s', flexShrink: 0 }}
          >
            {saving ? '⏳ Lưu...' : editing ? '💾 Lưu thay đổi' : '✏️ Chỉnh sửa'}
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24, padding: '16px', backgroundColor: 'var(--bg-subtle)', borderRadius: 12 }}>
          {[
            { icon: '📄', value: user?.cvCount || 2, label: 'CV đã chấm' },
            { icon: '🔖', value: SAVED_JOB_IDS.length, label: 'Việc đã lưu' },
            { icon: '📨', value: 3, label: 'Đơn ứng tuyển' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, marginBottom: 2 }}>{s.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 20, color: 'var(--text-primary)' }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Form fields */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { label: 'Họ và tên', key: 'name', type: 'text' },
            { label: 'Số điện thoại', key: 'phone', type: 'tel' },
            { label: 'Địa điểm', key: 'location', type: 'text' },
            { label: 'Chức danh hiện tại', key: 'title', type: 'text' },
          ].map(f => (
            <div key={f.key}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{f.label}</label>
              {editing ? (
                <input
                  value={form[f.key]}
                  onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  style={{ width: '100%', padding: '8px 12px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box' }}
                />
              ) : (
                <p style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500, margin: 0 }}>{user?.[f.key] || '—'}</p>
              )}
            </div>
          ))}
        </div>

        {/* Bio */}
        <div style={{ marginTop: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Giới thiệu bản thân</label>
          {editing ? (
            <textarea rows={3} value={form.bio} onChange={e => setForm(prev => ({ ...prev, bio: e.target.value }))}
              style={{ width: '100%', padding: '8px 12px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }} />
          ) : (
            <p style={{ fontSize: 14, color: user?.bio ? 'var(--text-secondary)' : 'var(--text-muted)', lineHeight: 1.6, margin: 0, fontStyle: user?.bio ? 'normal' : 'italic' }}>
              {user?.bio || 'Chưa có giới thiệu...'}
            </p>
          )}
        </div>
      </div>

      {/* Skills */}
      <div style={{ backgroundColor: 'white', borderRadius: 16, border: '1.5px solid var(--border)', padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>🛠️ Kỹ năng</h3>
          <button style={{ fontSize: 13, color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>+ Thêm</button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {(user?.skills || []).map(skill => (
            <span key={skill} style={{ padding: '5px 14px', borderRadius: 20, backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontSize: 13, fontWeight: 600, border: '1px solid rgba(21,73,184,0.15)' }}>
              {skill}
            </span>
          ))}
          {(!user?.skills?.length) && <p style={{ fontSize: 13, color: 'var(--text-muted)', fontStyle: 'italic' }}>Chưa có kỹ năng nào...</p>}
        </div>
      </div>
    </div>
  )
}

function CVHistory() {
  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>Lịch sử chấm điểm CV</h3>
        <Link to="/cv-upload" style={{ padding: '8px 16px', borderRadius: 8, backgroundColor: 'var(--primary)', color: 'white', textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>
          + Chấm CV mới
        </Link>
      </div>
      {MOCK_CV_HISTORY.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: 14, border: '1.5px solid var(--border)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Chưa có CV nào được chấm điểm</p>
          <Link to="/cv-upload" style={{ display: 'inline-block', marginTop: 12, padding: '8px 20px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>Upload CV ngay</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {MOCK_CV_HISTORY.map(cv => (
            <div key={cv.id} style={{ backgroundColor: 'white', borderRadius: 14, border: '1.5px solid var(--border)', padding: 20, display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>📄</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cv.fileName}</p>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <GradeBadge grade={cv.grade} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{cv.overall}/100</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{cv.gradeLabel}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>·</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(cv.scoredAt).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <Link to="/cv-upload" style={{ padding: '7px 14px', borderRadius: 8, backgroundColor: 'var(--primary-light)', color: 'var(--primary)', textDecoration: 'none', fontSize: 12, fontWeight: 600 }}>Xem chi tiết</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function SavedJobs() {
  const savedJobs = MOCK_JOBS.filter(j => SAVED_JOB_IDS.includes(j.id))
  return (
    <div className="animate-fade-in">
      <h3 style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)', marginBottom: 16 }}>Việc làm đã lưu ({savedJobs.length})</h3>
      {savedJobs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: 14, border: '1.5px solid var(--border)' }}>
          <p style={{ color: 'var(--text-muted)' }}>Chưa có việc làm nào được lưu</p>
          <Link to="/jobs" style={{ display: 'inline-block', marginTop: 12, padding: '8px 20px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>Tìm việc làm</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {savedJobs.map(job => (
            <div key={job.id} style={{ backgroundColor: 'white', borderRadius: 14, border: '1.5px solid var(--border)', padding: 20, display: 'flex', gap: 14, alignItems: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, color: 'var(--primary)', flexShrink: 0 }}>
                {job.company.slice(0, 2).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', marginBottom: 3 }}>{job.title}</p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{job.company} · {job.location} · {job.salary}</p>
              </div>
              <Link to={`/jobs/${job.id}`} style={{ padding: '7px 14px', borderRadius: 8, backgroundColor: 'var(--primary)', color: 'white', textDecoration: 'none', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
                Xem →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ProfilePage() {
  const { user, isAuthenticated, updateUser } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'info')

  if (!isAuthenticated) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
        <h2 style={{ fontWeight: 800, fontSize: 22, color: 'var(--text-primary)', marginBottom: 8 }}>Đăng nhập để xem hồ sơ</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Bạn cần đăng nhập để truy cập trang này</p>
        <Link to="/login" style={{ padding: '12px 28px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: 10, textDecoration: 'none', fontWeight: 700 }}>Đăng nhập</Link>
      </div>
    )
  }

  const tabs = [
    { key: 'info', label: '👤 Hồ sơ' },
    { key: 'cvs', label: '📄 CV của tôi' },
    { key: 'saved', label: '🔖 Đã lưu' },
  ]

  return (
    <div style={{ backgroundColor: 'var(--bg-base)', minHeight: '100vh', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0F172A, #1549B8)', padding: '32px 0 60px' }}>
        <div className="container-app">
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <AvatarFallback name={user?.name} />
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 4 }}>{user?.name}</h1>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)' }}>{user?.email}</p>
              {user?.title && <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{user.title}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="container-app" style={{ marginTop: -32 }}>
        {/* Tabs */}
        <div style={{ backgroundColor: 'white', borderRadius: 14, border: '1.5px solid var(--border)', padding: '4px', display: 'inline-flex', gap: 2, marginBottom: 20, boxShadow: 'var(--shadow-md)' }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{ padding: '8px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit', transition: 'all 0.2s', backgroundColor: activeTab === tab.key ? 'var(--primary)' : 'transparent', color: activeTab === tab.key ? 'white' : 'var(--text-secondary)' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'info' && <ProfileInfo user={user} updateUser={updateUser} />}
        {activeTab === 'cvs' && <CVHistory />}
        {activeTab === 'saved' && <SavedJobs />}
      </div>
    </div>
  )
}