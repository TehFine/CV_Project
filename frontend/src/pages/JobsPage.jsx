import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { Search, MapPin, Filter, X, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { jobService, JOB_CATEGORIES } from '@/services/jobService'
import { cn } from '@/lib/utils'

const LEVELS = ['Intern', 'Junior', 'Middle', 'Senior', 'Lead/Manager']
const JOB_TYPES = ['Toàn thời gian', 'Bán thời gian', 'Remote', 'Freelance']
const LOCATIONS = ['TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ']

function JobCard({ job }) {
  const navigate = useNavigate()
  const daysAgo = Math.floor((Date.now() - new Date(job.postedAt)) / 86400000)
  return (
    <Card className="cursor-pointer hover:-translate-y-0.5 hover:shadow-md hover:border-primary/30 transition-all duration-200"
      onClick={() => navigate(`/jobs/${job.id}`)}>
      <CardContent className="p-5">
        <div className="flex gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center font-black text-sm text-primary flex-shrink-0">
            {job.company.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-0.5">
              <h3 className="font-bold text-sm text-foreground truncate">{job.title}</h3>
              {job.featured && <Badge variant="new" className="flex-shrink-0 text-[10px]">Nổi bật</Badge>}
            </div>
            <p className="text-xs text-muted-foreground">{job.company}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          <Badge variant="outline" className="text-[11px] font-normal gap-1"><MapPin className="h-2.5 w-2.5" />{job.location}</Badge>
          <Badge variant="outline" className="text-[11px] font-normal">💰 {job.salary}</Badge>
          <Badge variant="outline" className="text-[11px] font-normal">{job.level}</Badge>
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {job.tags.map(t => <Badge key={t} variant="secondary" className="text-[11px]">{t}</Badge>)}
        </div>
        <Separator className="mb-2.5" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{daysAgo === 0 ? 'Hôm nay' : `${daysAgo} ngày trước`}</span>
          <span className="font-semibold text-emerald-600">{job.salary}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function Sidebar({ filters, onChange }) {
  const hasFilters = ['category', 'level', 'type', 'location'].some(k => filters[k])
  const toggle = (key, val) => onChange({ ...filters, [key]: filters[key] === val ? '' : val })

  const Group = ({ title, items, fkey }) => (
    <div className="mb-5">
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">{title}</p>
      <div className="space-y-0.5">
        {items.map(item => {
          const val = typeof item === 'string' ? item : item.name
          const active = filters[fkey] === val
          return (
            <label key={val} className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-muted cursor-pointer transition-colors">
              <input type="radio" name={fkey} checked={active} onChange={() => toggle(fkey, val)}
                className="accent-primary w-3.5 h-3.5" />
              <span className={cn('text-sm transition-colors flex-1', active ? 'text-primary font-semibold' : 'text-muted-foreground')}>
                {val}
              </span>
              {typeof item !== 'string' && item.count && (
                <span className="text-[11px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">{item.count}</span>
              )}
            </label>
          )
        })}
      </div>
    </div>
  )

  return (
    <aside className="hidden lg:block w-56 flex-shrink-0">
      <Card>
        <CardContent className="p-5">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 font-bold text-sm"><Filter className="h-4 w-4" />Bộ lọc</div>
            {hasFilters && (
              <button onClick={() => onChange({ ...filters, category: '', level: '', type: '', location: '' })}
                className="text-xs text-destructive hover:underline flex items-center gap-1">
                <X className="h-3 w-3" />Xóa lọc
              </button>
            )}
          </div>
          <Separator className="mb-4" />
          <Group title="Địa điểm" items={LOCATIONS} fkey="location" />
          <Group title="Ngành nghề" items={JOB_CATEGORIES.slice(0, 5)} fkey="category" />
          <Group title="Cấp bậc" items={LEVELS} fkey="level" />
          <Group title="Hình thức" items={JOB_TYPES} fkey="type" />
        </CardContent>
      </Card>
    </aside>
  )
}

export default function JobsPage() {
  const [searchParams] = useSearchParams()
  const [jobs, setJobs] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState(searchParams.get('keyword') || '')
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
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
    <div className="min-h-screen bg-muted/30">
      {/* Search bar */}
      <div className="transparent ? 'bg-transparent' : 'bg-background/96 backdrop-blur-md border-b shadow-sm' border-b sticky top-16 z-10">
        <div className="max-w-[1200px] mx-auto px-6 py-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={searchInput} onChange={e => setSearchInput(e.target.value)}
                placeholder="Tìm kiếm theo tên công việc, kỹ năng, công ty..." className="pl-9" />
            </div>
            <Button type="submit">Tìm kiếm</Button>
          </form>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-6">
        <div className="flex gap-5 items-start">
          <Sidebar filters={filters} onChange={setFilters} />

          <div className="flex-1 min-w-0">
            {/* Results header */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm font-medium text-muted-foreground">
                {loading ? 'Đang tải...' : <><span className="font-bold text-foreground">{total}</span> việc làm {filters.keyword && `cho "${filters.keyword}"`}</>}
              </p>
              <Select defaultValue="newest">
                <SelectTrigger className="w-36 h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Mới nhất</SelectItem>
                  <SelectItem value="salary">Lương cao nhất</SelectItem>
                  <SelectItem value="relevant">Phù hợp nhất</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Jobs grid */}
            {loading ? (
              <div className="grid md:grid-cols-2 gap-4">
                {[1,2,3,4].map(i => <div key={i} className="h-48 rounded-xl shimmer-bg" />)}
              </div>
            ) : jobs.length === 0 ? (
              <Card><CardContent className="py-16 text-center">
                <p className="text-4xl mb-3">🔍</p>
                <p className="font-semibold text-foreground mb-1">Không tìm thấy kết quả</p>
                <p className="text-sm text-muted-foreground mb-4">Thử thay đổi từ khóa hoặc bỏ bớt bộ lọc</p>
                <Button variant="outline" size="sm" onClick={() => setFilters({ keyword: '', category: '', level: '', type: '', location: '' })}>
                  <X className="h-3.5 w-3.5 mr-1" />Xóa tất cả bộ lọc
                </Button>
              </CardContent></Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {jobs.map(job => <JobCard key={job.id} job={job} />)}
              </div>
            )}

            {/* AI Banner */}
            {!loading && jobs.length > 0 && (
              <Card className="mt-5 bg-gradient-to-r from-indigo-950 to-violet-900 border-0 text-white overflow-hidden">
                <CardContent className="p-5 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-violet-300 text-xs font-bold mb-1">✨ AI CV SCORING</p>
                    <p className="font-bold text-base">Tăng cơ hội được tuyển lên 3x với CV tối ưu</p>
                    <p className="text-slate-300 text-xs mt-0.5">Nhận phân tích chi tiết từ AI — Miễn phí</p>
                  </div>
                  <Button variant="ai" size="sm" asChild>
                    <Link to="/cv-upload"><Sparkles className="h-3.5 w-3.5" />Thử ngay</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}