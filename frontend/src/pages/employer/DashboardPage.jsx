import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, Users, Eye, TrendingUp, PlusCircle, ChevronRight } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { employerService } from '@/services/employerService'

const STATUS_BADGE = {
  pending:     { label: 'Chờ xem xét', bg: '#FFFBEB', text: '#D97706', border: '#FDE68A' },
  shortlisted: { label: 'Đã chọn',     bg: '#EEF2FF', text: '#1549B8', border: '#C7D2FE' },
  rejected:    { label: 'Từ chối',     bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' },
  hired:       { label: 'Đã tuyển',    bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' },
}

export default function EmployerDashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)

  useEffect(() => { employerService.getDashboard().then(setData) }, [])

  if (!data) return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#1549B8] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const STATS = [
    { label: 'Tin đang tuyển',     value: data.activeJobs,        icon: Briefcase, color: '#EEF2FF', text: '#1549B8' },
    { label: 'Tổng ứng tuyển',     value: data.totalApplications, icon: Users,     color: '#F5F3FF', text: '#7C3AED' },
    { label: 'Chờ xem xét',        value: data.pendingReview,     icon: Eye,       color: '#FFFBEB', text: '#D97706' },
    { label: 'Đã tuyển thành công',value: data.hired,             icon: TrendingUp,color: '#ECFDF5', text: '#059669' },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#0F172A] to-[#1549B8] py-10">
        <div className="container-app">
          <h1 className="text-2xl font-black text-white mb-1">
            Xin chào, {user?.name?.split(' ').slice(-1)[0]}! 👋
          </h1>
          <p className="text-blue-200 text-sm">{user?.companyName} — Nhà tuyển dụng</p>
        </div>
      </div>

      <div className="container-app py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-[#E2E8F0] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.color }}>
                  <s.icon className="h-5 w-5" style={{ color: s.text }} />
                </div>
                <span className="text-2xl font-black" style={{ color: s.text }}>{s.value}</span>
              </div>
              <p className="text-xs text-[#475569] font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          {/* Quick actions */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
            <h2 className="font-bold text-[#0F172A] mb-4">Thao tác nhanh</h2>
            <div className="space-y-2">
              {[
                { to: '/employer/post-job',   icon: '➕', label: 'Đăng tin tuyển dụng mới', color: 'bg-[#EEF2FF] text-[#1549B8]' },
                { to: '/employer/candidates', icon: '👥', label: 'Xem tất cả ứng viên',      color: 'bg-[#F5F3FF] text-[#7C3AED]' },
                { to: '/employer/jobs',       icon: '📋', label: 'Quản lý tin tuyển dụng',   color: 'bg-[#ECFDF5] text-[#059669]' },
              ].map(action => (
                <Link key={action.to} to={action.to}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F8FAFC] transition-colors group">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0 ${action.color}`}>
                    {action.icon}
                  </div>
                  <span className="text-sm font-medium text-[#0F172A] group-hover:text-[#1549B8] transition-colors">
                    {action.label}
                  </span>
                  <ChevronRight className="h-4 w-4 text-[#94A3B8] ml-auto" />
                </Link>
              ))}
            </div>
          </div>

          {/* Recent applications */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-[#0F172A]">Ứng tuyển gần đây</h2>
              <Link to="/employer/candidates" className="text-xs text-[#1549B8] hover:underline font-medium">
                Xem tất cả →
              </Link>
            </div>
            <div className="space-y-3">
              {data.recentApplications.map(c => {
                const s = STATUS_BADGE[c.status] || STATUS_BADGE.pending
                return (
                  <div key={c.id} className="flex items-center gap-3 py-2 border-b border-[#F1F5F9] last:border-0">
                    <div className="w-9 h-9 rounded-full bg-[#EEF2FF] flex items-center justify-center font-bold text-xs text-[#1549B8] flex-shrink-0">
                      {c.name.split(' ').slice(-1)[0].slice(0,2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#0F172A] truncate">{c.name}</p>
                      <p className="text-xs text-[#94A3B8]">{c.title} · {c.appliedJob}</p>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full border flex-shrink-0"
                      style={{ backgroundColor: s.bg, color: s.text, borderColor: s.border }}>
                      {s.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}