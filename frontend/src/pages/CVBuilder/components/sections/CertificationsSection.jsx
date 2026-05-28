import { Plus, Trash2, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Section } from '../Section'
import { uid } from '../constants'

const EMPTY_CERT = { name: '', issuer: '', year: '' }

export function CertificationsSection({ items, onChange }) {
  const update = (id, key, val) =>
    onChange(cv => ({
      ...cv,
      certifications: cv.certifications.map(c => c.id === id ? { ...c, [key]: val } : c),
    }))

  const remove = id =>
    onChange(cv => ({ ...cv, certifications: cv.certifications.filter(c => c.id !== id) }))

  const add = () =>
    onChange(cv => ({ ...cv, certifications: [...cv.certifications, { id: uid(), ...EMPTY_CERT }] }))

  return (
    <Section title="Chứng chỉ" icon={<Trophy className="h-4 w-4 text-[#1549B8]" />}>
      {items.map(c => (
        <div key={c.id} className="flex gap-2 items-center">
          <Input
            value={c.name}
            onChange={e => update(c.id, 'name', e.target.value)}
            className="h-8 text-xs flex-1"
            placeholder="Tên chứng chỉ"
          />
          <Input
            value={c.issuer}
            onChange={e => update(c.id, 'issuer', e.target.value)}
            className="h-8 text-xs w-28 shrink-0"
            placeholder="Đơn vị cấp"
          />
          <Input
            value={c.year}
            onChange={e => update(c.id, 'year', e.target.value)}
            className="h-8 text-xs w-16 shrink-0"
            placeholder="Năm"
          />
          <button
            onClick={() => remove(c.id)}
            className="text-[#94A3B8] hover:text-red-500 shrink-0 cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}

      <Button
        variant="outline" size="sm"
        className="w-full gap-1.5 text-xs border-dashed border-[#1549B8]/40 text-[#1549B8] hover:bg-[#EEF2FF]"
        onClick={add}
      >
        <Plus className="h-3.5 w-3.5" />Thêm chứng chỉ
      </Button>
    </Section>
  )
}
