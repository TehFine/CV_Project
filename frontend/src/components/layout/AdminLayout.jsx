import { useState, useEffect, useCallback } from 'react'
import { adminService } from '@/services/adminService'
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import {
    LayoutDashboard, Users, Briefcase, FileText, BarChart2,
    Settings, LogOut, Menu, X, ChevronRight, Bell, Shield, CheckCircle2, Info, AlertTriangle,
    DollarSign
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
    {
        group: 'Tổng quan',
        items: [
            { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
            { href: '/admin/reports', label: 'Báo cáo & Thống kê', icon: BarChart2 },
        ],
    },
    {
        group: 'Quản lý nội dung',
        items: [
            { href: '/admin/users', label: 'Người dùng', icon: Users, badge: null },
            { href: '/admin/jobs', label: 'Tin tuyển dụng', icon: Briefcase, badge: '3' },
            { href: '/admin/cv-scores', label: 'Lịch sử chấm CV', icon: FileText },
        ],
    },
    {
        group: 'Hệ thống',
        items: [
            { href: '/admin/settings', label: 'Cài đặt', icon: Settings },
        ],
    },
]

function NavItem({ item, collapsed, onClick }) {
    const location = useLocation()
    const isActive = location.pathname === item.href ||
        (item.href !== '/admin' && location.pathname.startsWith(item.href))

    return (
        <Link
            to={item.href}
            onClick={onClick}
            className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative',
                isActive
                    ? 'bg-white text-[#1549B8] shadow-sm font-semibold'
                    : 'text-slate-400 hover:bg-white/10 hover:text-white'
            )}
        >
            <item.icon className={cn('h-4.5 w-4.5 flex-shrink-0', isActive ? 'text-[#1549B8]' : 'text-slate-400 group-hover:text-white')}
                style={{ width: 18, height: 18 }} />
            {!collapsed && (
                <>
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500 text-white">
                            {item.badge}
                        </span>
                    )}
                </>
            )}
            {collapsed && isActive && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-[#0F172A] text-white text-xs rounded-lg whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
                    {item.label}
                </div>
            )}
        </Link>
    )
}

const MOCK_NOTIFICATIONS = [
    { id: 1, title: 'Tin tuyển dụng mới', message: 'Công ty ABC vừa đăng tin "Frontend Developer" chờ bạn duyệt.', type: 'info', time: '5 phút trước', unread: true, jobId: 101 },
    { id: 2, title: 'Người dùng mới', message: 'Có 5 ứng viên mới vừa đăng ký tài khoản trong hôm nay.', type: 'success', time: '1 giờ trước', unread: true },
    { id: 3, title: 'Báo cáo hệ thống', message: 'Hệ thống đã tự động sao lưu dữ liệu thành công.', type: 'success', time: '3 giờ trước', unread: false },
    { id: 4, title: 'Cảnh báo', message: 'Phát hiện nhiều lượt đăng nhập thất bại từ IP 192.168.1.1', type: 'warning', time: '5 giờ trước', unread: false },
]

function NotificationDropdown({ notifications, setNotifications, onSelect, onClose }) {
    const navigate = useNavigate()
    const markAllRead = async () => {
        const updated = notifications.map(n => ({ ...n, unread: false }))
        setNotifications(updated)
        try { await adminService.markAllNotificationsRead() } catch(e) { /* silent */ }
        localStorage.setItem("nexcv_mock_notifications", JSON.stringify(updated))
    }

    return (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in duration-200">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <span className="font-bold text-sm text-slate-900">Thông báo</span>
                <button onClick={markAllRead} className="text-[11px] font-semibold text-[#1549B8] hover:underline">
                    Đánh dấu đã đọc
                </button>
            </div>
            <div className="max-h-[360px] overflow-auto">
                {notifications.length > 0 ? (
                    notifications.map(n => (
                        <div 
                            key={n.id} 
                            onClick={() => { onSelect(n); onClose(); }}
                            className={cn(
                                "px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3",
                                n.unread && "bg-blue-50/30"
                            )}
                        >
                            <div className={cn(
                                "w-9 h-9 rounded-full flex items-center justify-center shrink-0",
                                n.type === 'success' ? "bg-emerald-100 text-emerald-600" :
                                n.type === 'warning' ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
                            )}>
                                {n.type === 'success' ? <CheckCircle2 size={16} /> :
                                 n.type === 'warning' ? <AlertTriangle size={16} /> : <Info size={16} />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="font-bold text-[13px] text-slate-900 truncate">{n.title}</span>
                                    {n.unread && <div className="w-2 h-2 bg-blue-600 rounded-full shrink-0" />}
                                </div>
                                <p className="text-[12px] text-slate-500 leading-snug mt-0.5 line-clamp-2">{n.message}</p>
                                <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-12 text-center">
                        <Bell className="h-8 w-8 text-slate-200 mx-auto mb-2" />
                        <p className="text-sm text-slate-400">Không có thông báo mới</p>
                    </div>
                )}
            </div>
            <div className="px-4 py-2 border-t border-slate-100 text-center bg-slate-50/50">
                <button 
                    onClick={() => { navigate('/admin/notifications'); onClose(); }}
                    className="text-[12px] font-bold text-slate-600 hover:text-[#1549B8] transition-colors"
                >
                    Xem tất cả thông báo
                </button>
            </div>
        </div>
    )
}

function NotificationModal({ notification, onClose, onMarkRead, navigate }) {
    const [jobDetails, setJobDetails] = useState(null)
    const [loadingJob, setLoadingJob] = useState(false)

    useEffect(() => {
        if (notification?.jobId) {
            setLoadingJob(true)
            // Lấy thông tin chi tiết từ adminService (hoặc mock)
            adminService.getJobs().then(res => {
                const found = res.data.find(j => j.id == notification.jobId)
                if (found) setJobDetails(found)
                setLoadingJob(false)
            }).catch(() => setLoadingJob(false))
        } else {
            setJobDetails(null)
        }
    }, [notification])

    if (!notification) return null;

    const handleAction = async (status) => {
        onMarkRead(notification.id);
        if (notification.jobId && status) {
            await adminService.updateJobStatus(notification.jobId, status);
        } else if (notification.title.includes('Tin tuyển dụng')) {
            navigate(notification.jobId ? `/admin/jobs/${notification.jobId}` : '/admin/jobs');
        } else if (notification.title.includes('Người dùng')) {
            navigate('/admin/users');
        }
        onClose();
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-300">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center",
                            notification.type === 'success' ? "bg-emerald-100 text-emerald-600" :
                            notification.type === 'warning' ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
                        )}>
                            {notification.type === 'success' ? <CheckCircle2 size={24} /> :
                             notification.type === 'warning' ? <AlertTriangle size={24} /> : <Info size={24} />}
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                            <X size={20} />
                        </button>
                    </div>
                    
                    <h3 className="text-xl font-black text-slate-900 mb-2">{notification.title}</h3>
                    <p className="text-slate-500 text-[15px] leading-relaxed mb-6">{notification.message}</p>
                    
                    {/* Job Quick Review */}
                    {loadingJob ? (
                        <div className="py-8 text-center text-slate-400 text-sm">Đang tải thông tin công việc...</div>
                    ) : jobDetails && (
                        <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 max-h-[300px] overflow-y-auto custom-scrollbar">
                            <div className="flex flex-wrap gap-4 mb-4">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                                    <DollarSign size={12} /> {jobDetails.salary}
                                </div>
                                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                                    <Briefcase size={12} /> {jobDetails.level}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-[13px] font-bold text-slate-900 mb-1">Mô tả công việc:</h4>
                                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{jobDetails.description}</p>
                                </div>
                                <div>
                                    <h4 className="text-[13px] font-bold text-slate-900 mb-1">Yêu cầu:</h4>
                                    <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                                        {Array.isArray(jobDetails.requirements) ? jobDetails.requirements.join('\n') : jobDetails.requirements}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-[13px] font-bold text-slate-900 mb-1">Quyền lợi:</h4>
                                    <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                                        {Array.isArray(jobDetails.benefits) ? jobDetails.benefits.join('\n') : jobDetails.benefits}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-2 text-slate-400 text-xs mb-8">
                        <Bell size={12} />
                        <span>Nhận được vào {notification.time}</span>
                    </div>

                    <div className="flex gap-3">
                        <Button variant="outline" className="rounded-xl h-11 font-bold" onClick={onClose}>
                            Đóng
                        </Button>
                        {notification.jobId ? (
                            <>
                                <Button 
                                    className="flex-1 rounded-xl h-11 font-bold bg-[#1549B8] hover:bg-[#1e40af]" 
                                    onClick={() => handleAction()}
                                >
                                    Xem chi tiết →
                                </Button>
                                <Button 
                                    className="rounded-xl h-11 font-bold bg-emerald-600 hover:bg-emerald-700 px-4" 
                                    onClick={() => handleAction('active')}
                                >
                                    Duyệt ngay
                                </Button>
                            </>
                        ) : (
                            <Button className="flex-1 rounded-xl h-11 font-bold bg-[#1549B8] hover:bg-[#1e40af]" onClick={() => handleAction()}>
                                Xem chi tiết
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function AdminLayout() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [collapsed, setCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [showNotifications, setShowNotifications] = useState(false)
    const [notifications, setNotifications] = useState([])
    const [selectedNotif, setSelectedNotif] = useState(null)

    // Fetch notifications từ API + fallback localStorage
    const fetchNotifications = useCallback(async () => {
        try {
            const res = await adminService.getNotifications();
            if (res?.data) {
                setNotifications(res.data);
            }
        } catch (e) {
            const stored = localStorage.getItem("nexcv_mock_notifications");
            if (stored) {
                setNotifications(JSON.parse(stored));
            }
        }
    }, []);

    const location = useLocation();

    // Load notifications + auto-polling + re-fetch on route change + visibility/focus change
    useEffect(() => {
        fetchNotifications();

        // Poll mỗi 15 giây để cập nhật realtime hơn
        const intervalId = setInterval(fetchNotifications, 15000);

        // Re-fetch khi user quay lại tab trình duyệt
        const handleVisibility = () => {
            if (document.visibilityState === 'visible') {
                fetchNotifications();
            }
        };
        document.addEventListener('visibilitychange', handleVisibility);

        // Re-fetch khi user chuyển cửa sổ (Alt+Tab) quay lại
        const handleFocus = () => { fetchNotifications(); };
        window.addEventListener('focus', handleFocus);

        // Lắng nghe storage event (cho mock mode)
        const handleStorage = (e) => {
            if (e.key === "nexcv_mock_notifications") {
                setNotifications(JSON.parse(e.newValue));
            }
        };
        window.addEventListener("storage", handleStorage);

        return () => {
            clearInterval(intervalId);
            document.removeEventListener('visibilitychange', handleVisibility);
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener("storage", handleStorage);
        };
    }, [fetchNotifications, location.pathname]);

    const unreadCount = (notifications || []).filter(n => n.unread).length

    const handleMarkRead = async (id) => {
        const updated = notifications.map(n => n.id === id ? { ...n, unread: false } : n)
        setNotifications(updated)
        try {
            await adminService.markNotificationRead(id);
            // Sync lại từ server sau khi đánh dấu để đảm bảo đồng bộ
            fetchNotifications();
        } catch(e) { /* silent */ }
        localStorage.setItem("nexcv_mock_notifications", JSON.stringify(updated))
    }

    const handleLogout = () => { logout(); navigate('/admin/login') }
    const initials = name => name?.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase() || 'AD'

    const SidebarContent = ({ onLinkClick }) => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className={cn('flex items-center gap-3 px-4 py-5 flex-shrink-0', collapsed && 'justify-center px-2')}>
                <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                    <Shield className="h-5 w-5 text-[#1549B8]" />
                </div>
                {!collapsed && (
                    <div>
                        <span className="font-black text-lg text-white tracking-tight">
                            Nex<span className="text-violet-400">CV</span>
                        </span>
                        <div className="text-[10px] text-slate-400 font-medium -mt-0.5">Admin Panel</div>
                    </div>
                )}
            </div>

            <Separator className="bg-white/10 mx-3 mb-3" />

            {/* Navigation */}
            <nav className="flex-1 px-3 overflow-y-auto space-y-5 pb-3">
                {NAV_ITEMS.map(group => (
                    <div key={group.group}>
                        {!collapsed && (
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-1.5">
                                {group.group}
                            </p>
                        )}
                        <div className="space-y-0.5">
                            {group.items.map(item => (
                                <NavItem key={item.href} item={item} collapsed={collapsed} onClick={onLinkClick} />
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            <Separator className="bg-white/10 mx-3 mt-1 mb-3" />

            {/* User info + logout */}
            <div className={cn('px-3 pb-4', collapsed && 'flex flex-col items-center')}>
                {!collapsed && (
                    <div className="flex items-center gap-2.5 p-2.5 bg-white/5 rounded-xl mb-2 border border-white/10">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarFallback className="text-xs bg-[#1549B8] text-white font-bold">
                                {initials(user?.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-white truncate">{user?.name}</div>
                            <div className="text-[10px] text-slate-400">{user?.email}</div>
                        </div>
                    </div>
                )}
                <button
                    onClick={handleLogout}
                    className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-colors w-full',
                        collapsed && 'justify-center'
                    )}
                >
                    <LogOut className="h-4 w-4 flex-shrink-0" />
                    {!collapsed && <span>Đăng xuất</span>}
                </button>
            </div>
        </div>
    )

    return (
        <div className="h-screen flex bg-[#F1F5F9] overflow-hidden">
            {/* ── Desktop Sidebar ───────────────────────────────────── */}
            <aside className={cn(
                'hidden lg:flex flex-col bg-[#0F172A] transition-all duration-300 flex-shrink-0 relative h-full',
                collapsed ? 'w-16' : 'w-60'
            )}>
                <SidebarContent onLinkClick={null} />
                {/* Collapse toggle */}
                <button
                    onClick={() => setCollapsed(v => !v)}
                    className="absolute -right-3 top-20 w-6 h-6 bg-[#0F172A] border border-white/20 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors z-10"
                >
                    <ChevronRight className={cn('h-3.5 w-3.5 transition-transform', collapsed ? '' : 'rotate-180')} />
                </button>
            </aside>

            {/* ── Mobile Sidebar overlay ────────────────────────────── */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
                    <aside className="absolute left-0 top-0 bottom-0 w-64 bg-[#0F172A] flex flex-col">
                        <SidebarContent onLinkClick={() => setMobileOpen(false)} />
                    </aside>
                </div>
            )}

            {/* ── Main content ──────────────────────────────────────── */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Topbar */}
                <header className="bg-white border-b border-[#E2E8F0] shadow-sm flex-shrink-0 z-10">
                    <div className="h-14 px-6 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setMobileOpen(true)} className="lg:hidden text-[#475569] hover:text-[#0F172A]">
                                <Menu className="h-5 w-5" />
                            </button>
                            <div>
                                <PageTitle />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Notifications */}
                            <div className="relative">
                                <button 
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className={cn(
                                        "p-2 rounded-lg transition-colors relative",
                                        showNotifications ? "bg-[#EEF2FF] text-[#1549B8]" : "text-[#475569] hover:bg-[#F1F5F9]"
                                    )}
                                >
                                    <Bell className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>
                                {showNotifications && (
                                    <NotificationDropdown 
                                        notifications={notifications} 
                                        setNotifications={setNotifications}
                                        onSelect={(n) => {
                                            setSelectedNotif(n);
                                            handleMarkRead(n.id);
                                        }}
                                        onClose={() => {
                                            setShowNotifications(false);
                                            // Fetch lại khi đóng dropdown để đồng bộ
                                            fetchNotifications();
                                        }} 
                                    />
                                )}
                            </div>
                            {/* Admin badge */}
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#EEF2FF] rounded-lg border border-[#C7D2FE]">
                                <Shield className="h-3.5 w-3.5 text-[#1549B8]" />
                                <span className="text-xs font-bold text-[#1549B8]">Super Admin</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Notification Details Modal */}
                <NotificationModal 
                    notification={selectedNotif} 
                    onClose={() => setSelectedNotif(null)} 
                    onMarkRead={handleMarkRead}
                    navigate={navigate}
                />

                {/* Page content */}
                <main className="flex-1 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

// Dynamically show page title in topbar
function PageTitle() {
    const location = useLocation()
    const titles = {
        '/admin': { label: 'Dashboard', icon: LayoutDashboard },
        '/admin/users': { label: 'Quản lý người dùng', icon: Users },
        '/admin/jobs': { label: 'Quản lý tin tuyển dụng', icon: Briefcase },
        '/admin/cv-scores': { label: 'Lịch sử chấm điểm CV', icon: FileText },
        '/admin/reports': { label: 'Báo cáo & Thống kê', icon: BarChart2 },
        '/admin/settings': { label: 'Cài đặt hệ thống', icon: Settings },
    }
    const page = titles[location.pathname] || { label: 'Admin', icon: Shield }
    const Icon = page.icon
    return (
        <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-[#1549B8]" />
            <span className="font-bold text-sm text-[#0F172A]">{page.label}</span>
        </div>
    )
}