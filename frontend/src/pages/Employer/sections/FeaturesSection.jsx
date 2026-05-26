import { Card, CardContent } from "@/components/ui/card";

const FEATURES = [
  { icon: "📋", title: "Đăng tin dễ dàng", desc: "Tạo tin tuyển dụng chuyên nghiệp trong vài phút với template có sẵn" },
  { icon: "🤖", title: "AI chấm điểm CV", desc: "Tự động phân tích và xếp hạng ứng viên theo mức độ phù hợp" },
  { icon: "📊", title: "Dashboard thống kê", desc: "Theo dõi lượt xem, ứng tuyển và hiệu quả từng tin đăng" },
  { icon: "👥", title: "Quản lý ứng viên", desc: "Xem hồ sơ, cập nhật trạng thái và liên hệ ứng viên tiện lợi" },
  { icon: "🔍", title: "Tìm hồ sơ chủ động", desc: "Tìm kiếm trong kho 50,000+ CV theo kỹ năng và kinh nghiệm" },
  { icon: "🔔", title: "Thông báo realtime", desc: "Nhận thông báo ngay khi có ứng viên mới nộp hồ sơ" },
  { icon: "📅", title: "Lịch phỏng vấn", desc: "Đặt lịch và quản lý buổi phỏng vấn trực tiếp trên hệ thống" },
  { icon: "🆓", title: "Miễn phí hoàn toàn", desc: "Không mất phí đăng ký, không giới hạn số tin đăng cơ bản" },
];

export function FeaturesSection() {
  return (
    <section className="section">
      <div className="container-app">
        <div style={{ textAlign: "center", marginBottom: 32 }} className="md:mb-10">
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }} className="md:text-[28px]">
            Tất cả công cụ bạn cần
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
            Giải pháp tuyển dụng toàn diện cho doanh nghiệp mọi quy mô
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
          {FEATURES.map((feat) => (
            <Card key={feat.title} style={{ border: "1.5px solid var(--border)", borderRadius: 12, transition: "all 0.25s" }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(21,73,184,0.1)")}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}>
              <CardContent style={{ padding: "20px", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>{feat.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)", marginBottom: 4 }}>{feat.title}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>{feat.desc}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
