import { useState, useEffect } from 'react'
import { adminService } from '../../services/adminService'
import { 
  Users, Briefcase, FileText, Download, TrendingUp, 
  MapPin, PieChart as PieChartIcon, BarChart as BarChartIcon,
  Calendar, ArrowUpRight, ArrowDownRight
} from 'lucide-react'
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Cell, Pie, Legend
} from 'recharts'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const COLORS = ['#1549B8', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE', '#EFF6FF']
const GRADE_COLORS = {
  'A (85-100)': '#10B981',
  'B (70-84)': '#3B82F6',
  'C (55-69)': '#F59E0B',
  'D (<55)': '#EF4444'
}

export default function AdminReportsPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const [period, setPeriod] = useState('month')

  const fetchData = async (p) => {
    setLoading(true)
    // Simulate API delay for different periods
    await new Promise(resolve => setTimeout(resolve, 600))
    adminService.getDashboard().then(res => {
      // Mock: tweak data slightly based on period
      let multiplier = p === 'year' ? 12 : p === 'quarter' ? 3 : 1
      const tweaked = {
          ...res,
          overview: {
              ...res.overview,
              totalUsers: Math.round(res.overview.totalUsers * multiplier * 0.8),
              activeJobs: Math.round(res.overview.activeJobs * multiplier * 0.7),
          }
      }
      setData(tweaked)
      setLoading(false)
    })
  }

  useEffect(() => {
    fetchData(period)
  }, [period])

  if (loading) return <div className="p-12 text-center text-slate-400">Đang tải dữ liệu báo cáo...</div>

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Báo cáo & Thống kê</h1>
          <p className="text-slate-500 mt-1">Phân tích chuyên sâu về dữ liệu hệ thống và người dùng</p>
        </div>
        <div className="flex gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="rounded-2xl font-bold bg-white w-[160px] h-10 border-slate-200 shadow-sm px-4">
              <Calendar size={16} className="mr-2 text-slate-400" />
              <SelectValue placeholder="Chọn thời gian" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
              <SelectItem value="month" className="font-bold">Tháng này</SelectItem>
              <SelectItem value="quarter" className="font-bold">Quý này</SelectItem>
              <SelectItem value="year" className="font-bold">Năm này</SelectItem>
            </SelectContent>
          </Select>
          <Button className="rounded-2xl h-10 font-bold bg-[#1549B8] hover:bg-[#1e40af] shadow-lg shadow-blue-100">
            <Download size={16} className="mr-2" /> Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Tổng người dùng', value: data.overview.totalUsers, growth: '+12%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Tin đang tuyển', value: data.overview.activeJobs, growth: '+5%', icon: Briefcase, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Lượt ứng tuyển', value: data.overview.totalApplications, growth: '+18%', icon: FileText, color: 'text-violet-600', bg: 'bg-violet-50' },
          { label: 'Điểm CV TB', value: data.overview.avgCVScore, growth: '+2%', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 ${kpi.bg} ${kpi.color} rounded-2xl flex items-center justify-center`}>
                <kpi.icon size={24} />
              </div>
              <div className="flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                <ArrowUpRight size={12} className="mr-1" /> {kpi.growth}
              </div>
            </div>
            <div className="text-[13px] font-bold text-slate-400 uppercase tracking-wider">{kpi.label}</div>
            <div className="text-3xl font-black text-slate-900 mt-1">{kpi.value.toLocaleString()}</div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* User Growth */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-slate-900">Tăng trưởng người dùng</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <div className="w-3 h-3 rounded-full bg-[#1549B8]" /> Ứng viên
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <div className="w-3 h-3 rounded-full bg-violet-400" /> Nhà tuyển dụng
              </div>
            </div>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.userGrowth}>
                <defs>
                  <linearGradient id="colorCand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1549B8" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#1549B8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600, fill: '#94A3B8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600, fill: '#94A3B8'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="candidates" stroke="#1549B8" strokeWidth={4} fillOpacity={1} fill="url(#colorCand)" />
                <Area type="monotone" dataKey="employers" stroke="#A78BFA" strokeWidth={4} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Job Categories */}
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
            <PieChartIcon size={20} className="text-[#1549B8]" /> Ngành nghề hot
          </h3>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.jobsByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {data.jobsByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {data.jobsByCategory.slice(0, 4).map((cat, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 font-bold text-slate-600">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  {cat.category}
                </div>
                <div className="font-black text-slate-900">{cat.pct}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CV Grade Distribution */}
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
            <BarChartIcon size={20} className="text-[#1549B8]" /> Chất lượng CV (Grade)
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.cvScoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="grade" axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight: 700, fill: '#64748B'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600, fill: '#94A3B8'}} />
                <Tooltip />
                <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                  {data.cvScoreDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={GRADE_COLORS[entry.grade] || '#3B82F6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Locations */}
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
            <MapPin size={20} className="text-[#1549B8]" /> Phân bố địa lý
          </h3>
          <div className="space-y-6">
            {data.topLocations.map((loc, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-slate-700">{loc.city}</span>
                  <span className="text-xs font-black text-slate-900">{loc.jobs} tin đăng · {loc.users} người dùng</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                    <div className="h-full bg-[#1549B8] transition-all" style={{ width: `${(loc.jobs/2000)*100}%` }} />
                    <div className="h-full bg-violet-400 transition-all opacity-50" style={{ width: `${(loc.users/2000)*100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
