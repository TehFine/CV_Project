import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList, Bot, BarChart3, Users, Search, Bell, Calendar, Sparkles } from "lucide-react";

const FEATURES = [
  { icon: ClipboardList, title: "Đăng tin dễ dàng", desc: "Tạo tin tuyển dụng chuyên nghiệp trong vài phút với template có sẵn" },
  { icon: Bot, title: "AI chấm điểm CV", desc: "Tự động phân tích và xếp hạng ứng viên theo mức độ phù hợp" },
  { icon: BarChart3, title: "Dashboard thống kê", desc: "Theo dõi lượt xem, ứng tuyển và hiệu quả từng tin đăng" },
  { icon: Users, title: "Quản lý ứng viên", desc: "Xem hồ sơ, cập nhật trạng thái và liên hệ ứng viên tiện lợi" },
  { icon: Search, title: "Tìm hồ sơ chủ động", desc: "Tìm kiếm trong kho 50,000+ CV theo kỹ năng và kinh nghiệm" },
  { icon: Bell, title: "Thông báo realtime", desc: "Nhận thông báo ngay khi có ứng viên mới nộp hồ sơ" },
  { icon: Calendar, title: "Lịch phỏng vấn", desc: "Đặt lịch và quản lý buổi phỏng vấn trực tiếp trên hệ thống" },
  { icon: Sparkles, title: "Miễn phí hoàn toàn", desc: "Không mất phí đăng ký, không giới hạn số tin đăng cơ bản" },
];

export function FeaturesSection() {
  return (
    <section className="section">
      <div className="container-app">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2 md:text-[28px]">
            Tất cả công cụ bạn cần
          </h2>
          <p className="text-slate-500 text-[15px]">
            Giải pháp tuyển dụng toàn diện cho doanh nghiệp mọi quy mô
          </p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
          {FEATURES.map((feat) => (
            <Card key={feat.title} className="border-2 border-slate-200 rounded-xl transition-all duration-250 hover:shadow-lg hover:shadow-blue-600/5"
            >
              <CardContent className="p-5 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#EEF2FF] flex items-center justify-center shrink-0 text-[#1549B8]">
                  <feat.icon size={22} />
                </div>
                <div>
                  <div className="font-semibold text-sm text-slate-900 mb-1">{feat.title}</div>
                  <div className="text-xs text-slate-400 leading-relaxed">{feat.desc}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
