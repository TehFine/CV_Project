import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { Sparkles, Bot, ArrowRight } from "lucide-react";

const SCORE_BARS = [
  { label: "Kỹ năng phù hợp", pct: 94, color: "#34D399" },
  { label: "Kinh nghiệm", pct: 90, color: "#60A5FA" },
  { label: "Học vấn", pct: 88, color: "#A78BFA" },
  { label: "Từ khóa ATS", pct: 92, color: "#FCD34D" },
];

export function AIPromoSection() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <section className="section">
      <div className="container-app">
        <div style={{ background: "linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4C1D95 100%)", borderRadius: 24, padding: "clamp(32px, 5vw, 56px)", position: "relative", overflow: "hidden", display: "flex", gap: 40, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ position: "absolute", top: -60, right: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(124,58,237,0.2)", pointerEvents: "none" }} />

          <div style={{ flex: 1, minWidth: 280, position: "relative" }}>
            <Badge style={{ backgroundColor: "rgba(124,58,237,0.2)", color: "#C4B5FD", border: "1px solid rgba(124,58,237,0.3)", marginBottom: 16 }}>
              <Bot className="inline-block h-3.5 w-3.5 mr-1" />AI-Powered CV Scoring
            </Badge>
            <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 800, color: "white", lineHeight: 1.2, marginBottom: 16 }}>
              Lọc ứng viên thông minh<br />với AI chấm điểm CV
            </h2>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
              AI của NexCV tự động phân tích CV và cho điểm theo 5 tiêu chí — giúp bạn tìm ứng viên phù hợp nhất trong vài giây.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Button size="lg" onClick={() => navigate(isAuthenticated ? "/employer/dashboard" : "/employer/register")}
                style={{ background: "white", color: "#1549B8", fontWeight: 700 }}>
                <Sparkles className="h-4 w-4" /> {isAuthenticated ? "Vào Dashboard" : "Dùng thử miễn phí"}
              </Button>
              {!isAuthenticated && (
                <Button size="lg" variant="outline" onClick={() => navigate("/employer/login")}
                  style={{ borderColor: "rgba(255,255,255,0.3)", color: "white", backgroundColor: "transparent" }}>
                  Đăng nhập <ArrowRight className="inline-block h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </div>

          {/* Score preview */}
          <div style={{ width: 280, backgroundColor: "rgba(255,255,255,0.07)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 16, padding: 24, flexShrink: 0 }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", border: "4px solid #60A5FA", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", backgroundColor: "rgba(96,165,250,0.2)" }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: "white" }}>91</span>
              </div>
              <div style={{ fontSize: 13, color: "#93C5FD", fontWeight: 600 }}>Điểm phù hợp — Nguyễn Văn An</div>
            </div>
            {SCORE_BARS.map((item) => (
              <div key={item.label} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>
                  <span>{item.label}</span>
                  <span style={{ fontWeight: 600, color: "white" }}>{item.pct}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${item.pct}%`, background: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
