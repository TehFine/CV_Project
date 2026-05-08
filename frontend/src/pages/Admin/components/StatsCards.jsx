import { Link } from 'react-router-dom'
import { Users, Briefcase, FileText, TrendingUp, ArrowUpRight, BarChart2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function StatCard({ label, value, sub, icon: Icon, color, bgColor, trend, link }) {
  return (
    <Link to={link || '#'} className="block">
      <Card className="border-[#E2E8F0] hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer group">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: bgColor }}>
              <Icon className="h-5 w-5" style={{ color }} />
            </div>
            {trend !== undefined && (
              <div className="flex items-center gap-1 text-xs font-semibold text-[#059669]">
                <ArrowUpRight className="h-3.5 w-3.5" />+{trend}%
              </div>
            )}
          </div>
          <div className="text-2xl font-black text-[#0F172A] mb-0.5">{value?.toLocaleString()}</div>
          <div className="text-sm font-medium text-[#475569]">{label}</div>
          {sub && <div className="text-xs text-[#94A3B8] mt-0.5">{sub}</div>}
        </CardContent>
      </Card>
    </Link>
  )
}

export function StatsRow({ overview }) {
  const STATS = [
    { label: 'Tổng người dùng', value: overview.totalUsers, sub: `+${overview.newUsersThisMonth} tháng này`, icon: Users, color: '#1549B8', bgColor: '#EEF2FF', trend: 13, link: '/admin/users' },
    { label: 'Nhà tuyển dụng', value: overview.totalEmployers, sub: 'Đang hoạt động', icon: TrendingUp, color: '#7C3AED', bgColor: '#F5F3FF', trend: 8, link: '/admin/users?role=employer' },
    { label: 'Tin tuyển dụng', value: overview.totalJobs, sub: `${overview.activeJobs?.toLocaleString()} đang tuyển`, icon: Briefcase, color: '#059669', bgColor: '#ECFDF5', trend: 21, link: '/admin/jobs' },
    { label: 'CV đã chấm điểm', value: overview.totalCVScores, sub: `Điểm TB: ${overview.avgCVScore}`, icon: FileText, color: '#D97706', bgColor: '#FFFBEB', trend: 18, link: '/admin/cv-scores' },
  ]
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {STATS.map(s => <StatCard key={s.label} {...s} />)}
    </div>
  )
}

export function DashboardHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-black text-[#0F172A]">Tổng quan hệ thống</h1>
        <p className="text-sm text-[#94A3B8] mt-0.5">Cập nhật lần cuối: {new Date().toLocaleString('vi-VN')}</p>
      </div>
      <Button asChild size="sm" className="bg-[#1549B8] hover:bg-[#1240A0] text-white gap-2">
        <Link to="/admin/reports"><BarChart2 className="h-4 w-4" />Xem báo cáo đầy đủ</Link>
      </Button>
    </div>
  )
}
