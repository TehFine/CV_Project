import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { Plus, MapPin, Briefcase, BarChart3, Eye, Inbox } from "lucide-react";

const SAMPLE_POSTS = [
  { id: 1, title: "Senior Frontend Developer", company: "TechCorp Vietnam", location: "TP. HCM", type: "Full-time", level: "Senior", applications: 24, views: 312, postedDays: 1 },
  { id: 2, title: "Product Manager", company: "StartupXYZ", location: "Remote", type: "Full-time", level: "Mid-level", applications: 18, views: 198, postedDays: 3 },
  { id: 3, title: "UI/UX Designer", company: "Creative Agency", location: "Hà Nội", type: "Part-time", level: "Junior", applications: 9, views: 87, postedDays: 5 },
  { id: 4, title: "Data Analyst", company: "FinTech Co.", location: "TP. HCM", type: "Full-time", level: "Junior", applications: 31, views: 420, postedDays: 2 },
  { id: 5, title: "DevOps Engineer", company: "CloudSys", location: "Remote", type: "Full-time", level: "Senior", applications: 7, views: 156, postedDays: 0 },
  { id: 6, title: "Backend Developer", company: "E-commerce Ltd", location: "TP. HCM", type: "Full-time", level: "Mid-level", applications: 15, views: 203, postedDays: 4 },
];

export function RecentJobPostsSection() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <section className="section" style={{ backgroundColor: "var(--bg-subtle)" }}>
      <div className="container-app">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)", marginBottom: 6 }}>Tin tuyển dụng đang hot</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>Các vị trí đang có nhiều ứng viên quan tâm nhất</p>
          </div>
          <Button variant="outline" onClick={() => navigate(isAuthenticated ? "/employer/jobs/new" : "/employer/register")}>
            <><Plus size={16} /> Đăng tin ngay</>
          </Button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
          {SAMPLE_POSTS.map((job) => (
            <Card key={job.id} style={{ border: "1.5px solid var(--border)", borderRadius: 14, overflow: "hidden", transition: "all 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)")}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}>
              <CardContent style={{ padding: 20 }}>
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 10, backgroundColor: "rgba(124,58,237,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, color: "#7C3AED", flexShrink: 0 }}>
                    {job.company.slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)", marginBottom: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{job.title}</h3>
                    <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>{job.company}</p>
                  </div>
                  <Badge style={{ backgroundColor: "#D1FAE5", color: "#065F46", border: "none", fontSize: 11 }}>Đang tuyển</Badge>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                  {[{ icon: MapPin, text: job.location }, { icon: Briefcase, text: job.type }, { icon: BarChart3, text: job.level }].map((info, idx) => {
                    const InfoIcon = info.icon
                    return (
                    <span key={idx} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--text-secondary)", backgroundColor: "var(--bg-subtle)", padding: "3px 8px", borderRadius: 6 }}>
                      <InfoIcon size={12} /> {info.text}
                    </span>
                  )})}
                </div>
                <Separator style={{ marginBottom: 12 }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{job.postedDays === 0 ? "Hôm nay" : `${job.postedDays} ngày trước`}</span>
                  <div style={{ display: "flex", gap: 12 }}>
                    <span style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}><Eye size={12} /> {job.views}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#7C3AED", display: "flex", alignItems: "center", gap: 4 }}><Inbox size={12} /> {job.applications} ứng tuyển</span>
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
