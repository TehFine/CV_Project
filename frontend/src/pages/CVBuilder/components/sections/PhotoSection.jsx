import { useRef } from 'react'
import { Upload, Trash2, User } from 'lucide-react'
import { Section } from '../Section'

export function PhotoSection({ photo, onChange }) {
  const inputRef = useRef(null)

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => onChange(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleRemove = () => {
    onChange('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <Section title="Ảnh CV" icon="🖼️">
      <div className="flex items-center gap-4">
        {/* Preview */}
        <div
          className="w-20 h-20 rounded-full border-2 border-dashed border-[#CBD5E1] bg-[#F8FAFC] flex items-center justify-center shrink-0 overflow-hidden"
          style={{ minWidth: 80 }}
        >
          {photo ? (
            <img
              src={photo}
              alt="Ảnh CV"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-8 h-8 text-[#CBD5E1]" />
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-2 flex-1">
          <p className="text-xs text-[#64748B] leading-relaxed">
            Ảnh chân dung rõ mặt, nền trắng hoặc nền đơn giản.
            <br />
            Định dạng: JPG, PNG. Tối đa 2MB.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[#1549B8] text-white hover:bg-[#1240A0] transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              {photo ? 'Đổi ảnh' : 'Tải ảnh lên'}
            </button>
            {photo && (
              <button
                onClick={handleRemove}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Xóa
              </button>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFile}
          />
        </div>
      </div>
    </Section>
  )
}
