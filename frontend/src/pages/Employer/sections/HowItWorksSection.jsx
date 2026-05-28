import { Card, CardContent } from "@/components/ui/card";
import { FileText, ClipboardList, Bot, Target } from "lucide-react";

const STEPS = [
  { num: "01", icon: FileText, title: "Đăng ký tài khoản", desc: "Tạo tài khoản nhà tuyển dụng miễn phí trong 2 phút với thông tin công ty." },
  { num: "02", icon: ClipboardList, title: "Đăng tin tuyển dụng", desc: "Tạo tin tuyển dụng chi tiết với mô tả công việc và yêu cầu kỹ năng." },
  { num: "03", icon: Bot, title: "AI lọc hồ sơ", desc: "Hệ thống AI tự động chấm điểm và xếp hạng CV theo mức độ phù hợp." },
  { num: "04", icon: Target, title: "Tuyển được người phù hợp", desc: "Liên hệ và phỏng vấn những ứng viên chất lượng nhất — nhanh hơn bao giờ hết." },
];

export function HowItWorksSection() {
  return (
    <section className="section" style={{ backgroundColor: "var(--bg-subtle)" }}>
      <div className="container-app">
        <div style={{ textAlign: "center", marginBottom: 32 }} className="md:mb-12">
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }} className="md:text-[28px]">Bắt đầu tuyển dụng chỉ với 4 bước</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>Đơn giản, nhanh chóng và hiệu quả</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
          {STEPS.map((step) => (
            <Card key={step.num} style={{ border: "1.5px solid var(--border)", borderRadius: 16, textAlign: "center", position: "relative", overflow: "hidden" }}>
              <CardContent style={{ padding: "28px 24px" }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "#1549B8" }}>
                  <step.icon size={26} />
                </div>
                <div style={{ position: "absolute", top: 16, right: 16, fontSize: 32, fontWeight: 900, color: "var(--border)", lineHeight: 1 }}>{step.num}</div>
                <h3 style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)", marginBottom: 8 }}>{step.title}</h3>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{step.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
