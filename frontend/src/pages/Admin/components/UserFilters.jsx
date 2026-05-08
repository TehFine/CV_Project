import { Search } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function UserFilters({ keyword, role, status, onKeyword, onRole, onStatus }) {
  return (
    <Card className="border-[#E2E8F0]">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-52 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
            <Input value={keyword} onChange={e => onKeyword(e.target.value)}
              placeholder="Tìm theo tên, email..."
              className="pl-9 border-[#E2E8F0] h-9 text-sm" />
          </div>
          <Select value={role} onValueChange={onRole}>
            <SelectTrigger className="w-40 h-9 text-sm border-[#E2E8F0]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả vai trò</SelectItem>
              <SelectItem value="candidate">Ứng viên</SelectItem>
              <SelectItem value="employer">Nhà tuyển dụng</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={onStatus}>
            <SelectTrigger className="w-36 h-9 text-sm border-[#E2E8F0]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="active">Hoạt động</SelectItem>
              <SelectItem value="banned">Bị cấm</SelectItem>
              <SelectItem value="pending">Chờ duyệt</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
