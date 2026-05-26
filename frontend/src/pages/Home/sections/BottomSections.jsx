import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Users, FileEdit } from "lucide-react";
import { Button } from "@/components/ui/button";

const HOW_IT_WORKS = [
  { num: "01", icon: "📤", title: "Upload CV", desc: "Tải lên CV dạng PDF hoặc DOCX từ máy tính." },
  { num: "02", icon: "🤖", title: "AI Phân tích", desc: "Hệ thống AI phân tích theo 5 tiêu chí trong 30 giây." },
  { num: "03", icon: "📊", title: "Nhận kết quả", desc: "Xem điểm số chi tiết và gợi ý cải thiện cụ thể." },
  { num: "04", icon: "🚀", title: "Ứng tuyển", desc: "Cải thiện CV và tự tin ứng tuyển vị trí mơ ước." },
];

const SCORE_BARS = [
  { label: "Kỹ năng phù hợp", pct: 85, color: "#34D399" },
  { label: "Kinh nghiệm", pct: 78, color: "#60A5FA" },
  { label: "Định dạng & ATS", pct: 72, color: "#FCD34D" },
  { label: "Từ khóa", pct: 65, color: "#F87171" },
];

export function AIPromoSection() {
  return (
    <section className="section-sm relative bg-white from-[#0F172A] via-[#1E3A6E] to-[#1549B8] overflow-hidden">
      <div className="container-app">
        <div className="rounded-2xl md:rounded-3xl bg-linear-to-br from-[#0F172A] via-[#1E3A6E] to-[#1549B8] p-6 md:p-12 flex flex-col md:flex-row gap-6 md:gap-8 items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="flex-1 relative">
            <div className="inline-flex items-center gap-1.5 bg-violet-500/20 border border-violet-400/30 rounded-full px-3 py-1 mb-4">
              <Sparkles className="h-3 w-3 text-violet-300" />
              <span className="text-xs text-violet-200 font-medium">AI-Powered CV Scoring</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-black text-white mb-4 leading-tight">
              CV của bạn có đủ<br />sức cạnh tranh?
            </h2>
            <p className="text-slate-300 leading-relaxed mb-6 text-sm">
              AI của NexCV phân tích CV trong 30 giây, đưa ra điểm số chi tiết và gợi ý cụ thể để cải thiện cơ hội được tuyển dụng lên đến 3 lần.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="gap-2 bg-linear-to-r from-[#1549B8] to-[#1240A0] hover:opacity-90 text-white font-bold shadow-lg">
                <Link to="/cv-upload"><Sparkles className="h-4 w-4" />Chấm điểm CV — Miễn phí</Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="border-white/25 text-white bg-white/10 hover:bg-white/20 hover:text-white hover:border-white/40">
                <Link to="/register">Tìm hiểu thêm <ArrowRight className="h-4 w-4 ml-1" /></Link>
              </Button>
            </div>
          </div>

          <div className="w-full md:w-72 bg-white/8 backdrop-blur-sm border border-white/15 rounded-2xl p-5 md:p-6 shrink-0">
            <div className="text-center mb-5">
              <div className="w-20 h-20 mx-auto rounded-full border-4 border-blue-400 bg-blue-500/20 flex items-center justify-center mb-2">
                <span className="text-3xl font-black text-white">82</span>
              </div>
              <p className="text-violet-300 text-sm font-semibold">Điểm CV của bạn</p>
            </div>
            {SCORE_BARS.map(item => (
              <div key={item.label} className="mb-2.5">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">{item.label}</span>
                  <span className="text-white font-bold">{item.pct}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  return (
    <section className="section bg-[#F8FAFC] border-t border-[#F1F5F9]">
      <div className="container-app">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-black text-[#0F172A] mb-2">Cách hoạt động</h2>
          <p className="text-[#475569]">Chỉ 4 bước đơn giản để có CV hoàn hảo</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {HOW_IT_WORKS.map((step, i) => (
            <div key={step.num} className="bg-white rounded-2xl border border-[#E2E8F0] p-6 text-center relative overflow-hidden" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="absolute top-3 right-4 text-5xl font-black text-[#F1F5F9] leading-none select-none">{step.num}</div>
              <div className="w-14 h-14 bg-[#EEF2FF] rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">{step.icon}</div>
              <h3 className="font-bold text-[#0F172A] mb-2">{step.title}</h3>
              <p className="text-sm text-[#475569] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTASplitSection({ onCreateCV }) {
  return (
    <section className="section bg-white border-t border-[#F1F5F9]">
      <div className="container-app">
        <div className="grid md:grid-cols-2 gap-4 md:gap-5">
          <div className="bg-linear-to-br from-[#1549B8] to-[#1E40AF] rounded-2xl p-6 md:p-8 text-white">
            <Users className="h-8 w-8 mb-4 opacity-80" />
            <h3 className="text-xl md:text-2xl font-black mb-2">Dành cho ứng viên</h3>
            <p className="text-blue-100 text-sm leading-relaxed mb-5">
              Tạo hồ sơ, upload CV và để AI giúp bạn tối ưu để nổi bật trước nhà tuyển dụng.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" asChild className="border-white/40 text-white bg-transparent hover:bg-white hover:text-[#1549B8] font-semibold">
                <Link to="/register">Tạo tài khoản miễn phí</Link>
              </Button>
              <Button variant="outline" onClick={onCreateCV} className="border-white/40 text-white bg-transparent hover:bg-white hover:text-[#1549B8] font-semibold gap-2">
                <FileEdit className="h-4 w-4" />Tạo CV ngay
              </Button>
            </div>
          </div>

          <div className="bg-linear-to-br from-[#0F172A] to-[#1E293B] rounded-2xl p-6 md:p-8 text-white">
            <span className="text-3xl mb-4 block">🏢</span>
            <h3 className="text-xl md:text-2xl font-black mb-2">Dành cho nhà tuyển dụng</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-5">
              Đăng tin tuyển dụng, tìm kiếm ứng viên phù hợp và quản lý toàn bộ quy trình tuyển dụng với AI.
            </p>
            <Link
              to="/employer/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold border border-white/30 text-white bg-transparent hover:bg-white hover:text-[#0F172A] transition-colors"
            >
              Tìm hiểu & đăng ký <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
