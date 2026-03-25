import api from './api'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || !import.meta.env.VITE_API_URL
const delay = ms => new Promise(r => setTimeout(r, ms))

export const MOCK_POSTED_JOBS = [
  {
    id: 101, title: 'Frontend Developer (React)', status: 'active',
    location: 'TP. Hồ Chí Minh', salary: '20 - 35 triệu', type: 'Toàn thời gian',
    level: 'Middle', category: 'Công nghệ thông tin',
    tags: ['React', 'TypeScript', 'TailwindCSS'],
    deadline: '2025-03-15', postedAt: '2025-01-20',
    views: 1243, applied: 18, shortlisted: 5, rejected: 3,
    description: 'Chúng tôi tìm Frontend Developer có kinh nghiệm với React.',
    requirements: ['2+ năm kinh nghiệm React', 'Thành thạo TypeScript', 'Hiểu biết RESTful API'],
    benefits: ['Lương cạnh tranh', 'Thưởng hiệu suất', 'MacBook'],
  },
  {
    id: 102, title: 'Backend Engineer (Node.js)', status: 'active',
    location: 'TP. Hồ Chí Minh', salary: '25 - 40 triệu', type: 'Toàn thời gian',
    level: 'Senior', category: 'Công nghệ thông tin',
    tags: ['Node.js', 'PostgreSQL', 'Docker'],
    deadline: '2025-03-20', postedAt: '2025-01-18',
    views: 876, applied: 12, shortlisted: 3, rejected: 2,
    description: 'Phát triển hệ thống backend phục vụ hàng triệu người dùng.',
    requirements: ['4+ năm Node.js', 'Kinh nghiệm microservices', 'SQL/NoSQL'],
    benefits: ['Thưởng dự án', 'Remote 2 ngày/tuần'],
  },
  {
    id: 103, title: 'UI/UX Designer', status: 'closed',
    location: 'TP. Hồ Chí Minh', salary: '18 - 28 triệu', type: 'Toàn thời gian',
    level: 'Middle', category: 'Thiết kế',
    tags: ['Figma', 'Prototyping'],
    deadline: '2025-01-31', postedAt: '2025-01-05',
    views: 560, applied: 9, shortlisted: 2, rejected: 7,
    description: 'Thiết kế UI/UX cho sản phẩm web và mobile.',
    requirements: ['2+ năm UI/UX', 'Portfolio đẹp', 'Figma thành thạo'],
    benefits: ['Môi trường sáng tạo'],
  },
]

export const MOCK_CANDIDATES = [
  {
    id: 1, name: 'Nguyễn Văn An', email: 'an@example.com', phone: '0901234567',
    title: 'Frontend Developer', location: 'TP. Hồ Chí Minh',
    experience: '3 năm', skills: ['React', 'TypeScript', 'Node.js'],
    education: 'Đại học Bách Khoa TP.HCM', cvScore: 85, cvGrade: 'A',
    appliedJob: 'Frontend Developer (React)', appliedAt: '2025-01-22T10:00:00Z',
    status: 'shortlisted', // pending | shortlisted | rejected | hired
    jobId: 101,
  },
  {
    id: 2, name: 'Lê Thị Mai', email: 'mai@example.com', phone: '0902345678',
    title: 'React Developer', location: 'Hà Nội',
    experience: '2 năm', skills: ['React', 'JavaScript', 'CSS'],
    education: 'Đại học FPT', cvScore: 72, cvGrade: 'B',
    appliedJob: 'Frontend Developer (React)', appliedAt: '2025-01-23T14:30:00Z',
    status: 'pending',
    jobId: 101,
  },
  {
    id: 3, name: 'Phạm Minh Tuấn', email: 'tuan@example.com', phone: '0903456789',
    title: 'Full Stack Developer', location: 'TP. Hồ Chí Minh',
    experience: '4 năm', skills: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
    education: 'Đại học KHTN TP.HCM', cvScore: 91, cvGrade: 'A',
    appliedJob: 'Frontend Developer (React)', appliedAt: '2025-01-21T09:00:00Z',
    status: 'hired',
    jobId: 101,
  },
  {
    id: 4, name: 'Vũ Thị Hoa', email: 'hoa@example.com', phone: '0904567890',
    title: 'Backend Developer', location: 'TP. Hồ Chí Minh',
    experience: '5 năm', skills: ['Node.js', 'PostgreSQL', 'Redis', 'AWS'],
    education: 'Đại học Công nghệ - ĐHQGHN', cvScore: 88, cvGrade: 'A',
    appliedJob: 'Backend Engineer (Node.js)', appliedAt: '2025-01-24T11:00:00Z',
    status: 'shortlisted',
    jobId: 102,
  },
  {
    id: 5, name: 'Trần Quốc Bảo', email: 'bao@example.com', phone: '0905678901',
    title: 'Junior Backend Developer', location: 'Đà Nẵng',
    experience: '1 năm', skills: ['Node.js', 'MySQL'],
    education: 'Đại học Đà Nẵng', cvScore: 58, cvGrade: 'C',
    appliedJob: 'Backend Engineer (Node.js)', appliedAt: '2025-01-25T16:00:00Z',
    status: 'rejected',
    jobId: 102,
  },
]

export const MOCK_RESUME_SEARCH = [
  {
    id: 10, name: 'Đinh Văn Hùng', title: 'Senior React Developer',
    location: 'TP. Hồ Chí Minh', experience: '5 năm',
    skills: ['React', 'TypeScript', 'GraphQL', 'AWS'],
    education: 'Đại học Bách Khoa', cvScore: 92, expectedSalary: '35 - 50 triệu',
    availability: 'Có thể bắt đầu ngay', lastActive: '1 ngày trước',
  },
  {
    id: 11, name: 'Ngô Thị Lan', title: 'Product Designer',
    location: 'TP. Hồ Chí Minh', experience: '3 năm',
    skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
    education: 'Đại học Mỹ thuật TP.HCM', cvScore: 84, expectedSalary: '20 - 30 triệu',
    availability: 'Đang tìm việc', lastActive: '3 giờ trước',
  },
  {
    id: 12, name: 'Hoàng Minh Đức', title: 'DevOps Engineer',
    location: 'Hà Nội', experience: '4 năm',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
    education: 'Đại học Bách Khoa HN', cvScore: 88, expectedSalary: '28 - 45 triệu',
    availability: 'Có thể bắt đầu trong 1 tháng', lastActive: '2 ngày trước',
  },
  {
    id: 13, name: 'Bùi Thị Thu', title: 'Data Analyst',
    location: 'TP. Hồ Chí Minh', experience: '2 năm',
    skills: ['Python', 'SQL', 'Power BI', 'Tableau'],
    education: 'Đại học Kinh tế TP.HCM', cvScore: 76, expectedSalary: '18 - 28 triệu',
    availability: 'Đang tìm việc', lastActive: '5 giờ trước',
  },
  {
    id: 14, name: 'Lý Văn Nam', title: 'Mobile Developer (React Native)',
    location: 'TP. Hồ Chí Minh', experience: '3 năm',
    skills: ['React Native', 'TypeScript', 'Firebase', 'Redux'],
    education: 'Đại học FPT', cvScore: 80, expectedSalary: '22 - 35 triệu',
    availability: 'Đang tìm việc', lastActive: '1 giờ trước',
  },
  {
    id: 15, name: 'Phan Thị Yến', title: 'Backend Developer (Python)',
    location: 'Đà Nẵng', experience: '3 năm',
    skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
    education: 'Đại học Đà Nẵng', cvScore: 82, expectedSalary: '20 - 32 triệu',
    availability: 'Có thể bắt đầu trong 2 tuần', lastActive: '12 giờ trước',
  },
]

export const employerService = {
  async getMyJobs() {
    if (USE_MOCK) { await delay(500); return MOCK_POSTED_JOBS }
    return api.get('/employer/jobs')
  },

  async getJob(id) {
    if (USE_MOCK) { await delay(300); return MOCK_POSTED_JOBS.find(j => j.id === Number(id)) }
    return api.get(`/employer/jobs/${id}`)
  },

  async createJob(data) {
    if (USE_MOCK) { await delay(1000); return { ...data, id: Date.now(), status: 'active', views: 0, applied: 0, shortlisted: 0, rejected: 0, postedAt: new Date().toISOString() } }
    return api.post('/employer/jobs', data)
  },

  async updateJob(id, data) {
    if (USE_MOCK) { await delay(600); return { id, ...data } }
    return api.put(`/employer/jobs/${id}`, data)
  },

  async deleteJob(id) {
    if (USE_MOCK) { await delay(400); return { message: 'Đã xóa' } }
    return api.delete(`/employer/jobs/${id}`)
  },

  async getCandidates(jobId) {
    if (USE_MOCK) {
      await delay(500)
      return jobId ? MOCK_CANDIDATES.filter(c => c.jobId === Number(jobId)) : MOCK_CANDIDATES
    }
    const q = jobId ? `?jobId=${jobId}` : ''
    return api.get(`/employer/candidates${q}`)
  },

  async updateCandidateStatus(candidateId, status) {
    if (USE_MOCK) { await delay(300); return { candidateId, status } }
    return api.patch(`/employer/candidates/${candidateId}/status`, { status })
  },

  async searchResumes(params = {}) {
    if (USE_MOCK) {
      await delay(600)
      let list = [...MOCK_RESUME_SEARCH]
      if (params.keyword) {
        const kw = params.keyword.toLowerCase()
        list = list.filter(r => r.title.toLowerCase().includes(kw) || r.skills.some(s => s.toLowerCase().includes(kw)))
      }
      if (params.location) list = list.filter(r => r.location.includes(params.location))
      return { data: list, total: list.length }
    }
    return api.get(`/employer/resumes?${new URLSearchParams(params)}`)
  },

  async getDashboard() {
    if (USE_MOCK) {
      await delay(400)
      return {
        totalJobs: MOCK_POSTED_JOBS.length,
        activeJobs: MOCK_POSTED_JOBS.filter(j => j.status === 'active').length,
        totalApplications: MOCK_CANDIDATES.length,
        pendingReview: MOCK_CANDIDATES.filter(c => c.status === 'pending').length,
        shortlisted: MOCK_CANDIDATES.filter(c => c.status === 'shortlisted').length,
        hired: MOCK_CANDIDATES.filter(c => c.status === 'hired').length,
        recentApplications: MOCK_CANDIDATES.slice(0, 3),
      }
    }
    return api.get('/employer/dashboard')
  },
}