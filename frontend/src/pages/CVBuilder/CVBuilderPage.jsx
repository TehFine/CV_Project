import { useState, useRef } from 'react'
import { Download, Eye, Edit3, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useReactToPrint } from 'react-to-print'
import { DEFAULT_CV } from './components/constants'
import { CVPreview } from './components/CVPreview'
import { EditorPanel } from './components/EditorPanel'

export default function CVBuilderPage() {
  const [cv, setCv] = useState(DEFAULT_CV)
  const [view, setView] = useState('split') // 'split' | 'preview' | 'edit'
  const [saved, setSaved] = useState(false)

  const componentRef = useRef(null)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    // Khi có backend: await cvBuilderService.save(cv)
  }

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: cv.personal?.name ? `CV_${cv.personal.name}` : 'CV',
  })

  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      {/* Container ẩn được dành riêng cho việc in ấn */}
      <div style={{ display: 'none' }}>
        <div ref={componentRef}>
          <CVPreview cv={cv} />
        </div>
      </div>

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
    </div>
  )
}