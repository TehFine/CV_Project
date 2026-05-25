import { useState, useEffect, useCallback } from 'react'
import { adminService } from '@/services/adminService'
import { UserFilters }    from './components/UserFilters'
import { UsersTable, UserDetailDialog } from './components/UsersTable'

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
    all:       users.length,
    candidate: users.filter(u => u.role === 'candidate').length,
    employer:  users.filter(u => u.role === 'employer').length,
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black text-[#0F172A]">Quản lý người dùng</h1>
          <p className="text-sm text-[#94A3B8]">{total} người dùng trong hệ thống</p>
        </div>
      </div>

      <UserFilters
        keyword={keyword} role={role} status={status}
        onKeyword={setKeyword} onRole={setRole} onStatus={setStatus}
      />

      <UsersTable
        users={users} loading={loading} role={role}
        onView={setSelectedUser} onStatusChange={handleStatusChange} onDelete={handleDelete}
        onRoleChange={setRole} counts={counts}
      />

      <UserDetailDialog
        user={selectedUser} open={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  )
}