import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { authService } from '../../services/authService'
import { Building, Mail, Phone, Globe, Briefcase, Camera, CheckCircle2 } from 'lucide-react'

function Field({ label, required, children, icon: Icon }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, color: '#0F172A', marginBottom: 8 }}>
        {Icon && <Icon size={16} color="#64748B" />}
        {label} {required && <span style={{ color: '#EF4444' }}>*</span>}
      </label>
      {children}
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '12px 14px', border: '1.5px solid #E2E8F0', borderRadius: 10,
  fontSize: 14, fontFamily: 'inherit', color: '#0F172A', boxSizing: 'border-box',
  outline: 'none', transition: 'all 0.2s', backgroundColor: '#F8FAFC'
}

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
    <div style={{ padding: '40px 20px', maxWidth: 800, margin: '0 auto', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0F172A', marginBottom: 8 }}>Hồ sơ Công ty</h1>
        <p style={{ color: '#64748B', fontSize: 15 }}>Quản lý thông tin hiển thị với ứng viên và trên các tin tuyển dụng.</p>
      </div>

      <div style={{ background: 'white', borderRadius: 20, border: '1px solid #E2E8F0', padding: 40, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 40, paddingBottom: 32, borderBottom: '1px solid #F1F5F9' }}>
          <div 
            onClick={() => document.getElementById('logo-upload').click()}
            style={{ 
              width: 100, height: 100, borderRadius: 24, backgroundColor: '#EEF2FF', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              color: '#1549B8', fontSize: 32, fontWeight: 900, position: 'relative',
              cursor: 'pointer', overflow: 'hidden', border: '2px dashed #E2E8F0'
            }}
          >
            {logoPreview ? (
              <img src={logoPreview} alt="Logo preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              form.companyName ? form.companyName.slice(0, 2).toUpperCase() : 'HR'
            )}
            
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 28,
              backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: 'white'
            }}>
              <Camera size={14} />
            </div>

            <input 
              id="logo-upload"
              type="file" 
              accept="image/*" 
              onChange={handleLogoChange} 
              style={{ display: 'none' }} 
            />
          </div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>Logo công ty</h3>
            <p style={{ fontSize: 13, color: '#94A3B8' }}>Nhấp vào ô bên trái để tải ảnh lên. Định dạng JPG, PNG hoặc GIF.</p>
          </div>
        </div>

        {/* Form Fields */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <Field label="Tên công ty" required icon={Building}>
            <input 
              value={form.companyName} 
              onChange={e => handleChange('companyName', e.target.value)} 
              style={inputStyle} 
              placeholder="VD: Công ty TNHH NexCV"
              onFocus={e => { e.target.style.borderColor = '#1549B8'; e.target.style.backgroundColor = 'white' }}
              onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.backgroundColor = '#F8FAFC' }}
            />
          </Field>
          <Field label="Lĩnh vực hoạt động" icon={Briefcase}>
            <input 
              value={form.industry} 
              onChange={e => handleChange('industry', e.target.value)} 
              style={inputStyle} 
              placeholder="VD: Công nghệ thông tin, Tài chính..."
              onFocus={e => { e.target.style.borderColor = '#1549B8'; e.target.style.backgroundColor = 'white' }}
              onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.backgroundColor = '#F8FAFC' }}
            />
          </Field>
          <Field label="Email liên hệ" required icon={Mail}>
            <input 
              value={form.email} 
              onChange={e => handleChange('email', e.target.value)} 
              style={inputStyle} 
              type="email"
              placeholder="contact@company.com"
              onFocus={e => { e.target.style.borderColor = '#1549B8'; e.target.style.backgroundColor = 'white' }}
              onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.backgroundColor = '#F8FAFC' }}
            />
          </Field>
          <Field label="Số điện thoại" icon={Phone}>
            <input 
              value={form.phone} 
              onChange={e => handleChange('phone', e.target.value)} 
              style={inputStyle} 
              placeholder="0901234567"
              onFocus={e => { e.target.style.borderColor = '#1549B8'; e.target.style.backgroundColor = 'white' }}
              onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.backgroundColor = '#F8FAFC' }}
            />
          </Field>
          <div style={{ gridColumn: '1 / -1' }}>
            <Field label="Website công ty" icon={Globe}>
              <input 
                value={form.companyWebsite} 
                onChange={e => handleChange('companyWebsite', e.target.value)} 
                style={inputStyle} 
                placeholder="https://www.yourcompany.com"
                onFocus={e => { e.target.style.borderColor = '#1549B8'; e.target.style.backgroundColor = 'white' }}
                onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.backgroundColor = '#F8FAFC' }}
              />
            </Field>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <Field label="Mô tả công ty / Giới thiệu chung" icon={Building}>
              <textarea 
                value={form.description} 
                onChange={e => handleChange('description', e.target.value)} 
                style={{ ...inputStyle, minHeight: 120, resize: 'vertical' }} 
                placeholder="Giới thiệu về công ty, văn hóa, môi trường làm việc..."
                onFocus={e => { e.target.style.borderColor = '#1549B8'; e.target.style.backgroundColor = 'white' }}
                onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.backgroundColor = '#F8FAFC' }}
              />
            </Field>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 24, borderTop: '1px solid #F1F5F9' }}>
          <div style={{ fontSize: 14, color: '#10B981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, opacity: success ? 1 : 0, transition: 'opacity 0.3s' }}>
            <CheckCircle2 size={18} /> Đã cập nhật thành công
          </div>
          <button 
            onClick={handleSave} 
            disabled={saving}
            style={{
              padding: '12px 32px', borderRadius: 12, border: 'none',
              background: 'linear-gradient(135deg, #1E40AF, #3B82F6)', color: 'white',
              fontSize: 15, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(59,130,246,0.3)', transition: 'all 0.2s',
              opacity: saving ? 0.7 : 1
            }}
          >
            {saving ? '⏳ Đang lưu...' : '💾 Lưu thay đổi'}
          </button>
        </div>
      </div>
    </div>
  )
}
