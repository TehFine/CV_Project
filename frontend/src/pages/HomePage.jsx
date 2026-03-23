import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { jobService, JOB_CATEGORIES, MOCK_JOBS } from '../services/jobService'

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [location, setLocation] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (keyword) params.set('keyword', keyword)
    if (location) params.set('location', location)
    navigate(`/jobs?${params.toString()}`)
  }

  return (
    <section style={{
      background: 'linear-gradient(135deg, #0F172A 0%, #1E3A6E 50%, #1549B8 100%)',
      paddingTop: 120, paddingBottom: 80,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background decoration */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(21,73,184,0.3) 0%, transparent 70%)' }} />
        {/* Dots grid */}
        <svg style={{ position: 'absolute', right: '5%', top: '20%', opacity: 0.15 }} width="200" height="200" viewBox="0 0 200 200">
          {Array.from({ length: 6 }).map((_, r) =>
            Array.from({ length: 6 }).map((_, c) => (
              <circle key={`${r}-${c}`} cx={c * 35 + 10} cy={r * 35 + 10} r="2.5" fill="white" />
            ))
          )}
        </svg>
      </div>

      <div className="container-app" style={{ position: 'relative' }}>
        {/* AI badge */}
        <div className="animate-fade-in" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: 'rgba(124,58,237,0.25)', border: '1px solid rgba(124,58,237,0.4)', borderRadius: 20, padding: '5px 14px', marginBottom: 20 }}>
          <span style={{ fontSize: 14 }}>✨</span>
          <span style={{ fontSize: 13, color: '#C4B5FD', fontWeight: 500 }}>Tích hợp AI chấm điểm CV thông minh</span>
        </div>

        <h1 className="animate-fade-in delay-100" style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: 20, maxWidth: 700 }}>
          Tìm việc làm mơ ước<br />
          <span style={{ background: 'linear-gradient(135deg, #60A5FA, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            với sức mạnh AI
          </span>
        </h1>
        <p className="animate-fade-in delay-200" style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', marginBottom: 36, maxWidth: 520, lineHeight: 1.7 }}>
          Upload CV và nhận đánh giá chi tiết từ AI trong 30 giây. Khám phá hàng nghìn cơ hội việc làm từ các công ty hàng đầu Việt Nam.
        </p>

        {/* Search box */}
        <form onSubmit={handleSearch} className="animate-fade-in delay-300" style={{ display: 'flex', gap: 0, backgroundColor: 'white', borderRadius: 14, padding: 6, boxShadow: '0 20px 60px rgba(0,0,0,0.3)', maxWidth: 680 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRight: '1px solid var(--border)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              placeholder="Tên công việc, kỹ năng, công ty..."
              style={{ border: 'none', outline: 'none', fontSize: 14, flex: 1, fontFamily: 'inherit', color: 'var(--text-primary)' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <input
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="Địa điểm"
              style={{ border: 'none', outline: 'none', fontSize: 14, width: 140, fontFamily: 'inherit', color: 'var(--text-primary)' }}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ padding: '10px 24px', flexShrink: 0, fontSize: 14, border: 'none', cursor: 'pointer' }}>
            Tìm kiếm
          </button>
        </form>

        {/* Popular tags */}
        <div className="animate-fade-in delay-400" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16, alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Phổ biến:</span>
          {['React Developer', 'UI/UX Designer', 'Data Analyst', 'Product Manager', 'DevOps'].map(tag => (
            <button
              key={tag}
              onClick={() => navigate(`/jobs?keyword=${encodeURIComponent(tag)}`)}
              style={{ fontSize: 12, padding: '4px 12px', borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
            >{tag}</button>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 60 }}>
        <div className="container-app" style={{ paddingTop: 28, paddingBottom: 0 }}>
          <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
            {[
              { value: '50,000+', label: 'CV đã được chấm điểm', icon: '📄' },
              { value: '12,000+', label: 'Công việc đang tuyển', icon: '💼' },
              { value: '3,500+', label: 'Công ty đối tác', icon: '🏢' },
              { value: '95%', label: 'Tỷ lệ hài lòng', icon: '⭐' },
            ].map(stat => (
              <div key={stat.value} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20 }}>{stat.icon}</span>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: 'white', lineHeight: 1 }}>{stat.value}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Categories Section ───────────────────────────────────────────────────────
function CategoriesSection() {
  const navigate = useNavigate()
  return (
    <section className="section">
      <div className="container-app">
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>Khám phá theo ngành nghề</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Hàng nghìn công việc trong tất cả lĩnh vực</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {JOB_CATEGORIES.map((cat, i) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/jobs?category=${cat.name}`)}
              className={`card-hover animate-fade-in delay-${Math.min((i + 1) * 100, 600)}`}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', backgroundColor: 'white', border: '1.5px solid var(--border)', borderRadius: 12, cursor: 'pointer', textAlign: 'left', transition: 'all 0.25s' }}
            >
              <span style={{ fontSize: 28, lineHeight: 1 }}>{cat.icon}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{cat.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{cat.count.toLocaleString()} việc làm</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Job Card ─────────────────────────────────────────────────────────────────
function JobCard({ job, index = 0 }) {
  const navigate = useNavigate()
  const daysAgo = Math.floor((Date.now() - new Date(job.postedAt)) / 86400000)
  const companyInitials = job.company.slice(0, 2).toUpperCase()

  return (
    <div
      className={`card-hover animate-fade-in delay-${Math.min((index + 1) * 100, 600)}`}
      onClick={() => navigate(`/jobs/${job.id}`)}
      style={{ backgroundColor: 'white', border: `1.5px solid ${job.featured ? 'rgba(21,73,184,0.3)' : 'var(--border)'}`, borderRadius: 14, padding: 20, cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
    >
      {job.featured && (
        <div style={{ position: 'absolute', top: 12, right: 12, backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, border: '1px solid rgba(21,73,184,0.2)' }}>
          Nổi bật
        </div>
      )}

      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        {/* Company logo */}
        <div style={{ width: 48, height: 48, borderRadius: 10, backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: 'var(--primary)', flexShrink: 0 }}>
          {companyInitials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{job.title}</h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10 }}>{job.company}</p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {[
              { icon: '📍', text: job.location },
              { icon: '💰', text: job.salary },
              { icon: '⏱️', text: job.type },
            ].map(info => (
              <span key={info.text} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-secondary)', backgroundColor: 'var(--bg-subtle)', padding: '3px 8px', borderRadius: 6 }}>
                <span>{info.icon}</span> {info.text}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {job.tags.map(tag => (
              <span key={tag} style={{ fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 20, backgroundColor: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid rgba(21,73,184,0.15)' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{daysAgo === 0 ? 'Hôm nay' : `${daysAgo} ngày trước`}</span>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{job.applied} đã ứng tuyển</span>
      </div>
    </div>
  )
}

// ─── Featured Jobs ─────────────────────────────────────────────────────────────
function FeaturedJobsSection() {
  const featuredJobs = MOCK_JOBS.filter(j => j.featured).slice(0, 3)
  const recentJobs = MOCK_JOBS.slice(0, 6)

  return (
    <section className="section" style={{ backgroundColor: 'var(--bg-subtle)' }}>
      <div className="container-app">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>Việc làm mới nhất</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Cập nhật mỗi ngày từ các công ty hàng đầu</p>
          </div>
          <Link to="/jobs" style={{ fontSize: 14, fontWeight: 600, color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
            Xem tất cả →
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {recentJobs.map((job, i) => <JobCard key={job.id} job={job} index={i} />)}
        </div>
      </div>
    </section>
  )
}

// ─── AI Promo Section ─────────────────────────────────────────────────────────
function AIPromoSection() {
  return (
    <section className="section">
      <div className="container-app">
        <div style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4C1D95 100%)', borderRadius: 24, padding: 'clamp(32px, 5vw, 56px)', position: 'relative', overflow: 'hidden', display: 'flex', gap: 40, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Decoration */}
          <div style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(139, 92, 246, 0.2)', pointerEvents: 'none' }} />

          <div style={{ flex: 1, minWidth: 280, position: 'relative' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: 'rgba(167,139,250,0.2)', border: '1px solid rgba(167,139,250,0.3)', borderRadius: 20, padding: '4px 12px', marginBottom: 16 }}>
              <span style={{ fontSize: 13 }}>🤖</span>
              <span style={{ fontSize: 12, color: '#C4B5FD', fontWeight: 500 }}>AI-Powered CV Scoring</span>
            </div>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: 16 }}>
              CV của bạn có đủ<br />sức cạnh tranh?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
              AI của NexCV phân tích CV trong 30 giây, đưa ra điểm số chi tiết và gợi ý cụ thể để cải thiện cơ hội được tuyển dụng lên đến 3 lần.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/cv-upload" className="btn-ai" style={{ padding: '12px 24px', borderRadius: 10, fontSize: 14, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, border: 'none', cursor: 'pointer' }}>
                <span>✨</span> Chấm điểm CV ngay — Miễn phí
              </Link>
              <Link to="/register" style={{ padding: '12px 24px', borderRadius: 10, fontSize: 14, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', fontWeight: 500, transition: 'all 0.2s' }}>
                Tìm hiểu thêm →
              </Link>
            </div>
          </div>

          {/* Score preview card */}
          <div style={{ width: 280, backgroundColor: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 16, padding: 24, flexShrink: 0, position: 'relative' }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', border: '4px solid #7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', backgroundColor: 'rgba(124,58,237,0.2)' }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: 'white' }}>82</span>
              </div>
              <div style={{ fontSize: 13, color: '#A78BFA', fontWeight: 600 }}>Điểm CV của bạn</div>
            </div>
            {[
              { label: 'Kỹ năng phù hợp', pct: 85, color: '#34D399' },
              { label: 'Kinh nghiệm', pct: 78, color: '#60A5FA' },
              { label: 'Định dạng & ATS', pct: 72, color: '#F59E0B' },
              { label: 'Từ khóa', pct: 65, color: '#F87171' },
            ].map(item => (
              <div key={item.label} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>
                  <span>{item.label}</span>
                  <span style={{ fontWeight: 600, color: 'white' }}>{item.pct}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${item.pct}%`, background: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorksSection() {
  const steps = [
    { num: '01', icon: '📤', title: 'Upload CV', desc: 'Tải lên CV dạng PDF hoặc DOCX. Hỗ trợ mọi định dạng phổ biến.' },
    { num: '02', icon: '🤖', title: 'AI Phân tích', desc: 'Hệ thống AI phân tích CV theo 5 tiêu chí quan trọng trong vòng 30 giây.' },
    { num: '03', icon: '📊', title: 'Nhận kết quả', desc: 'Xem điểm số chi tiết, điểm mạnh và các gợi ý cải thiện cụ thể.' },
    { num: '04', icon: '🚀', title: 'Ứng tuyển', desc: 'Áp dụng các gợi ý, cải thiện CV và tự tin ứng tuyển vào vị trí mơ ước.' },
  ]

  return (
    <section className="section" style={{ backgroundColor: 'var(--bg-subtle)' }}>
      <div className="container-app">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>Cách hoạt động</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Chỉ 4 bước đơn giản để có CV hoàn hảo</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, position: 'relative' }}>
          {steps.map((step, i) => (
            <div key={step.num} className={`animate-fade-in delay-${(i + 1) * 100}`} style={{ backgroundColor: 'white', borderRadius: 16, padding: '28px 24px', border: '1.5px solid var(--border)', textAlign: 'center', position: 'relative' }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 16px' }}>
                {step.icon}
              </div>
              <div style={{ position: 'absolute', top: 16, right: 16, fontSize: 32, fontWeight: 900, color: 'var(--border)', lineHeight: 1 }}>{step.num}</div>
              <h3 style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)', marginBottom: 8 }}>{step.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CTA Banner ───────────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section className="section-sm">
      <div className="container-app">
        <div style={{ textAlign: 'center', padding: '48px 24px', backgroundColor: 'var(--primary-light)', borderRadius: 20, border: '1px solid rgba(21,73,184,0.15)' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>Bắt đầu hành trình sự nghiệp ngay hôm nay</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 28, fontSize: 15 }}>Tham gia cùng 50,000+ ứng viên đã tin dùng NexCV</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn-primary" style={{ padding: '12px 28px', textDecoration: 'none', borderRadius: 10, fontSize: 15, display: 'inline-block', border: 'none', cursor: 'pointer' }}>
              Tạo tài khoản miễn phí
            </Link>
            <Link to="/cv-upload" style={{ padding: '12px 28px', textDecoration: 'none', borderRadius: 10, fontSize: 15, display: 'inline-block', backgroundColor: 'white', border: '1.5px solid var(--border)', color: 'var(--text-primary)', fontWeight: 600, transition: 'all 0.2s' }}>
              Thử chấm điểm CV
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <FeaturedJobsSection />
      <AIPromoSection />
      <HowItWorksSection />
      <CTASection />
    </>
  )
}
