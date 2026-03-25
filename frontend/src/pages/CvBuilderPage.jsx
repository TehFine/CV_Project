import { useState, useRef } from 'react'
import { Plus, Trash2, ChevronDown, ChevronUp, Download, Eye, Edit3, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

// ── Default template data ────────────────────────────────────────────────────
const DEFAULT_CV = {
  personal: {
    name: 'Nguyễn Văn An',
    title: 'Frontend Developer',
    email: 'an.nguyen@email.com',
    phone: '0901 234 567',
    location: 'TP. Hồ Chí Minh',
    linkedin: 'linkedin.com/in/nguyenvanan',
    website: '',
    summary: 'Frontend Developer với 3 năm kinh nghiệm xây dựng ứng dụng web hiện đại. Thành thạo React, TypeScript và TailwindCSS. Đam mê tạo ra những sản phẩm đẹp, hiệu năng cao và trải nghiệm người dùng xuất sắc.',
  },
  experience: [
    {
      id: 1,
      company: 'VNG Corporation',
      role: 'Frontend Developer',
      period: '01/2022 – Hiện tại',
      location: 'TP. Hồ Chí Minh',
      bullets: [
        'Phát triển và duy trì các tính năng cho ứng dụng Zalo Web với 70M+ người dùng.',
        'Tối ưu hóa hiệu năng, giảm 40% thời gian tải trang.',
        'Mentoring 3 junior developer trong nhóm.',
      ],
    },
    {
      id: 2,
      company: 'Startup XYZ',
      role: 'Junior Frontend Developer',
      period: '06/2021 – 12/2021',
      location: 'TP. Hồ Chí Minh',
      bullets: [
        'Xây dựng giao diện người dùng với React và Redux.',
        'Tích hợp RESTful API và xử lý state management.',
      ],
    },
  ],
  education: [
    {
      id: 1,
      school: 'Đại học Bách Khoa TP.HCM',
      degree: 'Cử nhân Kỹ thuật Phần mềm',
      period: '2017 – 2021',
      gpa: '3.5/4.0',
    },
  ],
  skills: [
    { id: 1, category: 'Frontend', items: 'React, TypeScript, JavaScript, HTML, CSS, TailwindCSS' },
    { id: 2, category: 'Backend',  items: 'Node.js, Express, RESTful API' },
    { id: 3, category: 'Tools',    items: 'Git, Docker, Figma, Vite, Webpack' },
  ],
  languages: [
    { id: 1, lang: 'Tiếng Việt', level: 'Bản ngữ' },
    { id: 2, lang: 'Tiếng Anh',  level: 'Thành thạo (IELTS 7.0)' },
  ],
  certifications: [
    { id: 1, name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', year: '2023' },
  ],
}

const uid = () => Date.now() + Math.random()

// ── Section collapse wrapper ─────────────────────────────────────────────────
function Section({ title, icon, children }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="border border-[#E2E8F0] rounded-xl overflow-hidden bg-white">
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors">
        <span className="flex items-center gap-2 text-sm font-bold text-[#0F172A]">
          <span>{icon}</span>{title}
        </span>
        {open ? <ChevronUp className="h-4 w-4 text-[#94A3B8]" /> : <ChevronDown className="h-4 w-4 text-[#94A3B8]" />}
      </button>
      {open && <div className="p-4 space-y-3">{children}</div>}
    </div>
  )
}

// ── CV Preview ───────────────────────────────────────────────────────────────
function CVPreview({ cv }) {
  const { personal, experience, education, skills, languages, certifications } = cv

  return (
    <div id="cv-preview" className="bg-white shadow-lg text-[#0F172A]" style={{ fontFamily: "'Be Vietnam Pro', sans-serif", minHeight: '297mm', fontSize: 13 }}>
      {/* Header */}
      <div className="bg-[#1549B8] px-8 py-6 text-white">
        <h1 className="text-2xl font-black tracking-tight mb-0.5">{personal.name || 'Họ và tên'}</h1>
        <p className="text-blue-200 font-semibold text-sm mb-3">{personal.title || 'Chức danh'}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-blue-100">
          {personal.email    && <span>✉ {personal.email}</span>}
          {personal.phone    && <span>📞 {personal.phone}</span>}
          {personal.location && <span>📍 {personal.location}</span>}
          {personal.linkedin && <span>🔗 {personal.linkedin}</span>}
          {personal.website  && <span>🌐 {personal.website}</span>}
        </div>
      </div>

      <div className="px-8 py-5 space-y-5">
        {/* Summary */}
        {personal.summary && (
          <div>
            <h2 className="text-xs font-black uppercase tracking-widest text-[#1549B8] border-b-2 border-[#1549B8] pb-1 mb-2">
              Giới thiệu bản thân
            </h2>
            <p className="text-xs leading-relaxed text-[#475569]">{personal.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div>
            <h2 className="text-xs font-black uppercase tracking-widest text-[#1549B8] border-b-2 border-[#1549B8] pb-1 mb-3">
              Kinh nghiệm làm việc
            </h2>
            <div className="space-y-4">
              {experience.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-sm text-[#0F172A]">{exp.role || 'Chức vụ'}</p>
                      <p className="text-xs font-semibold text-[#1549B8]">{exp.company || 'Công ty'}</p>
                    </div>
                    <div className="text-right text-xs text-[#94A3B8] flex-shrink-0 ml-4">
                      <p>{exp.period}</p>
                      <p>{exp.location}</p>
                    </div>
                  </div>
                  <ul className="mt-1.5 space-y-1">
                    {exp.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} className="flex gap-2 text-xs text-[#475569]">
                        <span className="text-[#1549B8] flex-shrink-0 mt-0.5">•</span>{b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div>
            <h2 className="text-xs font-black uppercase tracking-widest text-[#1549B8] border-b-2 border-[#1549B8] pb-1 mb-3">
              Học vấn
            </h2>
            <div className="space-y-2.5">
              {education.map(edu => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-sm text-[#0F172A]">{edu.school}</p>
                    <p className="text-xs text-[#475569]">{edu.degree}{edu.gpa && ` — GPA: ${edu.gpa}`}</p>
                  </div>
                  <span className="text-xs text-[#94A3B8] flex-shrink-0 ml-4">{edu.period}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <h2 className="text-xs font-black uppercase tracking-widest text-[#1549B8] border-b-2 border-[#1549B8] pb-1 mb-3">
              Kỹ năng
            </h2>
            <div className="space-y-1.5">
              {skills.map(s => (
                <div key={s.id} className="flex gap-2 text-xs">
                  <span className="font-bold text-[#0F172A] w-24 flex-shrink-0">{s.category}:</span>
                  <span className="text-[#475569]">{s.items}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div>
            <h2 className="text-xs font-black uppercase tracking-widest text-[#1549B8] border-b-2 border-[#1549B8] pb-1 mb-2">
              Ngôn ngữ
            </h2>
            <div className="flex flex-wrap gap-3">
              {languages.map(l => (
                <span key={l.id} className="text-xs">
                  <strong className="text-[#0F172A]">{l.lang}</strong>
                  {l.level && <span className="text-[#94A3B8]"> — {l.level}</span>}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div>
            <h2 className="text-xs font-black uppercase tracking-widest text-[#1549B8] border-b-2 border-[#1549B8] pb-1 mb-2">
              Chứng chỉ
            </h2>
            <div className="space-y-1">
              {certifications.map(c => (
                <div key={c.id} className="flex justify-between text-xs">
                  <span><strong className="text-[#0F172A]">{c.name}</strong>{c.issuer && <span className="text-[#94A3B8]"> — {c.issuer}</span>}</span>
                  <span className="text-[#94A3B8] ml-4">{c.year}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Editor form ──────────────────────────────────────────────────────────────
function EditorPanel({ cv, onChange }) {
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

// ── Main Page ────────────────────────────────────────────────────────────────
export default function CVBuilderPage() {
  const [cv, setCv] = useState(DEFAULT_CV)
  const [view, setView] = useState('split') // 'split' | 'preview' | 'edit'
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    // Khi có backend: await cvBuilderService.save(cv)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      {/* Toolbar */}
      <div className="bg-white border-b border-[#E2E8F0] shadow-sm sticky top-16 z-10">
        <div className="container-app h-12 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-[#0F172A]">✏️ Tạo CV</span>
            <span className="text-[#94A3B8] text-xs">— Template cơ bản</span>
          </div>

          {/* View toggle */}
          <div className="hidden md:flex items-center gap-1 bg-[#F1F5F9] rounded-lg p-1">
            {[
              { key: 'edit',    label: 'Chỉnh sửa', icon: Edit3 },
              { key: 'split',   label: 'Chia đôi',  icon: null },
              { key: 'preview', label: 'Xem trước', icon: Eye },
            ].map(v => (
              <button key={v.key} onClick={() => setView(v.key)}
                className={cn('px-3 py-1 rounded-md text-xs font-medium transition-all',
                  view === v.key ? 'bg-white text-[#0F172A] shadow-sm' : 'text-[#94A3B8] hover:text-[#475569]')}>
                {v.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSave} className="gap-1.5 border-[#E2E8F0] text-xs">
              <Save className="h-3.5 w-3.5" />
              {saved ? '✅ Đã lưu' : 'Lưu'}
            </Button>
            <Button size="sm" onClick={handlePrint} className="bg-[#1549B8] hover:bg-[#1240A0] text-white gap-1.5 text-xs">
              <Download className="h-3.5 w-3.5" />Xuất PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="container-app py-5">
        {/* Split view (default) */}
        {view === 'split' && (
          <div className="grid lg:grid-cols-[1fr_650px] gap-5 items-start">
            <div className="space-y-0 overflow-y-auto max-h-[calc(100vh-9rem)] pr-1">
              <EditorPanel cv={cv} onChange={setCv} />
            </div>
            <div className="sticky top-[7rem] overflow-auto max-h-[calc(100vh-9rem)] rounded-xl shadow-xl ring-1 ring-[#E2E8F0]">
              <CVPreview cv={cv} />
            </div>
          </div>
        )}

        {view === 'edit' && (
          <div className="max-w-2xl mx-auto">
            <EditorPanel cv={cv} onChange={setCv} />
          </div>
        )}

        {view === 'preview' && (
          <div className="max-w-[780px] mx-auto shadow-xl rounded-xl overflow-hidden ring-1 ring-[#E2E8F0]">
            <CVPreview cv={cv} />
          </div>
        )}
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body > *:not(#cv-preview) { display: none !important; }
          #cv-preview { display: block !important; margin: 0; }
          header, .sticky { display: none !important; }
        }
      `}</style>
    </div>
  )
}