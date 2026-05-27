import { useState, useEffect } from 'react'
import { adminService } from '../../services/adminService'
import { 
  FileText, Search, Trash2, 
  Clock, FileSearch, MoreHorizontal,
  Briefcase
} from 'lucide-react'
import { connectSocket, onDashboardUpdateNeeded } from '../../services/socket.js'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const GRADE_CONFIG = {
  A: { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  B: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  C: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  D: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
}

export default function AdminCVScoresPage() {
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeGrade, setActiveGrade] = useState('all')

  const fetchScores = async (keyword, grade) => {
    setLoading(true)
    try {
      const params = {}
      if (keyword || search) params.keyword = keyword || search
      if ((grade || activeGrade) !== 'all') params.grade = grade || activeGrade
      const res = await adminService.getCVScores(params)
      setScores(res.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchScores()
  }, [activeGrade])

  // Realtime sync: refetch when dashboard data changes (new CV scores, etc.)
  useEffect(() => {
    connectSocket()
    const cleanup = onDashboardUpdateNeeded(() => fetchScores(search, activeGrade))
    return cleanup
  }, [search, activeGrade])

  // Compute average score from the loaded scores
  const avgScore = scores.length > 0
    ? (scores.reduce((sum, s) => sum + Number(s.overall), 0) / scores.length).toFixed(1)
    : '—'

  const handleDelete = async (id) => {
    if (confirm('Bạn có chắc muốn xóa lịch sử chấm điểm này?')) {
      await adminService.deleteCVScore(id)
      setScores(scores.filter(s => s.id !== id))
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Lịch sử chấm CV</h1>
          <p className="text-slate-500 mt-1 text-sm">Theo dõi chất lượng CV và hiệu suất của công cụ AI chấm điểm</p>
        </div>
        <div className="bg-white p-1 rounded-2xl border border-slate-200 flex gap-1 w-full sm:w-auto">
          {['all', 'A', 'B', 'C', 'D'].map(grade => (
            <button
              key={grade}
              onClick={() => setActiveGrade(grade)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeGrade === grade 
                ? 'bg-[#1549B8] text-white shadow-lg shadow-blue-200' 
                : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {grade === 'all' ? 'Tất cả' : `Hạng ${grade}`}
            </button>
          ))}
        </div>
      </div>

      {/* Filters & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="lg:col-span-3 flex flex-col sm:flex-row gap-3">
          <div className="relative flex items-center flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="text-slate-400" size={18} />
            </div>
            <input 
              type="text"
              placeholder="Tìm kiếm ứng viên, email hoặc file..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchScores()}
            />
          </div>
          <Button onClick={fetchScores} className="rounded-2xl px-8 bg-[#1549B8] hover:bg-[#1e40af] font-bold w-full sm:w-auto">
            Tìm kiếm
          </Button>
        </div>
        <div className="bg-blue-600 rounded-2xl p-4 text-white shadow-lg shadow-blue-200">
          <div className="text-[10px] font-bold uppercase opacity-80">Điểm trung bình</div>
          <div className="text-2xl font-black mt-0.5">{avgScore}</div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden hidden md:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-wider">Ứng viên</th>
              <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-wider">File & Vị trí</th>
              <th className="px-6 py-4 text-center text-[11px] font-black text-slate-400 uppercase tracking-wider">Điểm / Hạng</th>
              <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-wider">Thời gian chấm</th>
              <th className="px-6 py-4 text-right text-[11px] font-black text-slate-400 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr>
                <td colSpan="5" className="py-20 text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
                  <span className="text-slate-400 font-medium">Đang tải lịch sử...</span>
                </td>
              </tr>
            ) : scores.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-20 text-center">
                  <FileSearch className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <span className="text-slate-400 font-medium">Không tìm thấy kết quả nào</span>
                </td>
              </tr>
            ) : (
              scores.map(s => {
                const cfg = GRADE_CONFIG[s.grade] || GRADE_CONFIG.B
                return (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-black text-xs uppercase">
                          {s.userName.split(' ').pop()[0]}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{s.userName}</div>
                          <div className="text-xs text-slate-400">{s.userEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-[#1549B8] font-semibold text-[13px] mb-1">
                        <FileText size={14} />
                        {s.fileName}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <Briefcase size={12} className="text-slate-400" />
                        Vị trí: {s.targetPosition || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="inline-flex flex-col items-center">
                        <div className="text-lg font-black text-slate-900 leading-none">{s.overall}</div>
                        <Badge className={`${cfg.bg} ${cfg.color} ${cfg.border} border text-[10px] py-0 px-2 mt-1.5`}>
                          Hạng {s.grade}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-[13px] text-slate-600 font-medium">
                        {new Date(s.scoredAt).toLocaleDateString('vi-VN')}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <Clock size={12} /> {s.processingTime} giây
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                       <div className="flex items-center justify-end gap-2">
                         <button className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 text-slate-400 hover:text-[#1549B8] transition-all">
                           <MoreHorizontal size={18} />
                         </button>
                         <button 
                           onClick={() => handleDelete(s.id)}
                           className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-red-100 text-slate-400 hover:text-red-600 transition-all"
                         >
                           <Trash2 size={18} />
                         </button>
                       </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="py-20 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
            <span className="text-slate-400 font-medium">Đang tải lịch sử...</span>
          </div>
        ) : scores.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-[24px] border border-slate-200">
            <FileSearch className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <span className="text-slate-400 font-medium">Không tìm thấy kết quả nào</span>
          </div>
        ) : (
          scores.map(s => {
            const cfg = GRADE_CONFIG[s.grade] || GRADE_CONFIG.B
            return (
              <div key={s.id} className="bg-white rounded-[24px] border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-black text-xs uppercase">
                    {s.userName.split(' ').pop()[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-900 text-sm truncate">{s.userName}</div>
                    <div className="text-xs text-slate-400 truncate">{s.userEmail}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-slate-900 leading-none">{s.overall}</div>
                    <Badge className={`${cfg.bg} ${cfg.color} ${cfg.border} border text-[10px] py-0 px-2 mt-1`}>
                      Hạng {s.grade}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[#1549B8] font-semibold text-[13px] mb-2">
                  <FileText size={14} />
                  <span className="truncate">{s.fileName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock size={12} /> {new Date(s.scoredAt).toLocaleDateString('vi-VN')} · {s.processingTime}s
                  </div>
                  <div className="flex gap-1">
                    <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-[#1549B8] transition-all">
                      <MoreHorizontal size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(s.id)}
                      className="p-2 hover:bg-red-50 rounded-xl text-slate-400 hover:text-red-600 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
