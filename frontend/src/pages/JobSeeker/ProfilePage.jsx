import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Loader2, Plus, ExternalLink, User, FileText, Bookmark, LayoutDashboard } from 'lucide-react'
import { MOCK_JOBS } from '@/services/jobService'

const MOCK_CVS = [
  { id:1, fileName:'CV_NguyenVanAn_2025.pdf',  overall:85, grade:'A', gradeLabel:'Xuất sắc', scoredAt:'2025-01-20T10:30:00Z' },
  { id:2, fileName:'CV_Frontend_Updated.pdf',  overall:78, grade:'B', gradeLabel:'Tốt',       scoredAt:'2025-01-15T14:20:00Z' },
]
const SAVED_IDS   = [1, 3]
const gradeVariant = { A:'success', B:'new', C:'warning', D:'destructive' }
const initials = name => name?.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase() || 'U'

/* ── Sidebar nav tabs ────────────────────────────────────────────────────── */
const TABS = [
  { key: 'info',  label: 'Hồ sơ',      icon: User },
  { key: 'cvs',   label: 'CV của tôi',  icon: FileText },
  { key: 'saved', label: 'Việc làm đã lưu',      icon: Bookmark },
]

/* ── Profile tab ─────────────────────────────────────────────────────────── */
function ProfileTab({ user, updateUser }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm]       = useState({ name: user?.name||'', phone: user?.phone||'', location: user?.location||'', title: user?.title||'', bio: user?.bio||'' })
  const [saving, setSaving]   = useState(false)
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 700))
    updateUser(form); setEditing(false); setSaving(false)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          {/* Avatar + name row */}
          <div className="flex gap-4 items-start mb-6">
            <Avatar className="h-16 w-16 flex-shrink-0">
              <AvatarFallback className="text-xl font-black bg-gradient-to-br from-primary to-violet-600 text-white">
                {initials(user?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-black text-foreground leading-tight">{user?.name}</h2>
              <p className="text-primary font-semibold text-sm">{user?.title || 'Chưa cập nhật chức danh'}</p>
              <p className="text-muted-foreground text-xs mt-1 truncate">📍 {user?.location || '—'} · 📧 {user?.email}</p>
            </div>
            <Button variant={editing ? 'default' : 'outline'} size="sm"
              onClick={editing ? handleSave : () => setEditing(true)} disabled={saving}>
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />}
              {saving ? 'Lưu...' : editing ? '💾 Lưu' : '✏️ Chỉnh sửa'}
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6 p-3 bg-muted/50 rounded-xl">
            {[['📄', MOCK_CVS.length, 'CV đã chấm'], ['🔖', SAVED_IDS.length, 'Việc đã lưu'], ['📨', 3, 'Đã ứng tuyển']].map(([icon, val, label]) => (
              <div key={label} className="text-center">
                <div className="text-base mb-0.5">{icon}</div>
                <div className="text-xl font-black text-foreground">{val}</div>
                <div className="text-[11px] text-muted-foreground leading-tight">{label}</div>
              </div>
            ))}
          </div>

          {/* Fields */}
          <div className="grid sm:grid-cols-2 gap-4">
            {[['name','Họ và tên','text'],['phone','Số điện thoại','tel'],['location','Địa điểm','text'],['title','Chức danh','text']].map(([key,label,type]) => (
              <div key={key} className="space-y-1.5">
                <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</Label>
                {editing
                  ? <Input type={type} value={form[key]} onChange={set(key)} />
                  : <p className="text-sm font-medium">{user?.[key] || '—'}</p>}
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-1.5">
            <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">Giới thiệu bản thân</Label>
            {editing
              ? <Textarea rows={3} value={form.bio} onChange={set('bio')} placeholder="Viết vài dòng giới thiệu..." />
              : <p className={`text-sm leading-relaxed ${user?.bio ? 'text-muted-foreground' : 'text-muted-foreground italic'}`}>{user?.bio || 'Chưa có giới thiệu...'}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-sm">🛠️ Kỹ năng</h3>
            <Button variant="ghost" size="sm" className="gap-1 h-7 text-xs"><Plus className="h-3 w-3" />Thêm</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(user?.skills || []).map(s => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
            {!user?.skills?.length && <p className="text-sm text-muted-foreground italic">Chưa có kỹ năng nào...</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ── CV tab ──────────────────────────────────────────────────────────────── */
function CVTab() {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-foreground">Lịch sử chấm điểm CV</h3>
        <Button size="sm" asChild><Link to="/cv-upload"><Plus className="h-3.5 w-3.5 mr-1" />Chấm CV mới</Link></Button>
      </div>
      {MOCK_CVS.map(cv => (
        <Card key={cv.id}>
          <CardContent className="p-4 flex gap-3 items-center">
            <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center text-xl flex-shrink-0">📄</div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{cv.fileName}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={gradeVariant[cv.grade]} className="text-xs">Loại {cv.grade}</Badge>
                <span className="text-sm font-bold">{cv.overall}/100</span>
                <span className="text-xs text-muted-foreground">{cv.gradeLabel}</span>
                <Separator orientation="vertical" className="h-3" />
                <span className="text-xs text-muted-foreground">{new Date(cv.scoredAt).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/cv-upload"><ExternalLink className="h-3.5 w-3.5 mr-1" />Xem</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

/* ── Saved tab ───────────────────────────────────────────────────────────── */
function SavedTab() {
  const saved = MOCK_JOBS.filter(j => SAVED_IDS.includes(j.id))
  return (
    <div className="space-y-3">
      <h3 className="font-bold text-foreground">Việc làm đã lưu ({saved.length})</h3>
      {saved.map(job => (
        <Card key={job.id} className="hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200">
          <CardContent className="p-4 flex gap-3 items-center">
            <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center font-black text-sm text-primary flex-shrink-0">
              {job.company.slice(0,2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{job.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{job.company} · {job.location} · <span className="text-emerald-600 font-medium">{job.salary}</span></p>
            </div>
            <Button size="sm" asChild><Link to={`/jobs/${job.id}`}>Xem →</Link></Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function ProfilePage() {
  const { user, isAuthenticated, updateUser } = useAuth()
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'info')

  if (!isAuthenticated) return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-sm w-full mx-6">
        <CardContent className="py-12 text-center">
          <p className="text-4xl mb-4">🔒</p>
          <h2 className="text-xl font-black mb-2">Đăng nhập để tiếp tục</h2>
          <p className="text-muted-foreground text-sm mb-6">Bạn cần đăng nhập để xem hồ sơ</p>
          <Button asChild className="w-full"><Link to="/login">Đăng nhập</Link></Button>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-muted/30 pb-16">

      {/* ── Hero banner — không có pb lớn, không dùng -mt trick ─────────── */}
      <div className="bg-gradient-to-br from-slate-900 to-primary py-8">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center gap-4">
          <Avatar className="h-14 w-14 flex-shrink-0">
            <AvatarFallback className="text-lg font-black bg-gradient-to-br from-primary to-violet-600 text-white">
              {initials(user?.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-black text-white leading-tight">{user?.name}</h1>
            <p className="text-blue-200 text-sm">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* ── Content — sidebar + main, bình thường không overlap ─────────── */}
      <div className="max-w-[1200px] mx-auto px-6 pt-6 flex gap-5 items-start">

        {/* Sidebar — cố định 180px, sticky */}
        <aside style={{ width: 180, flexShrink: 0 }} className="sticky top-20">
          <Card>
            <CardContent className="p-2">
              <nav className="flex flex-col gap-0.5">
                {TABS.map(tab => {
                  const Icon = tab.icon
                  const active = activeTab === tab.key
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={[
                        'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left w-full',
                        active
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      ].join(' ')}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      {tab.label}
                    </button>
                  )
                })}
              </nav>
            </CardContent>
          </Card>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {activeTab === 'info'  && <ProfileTab user={user} updateUser={updateUser} />}
          {activeTab === 'cvs'   && <CVTab />}
          {activeTab === 'saved' && <SavedTab />}
        </main>

      </div>
    </div>
  )
}