import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { Search, Filter, X, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import JobCard from '@/components/JobCard'
import { jobService, JOB_CATEGORIES } from '@/services/jobService'
import { cn } from '@/lib/utils'

const LEVELS    = ['Intern','Junior','Middle','Senior','Lead/Manager']
const JOB_TYPES = ['Toàn thời gian','Bán thời gian','Remote','Freelance']
const LOCATIONS = ['TP. Hồ Chí Minh','Hà Nội','Đà Nẵng','Cần Thơ']

function Sidebar({ filters, onChange }) {
  const hasFilters = ['category','level','type','location'].some(k => filters[k])
  const toggle = (key, val) => onChange({ ...filters, [key]: filters[key] === val ? '' : val })

  const Group = ({ title, items, fkey }) => (
    <div className="mb-5">
      <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2">{title}</p>
      {items.map(item => {
        const val    = typeof item === 'string' ? item : item.name
        const active = filters[fkey] === val
        return (
          <label key={val} className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-[#F1F5F9] cursor-pointer transition-colors">
            <input type="radio" name={fkey} checked={active} onChange={() => toggle(fkey, val)}
              className="accent-[#1549B8] w-3.5 h-3.5" />
            <span className={cn('text-sm transition-colors flex-1', active ? 'text-[#1549B8] font-semibold' : 'text-[#475569]')}>
              {val}
            </span>
            {typeof item !== 'string' && item.count && (
              <span className="text-[11px] text-[#94A3B8] bg-[#F1F5F9] px-1.5 py-0.5 rounded-full">{item.count}</span>
            )}
          </label>
        )
      })}
    </div>
  )

  return (
    <aside className="hidden lg:block w-56 flex-shrink-0">
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 sticky top-20">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 font-bold text-sm text-[#0F172A]">
            <Filter className="h-4 w-4 text-[#1549B8]" />Bộ lọc
          </div>
          {hasFilters && (
            <button onClick={() => onChange({ ...filters, category:'', level:'', type:'', location:'' })}
              className="text-xs text-red-500 hover:underline flex items-center gap-1">
              <X className="h-3 w-3" />Xóa lọc
            </button>
          )}
        </div>
        <Separator className="mb-4" />
        <Group title="Địa điểm"  items={LOCATIONS}               fkey="location" />
        <Group title="Ngành nghề" items={JOB_CATEGORIES.slice(0,5)} fkey="category" />
        <Group title="Cấp bậc"   items={LEVELS}                  fkey="level" />
        <Group title="Hình thức" items={JOB_TYPES}               fkey="type" />
      </div>
    </aside>
  )
}

export default function JobsPage() {
  const [searchParams] = useSearchParams()
  const [jobs,    setJobs]    = useState([])
  const [total,   setTotal]   = useState(0)
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState(searchParams.get('keyword') || '')
  const [filters, setFilters] = useState({
    keyword:  searchParams.get('keyword')  || '',
    category: searchParams.get('category') || '',
    level: '', type: '',
    location: searchParams.get('location') || '',
  })

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    try {
      const res = await jobService.getJobs(filters)
      setJobs(res.data); setTotal(res.total)
    } finally { setLoading(false) }
  }, [filters])

  useEffect(() => { fetchJobs() }, [fetchJobs])

  const handleSearch = e => { e.preventDefault(); setFilters(p => ({ ...p, keyword: searchInput })) }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Sticky search */}
      <div className="bg-white border-b border-[#E2E8F0] sticky top-16 z-10 shadow-sm">
        <div className="container-app py-3">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
              <Input value={searchInput} onChange={e => setSearchInput(e.target.value)}
                placeholder="Tìm kiếm theo tên công việc, kỹ năng, công ty..."
                className="pl-9 border-[#E2E8F0] focus-visible:border-[#1549B8]" />
            </div>
            <Button type="submit" className="bg-[#1549B8] hover:bg-[#1240A0] text-white font-semibold">Tìm kiếm</Button>
          </form>
        </div>
      </div>

      <div className="container-app py-6">
        <div className="flex gap-5 items-start">
          <Sidebar filters={filters} onChange={setFilters} />

          <div className="flex-1 min-w-0">
            {/* Results header */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-[#475569]">
                {loading ? 'Đang tải...' : (
                  <><span className="font-bold text-[#0F172A]">{total}</span> việc làm{filters.keyword && ` cho "${filters.keyword}"`}</>
                )}
              </p>
              <Select defaultValue="newest">
                <SelectTrigger className="w-36 h-8 text-xs border-[#E2E8F0]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Mới nhất</SelectItem>
                  <SelectItem value="salary">Lương cao nhất</SelectItem>
                  <SelectItem value="relevant">Phù hợp nhất</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 gap-4">
                {[1,2,3,4].map(i => <div key={i} className="h-52 shimmer-bg" />)}
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white rounded-xl border border-[#E2E8F0] py-16 text-center">
                <p className="text-4xl mb-3">🔍</p>
                <p className="font-semibold text-[#0F172A] mb-1">Không tìm thấy kết quả</p>
                <p className="text-sm text-[#94A3B8] mb-4">Thử thay đổi từ khóa hoặc bỏ bớt bộ lọc</p>
                <Button variant="outline" size="sm"
                  onClick={() => setFilters({ keyword:'', category:'', level:'', type:'', location:'' })}>
                  <X className="h-3.5 w-3.5 mr-1" />Xóa tất cả bộ lọc
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {jobs.map((job, i) => <JobCard key={job.id} job={job} index={i} />)}
              </div>
            )}

            {/* AI Banner */}
            {!loading && jobs.length > 0 && (
              <div className="mt-5 rounded-2xl bg-gradient-to-r from-[#1E1B4B] to-[#4C1D95] p-5 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-violet-300 text-xs font-bold mb-1">✨ AI CV SCORING</p>
                  <p className="text-white font-bold text-base">Tăng cơ hội được tuyển lên 3x với CV tối ưu</p>
                  <p className="text-slate-400 text-xs mt-0.5">Nhận phân tích chi tiết từ AI — Miễn phí</p>
                </div>
                <Button asChild
                  className="bg-gradient-to-r from-[#7C3AED] to-[#9333EA] hover:opacity-90 text-white font-bold flex-shrink-0">
                  <Link to="/cv-upload"><Sparkles className="h-3.5 w-3.5 mr-1" />Thử ngay</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}