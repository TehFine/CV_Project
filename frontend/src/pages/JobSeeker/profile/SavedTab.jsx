import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Bookmark, BookmarkX, MapPin, Banknote, ArrowRight, BriefcaseBusiness } from 'lucide-react'
import { jobService } from '@/services/jobService'

export function SavedTab() {
  const [saved, setSaved] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [removingId, setRemovingId] = useState(null)

  const fetchSaved = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await jobService.getSavedJobs()
      // Handle both direct array and axios-wrapped response
      const list = Array.isArray(data) ? data : (data?.data || [])
      setSaved(list)
    } catch {
      setError('Không thể tải danh sách việc đã lưu. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSaved() }, [])

  const handleUnsave = async (jobId) => {
    try {
      setRemovingId(jobId)
      await jobService.toggleSaveJob(jobId)
      setSaved(prev => prev.filter(j => (j._id || j.id) !== jobId))
    } catch {
      // silent fail — item stays in list
    } finally {
      setRemovingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-destructive/5 rounded-xl border border-destructive/10">
        <p className="text-destructive text-sm mb-3">{error}</p>
        <Button variant="outline" size="sm" onClick={fetchSaved}>Thử lại</Button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          <Bookmark className="h-4 w-4 text-primary" />
          Việc làm đã lưu
          <Badge variant="secondary" className="text-xs font-bold">{saved.length}</Badge>
        </h3>
        <Button size="sm" variant="outline" asChild>
          <Link to="/jobs">Tìm thêm việc →</Link>
        </Button>
      </div>

      {saved.length === 0 ? (
        <Card>
          <CardContent className="py-14 text-center">
            <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Bookmark className="h-8 w-8 text-primary/40" />
            </div>
            <p className="font-semibold text-foreground mb-1">Bạn chưa lưu công việc nào</p>
            <p className="text-sm text-muted-foreground mb-5">
              Lưu các công việc yêu thích để xem lại sau
            </p>
            <Button asChild>
              <Link to="/jobs"><BriefcaseBusiness className="h-4 w-4 mr-2" />Khám phá việc làm</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        saved.map(job => {
          const id = job._id || job.id
          const companyInit = (job.companyName || job.company || 'J').slice(0, 2).toUpperCase()
          return (
            <Card key={id} className="hover:shadow-sm transition-all duration-200 hover:-translate-y-0.5">
              <CardContent className="p-4 flex gap-3 items-center">
                {/* Company avatar */}
                <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center font-black text-sm text-primary shrink-0">
                  {companyInit}
                </div>

                {/* Job info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{job.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {job.companyName || job.company}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1.5">
                    {(job.location) && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />{job.location}
                      </span>
                    )}
                    {(job.salary || job.salaryRange) && (
                      <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                        <Banknote className="h-3 w-3" />{job.salary || job.salaryRange}
                      </span>
                    )}
                    {job.type && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{job.type}</Badge>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <Button size="sm" asChild>
                    <Link to={`/jobs/${id}`}>
                      Xem <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost" size="sm"
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    disabled={removingId === id}
                    onClick={() => handleUnsave(id)}
                    title="Bỏ lưu"
                  >
                    {removingId === id
                      ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      : <BookmarkX className="h-3.5 w-3.5" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })
      )}
    </div>
  )
}
