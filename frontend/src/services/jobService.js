import api from "./api";

const USE_MOCK =
  import.meta.env.VITE_USE_MOCK === "true" || !import.meta.env.VITE_API_URL;
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
// Thêm hàm helper này ngay trước "export const jobService"
function getPostedJobsFromStorage() {
  try {
    const raw = localStorage.getItem("nexcv_posted_jobs");
    if (!raw) return [];
    return JSON.parse(raw).map((j) => ({
      id: j.id,
      title: j.title,
      company: "Nhà tuyển dụng NexCV",
      companyLogo: null,
      location: j.location || "",
      salary:
        j.salary_min && j.salary_max
          ? `${(j.salary_min / 1000000).toFixed(0)} - ${(j.salary_max / 1000000).toFixed(0)} triệu`
          : "Thỏa thuận",
      type:
        j.job_type === "full-time"
          ? "Toàn thời gian"
          : j.job_type === "part-time"
            ? "Bán thời gian"
            : j.job_type === "remote"
              ? "Remote"
              : "Thực tập",
      level:
        j.level === "junior"
          ? "Junior"
          : j.level === "senior"
            ? "Senior"
            : j.level === "mid"
              ? "Middle"
              : j.level === "fresher"
                ? "Fresher"
                : "Intern",
      category: "Công nghệ thông tin",
      tags: j.required_skills || [],
      description: j.description || "",
      requirements: [],
      benefits: [],
      deadline: j.expired_at ? j.expired_at.slice(0, 10) : "",
      postedAt: j.created_at ? j.created_at.slice(0, 10) : "",
      views: j.view_count || 0,
      applied: j.application_count || 0,
      featured: false,
      _fromEmployer: true,
    }));
  } catch {
    return [];
  }
}
// ─── Mock Job Data ─────────────────────────────────────────────────────────────
export const MOCK_JOBS = [
  {
    id: 1,
    title: "Frontend Developer (React)",
    company: "VNG Corporation",
    companyLogo: null,
    location: "TP. Hồ Chí Minh",
    salary: "20 - 35 triệu",
    type: "Toàn thời gian",
    level: "Middle",
    category: "Công nghệ thông tin",
    tags: ["React", "TypeScript", "TailwindCSS"],
    description: `Chúng tôi đang tìm kiếm Frontend Developer có kinh nghiệm với React và TypeScript để tham gia vào nhóm phát triển sản phẩm Zalo.\n\nBạn sẽ làm việc trực tiếp với Product Manager và Designer để xây dựng các tính năng mới cho hàng triệu người dùng.`,
    requirements: [
      "Ít nhất 2 năm kinh nghiệm với React",
      "Thành thạo TypeScript",
      "Hiểu biết về RESTful API và GraphQL",
      "Kinh nghiệm với Git và CI/CD",
    ],
    benefits: [
      "Lương cạnh tranh",
      "Thưởng hiệu suất",
      "Bảo hiểm sức khỏe",
      "Laptop MacBook",
    ],
    deadline: "2025-02-28",
    postedAt: "2025-01-20",
    views: 1243,
    applied: 87,
    featured: true,
  },
  {
    id: 2,
    title: "Senior Backend Engineer (Node.js)",
    company: "Momo (M_Service)",
    companyLogo: null,
    location: "TP. Hồ Chí Minh",
    salary: "30 - 50 triệu",
    type: "Toàn thời gian",
    level: "Senior",
    category: "Công nghệ thông tin",
    tags: ["Node.js", "PostgreSQL", "Redis", "Docker"],
    description:
      "Tham gia phát triển hệ thống thanh toán quy mô lớn, xử lý hàng triệu giao dịch mỗi ngày.",
    requirements: [
      "4+ năm kinh nghiệm Backend với Node.js",
      "Kinh nghiệm với microservices",
      "Thành thạo SQL và NoSQL",
      "Hiểu về bảo mật trong payment system",
    ],
    benefits: [
      "Stock options",
      "Remote flexible",
      "Bảo hiểm premium",
      "Du lịch hàng năm",
    ],
    deadline: "2025-03-15",
    postedAt: "2025-01-18",
    views: 2156,
    applied: 134,
    featured: true,
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "Grab Vietnam",
    companyLogo: null,
    location: "TP. Hồ Chí Minh",
    salary: "18 - 28 triệu",
    type: "Toàn thời gian",
    level: "Middle",
    category: "Thiết kế",
    tags: ["Figma", "Prototyping", "User Research"],
    description:
      "Thiết kế trải nghiệm người dùng cho ứng dụng Grab với hàng triệu user tại Đông Nam Á.",
    requirements: [
      "2+ năm kinh nghiệm UI/UX",
      "Portfolio thể hiện kỹ năng thiết kế",
      "Thành thạo Figma và Adobe XD",
      "Hiểu về Design System",
    ],
    benefits: [
      "Grab credits hàng tháng",
      "Flexible working",
      "Training budget",
    ],
    deadline: "2025-02-20",
    postedAt: "2025-01-22",
    views: 987,
    applied: 56,
    featured: false,
  },
  {
    id: 4,
    title: "Product Manager",
    company: "FPT Software",
    companyLogo: null,
    location: "Hà Nội",
    salary: "25 - 45 triệu",
    type: "Toàn thời gian",
    level: "Senior",
    category: "Quản lý sản phẩm",
    tags: ["Agile", "Scrum", "Data Analysis"],
    description:
      "Dẫn dắt nhóm phát triển sản phẩm SaaS cho thị trường quốc tế.",
    requirements: [
      "3+ năm kinh nghiệm PM trong tech",
      "Kinh nghiệm với Agile/Scrum",
      "Kỹ năng phân tích dữ liệu",
      "Tiếng Anh thành thạo",
    ],
    benefits: [
      "Cơ hội làm việc onsite nước ngoài",
      "Đào tạo chứng chỉ quốc tế",
    ],
    deadline: "2025-03-01",
    postedAt: "2025-01-19",
    views: 678,
    applied: 43,
    featured: false,
  },
  {
    id: 5,
    title: "Data Scientist / ML Engineer",
    company: "Shopee Vietnam",
    companyLogo: null,
    location: "TP. Hồ Chí Minh",
    salary: "35 - 60 triệu",
    type: "Toàn thời gian",
    level: "Senior",
    category: "Dữ liệu & AI",
    tags: ["Python", "TensorFlow", "SQL", "Spark"],
    description:
      "Xây dựng các mô hình ML cho hệ thống gợi ý sản phẩm và phát hiện gian lận.",
    requirements: [
      "MS/PhD về KHMT hoặc tương đương",
      "3+ năm kinh nghiệm ML",
      "Thành thạo Python và SQL",
    ],
    benefits: ["Lương top market", "Bonus generous", "Remote hybrid"],
    deadline: "2025-02-25",
    postedAt: "2025-01-21",
    views: 1890,
    applied: 201,
    featured: true,
  },
  {
    id: 6,
    title: "DevOps / Cloud Engineer",
    company: "Zalo (VNG)",
    companyLogo: null,
    location: "TP. Hồ Chí Minh",
    salary: "25 - 40 triệu",
    type: "Toàn thời gian",
    level: "Middle",
    category: "Công nghệ thông tin",
    tags: ["AWS", "Kubernetes", "Terraform", "CI/CD"],
    description:
      "Quản lý và tối ưu hóa hạ tầng cloud phục vụ 70 triệu người dùng Zalo.",
    requirements: [
      "3+ năm DevOps/Cloud",
      "Kinh nghiệm với AWS hoặc GCP",
      "Terraform, Ansible",
    ],
    benefits: ["Môi trường kỹ thuật đỉnh cao", "Thưởng dự án"],
    deadline: "2025-03-10",
    postedAt: "2025-01-17",
    views: 1102,
    applied: 78,
    featured: false,
  },
];

export const JOB_CATEGORIES = [
  { id: "it", name: "Công nghệ thông tin", icon: "💻", count: 1240 },
  { id: "design", name: "Thiết kế", icon: "🎨", count: 340 },
  { id: "marketing", name: "Marketing", icon: "📢", count: 580 },
  { id: "finance", name: "Tài chính - Kế toán", icon: "💰", count: 420 },
  { id: "hr", name: "Nhân sự", icon: "👥", count: 290 },
  { id: "sales", name: "Kinh doanh / Sales", icon: "📈", count: 760 },
  { id: "data", name: "Dữ liệu & AI", icon: "🤖", count: 310 },
  { id: "pm", name: "Quản lý sản phẩm", icon: "🗂️", count: 180 },
];

// ─── Job Service ───────────────────────────────────────────────────────────────
export const jobService = {
  /**
   * Lấy danh sách công việc
   * @param {{ keyword?, location?, category?, level?, type?, page?, limit? }} params
   */
  async getJobs(params = {}) {
    if (USE_MOCK) {
      await delay(600);
      const postedJobs = getPostedJobsFromStorage();
      let jobs = [...MOCK_JOBS, ...postedJobs];
      if (params.keyword) {
        const kw = params.keyword.toLowerCase();
        jobs = jobs.filter(
          (j) =>
            j.title.toLowerCase().includes(kw) ||
            j.company.toLowerCase().includes(kw) ||
            j.tags.some((t) => t.toLowerCase().includes(kw)),
        );
      }
      if (params.category)
        jobs = jobs.filter((j) => j.category === params.category);
      if (params.level) jobs = jobs.filter((j) => j.level === params.level);
      if (params.location)
        jobs = jobs.filter((j) => j.location.includes(params.location));
      return {
        data: jobs.slice(0, params.limit || 20),
        total: jobs.length,
        page: params.page || 1,
      };
    }
    const query = new URLSearchParams(params).toString();
    return api.get(`/jobs?${query}`);
  },

  /**
   * Lấy chi tiết công việc
   * @param {string|number} id
   */
  async getJob(id) {
    if (USE_MOCK) {
      await delay(400);
      const postedJobs = getPostedJobsFromStorage();
      const allJobs = [...MOCK_JOBS, ...postedJobs];
      const job = allJobs.find((j) => String(j.id) === String(id));
      if (!job) throw { message: "Không tìm thấy công việc" };
      return job;
    }
    return api.get(`/jobs/${id}`);
  },

  /**
   * Ứng tuyển công việc
   * @param {number} jobId
   * @param {{ cvId?, coverLetter? }} data
   */
  async applyJob(jobId, data = {}) {
    if (USE_MOCK) {
      await delay(800);
      return { message: "Ứng tuyển thành công!", applicationId: Date.now() };
    }
    return api.post(`/jobs/${jobId}/apply`, data);
  },

  /**
   * Lưu / bỏ lưu công việc
   * @param {number} jobId
   */
  async toggleSaveJob(jobId) {
    if (USE_MOCK) {
      await delay(300);
      return { saved: true };
    }
    return api.post(`/jobs/${jobId}/save`);
  },

  async getCategories() {
    if (USE_MOCK) {
      await delay(200);
      return JOB_CATEGORIES;
    }
    return api.get("/jobs/categories");
  },
};
