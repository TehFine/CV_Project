import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { jobService, JOB_CATEGORIES } from '../../services/jobService'

const LEVELS = ['Intern', 'Junior', 'Middle', 'Senior', 'Lead/Manager']
const JOB_TYPES = ['Toàn thời gian', 'Bán thời gian', 'Remote', 'Freelance']
const LOCATIONS = ['TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Khác']

function JobCard({ job }) {
  const navigate = useNavigate()
  const daysAgo = Math.floor((Date.now() - new Date(job.postedAt)) / 86400000)
  const initials = job.company.slice(0, 2).toUpperCase()

  return (
    <div
      onClick={() => navigate(`/jobs/${job.id}`)}
      className="card-hover"
      style={{ backgroundColor: 'white', border: `1.5px solid ${job.featured ? 'rgba(21,73,184,0.2)' : 'var(--border)'}`, borderRadius: 14, padding: 20, cursor: 'pointer', display: 'flex', gap: 16, alignItems: 'flex-start', position: 'relative' }}
    >
      {job.featured && (
        <div style={{ position: 'absolute', top: 14, right: 14, backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20 }}>Nổi bật</div>
      )}
      <div style={{ width: 50, height: 50, borderRadius: 12, backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: 'var(--primary)', flexShrink: 0 }}>
        {initials}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 3 }}>{job.title}</h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10 }}>{job.company}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
          {[{ icon: '📍', text: job.location }, { icon: '💰', text: job.salary }, { icon: '⏱️', text: job.type }, { icon: '📊', text: job.level }].map(i => (
            <span key={i.text} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-secondary)', backgroundColor: 'var(--bg-subtle)', padding: '3px 9px', borderRadius: 6 }}>
              {i.icon} {i.text}
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {job.tags.map(t => (
            <span key={t} style={{ fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 20, backgroundColor: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid rgba(21,73,184,0.15)' }}>{t}</span>
          ))}
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>
          {daysAgo === 0 ? 'Hôm nay' : `${daysAgo} ngày trước`}
        </span>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--success)' }}>{job.salary}</span>
      </div>
    </div>
  )
}

function FilterSidebar({ filters, setFilters }) {
  const toggle = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key] === value ? '' : value,
    }))
  }

  const FilterGroup = ({ title, items, filterKey }) => (
    <div style={{ marginBottom: 24 }}>
      <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</h4>
      {items.map(item => {
        const val = typeof item === 'string' ? item : item.name
        const active = filters[filterKey] === val
        return (
          <label key={val} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', cursor: 'pointer' }}>
            <input type="radio" name={filterKey} checked={active} onChange={() => toggle(filterKey, val)} style={{ accentColor: 'var(--primary)', width: 15, height: 15 }} />
            <span style={{ fontSize: 13, color: active ? 'var(--primary)' : 'var(--text-secondary)', fontWeight: active ? 600 : 400, transition: 'color 0.15s' }}>
              {val}
            </span>
            {typeof item !== 'string' && item.count && (
              <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)', backgroundColor: 'var(--bg-subtle)', padding: '1px 6px', borderRadius: 10 }}>{item.count}</span>
            )}
          </label>
        )
      })}
    </div>
  )

  const hasFilters = Object.values(filters).some(v => v && v !== filters.keyword)

  return (
    <aside style={{ width: 260, flexShrink: 0 }}>
      <div style={{ backgroundColor: 'white', borderRadius: 14, border: '1.5px solid var(--border)', padding: 20, position: 'sticky', top: 80 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>🔍 Lọc kết quả</h3>
          {hasFilters && (
            <button onClick={() => setFilters(prev => ({ ...prev, category: '', level: '', type: '', location: '' }))} style={{ fontSize: 12, color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
              Xóa lọc
            </button>
          )}
        </div>
        <FilterGroup title="Địa điểm" items={LOCATIONS} filterKey="location" />
        <FilterGroup title="Ngành nghề" items={JOB_CATEGORIES.slice(0, 5)} filterKey="category" />
        <FilterGroup title="Cấp bậc" items={LEVELS} filterKey="level" />
        <FilterGroup title="Hình thức" items={JOB_TYPES} filterKey="type" />
      </div>
    </aside>
  )
}

export default function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [searchInput, setSearchInput] = useState(searchParams.get('keyword') || '')
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    category: searchParams.get('category') || '',
    level: '',
    type: '',
    location: searchParams.get('location') || '',
  })

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    try {
      const res = await jobService.getJobs(filters)
      setJobs(res.data)
      setTotal(res.total)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { fetchJobs() }, [fetchJobs])

  const handleSearch = (e) => {
    e.preventDefault()
    setFilters(prev => ({ ...prev, keyword: searchInput }))
  }

  return (
    <div className="section-sm" style={{ backgroundColor: 'var(--bg-base)' }}>
      <div className="container-app">
        {/* Search bar */}
        <div style={{ backgroundColor: 'white', borderRadius: 14, border: '1.5px solid var(--border)', padding: 20, marginBottom: 24, boxShadow: 'var(--shadow-sm)' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', border: '1.5px solid var(--border)', borderRadius: 10 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Tìm kiếm theo tên công việc, kỹ năng, công ty..."
                style={{ border: 'none', outline: 'none', flex: 1, fontSize: 14, fontFamily: 'inherit', color: 'var(--text-primary)' }}
              />
              {searchInput && (
                <button type="button" onClick={() => { setSearchInput(''); setFilters(p => ({ ...p, keyword: '' })) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}>×</button>
              )}
            </div>
            <button type="submit" className="btn-primary" style={{ padding: '10px 24px', border: 'none', cursor: 'pointer', fontSize: 14, borderRadius: 10, whiteSpace: 'nowrap' }}>
              Tìm kiếm
            </button>
          </form>
        </div>

        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          <FilterSidebar filters={filters} setFilters={setFilters} />

          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>
                  {loading ? 'Đang tải...' : `${total} việc làm`}
                </span>
                {filters.keyword && <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 8 }}>cho "{filters.keyword}"</span>}
              </div>
              <select style={{ fontSize: 13, border: '1.5px solid var(--border)', borderRadius: 8, padding: '6px 10px', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit' }}>
                <option>Mới nhất</option>
                <option>Lương cao nhất</option>
                <option>Phù hợp nhất</option>
              </select>
            </div>

            {/* Jobs list */}
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[1,2,3,4].map(i => (
                  <div key={i} className="shimmer" style={{ height: 160, borderRadius: 14 }} />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'white', borderRadius: 14, border: '1.5px solid var(--border)' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
                <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Không tìm thấy kết quả</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Thử thay đổi từ khóa hoặc bỏ bớt bộ lọc</p>
                <button onClick={() => setFilters({ keyword: '', category: '', level: '', type: '', location: '' })} style={{ marginTop: 16, padding: '8px 20px', borderRadius: 8, backgroundColor: 'var(--primary-light)', color: 'var(--primary)', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13, fontFamily: 'inherit' }}>
                  Xóa tất cả bộ lọc
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {jobs.map((job, i) => <JobCard key={job.id} job={job} />)}
              </div>
            )}

            {/* AI promo card */}
            {!loading && jobs.length > 0 && (
              <div style={{ marginTop: 24, background: 'linear-gradient(135deg, #1E1B4B, #4C1D95)', borderRadius: 14, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <div>
                  <p style={{ color: '#A78BFA', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>✨ AI CV SCORING</p>
                  <p style={{ color: 'white', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Cải thiện CV để tăng cơ hội được tuyển lên 3x</p>
                  <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13 }}>Nhận phân tích chi tiết và gợi ý cụ thể từ AI</p>
                </div>
                <Link to="/cv-upload" style={{ padding: '10px 20px', backgroundColor: '#7C3AED', color: 'white', borderRadius: 10, textDecoration: 'none', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0, transition: 'all 0.2s' }}>
                  Thử ngay — Miễn phí
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          aside { display: none; }
        }
      `}</style>
    </div>
  )
}