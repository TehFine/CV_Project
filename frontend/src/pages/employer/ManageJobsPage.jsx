import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Eye, Users2, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { employerService } from '@/services/employerService'

export default function ManageJobsPage() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { employerService.getMyJobs().then(setJobs).finally(() => setLoading(false)) }, [])

  const handleDelete = async id => {
    if (!confirm('Xác nhận xóa tin này?')) return
    await employerService.deleteJob(id)
    setJobs(p => p.filter(j => j.id !== id))
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="bg-gradient-to-br from-[#0F172A] to-[#1549B8] py-8">
        <div className="container-app flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-white mb-1">📋 Quản lý tin tuyển dụng</h1>
            <p className="text-blue-200 text-sm">{jobs.length} tin đang hiển thị</p>
          </div>
          <Button asChild className="bg-white text-[#1549B8] hover:bg-[#EEF2FF] font-bold gap-2">
            <Link to="/employer/post-job"><Plus className="h-4 w-4" />Đăng tin mới</Link>
          </Button>
        </div>
      </div>

      <div className="container-app py-6">
        {loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-32 shimmer-bg" />)}</div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E2E8F0] py-16 text-center">
            <p className="text-4xl mb-3">📋</p>
            <p className="font-semibold text-[#0F172A] mb-4">Chưa có tin tuyển dụng nào</p>
            <Button asChild className="bg-[#1549B8] hover:bg-[#1240A0] text-white gap-2">
              <Link to="/employer/post-job"><Plus className="h-4 w-4" />Đăng tin đầu tiên</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map(job => (
              <div key={job.id} className="bg-white rounded-xl border border-[#E2E8F0] p-5">
                <div className="flex gap-4 items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-bold text-[#0F172A]">{job.title}</h3>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        job.status === 'active' ? 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]' : 'bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]'
                      }`}>
                        {job.status === 'active' ? '🟢 Đang tuyển' : '⏸️ Đã đóng'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#94A3B8] mb-3">
                      <span>📍 {job.location}</span>
                      <span>💰 {job.salary}</span>
                      <span>📊 {job.level}</span>
                      <span>⏳ Hạn: {new Date(job.deadline).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="flex gap-4 text-xs">
                      <span className="flex items-center gap-1 text-[#475569]"><Eye className="h-3.5 w-3.5" />{job.views} lượt xem</span>
                      <span className="flex items-center gap-1 text-[#1549B8] font-semibold"><Users2 className="h-3.5 w-3.5" />{job.applied} ứng tuyển</span>
                      <span className="text-[#059669] font-semibold">{job.shortlisted} đã chọn</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <Button asChild variant="outline" size="sm" className="gap-1 text-xs border-[#E2E8F0]">
                      <Link to={`/employer/candidates?jobId=${job.id}`}><Users2 className="h-3.5 w-3.5" />Ứng viên</Link>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1 text-xs text-[#475569]">
                      <Edit className="h-3.5 w-3.5" />Sửa
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(job.id)}
                      className="gap-1 text-xs text-red-400 hover:text-red-600 hover:bg-red-50">
                      <Trash2 className="h-3.5 w-3.5" />Xóa
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}