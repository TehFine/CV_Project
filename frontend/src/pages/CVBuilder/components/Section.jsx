import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export function Section({ title, icon, children }) {
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
