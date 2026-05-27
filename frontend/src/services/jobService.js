import api from "./api";

// ─── Job Service ───────────────────────────────────────────────────────────────
export const jobService = {
  /**
   * Lấy danh sách công việc
   * @param {{ keyword?, location?, category?, level?, type?, page?, limit? }} params
   */
  async getJobs(params = {}) {
    const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
    if (USE_MOCK) {
      const localStr = localStorage.getItem("nexcv_mock_jobs");
      let jobs = localStr ? JSON.parse(localStr) : [];
      // Candidate only sees 'active' jobs
      jobs = jobs.filter(j => j.status === 'active');

      // Apply filters
      if (params.keyword) {
        const term = params.keyword.toLowerCase();
        jobs = jobs.filter(j => 
            j.title.toLowerCase().includes(term) || 
            (j.company && j.company.toLowerCase().includes(term)) ||
            (j.description && j.description.toLowerCase().includes(term)) ||
            (j.required_skills && j.required_skills.some(s => s.toLowerCase().includes(term)))
        );
      }
      if (params.location) {
        jobs = jobs.filter(j => j.location && j.location.includes(params.location));
      }
      if (params.category) {
        jobs = jobs.filter(j => j.category === params.category);
      }
      if (params.level) {
        jobs = jobs.filter(j => j.level === params.level);
      }
      if (params.type) {
        jobs = jobs.filter(j => j.type === params.type);
      }
      
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
    const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
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
    const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 600));
      const localAppsStr = localStorage.getItem("nexcv_mock_applications");
      const apps = localAppsStr ? JSON.parse(localAppsStr) : [];
      const newApp = {
        id: "app_" + Date.now(),
        job_id: jobId,
        seeker_id: "demo_seeker",
        status: "pending",
        cover_letter: data.coverLetter || "",
        applied_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        seeker: {
          full_name: "Nguyễn Văn An (Demo)",
          email: "demo@nexcv.vn",
          avatar_url: null,
        },
        resume: { title: "CV_Demo_UngVien.pdf", pdf_url: "#" },
        ai_score: { 
          overall_score: Math.floor(Math.random() * 20) + 75, 
          breakdown: { skills: 80, experience: 80, education: 80, keywords: 80 } 
        },
      };
      apps.push(newApp);
      localStorage.setItem("nexcv_mock_applications", JSON.stringify(apps));
      
      // Tăng application_count trong nexcv_mock_jobs
      const jobsStr = localStorage.getItem("nexcv_mock_jobs");
      if (jobsStr) {
        const jobs = JSON.parse(jobsStr);
        const jobIndex = jobs.findIndex(j => j.id == jobId);
        if (jobIndex !== -1) {
          jobs[jobIndex].application_count = (jobs[jobIndex].application_count || 0) + 1;
          localStorage.setItem("nexcv_mock_jobs", JSON.stringify(jobs));
        }
      }
      
      return { message: "Ứng tuyển thành công" };
    }
    return api.post(`/jobs/${jobId}/apply`, data);
  },

  /**
   * Lưu / bỏ lưu công việc
   * @param {string} jobId
   */
  async toggleSaveJob(jobId) {
    const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 300));
      const savedStr = localStorage.getItem('nexcv_mock_saved_jobs');
      const saved = savedStr ? JSON.parse(savedStr) : [];
      const idx = saved.indexOf(jobId);
      if (idx === -1) {
        saved.push(jobId);
        localStorage.setItem('nexcv_mock_saved_jobs', JSON.stringify(saved));
        return { saved: true };
      } else {
        saved.splice(idx, 1);
        localStorage.setItem('nexcv_mock_saved_jobs', JSON.stringify(saved));
        return { saved: false };
      }
    }
    return api.post(`/jobs/${jobId}/save`);
  },

  /**
   * Lấy danh sách việc làm đã lưu
   */
  async getSavedJobs() {
    const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 400));
      const savedStr = localStorage.getItem('nexcv_mock_saved_jobs');
      const savedIds = savedStr ? JSON.parse(savedStr) : [];
      const jobsStr = localStorage.getItem('nexcv_mock_jobs');
      const jobs = jobsStr ? JSON.parse(jobsStr) : [];
      return jobs
        .filter(j => savedIds.includes(String(j.id)))
        .map(j => ({
          ...j,
          _id: j.id,
          companyName: j.company || 'Công ty TNHH NexCV',
          salary: j.salary_min ? `${j.salary_min / 1000000} - ${j.salary_max / 1000000} triệu` : 'Thỏa thuận',
        }));
    }
    return api.get('/jobs/my-saved-jobs');
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
    const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 400));
      const appsStr = localStorage.getItem("nexcv_mock_applications");
      const jobsStr = localStorage.getItem("nexcv_mock_jobs");
      
      const apps = appsStr ? JSON.parse(appsStr) : [];
      const jobs = jobsStr ? JSON.parse(jobsStr) : [];
      
      // Lọc các ứng tuyển của seeker hiện tại (trong mock ta dùng 'demo_seeker')
      const myApps = apps.filter(a => a.seeker_id === "demo_seeker");
      
      // Map format cho AppliedTab
      return myApps.map(app => {
        const job = jobs.find(j => j.id === app.job_id) || {};
        return {
          _id: app.id,
          status: app.status,
          createdAt: app.applied_at,
          jobId: {
            _id: job.id,
            title: job.title,
            companyName: job.company || "Công ty TNHH NexCV",
            location: job.location,
          }
        };
      });
    }
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
