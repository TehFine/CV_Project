import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { BarChart3, Rocket, ClipboardList } from "lucide-react";

export function CTASection() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <section className="section-sm">
      <div className="container-app">
          <div style={{ textAlign: "center", padding: "32px 20px", backgroundColor: "#EEF2FF", borderRadius: 16, border: "1px solid rgba(21,73,184,0.15)" }} className="md:p-12 md:rounded-[20px]">
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", marginBottom: 10 }} className="md:text-[28px]">
            Sẵn sàng tìm ứng viên chất lượng?
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: 28, fontSize: 15 }}>
            Tham gia cùng 2,000+ nhà tuyển dụng đã tin dùng NexCV — hoàn toàn miễn phí
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Button size="lg"
              onClick={() => navigate(isAuthenticated ? "/employer/dashboard" : "/employer/register")}
              style={{ background: "linear-gradient(135deg, #1549B8, #1E40AF)", color: "white", fontWeight: 700, padding: "0 28px", height: 48 }}>
              {isAuthenticated ? <><BarChart3 size={16} /> Vào Dashboard</> : <><Rocket size={16} /> Đăng ký nhà tuyển dụng miễn phí</>}
            </Button>
            <Button size="lg" variant="outline"
              onClick={() => navigate(isAuthenticated ? "/employer/jobs/new" : "/employer/register")}
              style={{ fontWeight: 600, height: 48, padding: "0 28px" }}>
              <><ClipboardList size={16} /> Đăng tin tuyển dụng ngay</>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
