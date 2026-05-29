import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

export default function StatCard({ icon, label, value, sub, color = '#3B82F6', to, className }) {
  const content = (
    <div
      className={cn(
        'bg-white rounded-2xl border border-border p-5 flex items-center gap-4 transition-all duration-200',
        to && 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer',
        className
      )}
    >
      <div
        className="flex items-center justify-center rounded-xl size-11 shrink-0 text-xl"
        style={{ backgroundColor: color + '18' }}
      >
        {icon}
      </div>
      <div>
        <div className="text-[26px] font-black text-[#0F172A] leading-none">{value}</div>
        <div className="text-xs text-muted-foreground mt-0.5 font-medium">{label}</div>
        {sub && (
          <div className="text-[11px] font-semibold mt-0.5" style={{ color }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  )

  return to ? <Link to={to} className="no-underline">{content}</Link> : content
}
