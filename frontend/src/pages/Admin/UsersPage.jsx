import { useState, useEffect, useCallback } from 'react'
import { Search, Filter, UserX, UserCheck, Trash2, Eye, ChevronDown, Users, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { adminService } from '@/services/adminService'
import { cn } from '@/lib/utils'

const STATUS_STYLE = {
    active: { label: 'Hoạt động', bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' },
    banned: { label: 'Bị cấm', bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' },
    pending: { label: 'Chờ duyệt', bg: '#FFFBEB', text: '#D97706', border: '#FDE68A' },
}

const initials = name => name?.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase() || 'U'
const timeSince = iso => {
    const d = (Date.now() - new Date(iso)) / 1000
    if (d < 3600) return `${Math.floor(d / 60)} phút trước`
    if (d < 86400) return `${Math.floor(d / 3600)} giờ trước`
    return `${Math.floor(d / 86400)} ngày trước`
}

function UserDetailDialog({ user, open, onClose, onStatusChange }) {
    const [banReason, setBanReason] = useState('')
    const [showBanForm, setShowBanForm] = useState(false)
    const [loading, setLoading] = useState(false)

    if (!user) return null
    const s = STATUS_STYLE[user.status] || STATUS_STYLE.active

    const handleBan = async () => {
        setLoading(true)
        await adminService.updateUserStatus(user.id, 'banned', banReason)
        onStatusChange(user.id, 'banned', banReason)
        setLoading(false); setShowBanForm(false); onClose()
    }

    const handleUnban = async () => {
        setLoading(true)
        await adminService.updateUserStatus(user.id, 'active')
        onStatusChange(user.id, 'active')
        setLoading(false); onClose()
    }

    const handleApprove = async () => {
        setLoading(true)
        await adminService.updateUserStatus(user.id, 'active')
        onStatusChange(user.id, 'active')
        setLoading(false); onClose()
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Chi tiết người dùng</DialogTitle>
                </DialogHeader>

                {/* Profile */}
                <div className="flex gap-4 items-start">
                    <div className="w-14 h-14 rounded-xl bg-[#EEF2FF] flex items-center justify-center font-black text-lg text-[#1549B8] flex-shrink-0">
                        {initials(user.name)}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="font-bold text-[#0F172A]">{user.name}</h3>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full border"
                                style={{ backgroundColor: s.bg, color: s.text, borderColor: s.border }}>
                                {s.label}
                            </span>
                            <Badge variant="outline" className="text-xs">
                                {user.role === 'candidate' ? '👤 Ứng viên' : '🏢 NTD'}
                            </Badge>
                        </div>
                        <p className="text-sm text-[#475569]">{user.email}</p>
                        <p className="text-xs text-[#94A3B8]">{user.phone} · {user.location}</p>
                    </div>
                </div>

                <Separator />

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                    {user.role === 'candidate' ? (
                        <>
                            <div className="text-center p-3 bg-[#F8FAFC] rounded-xl">
                                <div className="font-black text-lg text-[#0F172A]">{user.cvCount}</div>
                                <div className="text-xs text-[#94A3B8]">CV chấm</div>
                            </div>
                            <div className="text-center p-3 bg-[#F8FAFC] rounded-xl">
                                <div className="font-black text-lg text-[#0F172A]">{user.appliedJobs}</div>
                                <div className="text-xs text-[#94A3B8]">Đã ứng tuyển</div>
                            </div>
                            <div className="text-center p-3 bg-[#F8FAFC] rounded-xl">
                                <div className="font-black text-lg text-[#0F172A]">{user.savedJobs}</div>
                                <div className="text-xs text-[#94A3B8]">Việc đã lưu</div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="text-center p-3 bg-[#F8FAFC] rounded-xl">
                                <div className="font-black text-lg text-[#0F172A]">{user.postedJobs}</div>
                                <div className="text-xs text-[#94A3B8]">Tin đăng</div>
                            </div>
                            <div className="text-center p-3 bg-[#F8FAFC] rounded-xl">
                                <div className="font-black text-lg text-[#0F172A]">{user.totalApplicants || 0}</div>
                                <div className="text-xs text-[#94A3B8]">Ứng viên</div>
                            </div>
                            <div className="text-center p-3 bg-[#F8FAFC] rounded-xl">
                                <div className="text-xs font-bold text-[#0F172A] mt-1">{user.companySize || '—'}</div>
                                <div className="text-xs text-[#94A3B8]">Quy mô</div>
                            </div>
                        </>
                    )}
                </div>

                {/* Timestamps */}
                <div className="space-y-1.5 text-xs text-[#94A3B8]">
                    <div className="flex justify-between">
                        <span>Ngày đăng ký</span>
                        <span className="font-medium text-[#475569]">{new Date(user.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Đăng nhập gần nhất</span>
                        <span className="font-medium text-[#475569]">{timeSince(user.lastLogin)}</span>
                    </div>
                    {user.banReason && (
                        <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg">
                            <span className="text-red-600 font-medium">Lý do cấm: </span>
                            <span className="text-red-500">{user.banReason}</span>
                        </div>
                    )}
                </div>

                {/* Ban form */}
                {showBanForm && (
                    <div className="space-y-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                        <Label className="text-xs text-red-700">Lý do cấm tài khoản *</Label>
                        <Textarea rows={2} value={banReason} onChange={e => setBanReason(e.target.value)}
                            placeholder="VD: Vi phạm điều khoản sử dụng, spam nội dung..." className="text-sm" />
                    </div>
                )}

                <DialogFooter className="gap-2 flex-wrap">
                    {user.status === 'pending' && (
                        <Button onClick={handleApprove} disabled={loading} className="bg-[#059669] hover:bg-[#047857] text-white gap-1.5 flex-1">
                            <UserCheck className="h-4 w-4" />Duyệt tài khoản
                        </Button>
                    )}
                    {user.status === 'active' && !showBanForm && (
                        <Button variant="destructive" onClick={() => setShowBanForm(true)} className="gap-1.5 flex-1">
                            <UserX className="h-4 w-4" />Cấm tài khoản
                        </Button>
                    )}
                    {user.status === 'active' && showBanForm && (
                        <Button variant="destructive" onClick={handleBan} disabled={loading || !banReason.trim()} className="gap-1.5 flex-1">
                            <UserX className="h-4 w-4" />Xác nhận cấm
                        </Button>
                    )}
                    {user.status === 'banned' && (
                        <Button onClick={handleUnban} disabled={loading} className="bg-[#059669] hover:bg-[#047857] text-white gap-1.5 flex-1">
                            <UserCheck className="h-4 w-4" />Mở cấm tài khoản
                        </Button>
                    )}
                    <Button variant="outline" onClick={onClose} className="flex-1">Đóng</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function UserRow({ user, onView, onStatusChange, onDelete }) {
    const s = STATUS_STYLE[user.status] || STATUS_STYLE.active
    return (
        <div className="flex items-center gap-3 py-3 border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC] px-2 rounded-lg transition-colors">
            <div className="w-9 h-9 rounded-full bg-[#EEF2FF] flex items-center justify-center font-bold text-xs text-[#1549B8] flex-shrink-0">
                {initials(user.name)}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-[#0F172A]">{user.name}</span>
                    <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full border"
                        style={{ backgroundColor: s.bg, color: s.text, borderColor: s.border, fontSize: 10 }}>
                        {s.label}
                    </span>
                </div>
                <p className="text-xs text-[#94A3B8]">{user.email} · {user.location}</p>
                {user.role === 'employer' && <p className="text-xs text-[#7C3AED] font-medium">{user.companyName}</p>}
            </div>
            <div className="text-xs text-[#94A3B8] hidden md:block flex-shrink-0 w-24 text-right">
                {timeSince(user.lastLogin)}
            </div>
            <div className="flex gap-1 flex-shrink-0">
                <Button variant="ghost" size="icon" onClick={() => onView(user)} className="h-8 w-8 text-[#475569] hover:text-[#1549B8]">
                    <Eye className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(user.id)} className="h-8 w-8 text-[#94A3B8] hover:text-red-500 hover:bg-red-50">
                    <Trash2 className="h-3.5 w-3.5" />
                </Button>
            </div>
        </div>
    )
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [keyword, setKeyword] = useState('')
    const [role, setRole] = useState('all')
    const [status, setStatus] = useState('all')
    const [selectedUser, setSelectedUser] = useState(null)

    const fetchUsers = useCallback(async () => {
        setLoading(true)
        const params = {}
        if (keyword) params.keyword = keyword
        if (role !== 'all') params.role = role
        if (status !== 'all') params.status = status
        const res = await adminService.getUsers(params)
        setUsers(res.data); setTotal(res.total)
        setLoading(false)
    }, [keyword, role, status])

    useEffect(() => { fetchUsers() }, [fetchUsers])

    const handleStatusChange = (id, newStatus, reason) => {
        setUsers(p => p.map(u => u.id === id ? { ...u, status: newStatus, ...(reason && { banReason: reason }) } : u))
    }

    const handleDelete = async id => {
        if (!confirm('Xác nhận xóa vĩnh viễn người dùng này?')) return
        await adminService.deleteUser(id)
        setUsers(p => p.filter(u => u.id !== id))
    }

    const counts = {
        all: users.length,
        candidate: users.filter(u => u.role === 'candidate').length,
        employer: users.filter(u => u.role === 'employer').length,
    }

    return (
        <div className="p-6 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-black text-[#0F172A]">Quản lý người dùng</h1>
                    <p className="text-sm text-[#94A3B8]">{total} người dùng trong hệ thống</p>
                </div>
            </div>

            {/* Filters */}
            <Card className="border-[#E2E8F0]">
                <CardContent className="p-4">
                    <div className="flex flex-wrap gap-3">
                        <div className="flex-1 min-w-52 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
                            <Input value={keyword} onChange={e => setKeyword(e.target.value)}
                                placeholder="Tìm theo tên, email..."
                                className="pl-9 border-[#E2E8F0] h-9 text-sm" />
                        </div>
                        <Select value={role} onValueChange={setRole}>
                            <SelectTrigger className="w-40 h-9 text-sm border-[#E2E8F0]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả vai trò</SelectItem>
                                <SelectItem value="candidate">Ứng viên</SelectItem>
                                <SelectItem value="employer">Nhà tuyển dụng</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="w-36 h-9 text-sm border-[#E2E8F0]">
                                <SelectValue />
                            </SelectTrigger>
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

            {/* Tabs by role */}
            <Tabs value={role === 'all' ? 'all' : role} onValueChange={v => setRole(v)}>
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-2 inline-block">
                    <TabsList className="bg-transparent gap-1">
                        {[
                            { key: 'all', label: `Tất cả (${counts.all})`, icon: Users },
                            { key: 'candidate', label: `Ứng viên (${counts.candidate})`, icon: Users },
                            { key: 'employer', label: `Nhà tuyển dụng (${counts.employer})`, icon: Building2 },
                        ].map(t => (
                            <TabsTrigger key={t.key} value={t.key}
                                className="text-xs gap-1.5 data-[state=active]:bg-[#EEF2FF] data-[state=active]:text-[#1549B8]">
                                <t.icon className="h-3.5 w-3.5" />{t.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                <Card className="border-[#E2E8F0] mt-3">
                    <CardContent className="p-4">
                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-12 shimmer-bg" />)}
                            </div>
                        ) : users.length === 0 ? (
                            <div className="py-12 text-center">
                                <p className="text-4xl mb-3">👥</p>
                                <p className="font-semibold text-[#0F172A]">Không tìm thấy người dùng nào</p>
                            </div>
                        ) : (
                            <div>
                                {users.map(user => (
                                    <UserRow key={user.id} user={user}
                                        onView={setSelectedUser}
                                        onStatusChange={handleStatusChange}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </Tabs>

            {/* Detail dialog */}
            <UserDetailDialog
                user={selectedUser}
                open={!!selectedUser}
                onClose={() => setSelectedUser(null)}
                onStatusChange={handleStatusChange}
            />
        </div>
    )
}