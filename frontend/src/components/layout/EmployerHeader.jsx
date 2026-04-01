import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const NAV_LINKS = [
  { href: "/employer/dashboard", label: "Dashboard" },
  { href: "/employer/jobs", label: "Tin tuyển dụng" },
  { href: "/employer/jobs/new", label: "Đăng tin mới" },
];

export default function EmployerHeader() {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href) =>
    href === "/employer/jobs"
      ? location.pathname === href
      : location.pathname === href || location.pathname.startsWith(href + "/");

  const handleLogout = () => {
    logout();
    navigate("/employer/login");
  };

  const initials =
    user?.name
      ?.split(" ")
      .slice(-2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "HR";

  return (
    <>
      <header className="employer-header">
        <div className="employer-header-inner">
          {/* Logo */}
          <Link to="/employer/" className="employer-logo">
            <div className="employer-logo-icon">
              <span>N</span>
            </div>
            <span className="employer-logo-text">
              Nex<span style={{ color: "#7C3AED" }}>CV</span>
              <Badge variant="secondary" className="employer-badge">
                Nhà tuyển dụng
              </Badge>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="employer-nav desktop-only">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                className={`employer-nav-link ${isActive(l.href) ? "active" : ""}`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="employer-header-right desktop-only">
            {isAuthenticated ? (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/employer/jobs/new">➕ Đăng tin</Link>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="employer-avatar-btn">
                      <Avatar className="employer-avatar">
                        <AvatarFallback className="employer-avatar-fallback">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="employer-user-info">
                        <span className="employer-user-name">
                          {user?.name?.split(" ").slice(-1)[0]}
                        </span>
                        <span className="employer-user-role">
                          Nhà tuyển dụng
                        </span>
                      </div>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" style={{ width: 220 }}>
                    <DropdownMenuLabel>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>
                        {user?.name}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "#94A3B8",
                          fontWeight: 400,
                        }}
                      >
                        {user?.email}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/employer/dashboard">📊 Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/employer/jobs">📋 Quản lý tin đăng</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/employer/jobs/new">➕ Đăng tin mới</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {/* Link quay về trang tìm việc */}
                    <DropdownMenuItem asChild>
                      <Link to="/" style={{ color: "#64748B" }}>
                        🔄 Về trang tìm việc
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      style={{ color: "#EF4444", cursor: "pointer" }}
                    >
                      🚪 Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/employer/login">Đăng nhập</Link>
                </Button>
                <Button size="sm" style={{ background: "#7C3AED" }} asChild>
                  <Link to="/employer/register">Đăng ký miễn phí</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="employer-hamburger mobile-only"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {mobileOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="employer-mobile-menu">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                onClick={() => setMobileOpen(false)}
                className={`employer-mobile-link ${isActive(l.href) ? "active" : ""}`}
              >
                {l.label}
              </Link>
            ))}
            <div className="employer-mobile-actions">
              {isAuthenticated ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="w-full"
                  >
                    <Link to="/" onClick={() => setMobileOpen(false)}>
                      🔄 Trang tìm việc
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={handleLogout}
                  >
                    🚪 Đăng xuất
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="w-full"
                  >
                    <Link
                      to="/employer/login"
                      onClick={() => setMobileOpen(false)}
                    >
                      Đăng nhập
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    className="w-full"
                    style={{ background: "#7C3AED" }}
                    asChild
                  >
                    <Link
                      to="/employer/register"
                      onClick={() => setMobileOpen(false)}
                    >
                      Đăng ký
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <div style={{ height: 64 }} />

      <style>{`
        .employer-header {
          position: fixed; top: 0; left: 0; right: 0; z-index: 50;
          background: white;
          border-bottom: 1.5px solid #E2E8F0;
          box-shadow: 0 1px 8px rgba(0,0,0,0.06);
        }
        .employer-header-inner {
          max-width: 1200px; margin: 0 auto;
          padding: 0 24px;
          height: 64px;
          display: flex; align-items: center; gap: 24px;
        }
        .employer-logo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; flex-shrink: 0;
        }
        .employer-logo-icon {
          width: 32px; height: 32px; border-radius: 8px;
          background: #7C3AED;
          display: flex; align-items: center; justify-content: center;
        }
        .employer-logo-icon span { color: white; font-weight: 900; font-size: 14px; }
        .employer-logo-text {
          font-weight: 800; font-size: 18px; color: #0F172A;
          letter-spacing: -0.5px;
          display: flex; align-items: center; gap: 8px;
        }
        .employer-badge {
          font-size: 10px !important; padding: 2px 8px !important;
          background: rgba(124,58,237,0.1) !important;
          color: #7C3AED !important; border: none !important;
        }
        .employer-nav {
          display: flex; align-items: center; gap: 2px; flex: 1;
        }
        .employer-nav-link {
          padding: 6px 14px; border-radius: 8px; font-size: 13px; font-weight: 500;
          color: #64748B; text-decoration: none; transition: all 0.15s;
          white-space: nowrap;
        }
        .employer-nav-link:hover { background: #F8FAFC; color: #0F172A; }
        .employer-nav-link.active {
          background: rgba(124,58,237,0.08); color: #7C3AED; font-weight: 600;
        }
        .employer-header-right {
          display: flex; align-items: center; gap: 10px; margin-left: auto;
        }
        .employer-avatar-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 4px 10px 4px 4px; border-radius: 10px;
          border: 1.5px solid #E2E8F0; background: white;
          cursor: pointer; transition: all 0.15s; color: #64748B;
        }
        .employer-avatar-btn:hover { background: #F8FAFC; border-color: #CBD5E1; }
        .employer-avatar { width: 32px !important; height: 32px !important; }
        .employer-avatar-fallback {
          background: linear-gradient(135deg, #7C3AED, #1E40AF) !important;
          color: white !important; font-size: 12px !important; font-weight: 700 !important;
        }
        .employer-user-info { display: flex; flex-direction: column; text-align: left; }
        .employer-user-name { font-size: 13px; font-weight: 600; color: #0F172A; line-height: 1.2; }
        .employer-user-role { font-size: 10px; color: #7C3AED; font-weight: 500; }
        .employer-hamburger {
          display: none; margin-left: auto; background: none; border: none;
          cursor: pointer; padding: 4px; color: #0F172A;
        }
        .employer-mobile-menu {
          border-top: 1px solid #E2E8F0; padding: 16px 24px 20px;
          display: flex; flex-direction: column; gap: 4px;
        }
        .employer-mobile-link {
          display: block; padding: 10px 12px; border-radius: 8px;
          font-size: 14px; font-weight: 500; color: #475569; text-decoration: none;
        }
        .employer-mobile-link.active { background: rgba(124,58,237,0.08); color: #7C3AED; font-weight: 600; }
        .employer-mobile-actions {
          display: flex; gap: 10px; margin-top: 12px; padding-top: 12px;
          border-top: 1px solid #E2E8F0;
        }
        .desktop-only { display: flex; }
        .mobile-only { display: none; }
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
          .mobile-only { display: block !important; }
          .employer-hamburger { display: block; }
        }
      `}</style>
    </>
  );
}
