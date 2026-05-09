import api from "./api";

// ─── Job Service ───────────────────────────────────────────────────────────────
export const jobService = {
  /**
   * Lấy danh sách công việc
   * @param {{ keyword?, location?, category?, level?, type?, page?, limit? }} params
   */
  async getJobs(params = {}) {
    const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true" || !import.meta.env.VITE_API_URL;
    if (USE_MOCK) {
      const localStr = localStorage.getItem("nexcv_mock_jobs");
      let jobs = localStr ? JSON.parse(localStr) : [];
      // Candidate only sees 'active' jobs
      jobs = jobs.filter(j => j.status === 'active');
      
      // Map to frontend format
      const formatted = jobs.map(j => ({
        ...j,
        company: j.company || 'Công ty TNHH NexCV',
        postedAt: j.created_at,
        salary: j.salary_min ? `${(j.salary_min/1000000)} - ${(j.salary_max/1000000)} triệu` : 'Thỏa thuận',
        tags: j.required_skills || [],
      }));
      return { data: formatted, total: formatted.length };
    }
    const query = new URLSearchParams(params).toString();
    const res = await api.get(`/jobs?${query}`);
    // Chuẩn hóa dữ liệu từ backend sang format frontend mong muốn
    if (res && res.data) {
      res.data = res.data.map((j) => ({
        ...j,
        id: j._id, // Backend dùng _id
        company: j.companyName || "N/A",
        postedAt: j.createdAt,
      }));
    }
    return res;
  },

  /**
   * Lấy chi tiết công việc
   * @param {string|number} id
   */
  async getJob(id) {
    const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true" || !import.meta.env.VITE_API_URL;
    if (USE_MOCK) {
      const localStr = localStorage.getItem("nexcv_mock_jobs");
      const jobs = localStr ? JSON.parse(localStr) : [];
      // Note: id might be string or number
      const job = jobs.find(j => j.id == id);
      if (job) {
        return {
          ...job,
          company: job.company || 'Công ty TNHH NexCV',
          postedAt: job.created_at,
          salary: job.salary_min ? `${(job.salary_min/1000000)} - ${(job.salary_max/1000000)} triệu` : 'Thỏa thuận',
          tags: job.required_skills || [],
          requirements: job.requirements || ['Yêu cầu xem trong phần mô tả chi tiết'],
          benefits: job.benefits || ['Được làm việc trong môi trường năng động', 'Đầy đủ chế độ bảo hiểm'],
        };
      }
      throw new Error("Job not found");
    }
    const res = await api.get(`/jobs/${id}`);
    if (res) {
      return {
        ...res,
        id: res._id,
        company: res.companyName || "N/A",
        postedAt: res.createdAt,
      };
    }
    return res;
  },

  /**
   * Ứng tuyển công việc
   * @param {string} jobId
   * @param {{ cvId?, coverLetter? }} data
   */
  async applyJob(jobId, data = {}) {
    return api.post(`/jobs/${jobId}/apply`, data);
  },

  /**
   * Lưu / bỏ lưu công việc
   * @param {string} jobId
   */
  async toggleSaveJob(jobId) {
    return api.post(`/jobs/${jobId}/save`);
  },

  /**
   * Lấy danh sách danh mục công việc
   */
  async getCategories() {
    return api.get("/jobs/categories");
  },

  /**
   * Lấy danh sách công việc đã ứng tuyển
   */
  async getAppliedJobs() {
    return api.get("/jobs/my-applications");
  },
};

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
