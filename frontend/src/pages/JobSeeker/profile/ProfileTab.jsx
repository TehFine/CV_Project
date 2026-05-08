import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Plus } from 'lucide-react'

const MOCK_CVS_COUNT = 2
const SAVED_COUNT = 2

const initials = name => {
  if (!name) return 'U'
  try {
    const parts = name.trim().split(/\s+/)
    return parts.slice(-2).map(w => w[0]).join('').toUpperCase() || 'U'
  } catch { return 'U' }
}

export function ProfileTab({ user, updateUser }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', location: user?.location || '', title: user?.title || '', bio: user?.bio || '' })
  const [saving, setSaving] = useState(false)
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
          <div className="flex gap-4 items-start mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-xl font-black text-white shrink-0">
              {initials(user?.name)}
            </div>
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

          <div className="grid grid-cols-3 gap-3 mb-6 p-3 bg-muted/50 rounded-xl">
            {[['📄', MOCK_CVS_COUNT, 'CV đã phân tích'], ['🔖', SAVED_COUNT, 'Việc đã lưu'], ['📨', 3, 'Đã ứng tuyển']].map(([icon, val, label]) => (
              <div key={label} className="text-center">
                <div className="text-base mb-0.5">{icon}</div>
                <div className="text-xl font-black text-foreground">{val}</div>
                <div className="text-[11px] text-muted-foreground leading-tight">{label}</div>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[['name', 'Họ và tên', 'text'], ['phone', 'Số điện thoại', 'tel'], ['location', 'Địa điểm', 'text'], ['title', 'Chức danh', 'text']].map(([key, label, type]) => (
              <div key={key} className="space-y-1.5">
                <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</Label>
                {editing ? <Input type={type} value={form[key]} onChange={set(key)} /> : <p className="text-sm font-medium">{user?.[key] || '—'}</p>}
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
