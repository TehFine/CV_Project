import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { jobService } from '@/services/jobService'

const STATUS_MAP = {
  pending:   { label: 'Đang chờ',    color: 'bg-slate-100 text-slate-600' },
  reviewing: { label: 'Đang xem xét', color: 'bg-blue-100 text-blue-600' },
  interview: { label: 'Phỏng vấn',   color: 'bg-purple-100 text-purple-600' },
  offered:   { label: 'Đã mời làm',  color: 'bg-emerald-100 text-emerald-600' },
  rejected:  { label: 'Từ chối',     color: 'bg-red-100 text-red-600' },
}

export function AppliedTab() {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    jobService.getAppliedJobs().then(res => {
      setApps(res || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-foreground">Việc làm đã ứng tuyển ({apps.length})</h3>
      {apps.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">Bạn chưa ứng tuyển công việc nào.</CardContent></Card>
      ) : (
        apps.map(app => {
          const job = app.jobId
          const status = STATUS_MAP[app.status] || STATUS_MAP.pending
          return (
            <Card key={app._id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4 flex gap-4 items-center">
                <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center font-bold text-primary shrink-0">
                  {job?.companyName?.slice(0, 2).toUpperCase() || 'CV'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-bold text-sm truncate">{job?.title || 'Công việc không còn tồn tại'}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${status.color}`}>{status.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{job?.companyName} · {job?.location}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Đã ứng tuyển: {new Date(app.createdAt).toLocaleDateString('vi-VN')}</p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/jobs/${job?._id}`}>Chi tiết</Link>
                </Button>
              </CardContent>
            </Card>
          )
        })
      )}
    </div>
  )
}
