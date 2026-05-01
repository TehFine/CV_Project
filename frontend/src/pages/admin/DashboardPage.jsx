import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
    Users, Briefcase, FileText, TrendingUp, ArrowUpRight,
    Clock, CheckCircle2, AlertTriangle, UserCheck, BarChart2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { adminService } from '@/services/adminService'

// ── Mini bar chart (thuần SVG, không cần thư viện) ────────────────────────────
function MiniBarChart({ data, valueKey, labelKey, color = '#1549B8' }) {
    const max = Math.max(...data.map(d => d[valueKey]))
    return (
        <div className="flex items-end gap-1.5 h-20">
            {data.map((d, i) => {
                const pct = max > 0 ? (d[valueKey] / max) * 100 : 0
                return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#0F172A] text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            {d[labelKey]}: {d[valueKey].toLocaleString()}
                        </div>
                        <div className="w-full rounded-t-md transition-all duration-500" style={{ height: `${pct}%`, minHeight: 4, backgroundColor: color }} />
                    </div>
                )
            })}
        </div>
    )
}

// ── Donut chart ───────────────────────────────────────────────────────────────
function DonutChart({ data }) {
    const COLORS = ['#1549B8', '#7C3AED', '#F59E0B', '#EF4444']
    let cumulative = 0
    const total = data.reduce((s, d) => s + d.pct, 0)
    const r = 40, cx = 50, cy = 50, circumference = 2 * Math.PI * r

    return (
        <div className="flex items-center gap-5">
            <svg viewBox="0 0 100 100" className="w-28 h-28 flex-shrink-0" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F1F5F9" strokeWidth="14" />
                {data.map((d, i) => {
                    const dash = (d.pct / 100) * circumference
                    const offset = circumference - (cumulative / 100) * circumference
                    cumulative += d.pct
                    return (
                        <circle key={i} cx={cx} cy={cy} r={r} fill="none"
                            stroke={COLORS[i % COLORS.length]} strokeWidth="14"
                            strokeDasharray={`${dash} ${circumference - dash}`}
                            strokeDashoffset={offset}
                            strokeLinecap="butt"
                        />
                    )
                })}
            </svg>
            <div className="space-y-1.5 flex-1">
                {data.map((d, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="text-[#475569] flex-1 truncate">{d.grade || d.category}</span>
                        <span className="font-bold text-[#0F172A]">{d.pct}%</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon: Icon, color, bgColor, trend, link }) {
    return (
        <Link to={link || '#'} className="block">
            <Card className="border-[#E2E8F0] hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer group">
                <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bgColor }}>
                            <Icon className="h-5 w-5" style={{ color }} />
                        </div>
                        {trend !== undefined && (
                            <div className="flex items-center gap-1 text-xs font-semibold text-[#059669]">
                                <ArrowUpRight className="h-3.5 w-3.5" />
                                +{trend}%
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

export default function AdminDashboardPage() {
    const [data, setData] = useState(null)

    useEffect(() => { adminService.getDashboard().then(setData) }, [])

    if (!data) return (
        <div className="p-8 flex items-center justify-center min-h-[60vh]">
            <div className="w-8 h-8 border-4 border-[#1549B8] border-t-transparent rounded-full animate-spin" />
        </div>
    )

    const { overview, userGrowth, jobsByCategory, cvScoreDistribution, topLocations, recentActivities } = data

    const STATS = [
        { label: 'Tổng người dùng', value: overview.totalUsers, sub: `+${overview.newUsersThisMonth} tháng này`, icon: Users, color: '#1549B8', bgColor: '#EEF2FF', trend: 13, link: '/admin/users' },
        { label: 'Nhà tuyển dụng', value: overview.totalEmployers, sub: 'Đang hoạt động', icon: UserCheck, color: '#7C3AED', bgColor: '#F5F3FF', trend: 8, link: '/admin/users?role=employer' },
        { label: 'Tin tuyển dụng', value: overview.totalJobs, sub: `${overview.activeJobs.toLocaleString()} đang tuyển`, icon: Briefcase, color: '#059669', bgColor: '#ECFDF5', trend: 21, link: '/admin/jobs' },
        { label: 'CV đã chấm điểm', value: overview.totalCVScores, sub: `Điểm TB: ${overview.avgCVScore}`, icon: FileText, color: '#D97706', bgColor: '#FFFBEB', trend: 18, link: '/admin/cv-scores' },
    ]

    const ACTIVITY_COLORS = {
        new_user: { bg: '#EEF2FF', text: '#1549B8' },
        new_job: { bg: '#ECFDF5', text: '#059669' },
        cv_score: { bg: '#F5F3FF', text: '#7C3AED' },
        report: { bg: '#FEF2F2', text: '#DC2626' },
        new_employer: { bg: '#FFFBEB', text: '#D97706' },
        application: { bg: '#F0FDF4', text: '#16A34A' },
    }

    return (
        <div className="p-6 space-y-6">
            {/* Welcome */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-black text-[#0F172A]">Tổng quan hệ thống</h1>
                    <p className="text-sm text-[#94A3B8] mt-0.5">
                        Cập nhật lần cuối: {new Date().toLocaleString('vi-VN')}
                    </p>
                </div>
                <Button asChild size="sm" className="bg-[#1549B8] hover:bg-[#1240A0] text-white gap-2">
                    <Link to="/admin/reports"><BarChart2 className="h-4 w-4" />Xem báo cáo đầy đủ</Link>
                </Button>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {STATS.map(s => <StatCard key={s.label} {...s} />)}
            </div>

            {/* Pending alert */}
            <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                <div className="flex-1">
                    <p className="text-sm font-semibold text-amber-800">Cần xử lý: <span className="text-amber-600">1 nhà tuyển dụng chờ xác minh</span> · <span className="text-amber-600">1 tin tuyển dụng chờ duyệt</span> · <span className="text-red-600">1 tin bị báo cáo</span></p>
                </div>
                <Button asChild size="sm" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100 flex-shrink-0">
                    <Link to="/admin/jobs?status=pending">Xem ngay</Link>
                </Button>
            </div>

            {/* Charts row */}
            <div className="grid lg:grid-cols-3 gap-5">
                {/* User growth chart */}
                <Card className="lg:col-span-2 border-[#E2E8F0]">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-sm font-bold text-[#0F172A]">📈 Tăng trưởng người dùng</CardTitle>
                            <div className="flex gap-3 text-xs text-[#94A3B8]">
                                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#1549B8] inline-block" />Ứng viên</span>
                                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED] inline-block" />NTD</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="flex gap-3 h-28 items-end">
                            {userGrowth.map((d, i) => {
                                const maxC = Math.max(...userGrowth.map(x => x.candidates))
                                const maxE = Math.max(...userGrowth.map(x => x.employers))
                                const hC = (d.candidates / maxC) * 80
                                const hE = (d.employers / maxE) * 80
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                                        <div className="w-full flex gap-0.5 items-end" style={{ height: 80 }}>
                                            <div className="flex-1 rounded-t-sm bg-[#1549B8] transition-all" style={{ height: hC }} />
                                            <div className="flex-1 rounded-t-sm bg-[#7C3AED] transition-all" style={{ height: hE }} />
                                        </div>
                                        <span className="text-[10px] text-[#94A3B8]">{d.month}</span>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-[#F1F5F9]">
                            <div className="text-center">
                                <div className="text-lg font-black text-[#0F172A]">{overview.totalUsers.toLocaleString()}</div>
                                <div className="text-xs text-[#94A3B8]">Tổng ứng viên</div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-black text-[#7C3AED]">{overview.totalEmployers}</div>
                                <div className="text-xs text-[#94A3B8]">Nhà tuyển dụng</div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-black text-[#059669]">+{overview.newUsersThisMonth}</div>
                                <div className="text-xs text-[#94A3B8]">Mới tháng này</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* CV score distribution */}
                <Card className="border-[#E2E8F0]">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold text-[#0F172A]">✨ Phân phối điểm CV</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <DonutChart data={cvScoreDistribution} />
                        <Separator className="my-3" />
                        <div className="text-center">
                            <div className="text-2xl font-black text-[#1549B8]">{overview.avgCVScore}</div>
                            <div className="text-xs text-[#94A3B8]">Điểm trung bình</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom row */}
            <div className="grid lg:grid-cols-3 gap-5">
                {/* Jobs by category */}
                <Card className="border-[#E2E8F0]">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold text-[#0F172A]">💼 Tin theo ngành nghề</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-2.5">
                        {jobsByCategory.map((cat, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-[#475569] truncate flex-1">{cat.category}</span>
                                    <span className="font-bold text-[#0F172A] ml-2">{cat.count.toLocaleString()}</span>
                                </div>
                                <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                                    <div className="h-full rounded-full bg-[#1549B8] transition-all duration-700"
                                        style={{ width: `${cat.pct}%` }} />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Top locations */}
                <Card className="border-[#E2E8F0]">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold text-[#0F172A]">📍 Theo địa điểm</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="space-y-3">
                            {topLocations.map((loc, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-[#EEF2FF] flex items-center justify-center text-xs font-black text-[#1549B8] flex-shrink-0">
                                        {i + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-semibold text-[#0F172A] truncate">{loc.city}</div>
                                        <div className="text-xs text-[#94A3B8]">{loc.jobs.toLocaleString()} việc · {loc.users} NTD</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent activity */}
                <Card className="border-[#E2E8F0]">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-sm font-bold text-[#0F172A]">🕐 Hoạt động gần đây</CardTitle>
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="space-y-3">
                            {recentActivities.map(act => {
                                const s = ACTIVITY_COLORS[act.type] || ACTIVITY_COLORS.new_user
                                return (
                                    <div key={act.id} className="flex gap-3 items-start">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                                            style={{ backgroundColor: s.bg }}>
                                            {act.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-[#0F172A] leading-snug">{act.message}</p>
                                            <p className="text-[10px] text-[#94A3B8] mt-0.5 flex items-center gap-1">
                                                <Clock className="h-2.5 w-2.5" />{act.time}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}