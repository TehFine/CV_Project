import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LogOut,
  User,
  Bookmark,
<<<<<<< HEAD
=======
  LayoutDashboard,
  Briefcase,
  Users,
  PlusCircle,
>>>>>>> auth_module
  Sparkles,
  FileEdit,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
<<<<<<< HEAD
=======
import { Badge } from "@/components/ui/badge";
>>>>>>> auth_module
import { cn } from "@/lib/utils";
import { useRef } from "react";

const CANDIDATE_NAV = [
  { href: "/jobs", label: "Việc làm" },
  { href: "/cv-upload", label: "Chấm điểm CV", badge: "AI" },
];
<<<<<<< HEAD

=======
const EMPLOYER_NAV = [
  { href: "/employer/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/employer/jobs", label: "Tin tuyển dụng", icon: Briefcase },
  {
    href: "/employer/jobs/new",
    label: "Đăng tin",
    icon: PlusCircle,
    highlight: true,
  },
];
>>>>>>> auth_module
const getInitials = (name) =>
  name
    ?.split(" ")
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "U";

export default function Header() {
<<<<<<< HEAD
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const headerRef = useRef(null);

  const isHome = location.pathname === "/";
=======
  const { user, logout, isAuthenticated, isEmployer } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const headerRef = useRef(null);

  // ── Giữ nguyên 100% từ Header 2 ────────────────────────────────────────
  const isHome = location.pathname === "/";
  const isEmployerPage = location.pathname.startsWith("/employer");
>>>>>>> auth_module

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const close = (e) => {
      if (!e.target.closest("#user-dropdown")) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => {
    if (!headerRef.current) return;
<<<<<<< HEAD
    const updateHeight = () => {
      const height = headerRef.current.offsetHeight;
      document.documentElement.style.setProperty("--header-height", `${height}px`);
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(headerRef.current);
    window.addEventListener("resize", updateHeight);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  const headerBg = scrolled || !isHome ? "rgba(255,255,255,0.97)" : "transparent";
  const logoColor = !scrolled && isHome ? "white" : "var(--primary)";
  const linkColor = !scrolled && isHome ? "rgba(255,255,255,0.9)" : "var(--text-secondary)";
=======

    const updateHeight = () => {
      const height = headerRef.current.offsetHeight;
      document.documentElement.style.setProperty('--header-height', `${height}px`);
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(headerRef.current);

    window.addEventListener('resize', updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, []);


  // ── Exact same color vars as Header 2 ──────────────────────────────────
  const headerBg =
    scrolled || !isHome ? "rgba(255,255,255,0.97)" : "transparent";
  const logoColor = !scrolled && isHome ? "white" : "var(--primary)";
  const linkColor =
    !scrolled && isHome ? "rgba(255,255,255,0.9)" : "var(--text-secondary)";
>>>>>>> auth_module
  const linkActiveColor = !scrolled && isHome ? "white" : "var(--primary)";

  const isActive = (href) =>
    location.pathname === href || location.pathname.startsWith(href + "/");

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/");
  };

  const handleCreateCV = () => {
<<<<<<< HEAD
    if (!isAuthenticated) navigate("/login", { state: { from: "/cv-builder" } });
    else navigate("/cv-builder");
  };

  return (
    <>
=======
    if (!isAuthenticated)
      navigate("/login", { state: { from: "/cv-builder" } });
    else navigate("/cv-builder");
  };

  const navLinks = isEmployer ? EMPLOYER_NAV : CANDIDATE_NAV;

  return (
    <>
      {/* ── Header — style object copy từ Header 2 ──────────────────────── */}
>>>>>>> auth_module
      <header
        ref={headerRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backgroundColor: headerBg,
          boxShadow: scrolled ? "0 1px 8px rgba(0,0,0,0.08)" : "none",
          backdropFilter: scrolled || !isHome ? "blur(12px)" : "none",
          transition: "all 0.25s ease",
<<<<<<< HEAD
          borderBottom: scrolled ? "1px solid #E2E8F0" : "1px solid transparent",
=======
          borderBottom: scrolled
            ? "1px solid #E2E8F0"
            : "1px solid transparent",
>>>>>>> auth_module
        }}
      >
        <div
          className="container-app"
          style={{ display: "flex", alignItems: "center", height: 64, gap: 20 }}
        >
          {/* Logo */}
          <Link
<<<<<<< HEAD
            to="/"
=======
            to={isEmployer ? "/employer/dashboard" : "/"}
>>>>>>> auth_module
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "#1549B8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
<<<<<<< HEAD
              <span style={{ color: "white", fontWeight: 900, fontSize: 14 }}>N</span>
=======
              <span style={{ color: "white", fontWeight: 900, fontSize: 14 }}>
                N
              </span>
>>>>>>> auth_module
            </div>
            <span
              style={{
                fontWeight: 800,
                fontSize: 20,
                letterSpacing: "-0.5px",
                color: logoColor,
                transition: "color 0.25s",
              }}
            >
              Nex<span style={{ color: "#7C3AED" }}>CV</span>
            </span>
<<<<<<< HEAD
=======
            {isEmployer && (
              <Badge className="ml-1 text-[10px] px-1.5 bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100">
                NTD
              </Badge>
            )}
>>>>>>> auth_module
          </Link>

          {/* Desktop Nav */}
          <nav
            style={{ display: "flex", alignItems: "center", gap: 4, flex: 1 }}
            className="hidden md:flex"
          >
<<<<<<< HEAD
            {CANDIDATE_NAV.map((link) => {
              const active = isActive(link.href);
=======
            {navLinks.map((link) => {
              const active = isActive(link.href);
              if (link.highlight)
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 14px",
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 600,
                      backgroundColor: "#1549B8",
                      color: "white",
                      textDecoration: "none",
                      marginLeft: 4,
                      boxShadow: "0 1px 4px rgba(21,73,184,.25)",
                    }}
                  >
                    <link.icon style={{ width: 14, height: 14 }} />
                    {link.label}
                  </Link>
                );
>>>>>>> auth_module
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 14px",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: active ? 600 : 500,
                    color: active ? linkActiveColor : linkColor,
                    textDecoration: "none",
                    transition: "all 0.2s",
                    backgroundColor: active
<<<<<<< HEAD
                      ? scrolled || !isHome ? "#EEF2FF" : "rgba(255,255,255,0.15)"
                      : "transparent",
                  }}
                >
=======
                      ? scrolled || !isHome
                        ? "#EEF2FF"
                        : "rgba(255,255,255,0.15)"
                      : "transparent",
                  }}
                >
                  {link.icon && <link.icon style={{ width: 14, height: 14 }} />}
>>>>>>> auth_module
                  {link.label}
                  {link.badge && (
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "2px 6px",
                        borderRadius: 99,
                        background: "#EDE9FE",
                        color: "#6D28D9",
                      }}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right side — desktop */}
          <div
            className="hidden md:flex"
            style={{ alignItems: "center", gap: 8, marginLeft: "auto" }}
          >
            {/* Tạo CV */}
<<<<<<< HEAD
            <button
              onClick={handleCreateCV}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 14px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                color: scrolled || !isHome ? "#1549B8" : "white",
                background: "transparent",
                border: `1.5px solid ${scrolled || !isHome ? "#C7D7FA" : "rgba(255,255,255,0.5)"}`,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  scrolled || !isHome ? "#EEF2FF" : "rgba(255,255,255,0.15)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <FileEdit style={{ width: 14, height: 14 }} />
              Tạo CV
            </button>
=======
            {!isEmployer && (
              <button
                onClick={handleCreateCV}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 14px",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  color: scrolled || !isHome ? "#1549B8" : "white",
                  background: "transparent",
                  border: `1.5px solid ${scrolled || !isHome ? "#C7D7FA" : "rgba(255,255,255,0.5)"}`,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    scrolled || !isHome ? "#EEF2FF" : "rgba(255,255,255,0.15)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <FileEdit style={{ width: 14, height: 14 }} />
                Tạo CV
              </button>
            )}
>>>>>>> auth_module

            {isAuthenticated ? (
              /* User dropdown */
              <div id="user-dropdown" style={{ position: "relative" }}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "4px 8px",
                    borderRadius: 8,
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
<<<<<<< HEAD
                      scrolled || !isHome ? "#F1F5F9" : "rgba(255,255,255,0.15)")
=======
                      scrolled || !isHome
                        ? "#F1F5F9"
                        : "rgba(255,255,255,0.15)")
>>>>>>> auth_module
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
<<<<<<< HEAD
=======
                  {/* Avatar */}
>>>>>>> auth_module
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "#1549B8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "white",
                      flexShrink: 0,
                    }}
                  >
                    {getInitials(user?.name)}
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        lineHeight: 1.2,
                        color: scrolled || !isHome ? "#0F172A" : "white",
                      }}
                    >
                      {user?.name?.split(" ").slice(-1)[0]}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
<<<<<<< HEAD
                        color: scrolled || !isHome ? "#94A3B8" : "rgba(255,255,255,0.7)",
                      }}
                    >
                      Ứng viên
=======
                        color:
                          scrolled || !isHome
                            ? "#94A3B8"
                            : "rgba(255,255,255,0.7)",
                      }}
                    >
                      {isEmployer
                        ? user?.companyName || "Nhà tuyển dụng"
                        : "Ứng viên"}
>>>>>>> auth_module
                    </div>
                  </div>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
<<<<<<< HEAD
                    stroke={scrolled || !isHome ? "#94A3B8" : "rgba(255,255,255,0.7)"}
=======
                    stroke={
                      scrolled || !isHome ? "#94A3B8" : "rgba(255,255,255,0.7)"
                    }
>>>>>>> auth_module
                    strokeWidth="2"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "calc(100% + 8px)",
                      width: 228,
                      backgroundColor: "white",
                      borderRadius: 12,
                      boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                      border: "1px solid #E2E8F0",
                      overflow: "hidden",
                      zIndex: 100,
                      animation: "fadeInUp 0.15s ease",
                    }}
                  >
<<<<<<< HEAD
                    <div style={{ padding: "12px 16px", borderBottom: "1px solid #E2E8F0" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{user?.name}</div>
                      <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{user?.email}</div>
                    </div>

                    {[
                      { href: "/profile", icon: <User size={14} />, label: "Hồ sơ của tôi" },
                      { href: "/cv-builder", icon: <FileEdit size={14} />, label: "Tạo CV" },
                      { href: "/cv-upload", icon: <Sparkles size={14} />, label: "Chấm điểm CV" },
                      { href: "/profile?tab=saved", icon: <Bookmark size={14} />, label: "Việc đã lưu" },
                    ].map((item) => (
                      <DDLink key={item.href} {...item} onClick={() => setDropdownOpen(false)} />
                    ))}
=======
                    <div
                      style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid #E2E8F0",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#0F172A",
                        }}
                      >
                        {user?.name}
                      </div>
                      <div
                        style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}
                      >
                        {user?.email}
                      </div>
                    </div>

                    {!isEmployer &&
                      [
                        {
                          href: "/profile",
                          icon: <User size={14} />,
                          label: "Hồ sơ của tôi",
                        },
                        {
                          href: "/cv-builder",
                          icon: <FileEdit size={14} />,
                          label: "Tạo CV",
                        },
                        {
                          href: "/cv-upload",
                          icon: <Sparkles size={14} />,
                          label: "Chấm điểm CV",
                        },
                        {
                          href: "/profile?tab=saved",
                          icon: <Bookmark size={14} />,
                          label: "Việc đã lưu",
                        },
                      ].map((item) => (
                        <DDLink
                          key={item.href}
                          {...item}
                          onClick={() => setDropdownOpen(false)}
                        />
                      ))}

                    {isEmployer &&
                      [
                        {
                          href: "/employer/dashboard",
                          icon: <LayoutDashboard size={14} />,
                          label: "Dashboard",
                        },
                        {
                          href: "/employer/post-job",
                          icon: <PlusCircle size={14} />,
                          label: "Đăng tin tuyển dụng",
                        },
                        {
                          href: "/employer/candidates",
                          icon: <Users size={14} />,
                          label: "Quản lý ứng viên",
                        },
                      ].map((item) => (
                        <DDLink
                          key={item.href}
                          {...item}
                          accent
                          onClick={() => setDropdownOpen(false)}
                        />
                      ))}
>>>>>>> auth_module

                    <div style={{ borderTop: "1px solid #E2E8F0" }}>
                      <button
                        onClick={handleLogout}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          width: "100%",
                          padding: "10px 16px",
                          fontSize: 13,
                          color: "#DC2626",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          textAlign: "left",
                          fontFamily: "inherit",
                          transition: "background 0.15s",
                        }}
<<<<<<< HEAD
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FEF2F2")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
=======
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#FEF2F2")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "transparent")
                        }
>>>>>>> auth_module
                      >
                        <LogOut size={14} /> Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Guest buttons */
              <>
                <Link
                  to="/login"
                  style={{
                    padding: "7px 16px",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 500,
                    color: scrolled || !isHome ? "#0F172A" : "white",
                    textDecoration: "none",
                    border: `1.5px solid ${scrolled || !isHome ? "#E2E8F0" : "rgba(255,255,255,0.5)"}`,
                    transition: "all 0.2s",
                  }}
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  style={{
                    padding: "7px 16px",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    backgroundColor: "#1549B8",
                    color: "white",
                    textDecoration: "none",
                    boxShadow: "0 2px 8px rgba(21,73,184,0.3)",
                    transition: "all 0.2s",
                  }}
                >
                  Đăng ký
                </Link>
                <a
                  href="/employer"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: "7px 16px",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    backgroundColor: "#0F172A",
                    color: "white",
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                >
                  Nhà tuyển dụng
                </a>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden" style={{ marginLeft: "auto" }}>
            <Sheet>
              <SheetTrigger asChild>
<<<<<<< HEAD
                <button style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4 }}>
=======
                <button
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: 4,
                  }}
                >
>>>>>>> auth_module
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={scrolled || !isHome ? "#475569" : "white"}
                    strokeWidth="2"
                  >
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0 flex flex-col">
                <div className="p-5 border-b">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 bg-[#1549B8] rounded-lg flex items-center justify-center">
                      <span className="text-white font-black text-xs">N</span>
                    </div>
                    <span className="font-black text-lg text-[#0F172A]">
                      Nex<span className="text-violet-600">CV</span>
                    </span>
                  </div>
                  {isAuthenticated && (
                    <div className="flex items-center gap-2.5 p-2.5 bg-[#F1F5F9] rounded-lg">
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          background: "#1549B8",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 13,
                          fontWeight: 700,
                          color: "white",
                        }}
                      >
                        {getInitials(user?.name)}
                      </div>
                      <div>
<<<<<<< HEAD
                        <div className="text-sm font-semibold text-[#0F172A]">{user?.name}</div>
                        <div className="text-xs text-[#94A3B8]">Ứng viên</div>
=======
                        <div className="text-sm font-semibold text-[#0F172A]">
                          {user?.name}
                        </div>
                        <div className="text-xs text-[#94A3B8]">
                          {isEmployer ? "Nhà tuyển dụng" : "Ứng viên"}
                        </div>
>>>>>>> auth_module
                      </div>
                    </div>
                  )}
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
<<<<<<< HEAD
                  {CANDIDATE_NAV.map((link) => (
=======
                  {navLinks.map((link) => (
>>>>>>> auth_module
                    <SheetClose asChild key={link.href}>
                      <Link
                        to={link.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
<<<<<<< HEAD
                          isActive(link.href)
                            ? "bg-[#EEF2FF] text-[#1549B8]"
                            : "text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
                        )}
                      >
=======
                          link.highlight
                            ? "bg-[#1549B8] text-white"
                            : isActive(link.href)
                              ? "bg-[#EEF2FF] text-[#1549B8]"
                              : "text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]",
                        )}
                      >
                        {link.icon && <link.icon className="h-4 w-4" />}
>>>>>>> auth_module
                        {link.label}
                        {link.badge && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-700 ml-auto">
                            {link.badge}
                          </span>
                        )}
                      </Link>
                    </SheetClose>
                  ))}
<<<<<<< HEAD
                  <SheetClose asChild>
                    <button
                      onClick={handleCreateCV}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#475569] hover:bg-[#F1F5F9] w-full text-left"
                    >
                      <FileEdit className="h-4 w-4" /> Tạo CV
                    </button>
                  </SheetClose>
=======
                  {!isEmployer && (
                    <SheetClose asChild>
                      <button
                        onClick={handleCreateCV}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#475569] hover:bg-[#F1F5F9] w-full text-left"
                      >
                        <FileEdit className="h-4 w-4" /> Tạo CV
                      </button>
                    </SheetClose>
                  )}
>>>>>>> auth_module
                </nav>

                <div className="p-4 border-t space-y-2">
                  {isAuthenticated ? (
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    >
                      <LogOut className="h-4 w-4" /> Đăng xuất
                    </button>
                  ) : (
                    <>
                      <SheetClose asChild>
                        <Link
                          to="/login"
                          className="block w-full py-2.5 text-center rounded-lg text-sm font-medium border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
                          style={{ textDecoration: "none" }}
                        >
                          Đăng nhập
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          to="/register"
                          className="block w-full py-2.5 text-center rounded-lg text-sm font-semibold bg-[#1549B8] text-white hover:bg-[#1240A0] transition-colors"
                          style={{ textDecoration: "none" }}
                        >
                          Đăng ký ứng viên
                        </Link>
                      </SheetClose>
                      <a
                        href="/employer"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-2.5 text-center rounded-lg text-sm font-semibold bg-[#0F172A] text-white hover:bg-slate-800 transition-colors"
                        style={{ textDecoration: "none" }}
                      >
                        Nhà tuyển dụng
                      </a>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

<<<<<<< HEAD
=======
      {/* Spacer — chỉ thêm khi không phải home (giống Header 2) */}
>>>>>>> auth_module
      {!isHome && <div style={{ height: 64 }} />}
    </>
  );
}

/* Dropdown link helper */
<<<<<<< HEAD
function DDLink({ href, icon, label, onClick }) {
=======
function DDLink({ href, icon, label, onClick, accent = false }) {
>>>>>>> auth_module
  return (
    <Link
      to={href}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 16px",
        fontSize: 13,
<<<<<<< HEAD
        color: "#475569",
        textDecoration: "none",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F8FAFC")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
=======
        color: accent ? "#7C3AED" : "#475569",
        textDecoration: "none",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.backgroundColor = accent
          ? "rgba(124,58,237,0.06)"
          : "#F8FAFC")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.backgroundColor = "transparent")
      }
>>>>>>> auth_module
    >
      {icon} {label}
    </Link>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> auth_module
