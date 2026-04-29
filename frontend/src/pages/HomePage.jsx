import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Sparkles,
  ArrowRight,
  Users,
  FileEdit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import JobCard from "@/components/JobCard";
import { JOB_CATEGORIES, MOCK_JOBS } from "@/services/jobService";

const STATS = [
  { value: "50,000+", label: "CV đã chấm điểm", icon: "📄" },
  { value: "12,000+", label: "Việc làm đang tuyển", icon: "💼" },
  { value: "3,500+", label: "Công ty đối tác", icon: "🏢" },
  { value: "95%", label: "Tỷ lệ hài lòng", icon: "⭐" },
];

const HOW_IT_WORKS = [
  {
    num: "01",
    icon: "📤",
    title: "Upload CV",
    desc: "Tải lên CV dạng PDF hoặc DOCX từ máy tính.",
  },
  {
    num: "02",
    icon: "🤖",
    title: "AI Phân tích",
    desc: "Hệ thống AI phân tích theo 5 tiêu chí trong 30 giây.",
  },
  {
    num: "03",
    icon: "📊",
    title: "Nhận kết quả",
    desc: "Xem điểm số chi tiết và gợi ý cải thiện cụ thể.",
  },
  {
    num: "04",
    icon: "🚀",
    title: "Ứng tuyển",
    desc: "Cải thiện CV và tự tin ứng tuyển vị trí mơ ước.",
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (keyword) p.set("keyword", keyword);
    if (location) p.set("location", location);
    navigate(`/jobs?${p}`);
  };

  const handleCreateCV = () =>
    navigate(isAuthenticated ? "/cv-builder" : "/login", {
      state: { from: "/cv-builder" },
    });

  return (
    <>
      {/* ─── Hero ───────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-[#0F172A] via-[#1E3A6E] to-[#1549B8] overflow-hidden pt-20 pb-0">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] rounded-full bg-[#1549B8]/30 blur-3xl" />
          <svg
            className="absolute right-10 top-20 opacity-10"
            width="200"
            height="200"
            viewBox="0 0 200 200"
          >
            {Array.from({ length: 6 }).flatMap((_, r) =>
              Array.from({ length: 6 }).map((_, c) => (
                <circle
                  key={`${r}${c}`}
                  cx={c * 35 + 10}
                  cy={r * 35 + 10}
                  r="2.5"
                  fill="white"
                />
              )),
            )}
          </svg>
        </div>

        <div className="container-app relative pt-12 pb-0">
          <div className="inline-flex items-center gap-1.5 bg-violet-500/20 border border-violet-400/30 rounded-full px-3 py-1.5 mb-5">
            <Sparkles className="h-3.5 w-3.5 text-violet-300" />
            <span className="text-xs font-medium text-violet-200">
              Tích hợp AI chấm điểm CV thông minh
            </span>
          </div>

          <h1 className="text-4xl md:text-[56px] font-black text-white leading-[1.1] mb-5 max-w-3xl">
            Tìm việc làm mơ ước
            <br />
            <span className="bg-gradient-to-r from-blue-300 to-violet-400 bg-clip-text text-transparent">
              với sức mạnh AI
            </span>
          </h1>
          <p className="text-slate-300 text-base md:text-lg mb-8 max-w-[520px] leading-relaxed">
            Upload CV và nhận đánh giá chi tiết từ AI trong 30 giây. Khám phá
            hàng nghìn cơ hội từ các công ty hàng đầu Việt Nam.
          </p>

          {/* Search box */}
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row bg-white rounded-2xl p-2 shadow-2xl max-w-2xl mb-5 gap-0"
          >
            <div className="flex-1 flex items-center gap-2 px-3 py-1.5">
              <Search className="h-4 w-4 text-[#94A3B8] flex-shrink-0" />
              <Input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tên công việc, kỹ năng, công ty..."
                className="border-0 shadow-none focus-visible:ring-0 p-0 text-sm text-[#0F172A] placeholder:text-[#94A3B8]"
              />
            </div>
            <Separator
              orientation="vertical"
              className="hidden sm:block h-8 self-center mx-1"
            />
            <div className="flex items-center gap-2 px-3 py-1.5">
              <MapPin className="h-4 w-4 text-[#94A3B8] flex-shrink-0" />
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Địa điểm"
                className="border-0 shadow-none focus-visible:ring-0 p-0 text-sm text-[#0F172A] placeholder:text-[#94A3B8] w-36"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="rounded-xl sm:ml-1 bg-[#1549B8] hover:bg-[#1240A0] text-white font-bold flex-shrink-0"
            >
              Tìm kiếm
            </Button>
          </form>

          {/* Popular tags */}
          <div className="flex flex-wrap gap-2 items-center mb-10">
            <span className="text-slate-400 text-sm">Phổ biến:</span>
            {[
              "React Developer",
              "UI/UX Designer",
              "Data Analyst",
              "Product Manager",
              "DevOps",
            ].map((tag) => (
              <button
                key={tag}
                onClick={() =>
                  navigate(`/jobs?keyword=${encodeURIComponent(tag)}`)
                }
                className="text-xs px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 hover:bg-white/20 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Stats bar */}
          <div className="border-t border-white/10 pt-8 pb-10 grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s) => (
              <div key={s.value} className="flex items-center gap-3">
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <div className="text-2xl font-black text-white">
                    {s.value}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Categories ─────────────────────────────────────────── */}
      <section className="section bg-[#F8FAFC] border-t border-[#F1F5F9]">
        <div className="container-app">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-[#0F172A] mb-2">
              Khám phá theo ngành nghề
            </h2>
            <p className="text-[#475569]">
              Hàng nghìn công việc trong tất cả lĩnh vực
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {JOB_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigate(`/jobs?category=${cat.name}`)}
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[#E2E8F0] hover:-translate-y-1 hover:shadow-md hover:border-[#1549B8]/30 transition-all duration-200 text-left"
              >
                <span className="text-2xl">{cat.icon}</span>
                <div>
                  <div className="font-semibold text-sm text-[#0F172A]">
                    {cat.name}
                  </div>
                  <div className="text-xs text-[#94A3B8] mt-0.5">
                    {cat.count.toLocaleString()} việc
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Jobs ───────────────────────────────────────── */}
      <section className="section bg-white border-t border-[#F1F5F9]">
        <div className="container-app">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-black text-[#0F172A] mb-1">
                Việc làm mới nhất
              </h2>
              <p className="text-[#475569]">
                Cập nhật mỗi ngày từ các công ty hàng đầu
              </p>
            </div>
            <Button
              variant="ghost"
              asChild
              className="gap-1 text-[#1549B8] hover:text-[#1549B8] hover:bg-[#EEF2FF]"
            >
              <Link to="/jobs">
                Xem tất cả <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOCK_JOBS.slice(0, 6).map((job, i) => (
              <JobCard key={job.id} job={job} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── AI Promo ────────────────────────────────────────────── */}
      <section className="section-sm relative bg-white from-[#0F172A] via-[#1E3A6E] to-[#1549B8] overflow-hidden">
        <div className="container-app">
          <div className="rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#1E3A6E] to-[#1549B8] p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="flex-1 relative">
              <div className="inline-flex items-center gap-1.5 bg-violet-500/20 border border-violet-400/30 rounded-full px-3 py-1 mb-4">
                <Sparkles className="h-3 w-3 text-violet-300" />
                <span className="text-xs text-violet-200 font-medium">
                  AI-Powered CV Scoring
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                CV của bạn có đủ
                <br />
                sức cạnh tranh?
              </h2>
              <p className="text-slate-300 leading-relaxed mb-6 text-sm">
                AI của NexCV phân tích CV trong 30 giây, đưa ra điểm số chi tiết
                và gợi ý cụ thể để cải thiện cơ hội được tuyển dụng lên đến 3
                lần.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg"
                  className="gap-2 bg-gradient-to-r from-[#1549B8] to-[#1240A0] hover:opacity-90 text-white font-bold shadow-lg">
                  <Link to="/cv-upload"><Sparkles className="h-4 w-4" />Chấm điểm CV — Miễn phí</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="border-white/25 text-white bg-white/10 hover:bg-white/20 hover:text-white hover:border-white/40"
                >
                  <Link to="/register">
                    Tìm hiểu thêm <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Score card preview */}
            <div className="w-full md:w-72 bg-white/8 backdrop-blur-sm border border-white/15 rounded-2xl p-6 flex-shrink-0">
              <div className="text-center mb-5">
                <div className="w-20 h-20 mx-auto rounded-full border-4 border-blue-400 bg-blue-500/20 flex items-center justify-center mb-2">
                  <span className="text-3xl font-black text-white">82</span>
                </div>
                <p className="text-violet-300 text-sm font-semibold">
                  Điểm CV của bạn
                </p>
              </div>
              {[
                { label: "Kỹ năng phù hợp", pct: 85, color: "#34D399" },
                { label: "Kinh nghiệm", pct: 78, color: "#60A5FA" },
                { label: "Định dạng & ATS", pct: 72, color: "#FCD34D" },
                { label: "Từ khóa", pct: 65, color: "#F87171" },
              ].map((item) => (
                <div key={item.label} className="mb-2.5">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">{item.label}</span>
                    <span className="text-white font-bold">{item.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${item.pct}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── How it works ────────────────────────────────────────── */}
      <section className="section bg-[#F8FAFC] border-t border-[#F1F5F9]">
        <div className="container-app">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-[#0F172A] mb-2">
              Cách hoạt động
            </h2>
            <p className="text-[#475569]">
              Chỉ 4 bước đơn giản để có CV hoàn hảo
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {HOW_IT_WORKS.map((step, i) => (
              <div
                key={step.num}
                className="bg-white rounded-2xl border border-[#E2E8F0] p-6 text-center relative overflow-hidden"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="absolute top-3 right-4 text-5xl font-black text-[#F1F5F9] leading-none select-none">
                  {step.num}
                </div>
                <div className="w-14 h-14 bg-[#EEF2FF] rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                  {step.icon}
                </div>
                <h3 className="font-bold text-[#0F172A] mb-2">{step.title}</h3>
                <p className="text-sm text-[#475569] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA split ───────────────────────────────────────────── */}
      <section className="section bg-white border-t border-[#F1F5F9]">
        <div className="container-app">
          <div className="grid md:grid-cols-2 gap-5">
            {/* Candidate */}
            <div className="bg-gradient-to-br from-[#1549B8] to-[#1E40AF] rounded-2xl p-8 text-white">
              <Users className="h-8 w-8 mb-4 opacity-80" />
              <h3 className="text-2xl font-black mb-2">Dành cho ứng viên</h3>
              <p className="text-blue-100 text-sm leading-relaxed mb-5">
                Tạo hồ sơ, upload CV và để AI giúp bạn tối ưu để nổi bật trước
                nhà tuyển dụng.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  asChild
                  className="border-white/40 text-white bg-transparent hover:bg-white hover:text-[#1549B8] font-semibold"
                >
                  <Link to="/register">Tạo tài khoản miễn phí</Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCreateCV}
                  className="border-white/40 text-white bg-transparent hover:bg-white hover:text-[#1549B8] font-semibold gap-2"
                >
                  <FileEdit className="h-4 w-4" />
                  Tạo CV ngay
                </Button>
              </div>
            </div>

            {/* Employer — mở tab mới sang /employer */}
            <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-2xl p-8 text-white">
              <span className="text-3xl mb-4 block">🏢</span>
              <h3 className="text-2xl font-black mb-2">
                Dành cho nhà tuyển dụng
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-5">
                Đăng tin tuyển dụng, tìm kiếm ứng viên phù hợp và quản lý toàn
                bộ quy trình tuyển dụng với AI.
              </p>
              {/* ← dùng thẻ <a> để mở tab mới, không dùng Link */}
              <a
                href="/employer"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold border border-white/30 text-white bg-transparent hover:bg-white hover:text-[#0F172A] transition-colors"
                style={{ textDecoration: "none" }}
              >
                Tìm hiểu & đăng ký <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
