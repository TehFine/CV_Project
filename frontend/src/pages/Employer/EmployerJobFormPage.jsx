import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Edit3, FileText, Wrench, Save, Loader2, CheckCircle2, Rocket, XCircle, Plus, AlertCircle } from 'lucide-react'
import { employerService } from '../../services/employerService'
import { useAuth } from '../../context/AuthContext'
import { SkeletonPage } from '@/components/ui/Skeleton'

const SKILL_SUGGESTIONS = [
  'React', 'Vue', 'Angular', 'Next.js', 'TypeScript', 'JavaScript',
  'Node.js', 'Express', 'NestJS', 'Python', 'FastAPI', 'Django',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes',
  'AWS', 'GCP', 'Figma', 'Photoshop', 'SQL', 'Git', 'CI/CD',
]

function Field({ label, required, hint, children }) {
  return (
    <div className="mb-5">
      <label className="block text-sm font-semibold text-slate-900 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
        {hint && <span className="text-xs text-slate-400 font-normal ml-1.5">{hint}</span>}
      </label>
      {children}
    </div>
  )
}

const inputStyle = "w-full px-3.5 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-inherit text-slate-900 box-border outline-none transition-all bg-white focus:border-blue-500"

export default function EmployerJobFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { user } = useAuth()

  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    companyName: user?.companyName || '',
    category: 'Công nghệ thông tin',
    job_type: 'full-time',
    level: 'junior',
    salary_min: '',
    salary_max: '',
    required_skills: [],
    requirements: '',
    benefits: '',
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
        companyName: job.companyName || user?.companyName || '',
        category: job.category || 'Công nghệ thông tin',
        job_type: job.job_type || 'full-time',
        level: job.level || 'junior',
        salary_min: job.salary_min || '',
        salary_max: job.salary_max || '',
        required_skills: job.required_skills || [],
        requirements: job.requirements || '',
        benefits: job.benefits || '',
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
    else if (form.title.trim().length < 3) e.title = 'Tiêu đề phải có ít nhất 3 ký tự'
    if (!form.description.trim()) e.description = 'Vui lòng nhập mô tả công việc'
    else if (form.description.trim().length < 10) e.description = 'Mô tả phải có ít nhất 10 ký tự'
    if (!form.location.trim()) e.location = 'Vui lòng nhập địa điểm'
    else if (form.location.trim().length < 3) e.location = 'Địa điểm phải có ít nhất 3 ký tự'
    if (!form.companyName.trim()) e.companyName = 'Vui lòng nhập tên công ty'
    if (form.salary_min && Number(form.salary_min) < 0)
      e.salary_min = 'Lương tối thiểu không được âm'
    if (form.salary_max && Number(form.salary_max) < 0)
      e.salary_max = 'Lương tối đa không được âm'
    if (form.salary_min && form.salary_max && Number(form.salary_min) > Number(form.salary_max))
      e.salary_min = 'Lương tối thiểu không được lớn hơn tối đa'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const [errorMsg, setErrorMsg] = useState('')

  const handleSave = async (publish = false) => {
    if (!validate()) return
    setSaving(true)
    setErrorMsg('')
    try {
      const payload = {
        ...form,
        salary_min: form.salary_min ? Number(form.salary_min) : null,
        salary_max: form.salary_max ? Number(form.salary_max) : null,
        expired_at: form.expired_at ? new Date(form.expired_at).toISOString() : null,
        status: publish ? 'pending' : form.status,
        companyName: form.companyName || user?.companyName || '',
      }
      if (isEdit) {
        await employerService.updateJob(id, payload)
      } else {
        await employerService.createJob(payload)
      }
      navigate('/employer/jobs')
    } catch (err) {
      const msg = err?.message || err?.data?.message || 'Có lỗi xảy ra khi lưu tin tuyển dụng. Vui lòng thử lại.'
      setErrorMsg(msg)
      console.error('Save job error:', err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="max-w-2xl mx-auto py-8"><SkeletonPage cards={3} /></div>

  return (
    <div className="px-4 py-8 max-w-[760px] mx-auto">
      {/* Header */}
      <div className="mb-7">
        <button onClick={() => navigate('/employer/jobs')}
          className="bg-transparent border-none cursor-pointer text-slate-500 text-[13px] font-inherit font-semibold p-0 mb-3 flex items-center gap-1.5 hover:text-slate-900 transition-colors">
          ← Quay lại danh sách
        </button>
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          {isEdit ? <><Edit3 className="h-5 w-5" /> Chỉnh sửa tin tuyển dụng</> : 'Đăng tin tuyển dụng mới'}
        </h1>
      </div>

      <div className="bg-white rounded-2xl border-2 border-slate-200 p-5 mb-5">
        <h2 className="text-[15px] font-extrabold text-slate-900 mb-5 pb-3 border-b-2 border-slate-100 flex items-center gap-1.5">
          <FileText className="h-4 w-4" /> Thông tin cơ bản
        </h2>

        {errorMsg && (
          <div className="px-4 py-3 rounded-xl mb-5 bg-red-50 border-2 border-red-200 text-red-600 text-[13px] font-semibold flex items-center gap-1.5">
            <XCircle className="h-4 w-4 shrink-0" />{errorMsg}
          </div>
        )}

        <Field label="Tiêu đề vị trí" required>
          <input value={form.title} onChange={e => set('title', e.target.value)}
            placeholder="VD: Senior Frontend Developer (React)"
            className={`${inputStyle} ${errors.title ? '!border-red-500' : ''}`}
          />
          {errors.title && <p className="text-xs text-red-500 mt-1 flex items-center gap-0.5"><AlertCircle size={11} />{errors.title}</p>}
        </Field>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
          <Field label="Tên công ty" required>
            <input value={form.companyName} onChange={e => set('companyName', e.target.value)}
              placeholder="VD: VNG Corporation"
              className={`${inputStyle} ${errors.companyName ? '!border-red-500' : ''}`}
            />
            {errors.companyName && <p className="text-xs text-red-500 mt-1 flex items-center gap-0.5"><AlertCircle size={11} />{errors.companyName}</p>}
          </Field>
          <Field label="Ngành nghề" required>
            <select value={form.category} onChange={e => set('category', e.target.value)} className={inputStyle}>
              <option value="Công nghệ thông tin">Công nghệ thông tin</option>
              <option value="Dữ liệu & AI">Dữ liệu & AI</option>
              <option value="Thiết kế">Thiết kế</option>
              <option value="Marketing">Marketing</option>
              <option value="Kinh doanh / Sales">Kinh doanh / Sales</option>
              <option value="Tài chính - Kế toán">Tài chính - Kế toán</option>
              <option value="Nhân sự">Nhân sự</option>
              <option value="Sản xuất">Sản xuất</option>
              <option value="Khác">Khác</option>
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
          <Field label="Hình thức làm việc" required>
            <select value={form.job_type} onChange={e => set('job_type', e.target.value)} className={inputStyle}>
              <option value="full-time">Toàn thời gian</option>
              <option value="part-time">Bán thời gian</option>
              <option value="remote">Remote</option>
              <option value="internship">Thực tập</option>
            </select>
          </Field>
          <Field label="Cấp độ" required>
            <select value={form.level} onChange={e => set('level', e.target.value)} className={inputStyle}>
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
            className={`${inputStyle} ${errors.location ? '!border-red-500' : ''}`}
          />
          {errors.location && <p className="text-xs text-red-500 mt-1 flex items-center gap-0.5"><AlertCircle size={11} />{errors.location}</p>}
        </Field>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
          <Field label="Lương tối thiểu" hint="(VNĐ, để trống = thỏa thuận)">
            <input type="number" min="0" value={form.salary_min} onChange={e => {
              const v = e.target.value
              if (v === '') return set('salary_min', '')
              const n = Number(v)
              if (!isNaN(n)) set('salary_min', Math.max(0, n).toString())
            }}
              placeholder="VD: 15000000"
              className={`${inputStyle} ${errors.salary_min ? '!border-red-500' : ''}`}
            />
          </Field>
          <Field label="Lương tối đa" hint="(VNĐ)">
            <input type="number" min="0" value={form.salary_max} onChange={e => {
              const v = e.target.value
              if (v === '') return set('salary_max', '')
              const n = Number(v)
              if (!isNaN(n)) set('salary_max', Math.max(0, n).toString())
            }}
              placeholder="VD: 25000000"
              className={inputStyle}
            />
          </Field>
          {errors.salary_min && <p className="text-xs text-red-500 col-span-full -mt-3">{errors.salary_min}</p>}
        </div>

        <Field label="Hạn nộp hồ sơ">
          <input type="date" value={form.expired_at} onChange={e => set('expired_at', e.target.value)}
            min={new Date().toISOString().slice(0, 10)}
            className={inputStyle}
          />
        </Field>
      </div>

      {/* Description & Details */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 p-5 mb-5">
        <h2 className="text-[15px] font-extrabold text-slate-900 mb-5 pb-3 border-b-2 border-slate-100 flex items-center gap-1.5">
          <FileText className="h-4 w-4" /> Chi tiết tin đăng
        </h2>

        <Field label="Mô tả công việc" required>
          <textarea value={form.description} onChange={e => set('description', e.target.value)}
            rows={6} placeholder="Nhập mô tả chung về công việc..."
            className={`${inputStyle} resize-y min-h-[120px] ${errors.description ? '!border-red-500' : ''}`}
          />
          {errors.description && <p className="text-xs text-red-500 mt-1 flex items-center gap-0.5"><AlertCircle size={11} />{errors.description}</p>}
        </Field>

        <Field label="Yêu cầu ứng viên" hint="Kỹ năng, kinh nghiệm, bằng cấp...">
          <textarea value={form.requirements} onChange={e => set('requirements', e.target.value)}
            rows={5} placeholder="Nhập các yêu cầu đối với ứng viên..."
            className={`${inputStyle} resize-y min-h-[100px]`}
          />
        </Field>

        <Field label="Quyền lợi" hint="Lương thưởng, bảo hiểm, chế độ đãi ngộ...">
          <textarea value={form.benefits} onChange={e => set('benefits', e.target.value)}
            rows={5} placeholder="Nhập các quyền lợi ứng viên sẽ được hưởng..."
            className={`${inputStyle} resize-y min-h-[100px]`}
          />
        </Field>
      </div>

      {/* Skills */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 p-5 mb-6">
        <h2 className="text-[15px] font-extrabold text-slate-900 mb-2 pb-3 border-b-2 border-slate-100 flex items-center gap-1.5">
          <Wrench className="h-4 w-4" /> Kỹ năng yêu cầu <span className="text-xs text-slate-400 font-normal">(AI dùng để so khớp CV)</span>
        </h2>

        {/* Selected skills */}
        <div className="flex flex-wrap gap-2 mb-3 min-h-[36px]">
          {form.required_skills.map(skill => (
            <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-semibold bg-blue-50 text-blue-600 border-2 border-blue-200">
              {skill}
              <button onClick={() => removeSkill(skill)} className="bg-transparent border-none cursor-pointer text-blue-300 hover:text-blue-500 text-base p-0 leading-none">×</button>
            </span>
          ))}
          {form.required_skills.length === 0 && (
            <span className="text-[13px] text-slate-400 italic">Chưa có kỹ năng nào</span>
          )}
        </div>

        {/* Skill input */}
        <div className="flex gap-2 mb-3">
          <input value={skillInput} onChange={e => setSkillInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput) } }}
            placeholder="Nhập kỹ năng và nhấn Enter..."
            className={`${inputStyle} flex-1`}
          />
          <button onClick={() => addSkill(skillInput)} disabled={!skillInput.trim()}
            className={`px-4.5 py-2.5 rounded-xl border-none font-bold font-inherit text-[13px] inline-flex items-center gap-1 transition-all ${
              skillInput.trim()
                ? 'bg-blue-500 text-white cursor-pointer hover:bg-blue-600'
                : 'bg-blue-500/50 text-white/70 cursor-not-allowed'
            }`}>
            <Plus className="h-4 w-4" /> Thêm
          </button>
        </div>

        {/* Suggestions */}
        <div>
          <p className="text-xs text-slate-400 mb-2">Gợi ý nhanh:</p>
          <div className="flex flex-wrap gap-1.5">
            {SKILL_SUGGESTIONS.filter(s => !form.required_skills.includes(s)).slice(0, 12).map(skill => (
              <button key={skill} onClick={() => addSkill(skill)}
                className="px-2.5 py-0.5 rounded-full text-xs font-medium border border-slate-200 bg-slate-50 text-slate-500 cursor-pointer font-inherit hover:border-blue-500 hover:text-blue-600 transition-all"
              >
                + {skill}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 flex-wrap flex-row">
        <button onClick={() => navigate('/employer/jobs')}
          className="px-6 py-3 rounded-xl border-2 border-slate-200 bg-white cursor-pointer text-sm font-semibold font-inherit text-slate-500 hover:bg-slate-50 transition-colors">
          Hủy
        </button>
        <button onClick={() => handleSave(false)} disabled={saving}
          className={`px-6 py-3 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold font-inherit text-slate-900 inline-flex items-center gap-1.5 transition-all ${
            saving ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-50'
          }`}>
          <Save className="h-4 w-4" /> Lưu nháp
        </button>
        <button onClick={() => handleSave(true)} disabled={saving}
          className={`px-7 py-3 rounded-xl border-none text-white text-sm font-extrabold font-inherit flex-1 inline-flex items-center justify-center gap-1.5 transition-all ${
            saving
              ? 'bg-blue-300 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-blue-700 to-blue-500 cursor-pointer shadow-lg shadow-blue-500/35 hover:shadow-xl hover:shadow-blue-500/45'
          }`}>
          {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Đang lưu...</> : isEdit ? <><CheckCircle2 className="h-4 w-4" /> Cập nhật & Gửi duyệt</> : <><Rocket className="h-4 w-4" /> Đăng tin (Chờ duyệt)</>}
        </button>
      </div>
    </div>
  )
}
