import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Plus, ExternalLink } from 'lucide-react'

// TODO: Replace with real API data when CV history endpoint is available
const MOCK_CVS = [
  { id: 1, fileName: 'CV_NguyenVanAn_2025.pdf', overall: 85, grade: 'A', gradeLabel: 'Xuất sắc', scoredAt: '2025-01-20T10:30:00Z' },
  { id: 2, fileName: 'CV_Frontend_Updated.pdf', overall: 78, grade: 'B', gradeLabel: 'Tốt', scoredAt: '2025-01-15T14:20:00Z' },
]
const gradeVariant = { A: 'success', B: 'new', C: 'warning', D: 'destructive' }

export function CVTab() {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-foreground">Lịch sử phân tích CV</h3>
        <Button size="sm" asChild><Link to="/cv-upload"><Plus className="h-3.5 w-3.5 mr-1" />Phân tích CV mới</Link></Button>
      </div>
      {MOCK_CVS.map(cv => (
        <Card key={cv.id}>
          <CardContent className="p-4 flex gap-3 items-center">
            <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center text-xl shrink-0">📄</div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{cv.fileName}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={gradeVariant[cv.grade]} className="text-xs">Loại {cv.grade}</Badge>
                <span className="text-sm font-bold">{cv.overall}/100</span>
                <span className="text-xs text-muted-foreground">{cv.gradeLabel}</span>
                <Separator orientation="vertical" className="h-3" />
                <span className="text-xs text-muted-foreground">{new Date(cv.scoredAt).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/cv-upload"><ExternalLink className="h-3.5 w-3.5 mr-1" />Xem</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
