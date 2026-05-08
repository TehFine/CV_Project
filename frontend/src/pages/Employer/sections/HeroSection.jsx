import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";

export function HeroSection() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <section
      style={{
        background: "linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4C1D95 100%)",
        paddingTop: 120,
        paddingBottom: 80,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: -100, right: -100, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: -80, left: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(76,29,149,0.4) 0%, transparent 70%)" }} />
        <svg style={{ position: "absolute", right: "5%", top: "20%", opacity: 0.15 }} width="200" height="200" viewBox="0 0 200 200">
          {Array.from({ length: 6 }).map((_, r) =>
            Array.from({ length: 6 }).map((_, c) => (
              <circle key={`${r}-${c}`} cx={c * 35 + 10} cy={r * 35 + 10} r="2.5" fill="white" />
            )),
          )}
        </svg>
      </div>

      <div className="container-app" style={{ position: "relative" }}>
        <div style={{ marginBottom: 20 }}>
          <Badge style={{ backgroundColor: "rgba(124,58,237,0.25)", color: "#C4B5FD", border: "1px solid rgba(124,58,237,0.4)", padding: "5px 14px", fontSize: 13, fontWeight: 500 }}>
            ✨ Nền tảng tuyển dụng thông minh với AI
          </Badge>
        </div>

        <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, color: "white", lineHeight: 1.1, marginBottom: 20, maxWidth: 700 }}>
          Tuyển dụng hiệu quả hơn
          <br />
          <span style={{ background: "linear-gradient(135deg, #60A5FA, #A78BFA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            với sức mạnh AI
          </span>
        </h1>

        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", marginBottom: 36, maxWidth: 520, lineHeight: 1.7 }}>
          Đăng tin tuyển dụng, nhận hồ sơ chất lượng và để AI tự động chấm điểm CV — tìm ứng viên phù hợp nhanh gấp 3 lần.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 40 }}>
          <Button size="lg" onClick={() => navigate(isAuthenticated ? "/employer/dashboard" : "/employer/register")}
            style={{ background: "white", color: "#4C1D95", fontWeight: 700, fontSize: 15, height: 48, padding: "0 28px" }}>
            🚀 {isAuthenticated ? "Vào Dashboard" : "Đăng ký miễn phí"}
          </Button>
          {!isAuthenticated && (
            <Button size="lg" variant="outline" onClick={() => navigate("/employer/login")}
              style={{ borderColor: "rgba(255,255,255,0.4)", color: "white", backgroundColor: "transparent", fontWeight: 600, fontSize: 15, height: 48, padding: "0 28px" }}>
              Đăng nhập
            </Button>
          )}
        </div>

        {/* Popular positions */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Tuyển nhiều nhất:</span>
          {["Frontend Developer", "Product Manager", "Data Analyst", "UI/UX Designer", "DevOps Engineer"].map((tag) => (
            <button key={tag} onClick={() => navigate(isAuthenticated ? "/employer/jobs/new" : "/employer/register")}
              style={{ fontSize: 12, padding: "4px 12px", borderRadius: 20, backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.8)", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")}>
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: 60 }}>
        <div className="container-app" style={{ paddingTop: 28, paddingBottom: 0 }}>
          <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
            {[
              { value: "2,000+", label: "Nhà tuyển dụng tin dùng", icon: "🏢" },
              { value: "50,000+", label: "CV đã được chấm điểm", icon: "🤖" },
              { value: "12,000+", label: "Ứng viên chất lượng", icon: "👥" },
              { value: "30s", label: "Chấm điểm CV tự động", icon: "⚡" },
            ].map((stat) => (
              <div key={stat.value} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>{stat.icon}</span>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "white", lineHeight: 1 }}>{stat.value}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
