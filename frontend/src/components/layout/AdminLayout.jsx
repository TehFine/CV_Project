import { useState } from 'react'
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import {
    LayoutDashboard, Users, Briefcase, FileText, BarChart2,
    Settings, LogOut, Menu, X, ChevronRight, Bell, Shield,
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

export default function AdminLayout() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [collapsed, setCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

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
                            <button className="relative p-2 rounded-lg text-[#475569] hover:bg-[#F1F5F9] transition-colors">
                                <Bell className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                            </button>
                            {/* Admin badge */}
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#EEF2FF] rounded-lg border border-[#C7D2FE]">
                                <Shield className="h-3.5 w-3.5 text-[#1549B8]" />
                                <span className="text-xs font-bold text-[#1549B8]">Super Admin</span>
                            </div>
                        </div>
                    </div>
                </header>

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