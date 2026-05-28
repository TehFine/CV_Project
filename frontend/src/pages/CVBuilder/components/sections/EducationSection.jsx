import { Plus, Trash2, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Section } from '../Section'
import { uid } from '../constants'

const EMPTY_EDUCATION = { school: '', degree: '', period: '', gpa: '' }

export function EducationSection({ items, onChange }) {
  const update = (id, key, val) =>
    onChange(cv => ({
      ...cv,
      education: cv.education.map(e => e.id === id ? { ...e, [key]: val } : e),
    }))

  const remove = id =>
    onChange(cv => ({ ...cv, education: cv.education.filter(e => e.id !== id) }))

  const add = () =>
    onChange(cv => ({ ...cv, education: [...cv.education, { id: uid(), ...EMPTY_EDUCATION }] }))

  return (
    <Section title="Học vấn" icon={<GraduationCap className="h-4 w-4 text-[#1549B8]" />}>
      {items.map(edu => (
        <div key={edu.id} className="border border-[#E2E8F0] rounded-lg p-3 space-y-2 relative">
          <button
            onClick={() => remove(edu.id)}
            className="absolute top-2 right-2 text-[#94A3B8] hover:text-red-500 cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>

          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2 space-y-1">
              <Label className="text-xs">Trường</Label>
              <Input
                value={edu.school}
                onChange={e => update(edu.id, 'school', e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            {[
              { key: 'degree', label: 'Ngành học' },
              { key: 'period', label: 'Thời gian' },
              { key: 'gpa',    label: 'GPA' },
            ].map(({ key, label }) => (
              <div key={key} className="space-y-1">
                <Label className="text-xs">{label}</Label>
                <Input
                  value={edu[key]}
                  onChange={e => update(edu.id, key, e.target.value)}
                  className="h-8 text-xs"
                />
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
        <Plus className="h-3.5 w-3.5" />Thêm học vấn
      </Button>
    </Section>
  )
}
