import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function SavedTab() {
  // TODO: Connect to saved jobs API when endpoint is available
  const [saved] = useState([])

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-foreground">Việc làm đã lưu ({saved.length})</h3>
      {saved.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">Bạn chưa lưu công việc nào.</CardContent></Card>
      ) : (
        saved.map(job => (
          <Card key={job.id} className="hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200">
            <CardContent className="p-4 flex gap-3 items-center">
              <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center font-black text-sm text-primary shrink-0">
                {job.company.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{job.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{job.company} · {job.location} · <span className="text-emerald-600 font-medium">{job.salary}</span></p>
              </div>
              <Button size="sm" asChild><Link to={`/jobs/${job.id}`}>Xem →</Link></Button>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
