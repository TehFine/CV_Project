import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { employerService } from '@/services/employerService'

const CATEGORIES = ['Công nghệ thông tin','Thiết kế','Marketing','Tài chính - Kế toán','Nhân sự','Kinh doanh','Dữ liệu & AI','Quản lý sản phẩm']
const LEVELS     = ['Intern','Junior','Middle','Senior','Lead/Manager']
const JOB_TYPES  = ['Toàn thời gian','Bán thời gian','Remote','Freelance']

export default function PostJobPage() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [success,    setSuccess]    = useState(false)
  const [form, setForm] = useState({
    title:'', category:'', level:'', type:'', location:'', salary:'',
    deadline:'', description:'', requirements:'', benefits:'',
    tags:'',
  })
  const [errors, setErrors] = useState({})

  const set = k => e => { setForm(p => ({...p, [k]: e.target.value})); setErrors(p => ({...p, [k]: ''})) }
  const setSelect = k => v => { setForm(p => ({...p, [k]: v})); setErrors(p => ({...p, [k]: ''})) }

  const validate = () => {
    const e = {}
    if (!form.title)       e.title       = 'Bắt buộc'
    if (!form.category)    e.category    = 'Bắt buộc'
    if (!form.level)       e.level       = 'Bắt buộc'
    if (!form.type)        e.type        = 'Bắt buộc'
    if (!form.location)    e.location    = 'Bắt buộc'
    if (!form.salary)      e.salary      = 'Bắt buộc'
    if (!form.deadline)    e.deadline    = 'Bắt buộc'
    if (!form.description) e.description = 'Bắt buộc'
    return e
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSubmitting(true)
    try {
      await employerService.createJob({
        ...form,
        requirements: form.requirements.split('\n').filter(Boolean),
        benefits:     form.benefits.split('\n').filter(Boolean),
        tags:         form.tags.split(',').map(t => t.trim()).filter(Boolean),
      })
      setSuccess(true)
      setTimeout(() => navigate('/employer/jobs'), 2000)
    } catch { setErrors({ submit: 'Đăng tin thất bại' }) }
    finally { setSubmitting(false) }
  }

  if (success) return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <div className="text-center">
        <CheckCircle2 className="h-16 w-16 text-[#059669] mx-auto mb-4" />
        <h2 className="text-xl font-black text-[#0F172A] mb-2">Đăng tin thành công! 🎉</h2>
        <p className="text-[#475569] text-sm">Đang chuyển hướng đến quản lý tin...</p>
      </div>
    </div>
  )

  const Field = ({ name, label, required, children }) => (
    <div className="space-y-1.5">
      <Label className="text-sm font-semibold text-[#0F172A]">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</Label>
      {children}
      {errors[name] && <p className="text-xs text-red-500">{errors[name]}</p>}
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      <div className="bg-gradient-to-br from-[#0F172A] to-[#1549B8] py-8">
        <div className="container-app">
          <h1 className="text-2xl font-black text-white mb-1">📢 Đăng tin tuyển dụng</h1>
          <p className="text-blue-200 text-sm">Tiếp cận hàng nghìn ứng viên tiềm năng</p>
        </div>
      </div>

      <div className="container-app py-6">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 mb-4">
            <h2 className="font-bold text-[#0F172A] mb-4 pb-3 border-b border-[#F1F5F9]">Thông tin cơ bản</h2>
            <div className="space-y-4">
              <Field name="title" label="Tên vị trí tuyển dụng" required>
                <Input value={form.title} onChange={set('title')} placeholder="VD: Senior Frontend Developer"
                  className={errors.title ? 'border-red-400' : ''} />
              </Field>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field name="category" label="Ngành nghề" required>
                  <Select onValueChange={setSelect('category')}>
                    <SelectTrigger className={errors.category ? 'border-red-400' : ''}><SelectValue placeholder="Chọn ngành" /></SelectTrigger>
                    <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
                <Field name="level" label="Cấp bậc" required>
                  <Select onValueChange={setSelect('level')}>
                    <SelectTrigger className={errors.level ? 'border-red-400' : ''}><SelectValue placeholder="Chọn cấp bậc" /></SelectTrigger>
                    <SelectContent>{LEVELS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
                <Field name="type" label="Hình thức làm việc" required>
                  <Select onValueChange={setSelect('type')}>
                    <SelectTrigger className={errors.type ? 'border-red-400' : ''}><SelectValue placeholder="Chọn hình thức" /></SelectTrigger>
                    <SelectContent>{JOB_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
                <Field name="location" label="Địa điểm" required>
                  <Input value={form.location} onChange={set('location')} placeholder="VD: TP. Hồ Chí Minh"
                    className={errors.location ? 'border-red-400' : ''} />
                </Field>
                <Field name="salary" label="Mức lương" required>
                  <Input value={form.salary} onChange={set('salary')} placeholder="VD: 20 - 35 triệu"
                    className={errors.salary ? 'border-red-400' : ''} />
                </Field>
                <Field name="deadline" label="Hạn nộp hồ sơ" required>
                  <Input type="date" value={form.deadline} onChange={set('deadline')}
                    className={errors.deadline ? 'border-red-400' : ''} />
                </Field>
              </div>
              <Field name="tags" label="Tags / Kỹ năng">
                <Input value={form.tags} onChange={set('tags')} placeholder="React, TypeScript, Node.js (cách nhau bằng dấu phẩy)" />
              </Field>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 mb-4">
            <h2 className="font-bold text-[#0F172A] mb-4 pb-3 border-b border-[#F1F5F9]">Mô tả chi tiết</h2>
            <div className="space-y-4">
              <Field name="description" label="Mô tả công việc" required>
                <Textarea value={form.description} onChange={set('description')} rows={5}
                  placeholder="Mô tả chi tiết về vai trò, trách nhiệm và môi trường làm việc..."
                  className={`text-sm ${errors.description ? 'border-red-400' : ''}`} />
              </Field>
              <Field name="requirements" label="Yêu cầu ứng viên">
                <Textarea value={form.requirements} onChange={set('requirements')} rows={4}
                  placeholder={"Mỗi yêu cầu trên một dòng:\n2+ năm kinh nghiệm React\nThành thạo TypeScript"}
                  className="text-sm" />
                <p className="text-xs text-[#94A3B8]">Mỗi yêu cầu trên một dòng</p>
              </Field>
              <Field name="benefits" label="Phúc lợi">
                <Textarea value={form.benefits} onChange={set('benefits')} rows={3}
                  placeholder={"Mỗi phúc lợi trên một dòng:\nLương cạnh tranh\nThưởng hiệu suất"}
                  className="text-sm" />
                <p className="text-xs text-[#94A3B8]">Mỗi phúc lợi trên một dòng</p>
              </Field>
            </div>
          </div>

          {errors.submit && (
            <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">⚠️ {errors.submit}</div>
          )}

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => navigate('/employer/jobs')} className="flex-1">Hủy</Button>
            <Button type="submit" disabled={submitting} className="flex-2 bg-[#1549B8] hover:bg-[#1240A0] text-white font-bold px-8">
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? 'Đang đăng...' : '📢 Đăng tin tuyển dụng'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}