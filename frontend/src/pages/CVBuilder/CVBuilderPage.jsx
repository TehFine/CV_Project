import { useState, useEffect } from 'react'
import { Download, Eye, Edit3, Save, AlertCircle, X, Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { DEFAULT_CV } from './components/constants'
import { CVPreview } from './components/CVPreview'
import { CVPDFDocument } from './components/CVPDFDocument'
import { EditorPanel } from './components/EditorPanel'
import { authService } from '@/services/authService'
import { useAuth } from '@/context/AuthContext'

// Các trường bắt buộc và tên hiển thị
const REQUIRED_FIELDS = [
  { path: 'personal.name',     label: 'Họ và tên' },
  { path: 'personal.phone',    label: 'Số điện thoại' },
  { path: 'personal.email',    label: 'Email' },
  { path: 'personal.location', label: 'Địa chỉ / Thành phố' },
  { path: 'personal.title',    label: 'Chức danh / Vị trí ứng tuyển' },
  { path: 'personal.summary',  label: 'Giới thiệu bản thân' },
]

function getField(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj)
}

function validateCV(cv) {
  const errors = []
  for (const field of REQUIRED_FIELDS) {
    const value = getField(cv, field.path)
    if (!value || String(value).trim() === '') {
      errors.push(field.label)
    }
  }
  // Phải có ít nhất 1 kinh nghiệm hoặc 1 học vấn
  const hasExp = cv.experience?.length > 0 && cv.experience.some(e => e.company?.trim())
  const hasEdu = cv.education?.length > 0 && cv.education.some(e => e.school?.trim())
  if (!hasExp && !hasEdu) {
    errors.push('Kinh nghiệm làm việc hoặc Học vấn (cần ít nhất 1 mục)')
  }
  // Phải có kỹ năng
  if (!cv.skills?.length || !cv.skills.some(s => s.items?.trim())) {
    errors.push('Kỹ năng (cần ít nhất 1 nhóm kỹ năng)')
  }
  return errors
}

export default function CVBuilderPage() {
  const [cv, setCv] = useState(DEFAULT_CV)
  const [view, setView] = useState('split')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showErrors, setShowErrors] = useState(false)
  const { isAuthenticated } = useAuth()

  const STORAGE_KEY = 'nexcv_cv_builder_draft'

  // Load saved CV on mount
  useEffect(() => {
    const loadSavedCV = async () => {
      if (isAuthenticated) {
        // Load from server for authenticated users
        try {
          const profile = await authService.getProfile(localStorage.getItem('nexcv_token'))
          const user = profile?.data || profile
          if (user?.cvBuilderData) {
            setCv(user.cvBuilderData)
            return
          }
        } catch { /* ignore, fall through to localStorage */ }
      }
      // Fallback: load from localStorage (guest or server empty)
      try {
        const draft = localStorage.getItem(STORAGE_KEY)
        if (draft) setCv(JSON.parse(draft))
      } catch { /* ignore */ }
    }
    loadSavedCV()
  }, [isAuthenticated]) // eslint-disable-line

  // Derived — re-computed on every render, always up to date
  const currentErrors = validateCV(cv)
  const isValid = currentErrors.length === 0

  const handleSave = async () => {
    setSaving(true)
    try {
      // Always save to localStorage as a fast local backup
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cv))
      // If logged in, also persist to server profile
      if (isAuthenticated) {
        await authService.updateProfile({ cvBuilderData: cv })
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch {
      /* silent fail, localStorage already saved */
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } finally {
      setSaving(false)
    }
  }

  const handleExportClick = () => {
    if (!isValid) {
      setShowErrors(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    // If valid, PDFDownloadLink renders and handles the click itself
  }

  const handleCvChange = (newCv) => {
    setCv(newCv)
    // Auto-hide error banner once all fields are filled
    if (showErrors && validateCV(newCv).length === 0) {
      setShowErrors(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9]">

      {/* Validation Error Banner */}
      {showErrors && currentErrors.length > 0 && (
        <div className="sticky top-16 z-20 bg-red-50 border-b-2 border-red-200 shadow-md">
          <div className="container-app py-3 px-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-red-700 text-sm mb-1">
                  Vui lòng điền đầy đủ các thông tin bắt buộc trước khi xuất PDF:
                </p>
                <ul className="flex flex-wrap gap-x-4 gap-y-1">
                  {currentErrors.map((err, i) => (
                    <li key={i} className="flex items-center gap-1 text-xs text-red-600 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                      {err}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => setShowErrors(false)}
                className="shrink-0 text-red-400 hover:text-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-white border-b border-[#E2E8F0] shadow-sm sticky top-16 z-10">
        <div className="container-app h-12 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-[#0F172A] flex items-center gap-1.5"><Edit3 className="h-4 w-4" /> Tạo CV</span>
            <span className="text-[#94A3B8] text-xs">— Template cơ bản</span>
          </div>

          {/* View toggle */}
          <div className="hidden md:flex items-center gap-1 bg-[#F1F5F9] rounded-lg p-1">
            {[
              { key: 'edit', label: 'Chỉnh sửa', icon: Edit3 },
              { key: 'split', label: 'Chia đôi', icon: null },
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
            <Button variant="outline" size="sm" onClick={handleSave} disabled={saving} className="gap-1.5 border-[#E2E8F0] text-xs">
              <Save className="h-3.5 w-3.5" />
              {saving ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Đang lưu...</> : saved ? <><CheckCircle2 className="h-3.5 w-3.5" /> Đã lưu</> : <><Save className="h-3.5 w-3.5" />{isAuthenticated ? 'Lưu' : 'Lưu'}</>}
            </Button>

            {/* Export button — always re-checks current cv state */}
            {isValid ? (
              <PDFDownloadLink
                document={<CVPDFDocument cv={cv} />}
                fileName={`CV_${cv.personal?.name || 'CV'}.pdf`}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[#1549B8] hover:bg-[#1240A0] text-white no-underline cursor-pointer transition-colors"
              >
                {({ loading }) => (
                  <>
                    <Download className="h-3.5 w-3.5" />
                    {loading ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Đang tạo...</> : 'Xuất PDF'}
                  </>
                )}
              </PDFDownloadLink>
            ) : (
              <button
                onClick={handleExportClick}
                className={cn(
                  'inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                  showErrors
                    ? 'bg-red-100 text-red-600 border border-red-300 hover:bg-red-200'
                    : 'bg-[#1549B8] hover:bg-[#1240A0] text-white'
                )}
              >
                <Download className="h-3.5 w-3.5" />                  {showErrors ? <><AlertCircle className="h-3.5 w-3.5" />{currentErrors.length} thiếu</> : 'Xuất PDF'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="container-app py-5 px-4 md:px-6">
        {/* View toggle - show on mobile too */}
        <div className="flex md:hidden items-center gap-1 bg-white border border-[#E2E8F0] rounded-lg p-1 mb-4 overflow-x-auto">
          {[
            { key: 'edit', label: '✏️ Sửa' },
            { key: 'split', label: '🔄 Đôi' },
            { key: 'preview', label: '👁️ Xem' },
          ].map(v => (
            <button key={v.key} onClick={() => setView(v.key)}
              className={cn('flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap',
                view === v.key ? 'bg-[#1549B8] text-white shadow-sm' : 'text-[#94A3B8] hover:text-[#475569]')}>
              {v.label}
            </button>
          ))}
        </div>

        {/* Split view (default) */}
        {view === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(300px,650px)] gap-5 items-start">
            <div className="space-y-0 overflow-y-auto max-h-[calc(100vh-12rem)] lg:max-h-[calc(100vh-9rem)] pr-1">
              <EditorPanel cv={cv} onChange={handleCvChange} />
            </div>
            <div className="lg:sticky lg:top-[7rem] overflow-auto max-h-none lg:max-h-[calc(100vh-9rem)] rounded-xl shadow-xl ring-1 ring-[#E2E8F0]">
              <CVPreview cv={cv} />
            </div>
          </div>
        )}

        {view === 'edit' && (
          <div className="max-w-2xl mx-auto">
            <EditorPanel cv={cv} onChange={handleCvChange} />
          </div>
        )}

        {view === 'preview' && (
          <div className="max-w-full lg:max-w-[780px] mx-auto shadow-xl rounded-xl overflow-hidden ring-1 ring-[#E2E8F0]">
            <CVPreview cv={cv} />
          </div>
        )}
      </div>
    </div>
  )
}