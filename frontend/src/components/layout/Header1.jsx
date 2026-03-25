import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, ChevronDown, LogOut, User, Bookmark, LayoutDashboard, Briefcase, Users, PlusCircle, Sparkles, FileEdit } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const CANDIDATE_NAV = [
  { href: '/jobs',      label: 'Việc làm' },
  { href: '/cv-upload', label: 'Chấm điểm CV', badge: 'AI' },
]
const EMPLOYER_NAV = [
  { href: '/employer/dashboard', label: 'Dashboard',   icon: LayoutDashboard },
  { href: '/employer/jobs',      label: 'Quản lý tin', icon: Briefcase },
  { href: '/employer/candidates',label: 'Ứng viên',    icon: Users },
  { href: '/employer/post-job',  label: 'Đăng tuyển',  icon: PlusCircle, highlight: true },
]

const initials = name => name?.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase() || 'U'

export default function Header() {
  const { user, logout, isAuthenticated, isEmployer } = useAuth()
  const location  = useLocation()
  const navigate  = useNavigate()

  const isActive = href => location.pathname === href || (href !== '/' && location.pathname.startsWith(href))
  const navLinks  = isEmployer ? EMPLOYER_NAV : CANDIDATE_NAV

  const handleLogout = () => { logout(); navigate('/') }

  // "Tạo CV" — yêu cầu đăng nhập
  const handleCreateCV = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cv-builder' } })
    } else {
      navigate('/cv-builder')
    }
  }

  return (
    <>
      {/* Always-white header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E2E8F0] shadow-sm">
        <div className="container-app h-16 flex items-center gap-5">

          {/* ── Logo ─────────────────────────────────────────── */}
          <Link to={isEmployer ? '/employer/dashboard' : '/'} className="flex items-center gap-2 flex-shrink-0 group">
            <div className="w-8 h-8 bg-[#1549B8] rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-sm">N</span>
            </div>
            <span className="font-black text-xl tracking-tight text-[#0F172A]">
              Nex<span className="text-violet-600">CV</span>
            </span>
            {isEmployer && (
              <Badge className="ml-1 text-[10px] px-1.5 bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100">
                NTD
              </Badge>
            )}
          </Link>

          {/* ── Desktop nav ───────────────────────────────────── */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                  link.highlight
                    ? 'bg-[#1549B8] text-white hover:bg-[#1240A0] shadow-sm ml-1'
                    : isActive(link.href)
                      ? 'bg-[#EEF2FF] text-[#1549B8] font-semibold'
                      : 'text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
                )}
              >
                {link.icon && <link.icon className="h-3.5 w-3.5" />}
                {link.label}
                {link.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-700">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* ── Right side ────────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-2 ml-auto">
            {/* Nút Tạo CV — luôn hiển thị */}
            {!isEmployer && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCreateCV}
                className="gap-1.5 border-[#E2E8F0] text-[#1549B8] hover:bg-[#EEF2FF] hover:border-[#1549B8]/30 font-semibold"
              >
                <FileEdit className="h-3.5 w-3.5" />
                Tạo CV
              </Button>
            )}

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 px-2 h-10 hover:bg-[#F1F5F9]">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-[#1549B8] text-white font-bold">
                        {initials(user?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden lg:block">
                      <div className="text-xs font-semibold leading-none text-[#0F172A]">
                        {user?.name?.split(' ').slice(-1)[0]}
                      </div>
                      <div className="text-[10px] leading-none mt-0.5 text-[#94A3B8]">
                        {isEmployer ? (user?.companyName || 'Nhà tuyển dụng') : 'Ứng viên'}
                      </div>
                    </div>
                    <ChevronDown className="h-3.5 w-3.5 text-[#94A3B8]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 shadow-lg">
                  <DropdownMenuLabel>
                    <div className="font-semibold text-sm text-[#0F172A]">{user?.name}</div>
                    <div className="text-xs text-[#94A3B8] font-normal mt-0.5">{user?.email}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isEmployer ? (
                    <>
                      <DropdownMenuItem asChild><Link to="/employer/dashboard" className="cursor-pointer gap-2"><LayoutDashboard className="h-4 w-4" />Dashboard</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link to="/employer/post-job" className="cursor-pointer gap-2"><PlusCircle className="h-4 w-4" />Đăng tin tuyển dụng</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link to="/employer/candidates" className="cursor-pointer gap-2"><Users className="h-4 w-4" />Quản lý ứng viên</Link></DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem asChild><Link to="/profile" className="cursor-pointer gap-2"><User className="h-4 w-4" />Hồ sơ của tôi</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link to="/cv-builder" className="cursor-pointer gap-2"><FileEdit className="h-4 w-4" />Tạo CV</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link to="/cv-upload" className="cursor-pointer gap-2"><Sparkles className="h-4 w-4" />Chấm điểm CV</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link to="/profile?tab=saved" className="cursor-pointer gap-2"><Bookmark className="h-4 w-4" />Việc đã lưu</Link></DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 cursor-pointer gap-2">
                    <LogOut className="h-4 w-4" />Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild className="text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] border border-[#E2E8F0]">
                  <Link to="/login">Đăng nhập</Link>
                </Button>
                <Button size="sm" asChild className="bg-[#1549B8] hover:bg-[#1240A0] text-white shadow-sm">
                  <Link to="/register">Đăng ký</Link>
                </Button>
                <Button size="sm" asChild className="bg-[#0F172A] hover:bg-slate-800 text-white shadow-sm">
                  <Link to="/register?role=employer">Nhà tuyển dụng</Link>
                </Button>
              </>
            )}
          </div>

          {/* ── Mobile hamburger ──────────────────────────────── */}
          <div className="md:hidden ml-auto">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-[#475569] hover:bg-[#F1F5F9]">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0 flex flex-col">
                <div className="p-5 border-b">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 bg-[#1549B8] rounded-lg flex items-center justify-center">
                      <span className="text-white font-black text-xs">N</span>
                    </div>
                    <span className="font-black text-lg text-[#0F172A]">Nex<span className="text-violet-600">CV</span></span>
                  </div>
                  {isAuthenticated && (
                    <div className="flex items-center gap-2.5 p-2.5 bg-[#F1F5F9] rounded-lg">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="text-xs bg-[#1549B8] text-white font-bold">{initials(user?.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-semibold text-[#0F172A]">{user?.name}</div>
                        <div className="text-xs text-[#94A3B8]">{isEmployer ? 'Nhà tuyển dụng' : 'Ứng viên'}</div>
                      </div>
                    </div>
                  )}
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                  {navLinks.map(link => (
                    <SheetClose asChild key={link.href}>
                      <Link to={link.href} className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                        link.highlight
                          ? 'bg-[#1549B8] text-white'
                          : isActive(link.href)
                            ? 'bg-[#EEF2FF] text-[#1549B8]'
                            : 'text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
                      )}>
                        {link.icon && <link.icon className="h-4 w-4" />}
                        {link.label}
                        {link.badge && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-700 ml-auto">{link.badge}</span>
                        )}
                      </Link>
                    </SheetClose>
                  ))}
                  {!isEmployer && (
                    <SheetClose asChild>
                      <button onClick={handleCreateCV} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#475569] hover:bg-[#F1F5F9] w-full text-left">
                        <FileEdit className="h-4 w-4" />Tạo CV
                      </button>
                    </SheetClose>
                  )}
                </nav>

                <div className="p-4 border-t space-y-2">
                  {isAuthenticated ? (
                    <Button variant="destructive" className="w-full gap-2" onClick={handleLogout}>
                      <LogOut className="h-4 w-4" />Đăng xuất
                    </Button>
                  ) : (
                    <>
                      <SheetClose asChild><Button variant="outline" className="w-full" asChild><Link to="/login">Đăng nhập</Link></Button></SheetClose>
                      <SheetClose asChild><Button className="w-full bg-[#1549B8] hover:bg-[#1240A0]" asChild><Link to="/register">Đăng ký ứng viên</Link></Button></SheetClose>
                      <SheetClose asChild><Button className="w-full bg-[#0F172A] hover:bg-slate-800" asChild><Link to="/register?role=employer">Nhà tuyển dụng</Link></Button></SheetClose>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Spacer */}
      <div className="h-16" />
    </>
  )
}