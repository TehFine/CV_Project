import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const getInitials = (name, fallback = "U") => {
  if (!name) return fallback;
  try {
    const parts = name.trim().split(/\s+/);
    return parts.slice(-2).map((w) => w[0]).join("").toUpperCase() || fallback;
  } catch {
    return fallback;
  }
};

export default function UserDropdown({
  user,
  roleLabel,
  roleTagCls,
  userBtnCls,
  avatarCls,
  items = [],
  extraItems = null,
  fallbackInitial = "U",
  logoutRedirect = "/"
}) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate(logoutRedirect);
  };

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((v) => !v)} className={userBtnCls}>
        <div className={avatarCls}>{getInitials(user?.name, fallbackInitial)}</div>
        <div className="flex flex-col text-left">
          <span className="text-[13px] font-semibold leading-tight">
            {user?.name?.split(" ").slice(-1)[0] ?? fallbackInitial}
          </span>
          <span className={roleTagCls}>{roleLabel}</span>
        </div>
        <ChevronDown className="w-3.5 h-3.5" />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] w-56 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="px-4 py-3 border-b border-slate-100">
            <div className="text-[13px] font-semibold text-slate-900">{user?.name}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{user?.email}</div>
          </div>
          
          <div className="p-1.5">
            {items.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] text-slate-600 hover:bg-slate-50 transition-colors"
              >
                {item.icon && item.icon} {item.label}
              </Link>
            ))}
          </div>

          {extraItems && (
            <div className="p-1.5 border-t border-slate-100" onClick={() => setOpen(false)}>
              {extraItems}
            </div>
          )}

          <div className="p-1.5 border-t border-slate-100">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] text-red-600 hover:bg-red-50 transition-colors w-full text-left"
            >
              <LogOut size={14} /> Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
