import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, ChevronDown, LogOut, User, Bookmark, LayoutDashboard, Briefcase, Users, PlusCircle, Sparkles } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const CANDIDATE_NAV = [
  { href: '/jobs', label: 'Việc làm' },
  { href: '/cv-upload', label: 'Chấm điểm CV', badge: 'AI' },
]
const EMPLOYER_NAV = [
  { href: '/employer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/employer/jobs', label: 'Quản lý tin', icon: Briefcase },
  { href: '/employer/candidates', label: 'Ứng viên', icon: Users },
  { href: '/employer/post-job', label: 'Đăng tuyển', icon: PlusCircle, highlight: true },
]

const initials = name => name?.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase() || 'U'

export default function Header() {
  const { user, logout, isAuthenticated, isEmployer } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  const isHome = location.pathname === '/'
  const isActive = href => location.pathname === href || (href !== '/' && location.pathname.startsWith(href))
  const transparent = isHome && !scrolled

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  const handleLogout = () => { logout(); navigate('/') }
  const navLinks = isEmployer ? EMPLOYER_NAV : CANDIDATE_NAV

  return (
    <>
      <header className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        transparent ? 'bg-transparent' : 'bg-background/ backdrop-blur-lg border-b shadow-sm'
      )}>
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center gap-6">
          {/* Logo */}
          <Link to={isEmployer ? '/employer/dashboard' : '/'} className="flex items-center gap-2 flex-shrink-0 group">
            <div className="w-8 h-8 bg-[#1549B8] rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-sm">N</span>
            </div>
            <span className={cn('font-black text-xl tracking-tight', transparent ? 'text-white' : 'text-foreground')}>
              Nex<span className="text-violet-500">CV</span>
            </span>
            {isEmployer && <Badge variant="secondary" className="ml-1 text-[10px] px-1.5">NTD</Badge>}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                  link.highlight
                    ? 'bg-primary text-white hover:bg-primary/90 shadow-sm ml-1'
                    : isActive(link.href)
                      ? transparent ? 'bg-white/15 text-white' : 'bg-primary/10 text-primary font-semibold'
                      : transparent ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                {link.icon && <link.icon className="h-3.5 w-3.5" />}
                {link.label}
                {link.badge && <Badge variant="ai" className="text-[10px] px-1.5 py-0 h-4">{link.badge}</Badge>}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-2 ml-auto">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className={cn('gap-2 px-2 h-10', transparent && 'text-white hover:bg-white/10 hover:text-white')}>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">{initials(user?.name)}</AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden lg:block">
                      <div className="text-xs font-semibold leading-none">{user?.name?.split(' ').slice(-1)[0]}</div>
                      <div className={cn('text-[10px] leading-none mt-0.5', transparent ? 'text-white/60' : 'text-muted-foreground')}>
                        {isEmployer ? (user?.companyName || 'Nhà tuyển dụng') : 'Ứng viên'}
                      </div>
                    </div>
                    <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="font-semibold text-sm">{user?.name}</div>
                    <div className="text-xs text-muted-foreground font-normal mt-0.5">{user?.email}</div>
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
                      <DropdownMenuItem asChild><Link to="/cv-upload" className="cursor-pointer gap-2"><Sparkles className="h-4 w-4" />Chấm điểm CV</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link to="/profile?tab=saved" className="cursor-pointer gap-2"><Bookmark className="h-4 w-4" />Việc đã lưu</Link></DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer gap-2">
                    <LogOut className="h-4 w-4" />Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant={transparent ? 'outline' : 'ghost'} size="sm" asChild className={cn(transparent && 'border-white/40 text-white hover:bg-white/10 hover:text-white')}>
                  <Link to="/login">Đăng nhập</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/register">Đăng ký</Link>
                </Button>
                <Button variant="employer" size="sm" asChild>
                  <Link to="/register?role=employer">Nhà tuyển dụng</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden ml-auto">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={cn(transparent && 'text-white hover:bg-white/10')}>
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0 flex flex-col">
                <div className="p-5 border-b">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                      <span className="text-white font-black text-xs">N</span>
                    </div>
                    <span className="font-black text-lg">Nex<span className="text-violet-500">CV</span></span>
                  </div>
                  {isAuthenticated && (
                    <div className="flex items-center gap-2.5 mt-4 p-2.5 bg-muted rounded-lg">
                      <Avatar className="h-9 w-9"><AvatarFallback className="text-xs">{initials(user?.name)}</AvatarFallback></Avatar>
                      <div>
                        <div className="text-sm font-semibold">{user?.name}</div>
                        <div className="text-xs text-muted-foreground">{isEmployer ? 'Nhà tuyển dụng' : 'Ứng viên'}</div>
                      </div>
                    </div>
                  )}
                </div>
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                  {navLinks.map(link => (
                    <SheetClose asChild key={link.href}>
                      <Link to={link.href} className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                        link.highlight ? 'bg-primary text-white' : isActive(link.href) ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}>
                        {link.icon && <link.icon className="h-4 w-4" />}
                        {link.label}
                        {link.badge && <Badge variant="ai" className="text-[10px] px-1.5 h-4 ml-auto">{link.badge}</Badge>}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
                <div className="p-4 border-t space-y-2">
                  {isAuthenticated ? (
                    <Button variant="destructive" className="w-full gap-2" onClick={handleLogout}>
                      <LogOut className="h-4 w-4" />Đăng xuất
                    </Button>
                  ) : (
                    <>
                      <SheetClose asChild><Button variant="outline" className="w-full" asChild><Link to="/login">Đăng nhập</Link></Button></SheetClose>
                      <SheetClose asChild><Button className="w-full" asChild><Link to="/register">Đăng ký ứng viên</Link></Button></SheetClose>
                      <SheetClose asChild><Button variant="employer" className="w-full" asChild><Link to="/register?role=employer">Nhà tuyển dụng</Link></Button></SheetClose>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      {!isHome && <div className="h-16" />}
    </>
  )
}