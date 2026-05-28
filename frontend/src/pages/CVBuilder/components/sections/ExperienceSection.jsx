import { Plus, Trash2, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Section } from '../Section'
import { uid } from '../constants'

const EMPTY_EXPERIENCE = { company: '', role: '', period: '', location: '', bullets: [''] }

export function ExperienceSection({ items, onChange }) {
  const update = (id, key, val) =>
    onChange(cv => ({
      ...cv,
      experience: cv.experience.map(e => e.id === id ? { ...e, [key]: val } : e),
    }))

  const remove = id =>
    onChange(cv => ({ ...cv, experience: cv.experience.filter(e => e.id !== id) }))

  const add = () =>
    onChange(cv => ({ ...cv, experience: [...cv.experience, { id: uid(), ...EMPTY_EXPERIENCE }] }))

  const setBullet = (expId, idx, val) =>
    onChange(cv => ({
      ...cv,
      experience: cv.experience.map(e =>
        e.id === expId
          ? { ...e, bullets: e.bullets.map((b, i) => (i === idx ? val : b)) }
          : e
      ),
    }))

  const addBullet = expId =>
    onChange(cv => ({
      ...cv,
      experience: cv.experience.map(e =>
        e.id === expId ? { ...e, bullets: [...e.bullets, ''] } : e
      ),
    }))

  const removeBullet = (expId, idx) =>
    onChange(cv => ({
      ...cv,
      experience: cv.experience.map(e =>
        e.id === expId
          ? { ...e, bullets: e.bullets.filter((_, i) => i !== idx) }
          : e
      ),
    }))

  return (
    <Section title="Kinh nghiệm làm việc" icon={<Briefcase className="h-4 w-4 text-[#1549B8]" />}>
      {items.map(exp => (
        <div key={exp.id} className="border border-[#E2E8F0] rounded-lg p-3 space-y-2.5 relative">
          <button
            onClick={() => remove(exp.id)}
            className="absolute top-2 right-2 text-[#94A3B8] hover:text-red-500 transition-colors cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>

          <div className="grid grid-cols-2 gap-2">
            {[
              { key: 'company',  label: 'Công ty' },
              { key: 'role',     label: 'Chức vụ' },
              { key: 'period',   label: 'Thời gian', placeholder: '01/2022 – Hiện tại' },
              { key: 'location', label: 'Địa điểm' },
            ].map(({ key, label, placeholder }) => (
              <div key={key} className="space-y-1">
                <Label className="text-xs">{label}</Label>
                <Input
                  value={exp[key]}
                  onChange={e => update(exp.id, key, e.target.value)}
                  className="h-8 text-xs"
                  placeholder={placeholder}
                />
              </div>
            ))}
          </div>

          {/* Bullets */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <Label className="text-xs">Mô tả công việc</Label>
              <button
                onClick={() => addBullet(exp.id)}
                className="text-xs text-[#1549B8] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <Plus className="h-3 w-3" />Thêm điểm
              </button>
            </div>
            {exp.bullets.map((b, i) => (
              <div key={i} className="flex gap-1.5 mb-1.5">
                <Input
                  value={b}
                  onChange={e => setBullet(exp.id, i, e.target.value)}
                  className="h-7 text-xs flex-1"
                />
                <button
                  onClick={() => removeBullet(exp.id, i)}
                  className="text-[#94A3B8] hover:text-red-500 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <Button
        variant="outline" size="sm"
        className="w-full gap-1.5 text-xs border-dashed border-[#1549B8]/40 text-[#1549B8] hover:bg-[#EEF2FF]"
        onClick={add}
      >
        <Plus className="h-3.5 w-3.5" />Thêm kinh nghiệm
      </Button>
    </Section>
  )
}
