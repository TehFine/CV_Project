import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Plus, Loader2, FileText, Eye, Trash2 } from 'lucide-react'
import { cvService } from '@/services/cvService'
import CVScoreModal from '@/components/CVScoreModal'

const gradeVariant = { A: 'success', B: 'new', C: 'warning', D: 'destructive' }

// Utility to fix font encoding issues if the backend saved UTF-8 as latin1
function fixEncoding(str) {
  if (!str) return str;
  try {
    // If the string contains mojibake like "Nguyá»…n", escape and decodeURIComponent will fix it
    return decodeURIComponent(escape(str));
  } catch {
    return str; // Return original if not valid encoded string
  }
}

function normalizeCV(item) {
  return {
    _id: item._id,
    id: item.id,
    fileName: fixEncoding(item.fileName || item.cvUrl || 'CV'),
    overall: item.overall ?? item.analysis?.overall ?? item.score ?? 0,
    grade: item.grade || item.analysis?.grade || '-',
    gradeLabel: item.gradeLabel || item.analysis?.gradeLabel || '',
    jobTitle: item.jobId?.title || null,
    scoredAt: item.createdAt || item.analysis?.scoredAt,
    createdAt: item.createdAt,
  }
}

export function CVTab() {
  const [cvs, setCvs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCv, setSelectedCv] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [deletingId, setDeletingId] = useState(null)   // id đang xóa
  const [confirmDeleteId, setConfirmDeleteId] = useState(null) // id chờ xác nhận

  const fetchCVs = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await cvService.getMyCVs()
      setCvs(Array.isArray(data) ? data.map(normalizeCV) : [])
    } catch {
      setError('Không thể tải danh sách CV. Vui lòng thử lại sau.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCVs()
  }, [])

  const handleViewCV = async (cv) => {
    try {
      setDetailLoading(true)
      setShowModal(true)
      const data = await cvService.getCVScore(cv._id || cv.id)
      // getCVScore returns axios response, extract data
      const scoreData = data?.data?.data || data?.data || data
      setSelectedCv({
        ...scoreData,
        fileName: scoreData.fileName || cv.fileName,
        overall: scoreData.overall ?? scoreData.score ?? cv.overall,
        grade: scoreData.grade || cv.grade,
        gradeLabel: scoreData.gradeLabel || cv.gradeLabel,
      })    } catch {
      // If detail fetch fails, show what we have
      setSelectedCv({...cv,
        categories: [],
        strengths: [],
        improvements: [],
      })
    } finally {
      setDetailLoading(false)
    }
  }

  const handleDeleteCV = async (id) => {
    try {
      setDeletingId(id)
      await cvService.deleteCVScore(id)
      setCvs(prev => prev.filter(cv => (cv._id || cv.id) !== id))
    } catch {
      setError('Xóa thất bại. Vui lòng thử lại.')
    } finally {
      setDeletingId(null)
      setConfirmDeleteId(null)
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
        <Button variant="outline" size="sm" onClick={fetchCVs}>Thử lại</Button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-foreground">Lịch sử phân tích CV</h3>
        <Button size="sm" asChild>
          <Link to="/cv-upload"><Plus className="h-3.5 w-3.5 mr-1" />Phân tích CV mới</Link>
        </Button>
      </div>

      {cvs.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mb-4"><FileText className="h-12 w-12 mx-auto text-muted-foreground/50" /></div>
            <p className="font-semibold mb-1">Bạn chưa phân tích CV nào</p>
            <p className="text-sm text-muted-foreground mb-5">
              Tải lên CV để AI phân tích và đánh giá năng lực của bạn
            </p>
            <Button asChild>
              <Link to="/cv-upload"><FileText className="h-4 w-4 mr-2" />Phân tích CV ngay</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        cvs.map(cv => (
          <Card key={cv._id || cv.id}>
            <CardContent className="p-4 flex gap-3 items-center">
              <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center shrink-0"><FileText className="h-5 w-5 text-primary" /></div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{cv.fileName}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge variant={gradeVariant[cv.grade] || 'secondary'} className="text-xs">
                    Loại {cv.grade || '-'}
                  </Badge>
                  {cv.jobTitle && (
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                      Mục tiêu: {cv.jobTitle}
                    </Badge>
                  )}
                  <span className="text-sm font-bold">{cv.overall}/100</span>
                  {cv.gradeLabel && (
                    <span className="text-xs text-muted-foreground">{cv.gradeLabel}</span>
                  )}
                  <Separator orientation="vertical" className="h-3" />
                  <span className="text-xs text-muted-foreground">
                    {cv.createdAt ? new Date(cv.createdAt).toLocaleDateString('vi-VN') : ''}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Button variant="outline" size="sm" onClick={() => handleViewCV(cv)} disabled={detailLoading}>
                  <Eye className="h-3.5 w-3.5 mr-1" />Xem
                </Button>
                {confirmDeleteId === (cv._id || cv.id) ? (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="destructive" size="sm"
                      disabled={deletingId === (cv._id || cv.id)}
                      onClick={() => handleDeleteCV(cv._id || cv.id)}
                    >
                      {deletingId === (cv._id || cv.id)
                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        : 'Xác nhận'}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setConfirmDeleteId(null)}>
                      Hủy
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost" size="sm"
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setConfirmDeleteId(cv._id || cv.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}

      {/* Score Detail Modal */}
      <CVScoreModal
        open={showModal}
        onClose={() => { setShowModal(false); setSelectedCv(null) }}
        result={selectedCv}
      />
    </div>
  )
}
