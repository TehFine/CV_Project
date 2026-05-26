import { useState } from 'react'
import { Download, Eye, Edit3, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { DEFAULT_CV } from './components/constants'
import { CVPreview } from './components/CVPreview'
import { CVPDFDocument } from './components/CVPDFDocument'
import { EditorPanel } from './components/EditorPanel'

export default function CVBuilderPage() {
  const [cv, setCv] = useState(DEFAULT_CV)
  const [view, setView] = useState('split') // 'split' | 'preview' | 'edit'
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    // Khi có backend: await cvBuilderService.save(cv)
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
            <Button variant="outline" size="sm" onClick={handleSave} className="gap-1.5 border-[#E2E8F0] text-xs">
              <Save className="h-3.5 w-3.5" />
              {saved ? '✅ Đã lưu' : 'Lưu'}
            </Button>
            <PDFDownloadLink
              document={<CVPDFDocument cv={cv} />}
              fileName={`CV_${cv.personal?.name || 'CV'}.pdf`}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[#1549B8] hover:bg-[#1240A0] text-white no-underline cursor-pointer transition-colors"
            >
              {({ loading }) => (
                <>
                  <Download className="h-3.5 w-3.5" />
                  {loading ? '⏳ Đang tạo...' : 'Xuất PDF'}
                </>
              )}
            </PDFDownloadLink>
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
    </div>
  )
}