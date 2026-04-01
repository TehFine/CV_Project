import api from "./api";

const USE_MOCK =
  import.meta.env.VITE_USE_MOCK === "true" || !import.meta.env.VITE_API_URL;
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── Mock Data ────────────────────────────────────────────────────────────────
const mockJobs = [
  {
    id: "job_001",
    recruiter_id: "rec_001",
    title: "Frontend Developer (React)",
    description:
      "Chúng tôi tìm kiếm Frontend Developer có kinh nghiệm với React, TypeScript...",
    location: "TP. Hồ Chí Minh",
    job_type: "full-time",
    level: "junior",
    salary_min: 15000000,
    salary_max: 25000000,
    required_skills: ["React", "TypeScript", "TailwindCSS", "REST API"],
    status: "active",
    expired_at: "2025-03-31T00:00:00Z",
    view_count: 142,
    created_at: "2025-01-10T08:00:00Z",
    updated_at: "2025-01-10T08:00:00Z",
    application_count: 18,
  },
  {
    id: "job_002",
    recruiter_id: "rec_001",
    title: "Backend Developer (Node.js)",
    description: "Xây dựng và duy trì các API RESTful cho hệ thống...",
    location: "Remote",
    job_type: "remote",
    level: "mid",
    salary_min: 20000000,
    salary_max: 35000000,
    required_skills: ["Node.js", "Express", "PostgreSQL", "Docker"],
    status: "active",
    expired_at: "2025-04-15T00:00:00Z",
    view_count: 98,
    created_at: "2025-01-12T09:30:00Z",
    updated_at: "2025-01-12T09:30:00Z",
    application_count: 9,
  },
  {
    id: "job_003",
    recruiter_id: "rec_001",
    title: "UI/UX Designer",
    description:
      "Thiết kế giao diện người dùng cho các sản phẩm web và mobile...",
    location: "Hà Nội",
    job_type: "full-time",
    level: "fresher",
    salary_min: 10000000,
    salary_max: 18000000,
    required_skills: ["Figma", "Prototyping", "User Research"],
    status: "draft",
    expired_at: "2025-05-01T00:00:00Z",
    view_count: 0,
    created_at: "2025-01-18T11:00:00Z",
    updated_at: "2025-01-18T11:00:00Z",
    application_count: 0,
  },
  {
    id: "job_004",
    recruiter_id: "rec_001",
    title: "Data Analyst",
    description: "Phân tích dữ liệu kinh doanh và tạo báo cáo...",
    location: "TP. Hồ Chí Minh",
    job_type: "full-time",
    level: "junior",
    salary_min: 18000000,
    salary_max: 28000000,
    required_skills: ["Python", "SQL", "Power BI", "Excel"],
    status: "expired",
    expired_at: "2025-01-01T00:00:00Z",
    view_count: 210,
    created_at: "2024-12-01T08:00:00Z",
    updated_at: "2024-12-01T08:00:00Z",
    application_count: 34,
  },
];

const mockApplications = [
  {
    id: "app_001",
    job_id: "job_001",
    seeker_id: "seeker_001",
    resume_id: "resume_001",
    status: "pending",
    cover_letter:
      "Tôi rất quan tâm đến vị trí này và muốn đóng góp vào team...",
    applied_at: "2025-01-20T10:30:00Z",
    updated_at: "2025-01-20T10:30:00Z",
    seeker: {
      full_name: "Nguyễn Văn An",
      email: "nvan@email.com",
      avatar_url: null,
    },
    resume: { title: "CV Frontend Developer 2025", pdf_url: "#" },
    ai_score: {
      overall_score: 82.5,
      breakdown: { skills: 85, experience: 78, education: 88, keywords: 79 },
    },
  },
  {
    id: "app_002",
    job_id: "job_001",
    seeker_id: "seeker_002",
    resume_id: "resume_002",
    status: "reviewing",
    cover_letter:
      "Với 2 năm kinh nghiệm React, tôi tự tin có thể đáp ứng yêu cầu...",
    applied_at: "2025-01-21T14:20:00Z",
    updated_at: "2025-01-22T09:00:00Z",
    seeker: {
      full_name: "Trần Thị Bích",
      email: "tbich@email.com",
      avatar_url: null,
    },
    resume: { title: "Trần Thị Bích - ReactJS Dev", pdf_url: "#" },
    ai_score: {
      overall_score: 91.0,
      breakdown: { skills: 94, experience: 90, education: 85, keywords: 95 },
    },
  },
  {
    id: "app_003",
    job_id: "job_001",
    seeker_id: "seeker_003",
    resume_id: "resume_003",
    status: "interview",
    cover_letter: null,
    applied_at: "2025-01-19T08:45:00Z",
    updated_at: "2025-01-23T15:00:00Z",
    seeker: {
      full_name: "Lê Minh Khoa",
      email: "lmkhoa@email.com",
      avatar_url: null,
    },
    resume: { title: "CV - Lê Minh Khoa", pdf_url: "#" },
    ai_score: {
      overall_score: 74.0,
      breakdown: { skills: 72, experience: 76, education: 70, keywords: 78 },
    },
  },
  {
    id: "app_004",
    job_id: "job_001",
    seeker_id: "seeker_004",
    resume_id: "resume_004",
    status: "rejected",
    cover_letter: "Tôi muốn ứng tuyển vị trí này...",
    applied_at: "2025-01-18T16:00:00Z",
    updated_at: "2025-01-20T10:00:00Z",
    seeker: {
      full_name: "Phạm Quốc Dũng",
      email: "pqdung@email.com",
      avatar_url: null,
    },
    resume: { title: "Resume_PhamQuocDung.pdf", pdf_url: "#" },
    ai_score: {
      overall_score: 52.0,
      breakdown: { skills: 48, experience: 55, education: 60, keywords: 45 },
    },
  },
  {
    id: "app_005",
    job_id: "job_002",
    seeker_id: "seeker_005",
    resume_id: "resume_005",
    status: "pending",
    cover_letter: "Tôi có 3 năm kinh nghiệm Node.js...",
    applied_at: "2025-01-22T11:00:00Z",
    updated_at: "2025-01-22T11:00:00Z",
    seeker: {
      full_name: "Hoàng Thu Hà",
      email: "htha@email.com",
      avatar_url: null,
    },
    resume: { title: "CV Backend Developer - Hoàng Thu Hà", pdf_url: "#" },
    ai_score: {
      overall_score: 88.5,
      breakdown: { skills: 90, experience: 86, education: 88, keywords: 90 },
    },
  },
];
function syncPostedJobsToStorage(jobs) {
  const activeJobs = jobs.filter((j) => j.status === "active");
  localStorage.setItem("nexcv_posted_jobs", JSON.stringify(activeJobs));
}
// ─── Employer Service ──────────────────────────────────────────────────────────
export const employerService = {
  // ── Dashboard stats ──
  async getDashboardStats() {
    if (USE_MOCK) {
      await delay(400);
      return {
        total_jobs: mockJobs.length,
        active_jobs: mockJobs.filter((j) => j.status === "active").length,
        total_applications: mockApplications.length,
        pending_applications: mockApplications.filter(
          (a) => a.status === "pending",
        ).length,
        total_views: mockJobs.reduce((sum, j) => sum + j.view_count, 0),
        // Biểu đồ ứng tuyển 7 ngày gần nhất
        applications_chart: [
          { date: "18/01", count: 3 },
          { date: "19/01", count: 5 },
          { date: "20/01", count: 8 },
          { date: "21/01", count: 4 },
          { date: "22/01", count: 6 },
          { date: "23/01", count: 2 },
          { date: "24/01", count: 7 },
        ],
        status_breakdown: {
          pending: mockApplications.filter((a) => a.status === "pending")
            .length,
          reviewing: mockApplications.filter((a) => a.status === "reviewing")
            .length,
          interview: mockApplications.filter((a) => a.status === "interview")
            .length,
          offered: mockApplications.filter((a) => a.status === "offered")
            .length,
          rejected: mockApplications.filter((a) => a.status === "rejected")
            .length,
        },
      };
    }
    return api.get("/employer/dashboard/stats");
  },

  // ── Job Posts ──
  async getMyJobs(params = {}) {
    if (USE_MOCK) {
      await delay(400);
      let jobs = [...mockJobs];
      if (params.status) jobs = jobs.filter((j) => j.status === params.status);
      return { data: jobs, total: jobs.length };
    }
    return api.get("/employer/jobs", { params });
  },

  async getJob(id) {
    if (USE_MOCK) {
      await delay(300);
      const job = mockJobs.find((j) => j.id === id);
      if (!job) throw { message: "Không tìm thấy tin tuyển dụng" };
      return job;
    }
    return api.get(`/employer/jobs/${id}`);
  },

  async createJob(data) {
    if (USE_MOCK) {
      await delay(600);
      const newJob = {
        id: "job_" + Date.now(),
        recruiter_id: "rec_001",
        ...data,
        status: data.status || "draft",
        view_count: 0,
        application_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      mockJobs.push(newJob);
      syncPostedJobsToStorage(mockJobs);
      return newJob;
    }
    return api.post("/employer/jobs", data);
  },

  async updateJob(id, data) {
    if (USE_MOCK) {
      await delay(500);
      const idx = mockJobs.findIndex((j) => j.id === id);
      if (idx === -1) throw { message: "Không tìm thấy tin tuyển dụng" };
      mockJobs[idx] = {
        ...mockJobs[idx],
        ...data,
        updated_at: new Date().toISOString(),
      };
      syncPostedJobsToStorage(mockJobs);
      return mockJobs[idx];
    }
    return api.put(`/employer/jobs/${id}`, data);
  },

  async deleteJob(id) {
    if (USE_MOCK) {
      await delay(400);
      const idx = mockJobs.findIndex((j) => j.id === id);
      if (idx !== -1) mockJobs.splice(idx, 1);
      syncPostedJobsToStorage(mockJobs);
      return { message: "Đã xóa tin tuyển dụng" };
    }
    return api.delete(`/employer/jobs/${id}`);
  },

  async updateJobStatus(id, status) {
    return this.updateJob(id, { status });
  },

  // ── Applications ──
  async getApplications(jobId, params = {}) {
    if (USE_MOCK) {
      await delay(400);
      let apps = mockApplications.filter((a) => a.job_id === jobId);
      if (params.status) apps = apps.filter((a) => a.status === params.status);
      return { data: apps, total: apps.length };
    }
    return api.get(`/employer/jobs/${jobId}/applications`, { params });
  },

  async updateApplicationStatus(applicationId, status) {
    if (USE_MOCK) {
      await delay(400);
      const app = mockApplications.find((a) => a.id === applicationId);
      if (app) {
        app.status = status;
        app.updated_at = new Date().toISOString();
      }
      return app;
    }
    return api.patch(`/employer/applications/${applicationId}/status`, {
      status,
    });
  },
};
