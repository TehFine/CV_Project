import { Plus, Trash2, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Section } from '../Section'
import { uid } from '../constants'

const EMPTY_LANGUAGE = { lang: '', level: '' }

export function LanguagesSection({ items, onChange }) {
  const update = (id, key, val) =>
    onChange(cv => ({
      ...cv,
      languages: cv.languages.map(l => l.id === id ? { ...l, [key]: val } : l),
    }))

  const remove = id =>
    onChange(cv => ({ ...cv, languages: cv.languages.filter(l => l.id !== id) }))

  const add = () =>
    onChange(cv => ({ ...cv, languages: [...cv.languages, { id: uid(), ...EMPTY_LANGUAGE }] }))

  return (
    <Section title="Ngôn ngữ" icon={<Globe className="h-4 w-4 text-[#1549B8]" />}>
      {items.map(l => (
        <div key={l.id} className="flex gap-2 items-center">
          <Input
            value={l.lang}
            onChange={e => update(l.id, 'lang', e.target.value)}
            className="h-8 text-xs w-32"
            placeholder="Ngôn ngữ"
          />
          <Input
            value={l.level}
            onChange={e => update(l.id, 'level', e.target.value)}
            className="h-8 text-xs flex-1"
            placeholder="Trình độ"
          />
          <button
            onClick={() => remove(l.id)}
            className="text-[#94A3B8] hover:text-red-500 cursor-pointer"
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
        <Plus className="h-3.5 w-3.5" />Thêm ngôn ngữ
      </Button>
    </Section>
  )
}
