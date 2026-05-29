import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, XCircle, Clock, Eye, CheckCircle, Mic, BriefcaseBusiness, Send, Inbox } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'
import { jobService } from '@/services/jobService'

const STATUS_MAP = {
  pending:   { label: 'Đang chờ',     color: 'bg-slate-100 text-slate-600',     icon: Clock },
  reviewing: { label: 'Đang xem xét', color: 'bg-blue-100 text-blue-700',       icon: Eye },
  interview: { label: 'Phỏng vấn',    color: 'bg-purple-100 text-purple-700',   icon: Mic },
  offered:   { label: 'Đã mời làm',   color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  rejected:  { label: 'Bị từ chối',   color: 'bg-red-100 text-red-700',         icon: XCircle },
}

export function AppliedTab() {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    jobService.getAppliedJobs().then(res => {
      setApps(Array.isArray(res) ? res : (res?.data || []))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>

  const active   = apps.filter(a => !['rejected', 'offered'].includes(a.status))
  const resolved = apps.filter(a =>  ['rejected', 'offered'].includes(a.status))

  const renderCard = (app) => {
    const job = app.jobId
    const isJobDeleted = !job || (!job.title && !job._id)
    const status = STATUS_MAP[app.status] || STATUS_MAP.pending
    const StatusIcon = status.icon
    const isRejected = app.status === 'rejected'

    return (
      <Card
        key={app._id}
        className={`transition-shadow ${isRejected ? 'opacity-70 bg-red-50/40 border-red-100' : 'hover:shadow-sm'}`}
      >
        <CardContent className="p-4 flex gap-4 items-start">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold shrink-0 mt-0.5
            ${isRejected ? 'bg-red-100 text-red-400' : 'bg-primary/5 text-primary'}`}>
            {isJobDeleted
              ? <BriefcaseBusiness className="h-5 w-5" />
              : (job?.companyName?.slice(0, 2).toUpperCase() || 'CV')}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <p className={`font-bold text-sm truncate ${isRejected ? 'text-slate-500' : ''}`}>
                {isJobDeleted ? 'Tin tuyển dụng đã bị gỡ' : job?.title}
              </p>
              <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold ${status.color}`}>
                <StatusIcon className="h-3 w-3" />
                {status.label}
              </span>
            </div>

            {!isJobDeleted && (
              <p className="text-xs text-muted-foreground">{job?.companyName} · {job?.location}</p>
            )}

            <p className="text-[10px] text-muted-foreground mt-1">
              Đã ứng tuyển: {new Date(app.createdAt).toLocaleDateString('vi-VN')}
            </p>

            {isRejected && (                    <p className="text-[11px] text-red-500 mt-1.5 font-medium flex items-center gap-1">
                        <XCircle className="h-3 w-3 shrink-0" />
                        {isJobDeleted
                          ? 'Tin tuyển dụng đã bị gỡ — đơn ứng tuyển đã tự động bị từ chối.'
                          : 'Nhà tuyển dụng đã từ chối đơn ứng tuyển của bạn.'}
                      </p>
            )}
          </div>

          {!isJobDeleted && !isRejected && job?._id && (
            <Button variant="outline" size="sm" asChild className="shrink-0 mt-0.5">
              <Link to={`/jobs/${job._id}`}>Chi tiết</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-5">
      <h3 className="font-bold text-foreground flex items-center gap-2">
        <Send className="h-4 w-4 text-primary" />
        Việc làm đã ứng tuyển ({apps.length})
      </h3>

      {apps.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="Bạn chưa ứng tuyển công việc nào"
          description="Khi bạn ứng tuyển, đơn ứng tuyển sẽ xuất hiện ở đây"
        />
      ) : (
        <>
          {active.length > 0 && (
            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                <Clock className="h-3 w-3" /> Đang xử lý ({active.length})
              </p>
              {active.map(renderCard)}
            </div>
          )}

          {resolved.length > 0 && (
            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                <CheckCircle className="h-3 w-3" /> Đã xử lý ({resolved.length})
              </p>
              {resolved.map(renderCard)}
            </div>
          )}
        </>
      )}
    </div>
  )
}
