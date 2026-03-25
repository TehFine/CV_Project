import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { employerService } from '@/services/employerService'

const STATUS_STYLE = {
  pending:     { label: 'Chờ xem xét', bg: '#FFFBEB', text: '#D97706', border: '#FDE68A' },
  shortlisted: { label: 'Đã chọn',     bg: '#EEF2FF', text: '#1549B8', border: '#C7D2FE' },
  rejected:    { label: 'Từ chối',     bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' },
  hired:       { label: 'Đã tuyển',    bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' },
}

const SCORE_COLOR = score => score >= 85 ? '#059669' : score >= 70 ? '#1549B8' : score >= 55 ? '#D97706' : '#DC2626'

function CandidateCard({ candidate, onStatusChange }) {
  const [updating, setUpdating] = useState(false)
  const s = STATUS_STYLE[candidate.status] || STATUS_STYLE.pending

  const changeStatus = async newStatus => {
    setUpdating(true)
    await employerService.updateCandidateStatus(candidate.id, newStatus)
    onStatusChange(candidate.id, newStatus)
    setUpdating(false)
  }

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
      <div className="flex gap-4 items-start">
        <div className="w-12 h-12 rounded-full bg-[#EEF2FF] flex items-center justify-center font-black text-sm text-[#1549B8] flex-shrink-0">
          {candidate.name.split(' ').slice(-1)[0].slice(0,2).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-bold text-sm text-[#0F172A]">{candidate.name}</h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full border" style={{ backgroundColor: s.bg, color: s.text, borderColor: s.border }}>{s.label}</span>
          </div>
          <p className="text-xs text-[#475569] mb-1">{candidate.title} · {candidate.location} · {candidate.experience} kinh nghiệm</p>
          <p className="text-xs text-[#94A3B8] mb-2">Ứng tuyển: <span className="text-[#0F172A] font-medium">{candidate.appliedJob}</span></p>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {candidate.skills.map(sk => (
              <span key={sk} className="text-[11px] px-2 py-0.5 rounded-full bg-[#EEF2FF] text-[#1549B8] border border-[#C7D2FE] font-medium">{sk}</span>
            ))}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* CV Score */}
            <div className="flex items-center gap-1.5 bg-[#F8FAFC] px-3 py-1.5 rounded-lg border border-[#E2E8F0]">
              <Star className="h-3.5 w-3.5" style={{ color: SCORE_COLOR(candidate.cvScore) }} />
              <span className="text-xs font-black" style={{ color: SCORE_COLOR(candidate.cvScore) }}>
                {candidate.cvScore}/100
              </span>
              <span className="text-xs text-[#94A3B8]">CV Score</span>
            </div>

            {/* Status actions */}
            <div className="flex gap-2 ml-auto flex-wrap">
              {candidate.status !== 'shortlisted' && (
                <Button size="sm" variant="outline" onClick={() => changeStatus('shortlisted')} disabled={updating}
                  className="text-xs h-7 border-[#C7D2FE] text-[#1549B8] hover:bg-[#EEF2FF]">
                  ✅ Chọn
                </Button>
              )}
              {candidate.status !== 'hired' && (
                <Button size="sm" onClick={() => changeStatus('hired')} disabled={updating}
                  className="text-xs h-7 bg-[#059669] hover:bg-[#047857] text-white">
                  🎉 Tuyển
                </Button>
              )}
              {candidate.status !== 'rejected' && (
                <Button size="sm" variant="ghost" onClick={() => changeStatus('rejected')} disabled={updating}
                  className="text-xs h-7 text-red-400 hover:text-red-600 hover:bg-red-50">
                  ✕ Từ chối
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ResumeSearchTab() {
  const [keyword, setKeyword] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  useEffect(() => { employerService.searchResumes().then(res => setResults(res.data)) }, [])

  const handleSearch = async e => {
    e.preventDefault()
    setLoading(true); setSearched(true)
    const res = await employerService.searchResumes({ keyword })
    setResults(res.data)
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
          <Input value={keyword} onChange={e => setKeyword(e.target.value)}
            placeholder="Tìm theo kỹ năng, chức danh... (VD: React, Data Analyst)"
            className="pl-9 border-[#E2E8F0]" />
        </div>
        <Button type="submit" className="bg-[#1549B8] hover:bg-[#1240A0] text-white font-semibold">Tìm hồ sơ</Button>
      </form>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-40 shimmer-bg" />)}</div>
      ) : (
        <div className="space-y-3">
          {searched && <p className="text-sm text-[#475569]"><span className="font-bold text-[#0F172A]">{results.length}</span> hồ sơ phù hợp</p>}
          {results.map(r => (
            <div key={r.id} className="bg-white rounded-xl border border-[#E2E8F0] p-5">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-full bg-[#F5F3FF] flex items-center justify-center font-black text-sm text-[#7C3AED] flex-shrink-0">
                  {r.name.split(' ').slice(-1)[0].slice(0,2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-sm text-[#0F172A]">{r.name}</h3>
                    <span className="text-xs font-black" style={{ color: SCORE_COLOR(r.cvScore) }}>★ {r.cvScore}/100</span>
                  </div>
                  <p className="text-xs text-[#1549B8] font-semibold mb-1">{r.title}</p>
                  <div className="flex gap-3 text-xs text-[#94A3B8] mb-2">
                    <span>📍 {r.location}</span>
                    <span>💼 {r.experience}</span>
                    <span>💰 {r.expectedSalary}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {r.skills.map(sk => (
                      <span key={sk} className="text-[11px] px-2 py-0.5 rounded-full bg-[#EEF2FF] text-[#1549B8] border border-[#C7D2FE] font-medium">{sk}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="text-xs text-[#94A3B8]">
                      <span className="text-[#059669] font-semibold">{r.availability}</span>
                      <span className="mx-2">·</span>Hoạt động {r.lastActive}
                    </div>
                    <Button size="sm" className="bg-[#1549B8] hover:bg-[#1240A0] text-white text-xs h-7">
                      📩 Liên hệ ứng viên
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function CandidatesPage() {
  const [searchParams] = useSearchParams()
  const jobId = searchParams.get('jobId')
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    employerService.getCandidates(jobId).then(setCandidates).finally(() => setLoading(false))
  }, [jobId])

  const handleStatusChange = (id, newStatus) =>
    setCandidates(p => p.map(c => c.id === id ? { ...c, status: newStatus } : c))

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="bg-gradient-to-br from-[#0F172A] to-[#1549B8] py-8">
        <div className="container-app">
          <h1 className="text-2xl font-black text-white mb-1">👥 Quản lý ứng viên</h1>
          <p className="text-blue-200 text-sm">Xem xét hồ sơ và tìm kiếm ứng viên phù hợp</p>
        </div>
      </div>

      <div className="container-app py-6">
        <Tabs defaultValue="applications">
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-2 mb-5 inline-block">
            <TabsList className="bg-transparent gap-1">
              <TabsTrigger value="applications" className="text-sm data-[state=active]:bg-[#EEF2FF] data-[state=active]:text-[#1549B8]">
                📥 Đã ứng tuyển ({candidates.length})
              </TabsTrigger>
              <TabsTrigger value="search" className="text-sm data-[state=active]:bg-[#EEF2FF] data-[state=active]:text-[#1549B8]">
                🔍 Tìm hồ sơ
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="applications">
            {loading ? (
              <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-40 shimmer-bg" />)}</div>
            ) : candidates.length === 0 ? (
              <div className="bg-white rounded-xl border border-[#E2E8F0] py-16 text-center">
                <p className="text-4xl mb-3">📭</p>
                <p className="font-semibold text-[#0F172A]">Chưa có ứng viên nào</p>
              </div>
            ) : (
              <div className="space-y-3">
                {candidates.map(c => (
                  <CandidateCard key={c.id} candidate={c} onStatusChange={handleStatusChange} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="search">
            <ResumeSearchTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}