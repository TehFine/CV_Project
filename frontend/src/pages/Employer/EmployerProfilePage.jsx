import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { authService } from '../../services/authService'
import { Building, Mail, Phone, Globe, Briefcase, Camera, CheckCircle2, Loader2, Save, AlertCircle } from 'lucide-react'

function Field({ label, required, children, icon: Icon }) {
  return (
    <div className="mb-5">
      <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 mb-2">
        {Icon && <Icon size={16} className="text-slate-400" />}
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputStyle = "w-full px-3.5 py-3 border-2 border-slate-200 rounded-xl text-sm font-inherit text-slate-900 box-border outline-none transition-all bg-[#F8FAFC] focus:border-[#1549B8] focus:bg-white"

export default function EmployerProfilePage() {
  const { user, updateUser } = useAuth()
  const [form, setForm] = useState({
    companyName: '',
    email: '',
    phone: '',
    industry: '',
    companyWebsite: '',
    description: '',
    avatar: '',
  })
  const [logoPreview, setLogoPreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [phoneError, setPhoneError] = useState('')
  const [phoneTouched, setPhoneTouched] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [emailTouched, setEmailTouched] = useState(false)
  const [companyNameError, setCompanyNameError] = useState('')
  const [companyNameTouched, setCompanyNameTouched] = useState(false)
  const [websiteError, setWebsiteError] = useState('')
  const [websiteTouched, setWebsiteTouched] = useState(false)

  const validateEmail = (value) => {
    if (!value.trim()) {
      setEmailError('')
      return true
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value.trim())) {
      setEmailError('Email không đúng định dạng (VD: contact@company.com)')
      return false
    }
    setEmailError('')
    return true
  }

  const validateCompanyName = (value) => {
    if (!value.trim()) {
      setCompanyNameError('Tên công ty không được để trống')
      return false
    }
    if (value.trim().length < 2) {
      setCompanyNameError('Tên công ty phải có ít nhất 2 ký tự')
      return false
    }
    setCompanyNameError('')
    return true
  }

  const validateWebsite = (value) => {
    if (!value.trim()) {
      setWebsiteError('')
      return true
    }
    // Accept URLs with or without protocol
    const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i
    if (!urlRegex.test(value.trim())) {
      setWebsiteError('Website không đúng định dạng (VD: https://example.com)')
      return false
    }
    setWebsiteError('')
    return true
  }

  const validatePhone = (value) => {
    if (!value.trim()) {
      setPhoneError('')
      return true
    }
    // Vietnamese phone: 0xxxxxxxxx (10 digits) or +84xxxxxxxxx (11 chars with +)
    const vnPhoneRegex = /^(0[3-9][0-9]{8,9}|\+84[3-9][0-9]{8,9})$/
    const cleaned = value.replace(/[\s.\-()]/g, '')
    if (!vnPhoneRegex.test(cleaned)) {
      setPhoneError('Số điện thoại không đúng định dạng (VD: 0901234567 hoặc +84901234567)')
      return false
    }
    setPhoneError('')
    return true
  }

  useEffect(() => {
    if (user) {
      setForm({
        companyName: user.companyName || '',
        email: user.email || '',
        phone: user.phone || '',
        industry: user.industry || '',
        companyWebsite: user.companyWebsite || '',
        description: user.description || '',
        avatar: user.avatar || '',
      })
      setLogoPreview(user.avatar || null)
    }
  }, [user])

  const handleChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }))
    setSuccess(false)
    if (field === 'phone') {
      setPhoneTouched(true)
      validatePhone(value)
    }
    if (field === 'email') {
      setEmailTouched(true)
      validateEmail(value)
    }
    if (field === 'companyName') {
      setCompanyNameTouched(true)
      validateCompanyName(value)
    }
    if (field === 'companyWebsite') {
      setWebsiteTouched(true)
      validateWebsite(value)
    }
  }

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      alert("Ảnh quá lớn! Vui lòng chọn ảnh dưới 2MB.")
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result
      setLogoPreview(base64String)
      setForm(f => ({ ...f, avatar: base64String }))
      setSuccess(false)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    if (!form.companyName || !form.email) return alert("Vui lòng điền các trường bắt buộc")
    if (form.email.trim() && !validateEmail(form.email)) return alert('Vui lòng kiểm tra lại email')
    if (!validateCompanyName(form.companyName)) return alert('Vui lòng kiểm tra lại tên công ty')
    if (form.phone.trim() && !validatePhone(form.phone)) return alert('Vui lòng kiểm tra lại số điện thoại')
    if (form.companyWebsite.trim() && !validateWebsite(form.companyWebsite)) return alert('Vui lòng kiểm tra lại website')
    setSaving(true)
    try {
      // Gọi authService để cập nhật
      const updatedUser = await authService.updateProfile({
        ...form,
        role: 'employer' // Để backend/mock biết đây là employer
      })
      
      // Cập nhật lại context toàn cục
      updateUser(updatedUser)
      
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      alert("Lỗi cập nhật: " + err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="px-4 py-8 max-w-200 mx-auto" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      <div className="mb-8">
        <h1 className="text-[28px] font-black text-slate-900 mb-2">Hồ sơ Công ty</h1>
        <p className="text-[15px] text-slate-500">Quản lý thông tin hiển thị với ứng viên và trên các tin tuyển dụng.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100 flex-wrap">
          <div
            onClick={() => document.getElementById('logo-upload').click()}
            className="w-25 h-25 rounded-3xl bg-[#EEF2FF] flex items-center justify-center text-[#1549B8] text-[32px] font-black relative cursor-pointer overflow-hidden border-2 border-dashed border-slate-200 shrink-0"
          >
            {logoPreview ? (
              <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
            ) : (
              form.companyName ? form.companyName.slice(0, 2).toUpperCase() : 'HR'
            )}
            
            <div className="absolute bottom-0 left-0 right-0 h-7 bg-black/40 flex items-center justify-center text-white">
              <Camera size={14} />
            </div>

            <input
              id="logo-upload"
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
            />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 mb-1">Logo công ty</h3>
            <p className="text-[13px] text-slate-400">Nhấp vào ô bên trái để tải ảnh lên. Định dạng JPG, PNG hoặc GIF.</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-5">
          <Field label="Tên công ty" required icon={Building}>
            <input
              value={form.companyName}
              onChange={e => handleChange('companyName', e.target.value)}
              className={`${inputStyle} ${companyNameTouched && companyNameError ? 'border-red-500!' : ''}`}
              placeholder="VD: Công ty TNHH NexCV"
            />
            {companyNameTouched && companyNameError && (
              <div className="flex items-center gap-1 mt-1.5 text-xs text-red-500">
                <AlertCircle size={12} /> {companyNameError}
              </div>
            )}
          </Field>
          <Field label="Lĩnh vực hoạt động" icon={Briefcase}>
            <input
              value={form.industry}
              onChange={e => handleChange('industry', e.target.value)}
              className={inputStyle}
              placeholder="VD: Công nghệ thông tin, Tài chính..."
            />
          </Field>
          <Field label="Email liên hệ" required icon={Mail}>
            <input
              value={form.email}
              onChange={e => handleChange('email', e.target.value)}
              className={`${inputStyle} ${emailTouched && emailError ? 'border-red-500!' : ''}`}
              type="email"
              placeholder="contact@company.com"
            />
            {emailTouched && emailError && (
              <div className="flex items-center gap-1 mt-1.5 text-xs text-red-500">
                <AlertCircle size={12} /> {emailError}
              </div>
            )}
          </Field>
          <Field label="Số điện thoại" icon={Phone}>
            <input
              value={form.phone}
              onChange={e => handleChange('phone', e.target.value)}
              className={`${inputStyle} ${phoneTouched && phoneError ? 'border-red-500!' : ''}`}
              placeholder="0901234567"
            />
            {phoneTouched && phoneError && (
              <div className="flex items-center gap-1 mt-1.5 text-xs text-red-500">
                <AlertCircle size={12} /> {phoneError}
              </div>
            )}
          </Field>
          <div className="col-span-full">
            <Field label="Website công ty" icon={Globe}>
              <input
                value={form.companyWebsite}
                onChange={e => handleChange('companyWebsite', e.target.value)}
                className={`${inputStyle} ${websiteTouched && websiteError ? 'border-red-500!' : ''}`}
                placeholder="https://www.yourcompany.com"
              />
              {websiteTouched && websiteError && (
                <div className="flex items-center gap-1 mt-1.5 text-xs text-red-500">
                  <AlertCircle size={12} /> {websiteError}
                </div>
              )}
            </Field>
          </div>
          <div className="col-span-full">
            <Field label="Mô tả công ty / Giới thiệu chung" icon={Building}>
              <textarea
                value={form.description}
                onChange={e => handleChange('description', e.target.value)}
                className={`${inputStyle} min-h-30 resize-y`}
                placeholder="Giới thiệu về công ty, văn hóa, môi trường làm việc..."
              />
            </Field>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-end pt-6 border-t border-slate-100 gap-3">
          {success && (
            <div className="text-sm text-emerald-600 font-semibold flex items-center gap-1.5">
              <CheckCircle2 size={18} /> Đã cập nhật thành công
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-6 py-3 rounded-xl border-none text-white text-sm font-bold transition-all whitespace-nowrap bg-linear-to-r from-blue-700 to-blue-500 shadow-lg shadow-blue-500/30 ${
              saving
                ? 'opacity-70 cursor-not-allowed'
                : 'cursor-pointer hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40'
            }`}
          >
            {saving ? <span className="inline-flex items-center gap-2"><Loader2 className="animate-spin" size={16} /> Đang lưu...</span> : <span className="inline-flex items-center gap-2"><Save size={16} /> Lưu thay đổi</span>}
          </button>
        </div>
      </div>
    </div>
  )
}
