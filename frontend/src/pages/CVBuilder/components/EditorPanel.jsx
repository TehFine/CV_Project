import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Section } from './Section'
import { uid } from './constants'

export function EditorPanel({ cv, onChange }) {
  const set = (section, key, val) =>
    onChange(p => ({ ...p, [section]: { ...p[section], [key]: val } }))

  const setArr = (section, id, key, val) =>
    onChange(p => ({
      ...p,
      [section]: p[section].map(item => item.id === id ? { ...item, [key]: val } : item),
    }))

  const addItem  = (section, template) => onChange(p => ({ ...p, [section]: [...p[section], { id: uid(), ...template }] }))
  const removeItem = (section, id) => onChange(p => ({ ...p, [section]: p[section].filter(i => i.id !== id) }))

  const setBullet = (expId, idx, val) =>
    onChange(p => ({
      ...p,
      experience: p.experience.map(e => e.id === expId
        ? { ...e, bullets: e.bullets.map((b, i) => i === idx ? val : b) }
        : e
      ),
    }))

  const addBullet    = expId => onChange(p => ({ ...p, experience: p.experience.map(e => e.id === expId ? { ...e, bullets: [...e.bullets, ''] } : e) }))
  const removeBullet = (expId, idx) => onChange(p => ({ ...p, experience: p.experience.map(e => e.id === expId ? { ...e, bullets: e.bullets.filter((_, i) => i !== idx) } : e) }))

  return (
    <div className="space-y-3">
      {/* Personal */}
      <Section title="Thông tin cá nhân" icon="👤">
        <div className="grid grid-cols-2 gap-3">
          {[['name','Họ và tên'],['title','Chức danh']].map(([k,l]) => (
            <div key={k} className="space-y-1">
              <Label className="text-xs">{l}</Label>
              <Input value={cv.personal[k]} onChange={e => set('personal', k, e.target.value)} className="h-8 text-xs" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[['email','Email'],['phone','Điện thoại'],['location','Địa điểm'],['linkedin','LinkedIn']].map(([k,l]) => (
            <div key={k} className="space-y-1">
              <Label className="text-xs">{l}</Label>
              <Input value={cv.personal[k]} onChange={e => set('personal', k, e.target.value)} className="h-8 text-xs" />
            </div>
          ))}
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Giới thiệu bản thân</Label>
          <Textarea value={cv.personal.summary} onChange={e => set('personal', 'summary', e.target.value)} rows={3} className="text-xs resize-none" />
        </div>
      </Section>

      {/* Experience */}
      <Section title="Kinh nghiệm làm việc" icon="💼">
        {cv.experience.map((exp, ei) => (
          <div key={exp.id} className="border border-[#E2E8F0] rounded-lg p-3 space-y-2.5 relative">
            <button onClick={() => removeItem('experience', exp.id)}
              className="absolute top-2 right-2 text-[#94A3B8] hover:text-red-500 transition-colors">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1"><Label className="text-xs">Công ty</Label><Input value={exp.company} onChange={e => setArr('experience', exp.id, 'company', e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Chức vụ</Label><Input value={exp.role} onChange={e => setArr('experience', exp.id, 'role', e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Thời gian</Label><Input value={exp.period} onChange={e => setArr('experience', exp.id, 'period', e.target.value)} className="h-8 text-xs" placeholder="01/2022 – Hiện tại" /></div>
              <div className="space-y-1"><Label className="text-xs">Địa điểm</Label><Input value={exp.location} onChange={e => setArr('experience', exp.id, 'location', e.target.value)} className="h-8 text-xs" /></div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <Label className="text-xs">Mô tả công việc</Label>
                <button onClick={() => addBullet(exp.id)} className="text-xs text-[#1549B8] hover:underline flex items-center gap-0.5">
                  <Plus className="h-3 w-3" />Thêm điểm
                </button>
              </div>
              {exp.bullets.map((b, i) => (
                <div key={i} className="flex gap-1.5 mb-1.5">
                  <Input value={b} onChange={e => setBullet(exp.id, i, e.target.value)} className="h-7 text-xs flex-1" />
                  <button onClick={() => removeBullet(exp.id, i)} className="text-[#94A3B8] hover:text-red-500">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
        <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs border-dashed border-[#1549B8]/40 text-[#1549B8] hover:bg-[#EEF2FF]"
          onClick={() => addItem('experience', { company:'', role:'', period:'', location:'', bullets:[''] })}>
          <Plus className="h-3.5 w-3.5" />Thêm kinh nghiệm
        </Button>
      </Section>

      {/* Education */}
      <Section title="Học vấn" icon="🎓">
        {cv.education.map(edu => (
          <div key={edu.id} className="border border-[#E2E8F0] rounded-lg p-3 space-y-2 relative">
            <button onClick={() => removeItem('education', edu.id)} className="absolute top-2 right-2 text-[#94A3B8] hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-2 space-y-1"><Label className="text-xs">Trường</Label><Input value={edu.school} onChange={e => setArr('education', edu.id, 'school', e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Ngành học</Label><Input value={edu.degree} onChange={e => setArr('education', edu.id, 'degree', e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Thời gian</Label><Input value={edu.period} onChange={e => setArr('education', edu.id, 'period', e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">GPA</Label><Input value={edu.gpa} onChange={e => setArr('education', edu.id, 'gpa', e.target.value)} className="h-8 text-xs" /></div>
            </div>
          </div>
        ))}
        <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs border-dashed border-[#1549B8]/40 text-[#1549B8] hover:bg-[#EEF2FF]"
          onClick={() => addItem('education', { school:'', degree:'', period:'', gpa:'' })}>
          <Plus className="h-3.5 w-3.5" />Thêm học vấn
        </Button>
      </Section>

      {/* Skills */}
      <Section title="Kỹ năng" icon="🛠️">
        {cv.skills.map(s => (
          <div key={s.id} className="flex gap-2 items-center">
            <Input value={s.category} onChange={e => setArr('skills', s.id, 'category', e.target.value)} className="h-8 text-xs w-28 flex-shrink-0" placeholder="Danh mục" />
            <Input value={s.items} onChange={e => setArr('skills', s.id, 'items', e.target.value)} className="h-8 text-xs flex-1" placeholder="Kỹ năng 1, Kỹ năng 2..." />
            <button onClick={() => removeItem('skills', s.id)} className="text-[#94A3B8] hover:text-red-500 flex-shrink-0"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
        ))}
        <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs border-dashed border-[#1549B8]/40 text-[#1549B8] hover:bg-[#EEF2FF]"
          onClick={() => addItem('skills', { category:'', items:'' })}>
          <Plus className="h-3.5 w-3.5" />Thêm nhóm kỹ năng
        </Button>
      </Section>

      {/* Languages */}
      <Section title="Ngôn ngữ" icon="🌐">
        {cv.languages.map(l => (
          <div key={l.id} className="flex gap-2 items-center">
            <Input value={l.lang} onChange={e => setArr('languages', l.id, 'lang', e.target.value)} className="h-8 text-xs w-32" placeholder="Ngôn ngữ" />
            <Input value={l.level} onChange={e => setArr('languages', l.id, 'level', e.target.value)} className="h-8 text-xs flex-1" placeholder="Trình độ" />
            <button onClick={() => removeItem('languages', l.id)} className="text-[#94A3B8] hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
        ))}
        <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs border-dashed border-[#1549B8]/40 text-[#1549B8] hover:bg-[#EEF2FF]"
          onClick={() => addItem('languages', { lang:'', level:'' })}>
          <Plus className="h-3.5 w-3.5" />Thêm ngôn ngữ
        </Button>
      </Section>

      {/* Certifications */}
      <Section title="Chứng chỉ" icon="🏆">
        {cv.certifications.map(c => (
          <div key={c.id} className="flex gap-2 items-center">
            <Input value={c.name} onChange={e => setArr('certifications', c.id, 'name', e.target.value)} className="h-8 text-xs flex-1" placeholder="Tên chứng chỉ" />
            <Input value={c.issuer} onChange={e => setArr('certifications', c.id, 'issuer', e.target.value)} className="h-8 text-xs w-28" placeholder="Đơn vị cấp" />
            <Input value={c.year} onChange={e => setArr('certifications', c.id, 'year', e.target.value)} className="h-8 text-xs w-16" placeholder="Năm" />
            <button onClick={() => removeItem('certifications', c.id)} className="text-[#94A3B8] hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
        ))}
        <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs border-dashed border-[#1549B8]/40 text-[#1549B8] hover:bg-[#EEF2FF]"
          onClick={() => addItem('certifications', { name:'', issuer:'', year:'' })}>
          <Plus className="h-3.5 w-3.5" />Thêm chứng chỉ
        </Button>
      </Section>
    </div>
  )
}
