import api from "./api";

// ─── Job Service ───────────────────────────────────────────────────────────────
export const jobService = {
  /**
   * Lấy danh sách công việc
   * @param {{ keyword?, location?, category?, level?, type?, page?, limit? }} params
   */
  async getJobs(params = {}) {
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
