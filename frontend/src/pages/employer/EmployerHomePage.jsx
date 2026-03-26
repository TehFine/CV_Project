import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <section
      style={{
        background:
          "linear-gradient(135deg, #0F172A 0%, #1E3A6E 50%, #1549B8 100%)",
        paddingTop: 120,
        paddingBottom: 80,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decoration — giống HomePage */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(21,73,184,0.3) 0%, transparent 70%)",
          }}
        />
        <svg
          style={{
            position: "absolute",
            right: "5%",
            top: "20%",
            opacity: 0.15,
          }}
          width="200"
          height="200"
          viewBox="0 0 200 200"
        >
          {Array.from({ length: 6 }).map((_, r) =>
            Array.from({ length: 6 }).map((_, c) => (
              <circle
                key={`${r}-${c}`}
                cx={c * 35 + 10}
                cy={r * 35 + 10}
                r="2.5"
                fill="white"
              />
            )),
          )}
        </svg>
      </div>

      <div className="container-app" style={{ position: "relative" }}>
        <div style={{ marginBottom: 20 }}>
          <Badge
            style={{
              backgroundColor: "rgba(124,58,237,0.25)",
              color: "#C4B5FD",
              border: "1px solid rgba(124,58,237,0.4)",
              padding: "5px 14px",
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            ✨ Nền tảng tuyển dụng thông minh với AI
          </Badge>
        </div>

        <h1
          style={{
            fontSize: "clamp(32px, 5vw, 56px)",
            fontWeight: 900,
            color: "white",
            lineHeight: 1.1,
            marginBottom: 20,
            maxWidth: 700,
          }}
        >
          Tuyển dụng hiệu quả hơn
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #60A5FA, #A78BFA)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            với sức mạnh AI
          </span>
        </h1>

        <p
          style={{
            fontSize: 16,
            color: "rgba(255,255,255,0.7)",
            marginBottom: 36,
            maxWidth: 520,
            lineHeight: 1.7,
          }}
        >
          Đăng tin tuyển dụng, nhận hồ sơ chất lượng và để AI tự động chấm điểm
          CV — tìm ứng viên phù hợp nhanh gấp 3 lần.
        </p>

        {/* CTA — điều hướng đúng trong /employer/* */}
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 40,
          }}
        >
          <Button
            size="lg"
            onClick={() =>
              navigate(
                isAuthenticated ? "/employer/dashboard" : "/employer/register",
              )
            }
            style={{
              background: "white",
              color: "#1549B8",
              fontWeight: 700,
              fontSize: 15,
              height: 48,
              padding: "0 28px",
            }}
          >
            🚀 {isAuthenticated ? "Vào Dashboard" : "Đăng ký miễn phí"}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/employer/login")}
            style={{
              borderColor: "rgba(255,255,255,0.4)",
              color: "white",
              backgroundColor: "transparent",
              fontWeight: 600,
              fontSize: 15,
              height: 48,
              padding: "0 28px",
            }}
          >
            Đăng nhập
          </Button>
        </div>

        {/* Popular positions */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
            Tuyển nhiều nhất:
          </span>
          {[
            "Frontend Developer",
            "Product Manager",
            "Data Analyst",
            "UI/UX Designer",
            "DevOps Engineer",
          ].map((tag) => (
            <button
              key={tag}
              onClick={() =>
                navigate(
                  isAuthenticated ? "/employer/jobs/new" : "/employer/register",
                )
              }
              style={{
                fontSize: 12,
                padding: "4px 12px",
                borderRadius: 20,
                backgroundColor: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.8)",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.2)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.1)")
              }
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div
        style={{ borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: 60 }}
      >
        <div
          className="container-app"
          style={{ paddingTop: 28, paddingBottom: 0 }}
        >
          <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
            {[
              { value: "2,000+", label: "Nhà tuyển dụng tin dùng", icon: "🏢" },
              { value: "50,000+", label: "CV đã được chấm điểm", icon: "🤖" },
              { value: "12,000+", label: "Ứng viên chất lượng", icon: "👥" },
              { value: "30s", label: "Chấm điểm CV tự động", icon: "⚡" },
            ].map((stat) => (
              <div
                key={stat.value}
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                <span style={{ fontSize: 20 }}>{stat.icon}</span>
                <div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 800,
                      color: "white",
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "rgba(255,255,255,0.5)",
                      marginTop: 2,
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Features Section ─────────────────────────────────────────────────────────
function FeaturesSection() {
  const FEATURES = [
    {
      icon: "📋",
      title: "Đăng tin dễ dàng",
      desc: "Tạo tin tuyển dụng chuyên nghiệp trong vài phút với template có sẵn",
    },
    {
      icon: "🤖",
      title: "AI chấm điểm CV",
      desc: "Tự động phân tích và xếp hạng ứng viên theo mức độ phù hợp",
    },
    {
      icon: "📊",
      title: "Dashboard thống kê",
      desc: "Theo dõi lượt xem, ứng tuyển và hiệu quả từng tin đăng",
    },
    {
      icon: "👥",
      title: "Quản lý ứng viên",
      desc: "Xem hồ sơ, cập nhật trạng thái và liên hệ ứng viên tiện lợi",
    },
    {
      icon: "🔍",
      title: "Tìm hồ sơ chủ động",
      desc: "Tìm kiếm trong kho 50,000+ CV theo kỹ năng và kinh nghiệm",
    },
    {
      icon: "🔔",
      title: "Thông báo realtime",
      desc: "Nhận thông báo ngay khi có ứng viên mới nộp hồ sơ",
    },
    {
      icon: "📅",
      title: "Lịch phỏng vấn",
      desc: "Đặt lịch và quản lý buổi phỏng vấn trực tiếp trên hệ thống",
    },
    {
      icon: "🆓",
      title: "Miễn phí hoàn toàn",
      desc: "Không mất phí đăng ký, không giới hạn số tin đăng cơ bản",
    },
  ];

  return (
    <section className="section">
      <div className="container-app">
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "var(--text-primary)",
              marginBottom: 8,
            }}
          >
            Tất cả công cụ bạn cần
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
            Giải pháp tuyển dụng toàn diện cho doanh nghiệp mọi quy mô
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          {FEATURES.map((feat) => (
            <Card
              key={feat.title}
              style={{
                border: "1.5px solid var(--border)",
                borderRadius: 12,
                transition: "all 0.25s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 4px 20px rgba(21,73,184,0.1)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
            >
              <CardContent
                style={{
                  padding: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <span style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>
                  {feat.icon}
                </span>
                <div>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 14,
                      color: "var(--text-primary)",
                      marginBottom: 4,
                    }}
                  >
                    {feat.title}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--text-muted)",
                      lineHeight: 1.5,
                    }}
                  >
                    {feat.desc}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Recent Job Posts ─────────────────────────────────────────────────────────
function RecentJobPostsSection() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const SAMPLE_POSTS = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Vietnam",
      location: "TP. HCM",
      type: "Full-time",
      level: "Senior",
      applications: 24,
      views: 312,
      postedDays: 1,
    },
    {
      id: 2,
      title: "Product Manager",
      company: "StartupXYZ",
      location: "Remote",
      type: "Full-time",
      level: "Mid-level",
      applications: 18,
      views: 198,
      postedDays: 3,
    },
    {
      id: 3,
      title: "UI/UX Designer",
      company: "Creative Agency",
      location: "Hà Nội",
      type: "Part-time",
      level: "Junior",
      applications: 9,
      views: 87,
      postedDays: 5,
    },
    {
      id: 4,
      title: "Data Analyst",
      company: "FinTech Co.",
      location: "TP. HCM",
      type: "Full-time",
      level: "Junior",
      applications: 31,
      views: 420,
      postedDays: 2,
    },
    {
      id: 5,
      title: "DevOps Engineer",
      company: "CloudSys",
      location: "Remote",
      type: "Full-time",
      level: "Senior",
      applications: 7,
      views: 156,
      postedDays: 0,
    },
    {
      id: 6,
      title: "Backend Developer",
      company: "E-commerce Ltd",
      location: "TP. HCM",
      type: "Full-time",
      level: "Mid-level",
      applications: 15,
      views: 203,
      postedDays: 4,
    },
  ];

  return (
    <section
      className="section"
      style={{ backgroundColor: "var(--bg-subtle)" }}
    >
      <div className="container-app">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 32,
          }}
        >
          <div>
            <h2
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: "var(--text-primary)",
                marginBottom: 6,
              }}
            >
              Tin tuyển dụng đang hot
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
              Các vị trí đang có nhiều ứng viên quan tâm nhất
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() =>
              navigate(
                isAuthenticated ? "/employer/jobs/new" : "/employer/register",
              )
            }
          >
            ➕ Đăng tin ngay
          </Button>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 16,
          }}
        >
          {SAMPLE_POSTS.map((job) => (
            <Card
              key={job.id}
              style={{
                border: "1.5px solid var(--border)",
                borderRadius: 14,
                overflow: "hidden",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 4px 16px rgba(0,0,0,0.08)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
            >
              <CardContent style={{ padding: 20 }}>
                <div
                  style={{
                    display: "flex",
                    gap: 14,
                    alignItems: "flex-start",
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 10,
                      backgroundColor: "#EEF2FF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: 14,
                      color: "#1549B8",
                      flexShrink: 0,
                    }}
                  >
                    {job.company.slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3
                      style={{
                        fontWeight: 700,
                        fontSize: 15,
                        color: "var(--text-primary)",
                        marginBottom: 3,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {job.title}
                    </h3>
                    <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                      {job.company}
                    </p>
                  </div>
                  <Badge
                    style={{
                      backgroundColor: "#D1FAE5",
                      color: "#065F46",
                      border: "none",
                      fontSize: 11,
                    }}
                  >
                    Đang tuyển
                  </Badge>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 6,
                    marginBottom: 14,
                  }}
                >
                  {[
                    { icon: "📍", text: job.location },
                    { icon: "💼", text: job.type },
                    { icon: "📊", text: job.level },
                  ].map((info) => (
                    <span
                      key={info.text}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 12,
                        color: "var(--text-secondary)",
                        backgroundColor: "var(--bg-subtle)",
                        padding: "3px 8px",
                        borderRadius: 6,
                      }}
                    >
                      {info.icon} {info.text}
                    </span>
                  ))}
                </div>
                <Separator style={{ marginBottom: 12 }} />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {job.postedDays === 0
                      ? "Hôm nay"
                      : `${job.postedDays} ngày trước`}
                  </span>
                  <div style={{ display: "flex", gap: 12 }}>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      👁 {job.views}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#1549B8",
                      }}
                    >
                      📩 {job.applications} ứng tuyển
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── AI Promo Section ─────────────────────────────────────────────────────────
function AIPromoSection() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <section className="section">
      <div className="container-app">
        <div
          style={{
            background:
              "linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4C1D95 100%)",
            borderRadius: 24,
            padding: "clamp(32px, 5vw, 56px)",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            gap: 40,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -60,
              right: -60,
              width: 240,
              height: 240,
              borderRadius: "50%",
              background: "rgba(124,58,237,0.2)",
              pointerEvents: "none",
            }}
          />
          <div style={{ flex: 1, minWidth: 280, position: "relative" }}>
            <Badge
              style={{
                backgroundColor: "rgba(124,58,237,0.2)",
                color: "#C4B5FD",
                border: "1px solid rgba(124,58,237,0.3)",
                marginBottom: 16,
              }}
            >
              🤖 AI-Powered CV Scoring
            </Badge>
            <h2
              style={{
                fontSize: "clamp(24px, 3vw, 36px)",
                fontWeight: 800,
                color: "white",
                lineHeight: 1.2,
                marginBottom: 16,
              }}
            >
              Lọc ứng viên thông minh
              <br />
              với AI chấm điểm CV
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: 15,
                lineHeight: 1.7,
                marginBottom: 24,
              }}
            >
              AI của NexCV tự động phân tích CV và cho điểm theo 5 tiêu chí —
              giúp bạn tìm ứng viên phù hợp nhất trong vài giây.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Button
                size="lg"
                onClick={() =>
                  navigate(
                    isAuthenticated
                      ? "/employer/dashboard"
                      : "/employer/register",
                  )
                }
                style={{
                  background: "white",
                  color: "#1549B8",
                  fontWeight: 700,
                }}
              >
                ✨ {isAuthenticated ? "Vào Dashboard" : "Dùng thử miễn phí"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/employer/login")}
                style={{
                  borderColor: "rgba(255,255,255,0.3)",
                  color: "white",
                  backgroundColor: "transparent",
                }}
              >
                Đăng nhập →
              </Button>
            </div>
          </div>

          {/* Score preview */}
          <div
            style={{
              width: 280,
              backgroundColor: "rgba(255,255,255,0.07)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 16,
              padding: 24,
              flexShrink: 0,
            }}
          >
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  border: "4px solid #60A5FA",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 8px",
                  backgroundColor: "rgba(96,165,250,0.2)",
                }}
              >
                <span style={{ fontSize: 28, fontWeight: 800, color: "white" }}>
                  91
                </span>
              </div>
              <div style={{ fontSize: 13, color: "#93C5FD", fontWeight: 600 }}>
                Điểm phù hợp — Nguyễn Văn An
              </div>
            </div>
            {[
              { label: "Kỹ năng phù hợp", pct: 94, color: "#34D399" },
              { label: "Kinh nghiệm", pct: 90, color: "#60A5FA" },
              { label: "Học vấn", pct: 88, color: "#A78BFA" },
              { label: "Từ khóa ATS", pct: 92, color: "#FCD34D" },
            ].map((item) => (
              <div key={item.label} style={{ marginBottom: 10 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12,
                    color: "rgba(255,255,255,0.7)",
                    marginBottom: 4,
                  }}
                >
                  <span>{item.label}</span>
                  <span style={{ fontWeight: 600, color: "white" }}>
                    {item.pct}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${item.pct}%`, background: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      icon: "📝",
      title: "Đăng ký tài khoản",
      desc: "Tạo tài khoản nhà tuyển dụng miễn phí trong 2 phút với thông tin công ty.",
    },
    {
      num: "02",
      icon: "📋",
      title: "Đăng tin tuyển dụng",
      desc: "Tạo tin tuyển dụng chi tiết với mô tả công việc và yêu cầu kỹ năng.",
    },
    {
      num: "03",
      icon: "🤖",
      title: "AI lọc hồ sơ",
      desc: "Hệ thống AI tự động chấm điểm và xếp hạng CV theo mức độ phù hợp.",
    },
    {
      num: "04",
      icon: "🎯",
      title: "Tuyển được người phù hợp",
      desc: "Liên hệ và phỏng vấn những ứng viên chất lượng nhất — nhanh hơn bao giờ hết.",
    },
  ];

  return (
    <section
      className="section"
      style={{ backgroundColor: "var(--bg-subtle)" }}
    >
      <div className="container-app">
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "var(--text-primary)",
              marginBottom: 8,
            }}
          >
            Bắt đầu tuyển dụng chỉ với 4 bước
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
            Đơn giản, nhanh chóng và hiệu quả
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 24,
          }}
        >
          {steps.map((step) => (
            <Card
              key={step.num}
              style={{
                border: "1.5px solid var(--border)",
                borderRadius: 16,
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <CardContent style={{ padding: "28px 24px" }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    backgroundColor: "#EEF2FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    margin: "0 auto 16px",
                  }}
                >
                  {step.icon}
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    fontSize: 32,
                    fontWeight: 900,
                    color: "var(--border)",
                    lineHeight: 1,
                  }}
                >
                  {step.num}
                </div>
                <h3
                  style={{
                    fontWeight: 700,
                    fontSize: 16,
                    color: "var(--text-primary)",
                    marginBottom: 8,
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                  }}
                >
                  {step.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Section ──────────────────────────────────────────────────────────────
function CTASection() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <section className="section-sm">
      <div className="container-app">
        <div
          style={{
            textAlign: "center",
            padding: "48px 24px",
            backgroundColor: "#EEF2FF",
            borderRadius: 20,
            border: "1px solid rgba(21,73,184,0.15)",
          }}
        >
          <h2
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "var(--text-primary)",
              marginBottom: 10,
            }}
          >
            Sẵn sàng tìm ứng viên chất lượng?
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              marginBottom: 28,
              fontSize: 15,
            }}
          >
            Tham gia cùng 2,000+ nhà tuyển dụng đã tin dùng NexCV — hoàn toàn
            miễn phí
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              size="lg"
              onClick={() =>
                navigate(
                  isAuthenticated
                    ? "/employer/dashboard"
                    : "/employer/register",
                )
              }
              style={{
                background: "linear-gradient(135deg, #1549B8, #1E40AF)",
                color: "white",
                fontWeight: 700,
                padding: "0 28px",
                height: 48,
              }}
            >
              {isAuthenticated
                ? "📊 Vào Dashboard"
                : "🚀 Đăng ký nhà tuyển dụng miễn phí"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() =>
                navigate(
                  isAuthenticated ? "/employer/jobs/new" : "/employer/register",
                )
              }
              style={{ fontWeight: 600, height: 48, padding: "0 28px" }}
            >
              📋 Đăng tin tuyển dụng ngay
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function EmployerHomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <RecentJobPostsSection />
      <AIPromoSection />
      <HowItWorksSection />
      <CTASection />
    </>
  );
}
