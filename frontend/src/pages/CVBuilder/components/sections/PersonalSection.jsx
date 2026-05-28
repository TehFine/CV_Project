import { User } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Section } from '../Section'

const TEXT_FIELDS = [
  { key: 'name',     label: 'Họ và tên' },
  { key: 'title',    label: 'Chức danh' },
]

const CONTACT_FIELDS = [
  { key: 'email',    label: 'Email' },
  { key: 'phone',    label: 'Điện thoại' },
  { key: 'location', label: 'Địa điểm' },
  { key: 'linkedin', label: 'LinkedIn' },
]

export function PersonalSection({ data, onChange }) {
  const set = (key, val) => onChange(key, val)

  return (
    <Section title="Thông tin cá nhân" icon={<User className="h-4 w-4 text-[#1549B8]" />}>
      <div className="grid grid-cols-2 gap-3">
        {TEXT_FIELDS.map(({ key, label }) => (
          <div key={key} className="space-y-1">
            <Label className="text-xs">{label}</Label>
            <Input
              value={data[key] ?? ''}
              onChange={e => set(key, e.target.value)}
              className="h-8 text-xs"
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {CONTACT_FIELDS.map(({ key, label }) => (
          <div key={key} className="space-y-1">
            <Label className="text-xs">{label}</Label>
            <Input
              value={data[key] ?? ''}
              onChange={e => set(key, e.target.value)}
              className="h-8 text-xs"
            />
          </div>
        ))}
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Giới thiệu bản thân</Label>
        <Textarea
          value={data.summary ?? ''}
          onChange={e => set('summary', e.target.value)}
          rows={3}
          className="text-xs resize-none"
        />
      </div>
    </Section>
  )
}
