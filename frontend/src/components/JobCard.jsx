import { useNavigate } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

// Company logo background colors cycling
const LOGO_COLORS = [
  { bg: '#EEF2FF', text: '#1549B8' },
  { bg: '#F5F3FF', text: '#7C3AED' },
  { bg: '#ECFDF5', text: '#059669' },
  { bg: '#FFF7ED', text: '#EA580C' },
  { bg: '#FEF2F2', text: '#DC2626' },
  { bg: '#F0FDF4', text: '#16A34A' },
]

const LEVEL_BADGE = {
  Intern:       { bg: '#F1F5F9', text: '#64748B', border: '#E2E8F0' },
  Junior:       { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' },
  Middle:       { bg: '#EEF2FF', text: '#1549B8', border: '#C7D2FE' },
  Senior:       { bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA' },
  'Lead/Manager': { bg: '#FDF4FF', text: '#7E22CE', border: '#E9D5FF' },
}

export default function JobCard({ job, index = 0 }) {
  const navigate = useNavigate()
  const daysAgo  = Math.floor((Date.now() - new Date(job.postedAt)) / 86400000)
  const logoColor = LOGO_COLORS[index % LOGO_COLORS.length]
  const levelStyle = LEVEL_BADGE[job.level] || LEVEL_BADGE.Middle

  return (
    <Card
      className="cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-200 border-[#E2E8F0] overflow-hidden group"
      onClick={() => navigate(`/jobs/${job.id}`)}
    >
      {/* Top accent line for featured */}
      {job.featured && (
        <div className="h-[3px] bg-gradient-to-r from-[#1549B8] to-[#7C3AED]" />
      )}

      <CardContent className="p-5">
        {/* Header row */}
        <div className="flex gap-3 mb-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 transition-transform group-hover:scale-105"
            style={{ backgroundColor: logoColor.bg, color: logoColor.text }}
          >
            {job.company.slice(0, 2).toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-sm text-[#0F172A] leading-snug group-hover:text-[#1549B8] transition-colors truncate">
                {job.title}
              </h3>
              {job.featured && (
                <span className="flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EEF2FF] text-[#1549B8] border border-[#C7D2FE]">
                  Nổi bật
                </span>
              )}
            </div>
            <p className="text-xs text-[#475569] mt-0.5 font-medium">{job.company}</p>
          </div>
        </div>

        {/* Info badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="flex items-center gap-1 text-[11px] text-[#475569] bg-[#F1F5F9] px-2 py-1 rounded-md">
            <MapPin className="h-2.5 w-2.5 text-[#94A3B8]" />{job.location}
          </span>
          <span className="text-[11px] text-[#059669] bg-[#ECFDF5] px-2 py-1 rounded-md font-semibold border border-[#A7F3D0]">
            💰 {job.salary}
          </span>
          <span
            className="text-[11px] px-2 py-1 rounded-md font-medium border"
            style={{ backgroundColor: levelStyle.bg, color: levelStyle.text, borderColor: levelStyle.border }}
          >
            {job.level}
          </span>
        </div>

        {/* Skill tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {job.tags.map(t => (
            <span key={t} className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#EEF2FF] text-[#1549B8] border border-[#C7D2FE]">
              {t}
            </span>
          ))}
        </div>

        <Separator className="mb-2.5 bg-[#F1F5F9]" />

        <div className="flex justify-between text-xs text-[#94A3B8]">
          <span>{daysAgo === 0 ? 'Hôm nay' : `${daysAgo} ngày trước`}</span>
          <span>{job.applied} đã ứng tuyển</span>
        </div>
      </CardContent>
    </Card>
  )
}