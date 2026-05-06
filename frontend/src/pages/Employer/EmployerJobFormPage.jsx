import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { employerService } from '../../services/employerService'

const SKILL_SUGGESTIONS = [
  'React', 'Vue', 'Angular', 'Next.js', 'TypeScript', 'JavaScript',
  'Node.js', 'Express', 'NestJS', 'Python', 'FastAPI', 'Django',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes',
  'AWS', 'GCP', 'Figma', 'Photoshop', 'SQL', 'Git', 'CI/CD',
]

function Field({ label, required, hint, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#0F172A', marginBottom: 6 }}>
        {label} {required && <span style={{ color: '#EF4444' }}>*</span>}
        {hint && <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 400, marginLeft: 6 }}>{hint}</span>}
      </label>
      {children}
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '10px 14px', border: '1.5px solid #E2E8F0', borderRadius: 10,
  fontSize: 14, fontFamily: 'inherit', color: '#0F172A', boxSizing: 'border-box',
  outline: 'none', transition: 'border-color 0.2s',
  backgroundColor: 'white',
}

export default function EmployerJobFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    job_type: 'full-time',
    level: 'junior',
    salary_min: '',
    salary_max: '',
    required_skills: [],
    status: 'draft',
    expired_at: '',
  })
  const [skillInput, setSkillInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(isEdit)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!isEdit) return
    employerService.getJob(id).then(job => {
      setForm({
        title: job.title || '',
        description: job.description || '',
        location: job.location || '',
        job_type: job.job_type || 'full-time',
        level: job.level || 'junior',
        salary_min: job.salary_min || '',
        salary_max: job.salary_max || '',
        required_skills: job.required_skills || [],
        status: job.status || 'draft',
        expired_at: job.expired_at ? job.expired_at.slice(0, 10) : '',
      })
      setLoading(false)
    })
  }, [id])

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }))
    setErrors(e => ({ ...e, [key]: '' }))
  }

  const addSkill = (skill) => {
    const trimmed = skill.trim()
    if (trimmed && !form.required_skills.includes(trimmed)) {
      set('required_skills', [...form.required_skills, trimmed])
    }
    setSkillInput('')
  }

  const removeSkill = (skill) => set('required_skills', form.required_skills.filter(s => s !== skill))

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Vui lòng nhập tiêu đề'
    if (!form.description.trim()) e.description = 'Vui lòng nhập mô tả công việc'
    if (!form.location.trim()) e.location = 'Vui lòng nhập địa điểm'
    if (form.salary_min && form.salary_max && Number(form.salary_min) > Number(form.salary_max))
      e.salary_min = 'Lương tối thiểu không được lớn hơn tối đa'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = async (publish = false) => {
    if (!validate()) return
    setSaving(true)
    try {
      const payload = {
        ...form,
        salary_min: form.salary_min ? Number(form.salary_min) : null,
        salary_max: form.salary_max ? Number(form.salary_max) : null,
        expired_at: form.expired_at ? new Date(form.expired_at).toISOString() : null,
        status: publish ? 'active' : form.status,
      }
      if (isEdit) {
        await employerService.updateJob(id, payload)
      } else {
        await employerService.createJob(payload)
      }
      navigate('/employer/jobs')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: '#94A3B8' }}>Đang tải...</div>

  return (
    <div style={{ padding: '32px 0', maxWidth: 760, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <button onClick={() => navigate('/employer/jobs')} style={{
          background: 'none', border: 'none', cursor: 'pointer', color: '#64748B',
          fontSize: 13, fontFamily: 'inherit', fontWeight: 600, padding: 0, marginBottom: 12,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          ← Quay lại danh sách
        </button>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0F172A' }}>
          {isEdit ? '✏️ Chỉnh sửa tin tuyển dụng' : '➕ Đăng tin tuyển dụng mới'}
        </h1>
      </div>

      <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #E2E8F0', padding: 32, marginBottom: 20 }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', marginBottom: 20, paddingBottom: 12, borderBottom: '1.5px solid #F1F5F9' }}>
          📝 Thông tin cơ bản
        </h2>

        <Field label="Tiêu đề vị trí" required>
          <input value={form.title} onChange={e => set('title', e.target.value)}
            placeholder="VD: Senior Frontend Developer (React)"
            style={{ ...inputStyle, borderColor: errors.title ? '#EF4444' : '#E2E8F0' }}
            onFocus={e => e.target.style.borderColor = '#3B82F6'}
            onBlur={e => e.target.style.borderColor = errors.title ? '#EF4444' : '#E2E8F0'}
          />
          {errors.title && <p style={{ fontSize: 12, color: '#EF4444', marginTop: 4 }}>{errors.title}</p>}
        </Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Field label="Hình thức làm việc" required>
            <select value={form.job_type} onChange={e => set('job_type', e.target.value)} style={{ ...inputStyle }}>
              <option value="full-time">Toàn thời gian</option>
              <option value="part-time">Bán thời gian</option>
              <option value="remote">Remote</option>
              <option value="internship">Thực tập</option>
            </select>
          </Field>
          <Field label="Cấp độ" required>
            <select value={form.level} onChange={e => set('level', e.target.value)} style={{ ...inputStyle }}>
              <option value="intern">Intern</option>
              <option value="fresher">Fresher</option>
              <option value="junior">Junior</option>
              <option value="mid">Mid-level</option>
              <option value="senior">Senior</option>
            </select>
          </Field>
        </div>

        <Field label="Địa điểm làm việc" required>
          <input value={form.location} onChange={e => set('location', e.target.value)}
            placeholder="VD: TP. Hồ Chí Minh, Hà Nội, Remote..."
            style={{ ...inputStyle, borderColor: errors.location ? '#EF4444' : '#E2E8F0' }}
            onFocus={e => e.target.style.borderColor = '#3B82F6'}
            onBlur={e => e.target.style.borderColor = errors.location ? '#EF4444' : '#E2E8F0'}
          />
          {errors.location && <p style={{ fontSize: 12, color: '#EF4444', marginTop: 4 }}>{errors.location}</p>}
        </Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Field label="Lương tối thiểu" hint="(VNĐ, để trống = thỏa thuận)">
            <input type="number" value={form.salary_min} onChange={e => set('salary_min', e.target.value)}
              placeholder="VD: 15000000"
              style={{ ...inputStyle, borderColor: errors.salary_min ? '#EF4444' : '#E2E8F0' }}
              onFocus={e => e.target.style.borderColor = '#3B82F6'}
              onBlur={e => e.target.style.borderColor = errors.salary_min ? '#EF4444' : '#E2E8F0'}
            />
          </Field>
          <Field label="Lương tối đa" hint="(VNĐ)">
            <input type="number" value={form.salary_max} onChange={e => set('salary_max', e.target.value)}
              placeholder="VD: 25000000"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#3B82F6'}
              onBlur={e => e.target.style.borderColor = '#E2E8F0'}
            />
          </Field>
          {errors.salary_min && <p style={{ fontSize: 12, color: '#EF4444', gridColumn: '1/-1', marginTop: -12 }}>{errors.salary_min}</p>}
        </div>

        <Field label="Hạn nộp hồ sơ">
          <input type="date" value={form.expired_at} onChange={e => set('expired_at', e.target.value)}
            min={new Date().toISOString().slice(0, 10)}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = '#3B82F6'}
            onBlur={e => e.target.style.borderColor = '#E2E8F0'}
          />
        </Field>
      </div>

      {/* Description */}
      <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #E2E8F0', padding: 32, marginBottom: 20 }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', marginBottom: 20, paddingBottom: 12, borderBottom: '1.5px solid #F1F5F9' }}>
          📄 Mô tả công việc
        </h2>
        <Field label="Mô tả chi tiết" required hint="Yêu cầu, quyền lợi, môi trường làm việc...">
          <textarea value={form.description} onChange={e => set('description', e.target.value)}
            rows={8} placeholder="Mô tả công việc, yêu cầu ứng viên, quyền lợi được hưởng..."
            style={{ ...inputStyle, resize: 'vertical', minHeight: 160, borderColor: errors.description ? '#EF4444' : '#E2E8F0' }}
            onFocus={e => e.target.style.borderColor = '#3B82F6'}
            onBlur={e => e.target.style.borderColor = errors.description ? '#EF4444' : '#E2E8F0'}
          />
          {errors.description && <p style={{ fontSize: 12, color: '#EF4444', marginTop: 4 }}>{errors.description}</p>}
        </Field>
      </div>

      {/* Skills */}
      <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #E2E8F0', padding: 32, marginBottom: 24 }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', marginBottom: 8, paddingBottom: 12, borderBottom: '1.5px solid #F1F5F9' }}>
          🔧 Kỹ năng yêu cầu <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 400 }}>(AI dùng để so khớp CV)</span>
        </h2>

        {/* Selected skills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12, minHeight: 36 }}>
          {form.required_skills.map(skill => (
            <span key={skill} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600,
              backgroundColor: '#EFF6FF', color: '#2563EB', border: '1.5px solid #BFDBFE',
            }}>
              {skill}
              <button onClick={() => removeSkill(skill)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#93C5FD', fontSize: 16, padding: 0, lineHeight: 1 }}>×</button>
            </span>
          ))}
          {form.required_skills.length === 0 && (
            <span style={{ fontSize: 13, color: '#94A3B8', fontStyle: 'italic' }}>Chưa có kỹ năng nào</span>
          )}
        </div>

        {/* Skill input */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input value={skillInput} onChange={e => setSkillInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput) } }}
            placeholder="Nhập kỹ năng và nhấn Enter..."
            style={{ ...inputStyle, flex: 1 }}
            onFocus={e => e.target.style.borderColor = '#3B82F6'}
            onBlur={e => e.target.style.borderColor = '#E2E8F0'}
          />
          <button onClick={() => addSkill(skillInput)} disabled={!skillInput.trim()} style={{
            padding: '10px 18px', borderRadius: 10, border: 'none', background: '#3B82F6',
            color: 'white', fontWeight: 700, cursor: skillInput.trim() ? 'pointer' : 'not-allowed',
            opacity: skillInput.trim() ? 1 : 0.5, fontFamily: 'inherit', fontSize: 13,
          }}>
            Thêm
          </button>
        </div>

        {/* Suggestions */}
        <div>
          <p style={{ fontSize: 12, color: '#94A3B8', marginBottom: 8 }}>Gợi ý nhanh:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {SKILL_SUGGESTIONS.filter(s => !form.required_skills.includes(s)).slice(0, 12).map(skill => (
              <button key={skill} onClick={() => addSkill(skill)} style={{
                padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500,
                border: '1px solid #E2E8F0', background: '#F8FAFC', color: '#64748B',
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#3B82F6'; e.currentTarget.style.color = '#2563EB' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#64748B' }}
              >
                + {skill}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button onClick={() => navigate('/employer/jobs')} style={{
          padding: '12px 24px', borderRadius: 10, border: '1.5px solid #E2E8F0',
          background: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 600,
          fontFamily: 'inherit', color: '#64748B',
        }}>
          Hủy
        </button>
        <button onClick={() => handleSave(false)} disabled={saving} style={{
          padding: '12px 24px', borderRadius: 10, border: '1.5px solid #E2E8F0',
          background: 'white', cursor: saving ? 'not-allowed' : 'pointer',
          fontSize: 14, fontWeight: 600, fontFamily: 'inherit', color: '#0F172A',
          opacity: saving ? 0.6 : 1,
        }}>
          💾 Lưu nháp
        </button>
        <button onClick={() => handleSave(true)} disabled={saving} style={{
          padding: '12px 28px', borderRadius: 10, border: 'none',
          background: saving ? '#93C5FD' : 'linear-gradient(135deg, #1E40AF, #3B82F6)',
          color: 'white', cursor: saving ? 'not-allowed' : 'pointer',
          fontSize: 14, fontWeight: 800, fontFamily: 'inherit',
          boxShadow: saving ? 'none' : '0 4px 12px rgba(59,130,246,0.35)',
          transition: 'all 0.2s', flex: 1,
        }}>
          {saving ? '⏳ Đang lưu...' : isEdit ? '✅ Cập nhật & Đăng tin' : '🚀 Đăng tin ngay'}
        </button>
      </div>
    </div>
  )
}
