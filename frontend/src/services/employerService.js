import api from "./api";

// ─── Employer Service ──────────────────────────────────────────────────────────
export const employerService = {
  // ── Dashboard stats ──
  async getDashboardStats() {
    return api.get("/employer/dashboard/stats");
  },

  // ── Job Posts ──
  async getMyJobs(params = {}) {
    return api.get("/employer/jobs", { params });
  },

  async getJob(id) {
    return api.get(`/employer/jobs/${id}`);
  },

  // Helper: transform frontend job format → backend schema format
  toBackendFormat(data) {
    return {
      title: data.title,
      description: data.description,
      location: data.location,
      type: data.job_type,
      level: data.level,
      companyName: data.companyName,
      category: data.category || 'Công nghệ thông tin',
      salaryMin: data.salary_min ? Number(data.salary_min) : undefined,
      salaryMax: data.salary_max ? Number(data.salary_max) : undefined,
      tags: data.required_skills || [],
      requirements: data.requirements ? data.requirements.split('\\n').filter(Boolean) : [],
      benefits: data.benefits ? data.benefits.split('\\n').filter(Boolean) : [],
      deadline: data.expired_at || undefined,
      status: data.status || 'draft',
    };
  },

  // Helper: transform backend schema format → frontend job format
  toFrontendFormat(job) {
    return {
      id: job._id || job.id,
      title: job.title,
      description: job.description,
      location: job.location,
      companyName: job.companyName,
      category: job.category,
      job_type: (job.type || 'full-time').toLowerCase(),
      level: (job.level || 'junior').toLowerCase(),
      salary_min: job.salaryMin || 0,
      salary_max: job.salaryMax || 0,
      required_skills: job.tags || [],
      requirements: Array.isArray(job.requirements) ? job.requirements.join('\\n') : (job.requirements || ''),
      benefits: Array.isArray(job.benefits) ? job.benefits.join('\\n') : (job.benefits || ''),
      status: job.status || 'active',
      expired_at: job.deadline ? new Date(job.deadline).toISOString() : '',
      view_count: job.views || 0,
      application_count: job.applied || 0,
      created_at: job.createdAt || job.created_at,
      updated_at: job.updatedAt || job.updated_at,
    };
  },

  async createJob(data) {
    return api.post("/jobs", this.toBackendFormat(data));
  },

  async updateJob(id, data) {
    return api.patch(`/jobs/${id}`, this.toBackendFormat(data));
  },

  async deleteJob(id) {
    return api.delete(`/jobs/${id}`);
  },

  async updateJobStatus(id, status) {
    return this.updateJob(id, { status });
  },

  // ── Applications ──
  async getApplications(jobId, params = {}) {
    return api.get(`/employer/jobs/${jobId}/applications`, { params });
  },

  async updateApplicationStatus(applicationId, status) {
    return api.patch(`/employer/applications/${applicationId}/status`, {
      status,
    });
  },

  // ── CV Scoring ──
  async scoreCv(jobId, file, candidateId) {
    const formData = new FormData();
    if (file) {
      formData.append('cv', file);
    }
    if (candidateId) {
      formData.append('candidateId', candidateId);
    }
    
    const response = await api.post(`/cv-scoring/score/${jobId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  async deleteApplication(applicationId) {
    return api.delete(`/employer/applications/${applicationId}`);
  },

  async bulkDeleteApplications(ids) {
    return api.post('/employer/applications/bulk-delete', { ids });
  },

  // ── Candidate Profile ──
  async getCandidateProfile(candidateId) {
    return api.get(`/employer/candidates/${candidateId}/profile`);
  },
};
