import { Plus, Trash2, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Section } from '../Section'
import { uid } from '../constants'

const EMPTY_SKILL = { category: '', items: '' }

export function SkillsSection({ items, onChange }) {
  const update = (id, key, val) =>
    onChange(cv => ({
      ...cv,
      skills: cv.skills.map(s => s.id === id ? { ...s, [key]: val } : s),
    }))

  const remove = id =>
    onChange(cv => ({ ...cv, skills: cv.skills.filter(s => s.id !== id) }))

  const add = () =>
    onChange(cv => ({ ...cv, skills: [...cv.skills, { id: uid(), ...EMPTY_SKILL }] }))

  return (
    <Section title="Kỹ năng" icon={<Wrench className="h-4 w-4 text-[#1549B8]" />}>
      {items.map(s => (
        <div key={s.id} className="flex gap-2 items-center">
          <Input
            value={s.category}
            onChange={e => update(s.id, 'category', e.target.value)}
            className="h-8 text-xs w-28 shrink-0"
            placeholder="Danh mục"
          />
          <Input
            value={s.items}
            onChange={e => update(s.id, 'items', e.target.value)}
            className="h-8 text-xs flex-1"
            placeholder="Kỹ năng 1, Kỹ năng 2..."
          />
          <button
            onClick={() => remove(s.id)}
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
        <Plus className="h-3.5 w-3.5" />Thêm nhóm kỹ năng
      </Button>
    </Section>
  )
}
