import api from './api'

const USE_MOCK = false; // Backend Admin APIs are now implemented
const delay = ms => new Promise(r => setTimeout(r, ms))

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const MOCK_ADMIN_USERS = [
    {
        id: 1, role: 'candidate', name: 'Nguyễn Văn An', email: 'an.nguyen@example.com',
        phone: '0901234567', location: 'TP. Hồ Chí Minh',
        avatar: null, status: 'active',
        cvCount: 5, appliedJobs: 12, savedJobs: 8,
        createdAt: '2024-11-10T08:00:00Z', lastLogin: '2025-01-25T14:30:00Z',
    },
    {
        id: 2, role: 'candidate', name: 'Lê Thị Mai', email: 'mai.le@example.com',
        phone: '0902345678', location: 'Hà Nội',
        avatar: null, status: 'active',
        cvCount: 2, appliedJobs: 5, savedJobs: 3,
        createdAt: '2024-12-01T09:00:00Z', lastLogin: '2025-01-24T10:00:00Z',
    },
    {
        id: 3, role: 'candidate', name: 'Trần Minh Quân', email: 'quan.tran@example.com',
        phone: '0903456789', location: 'Đà Nẵng',
        avatar: null, status: 'banned',
        cvCount: 1, appliedJobs: 2, savedJobs: 0,
        createdAt: '2024-12-15T10:00:00Z', lastLogin: '2025-01-10T08:00:00Z',
        banReason: 'Vi phạm điều khoản sử dụng',
    },
    {
        id: 4, role: 'employer', name: 'Phạm Thị Bích', email: 'bich.pham@vng.com.vn',
        phone: '0904567890', location: 'TP. Hồ Chí Minh',
        avatar: null, status: 'active',
        companyName: 'VNG Corporation', companySize: '1000-5000',
        postedJobs: 8, totalApplicants: 245,
        createdAt: '2024-10-05T07:00:00Z', lastLogin: '2025-01-25T16:00:00Z',
    },
    {
        id: 5, role: 'employer', name: 'Hoàng Văn Tú', email: 'tu.hoang@momo.com',
        phone: '0905678901', location: 'TP. Hồ Chí Minh',
        avatar: null, status: 'active',
        companyName: 'MoMo (M_Service)', companySize: '500-1000',
        postedJobs: 5, totalApplicants: 132,
        createdAt: '2024-11-20T08:00:00Z', lastLogin: '2025-01-23T11:00:00Z',
    },
    {
        id: 6, role: 'employer', name: 'Vũ Thị Lan', email: 'lan.vu@startup.vn',
        phone: '0906789012', location: 'Hà Nội',
        avatar: null, status: 'pending',
        companyName: 'Startup ABC', companySize: '10-50',
        postedJobs: 0, totalApplicants: 0,
        createdAt: '2025-01-24T09:00:00Z', lastLogin: '2025-01-24T09:05:00Z',
    },
    {
        id: 7, role: 'candidate', name: 'Đinh Quốc Bảo', email: 'bao.dinh@gmail.com',
        phone: '0907890123', location: 'TP. Hồ Chí Minh',
        avatar: null, status: 'active',
        cvCount: 3, appliedJobs: 7, savedJobs: 5,
        createdAt: '2025-01-02T10:00:00Z', lastLogin: '2025-01-25T09:00:00Z',
    },
]

export const MOCK_ADMIN_JOBS = [
    {
        id: 101, title: 'Senior Frontend Developer (React)', company: 'VNG Corporation',
        companyId: 4, location: 'TP. Hồ Chí Minh', salary: '30 - 50 triệu',
        level: 'Senior', type: 'Toàn thời gian', category: 'Công nghệ thông tin',
        status: 'active', featured: true,
        views: 3241, applied: 87, postedAt: '2025-01-15T08:00:00Z', deadline: '2025-03-01',
        tags: ['React', 'TypeScript', 'GraphQL'],
        reportCount: 0,
    },
    {
        id: 102, title: 'Data Scientist (ML/AI)', company: 'MoMo (M_Service)',
        companyId: 5, location: 'TP. Hồ Chí Minh', salary: '40 - 70 triệu',
        level: 'Senior', type: 'Toàn thời gian', category: 'Dữ liệu & AI',
        status: 'active', featured: false,
        views: 2105, applied: 54, postedAt: '2025-01-18T09:00:00Z', deadline: '2025-02-28',
        tags: ['Python', 'TensorFlow', 'SQL'],
        reportCount: 0,
    },
    {
        id: 103, title: 'UI/UX Designer', company: 'Startup ABC',
        companyId: 6, location: 'Hà Nội', salary: '15 - 25 triệu',
        level: 'Junior', type: 'Toàn thời gian', category: 'Thiết kế',
        status: 'pending', featured: false,
        views: 0, applied: 0, postedAt: '2025-01-24T10:00:00Z', deadline: '2025-03-15',
        tags: ['Figma', 'Adobe XD'],
        reportCount: 0,
    },
    {
        id: 104, title: 'Nhân Viên Marketing (Spam)', company: 'Unknown Co',
        companyId: 99, location: 'Toàn quốc', salary: 'Thu nhập không giới hạn',
        level: 'Intern', type: 'Bán thời gian', category: 'Marketing',
        status: 'reported', featured: false,
        views: 450, applied: 12, postedAt: '2025-01-20T11:00:00Z', deadline: '2025-02-01',
        tags: ['MLM', 'Sales'],
        reportCount: 5,
    },
    {
        id: 105, title: 'DevOps Engineer (AWS/K8s)', company: 'VNG Corporation',
        companyId: 4, location: 'TP. Hồ Chí Minh', salary: '25 - 45 triệu',
        level: 'Middle', type: 'Toàn thời gian', category: 'Công nghệ thông tin',
        status: 'active', featured: false,
        views: 1532, applied: 38, postedAt: '2025-01-19T08:00:00Z', deadline: '2025-03-10',
        tags: ['AWS', 'Kubernetes', 'Docker'],
        reportCount: 0,
    },
    {
        id: 106, title: 'Product Manager', company: 'MoMo (M_Service)',
        companyId: 5, location: 'TP. Hồ Chí Minh', salary: '35 - 60 triệu',
        level: 'Senior', type: 'Toàn thời gian', category: 'Quản lý sản phẩm',
        status: 'closed', featured: false,
        views: 987, applied: 23, postedAt: '2025-01-05T08:00:00Z', deadline: '2025-01-20',
        tags: ['Agile', 'Scrum', 'Analytics'],
        reportCount: 0,
    },
]

export const MOCK_CV_SCORES = [
    {
        id: 1, userId: 1, userName: 'Nguyễn Văn An', userEmail: 'an.nguyen@example.com',
        fileName: 'CV_NguyenVanAn_2025.pdf', overall: 85, grade: 'A',
        targetPosition: 'Frontend Developer',
        scoredAt: '2025-01-25T10:30:00Z', processingTime: 28,
        categories: { skills: 88, experience: 82, education: 90, format: 80, keywords: 75 },
    },
    {
        id: 2, userId: 2, userName: 'Lê Thị Mai', userEmail: 'mai.le@example.com',
        fileName: 'CV_LeTM_2025.pdf', overall: 72, grade: 'B',
        targetPosition: 'Marketing Executive',
        scoredAt: '2025-01-24T14:20:00Z', processingTime: 31,
        categories: { skills: 70, experience: 75, education: 80, format: 65, keywords: 60 },
    },
    {
        id: 3, userId: 7, userName: 'Đinh Quốc Bảo', userEmail: 'bao.dinh@gmail.com',
        fileName: 'CV_DinhQB.pdf', overall: 91, grade: 'A',
        targetPosition: 'Full Stack Developer',
        scoredAt: '2025-01-25T09:00:00Z', processingTime: 25,
        categories: { skills: 93, experience: 90, education: 88, format: 92, keywords: 88 },
    },
    {
        id: 4, userId: 1, userName: 'Nguyễn Văn An', userEmail: 'an.nguyen@example.com',
        fileName: 'CV_Updated_v2.pdf', overall: 78, grade: 'B',
        targetPosition: 'React Developer',
        scoredAt: '2025-01-20T16:00:00Z', processingTime: 29,
        categories: { skills: 80, experience: 78, education: 85, format: 72, keywords: 68 },
    },
    {
        id: 5, userId: 3, userName: 'Trần Minh Quân', userEmail: 'quan.tran@example.com',
        fileName: 'My_CV.pdf', overall: 55, grade: 'C',
        targetPosition: '',
        scoredAt: '2025-01-10T08:30:00Z', processingTime: 35,
        categories: { skills: 50, experience: 55, education: 60, format: 55, keywords: 45 },
    },
]

export const MOCK_REPORTS = {
    overview: {
        totalUsers: 1250, newUsersThisMonth: 143, totalEmployers: 280,
        totalJobs: 3840, activeJobs: 2651, totalApplications: 18430,
        totalCVScores: 8920, avgCVScore: 74.5,
        revenue: 0, // free platform
    },
    userGrowth: [
        { month: 'T8/2024', candidates: 580, employers: 120 },
        { month: 'T9/2024', candidates: 720, employers: 145 },
        { month: 'T10/2024', candidates: 890, employers: 178 },
        { month: 'T11/2024', candidates: 980, employers: 210 },
        { month: 'T12/2024', candidates: 1100, employers: 248 },
        { month: 'T1/2025', candidates: 1250, employers: 280 },
    ],
    jobsByCategory: [
        { category: 'Công nghệ thông tin', count: 1240, pct: 32 },
        { category: 'Kinh doanh / Sales', count: 760, pct: 20 },
        { category: 'Marketing', count: 580, pct: 15 },
        { category: 'Tài chính - Kế toán', count: 420, pct: 11 },
        { category: 'Nhân sự', count: 290, pct: 8 },
        { category: 'Thiết kế', count: 340, pct: 9 },
        { category: 'Khác', count: 210, pct: 5 },
    ],
    cvScoreDistribution: [
        { grade: 'A (85-100)', count: 1820, pct: 20 },
        { grade: 'B (70-84)', count: 3560, pct: 40 },
        { grade: 'C (55-69)', count: 2680, pct: 30 },
        { grade: 'D (<55)', count: 860, pct: 10 },
    ],
    topLocations: [
        { city: 'TP. Hồ Chí Minh', jobs: 1850, users: 620 },
        { city: 'Hà Nội', jobs: 1240, users: 410 },
        { city: 'Đà Nẵng', jobs: 380, users: 130 },
        { city: 'Cần Thơ', jobs: 120, users: 55 },
        { city: 'Khác', jobs: 250, users: 35 },
    ],
    recentActivities: [
        { id: 1, type: 'new_user', message: 'Ứng viên mới đăng ký: Nguyễn Văn X', time: '2 phút trước' },
        { id: 2, type: 'new_job', message: 'Tin tuyển dụng mới cần duyệt: UI/UX Designer', time: '8 phút trước' },
        { id: 3, type: 'cv_score', message: 'CV được chấm điểm: 91/100 (Xuất sắc)', time: '15 phút trước' },
        { id: 4, type: 'report', message: 'Tin đăng bị báo cáo: "Nhân viên Marketing"', time: '32 phút trước' },
        { id: 5, type: 'new_employer', message: 'NTD mới cần xác minh: Startup ABC', time: '1 giờ trước' },
        { id: 6, type: 'application', message: '87 lượt ứng tuyển mới trong hôm nay', time: '2 giờ trước' },
    ],
}

export const MOCK_SETTINGS = {
    site: {
        siteName: 'NexCV', siteUrl: 'https://nexcv.vn',
        contactEmail: 'support@nexcv.vn', contactPhone: '0901234567',
        maintenanceMode: false,
    },
    ai: {
        cvScoreEnabled: true, maxFileSizeMB: 10,
        supportedFormats: ['pdf', 'doc', 'docx'],
        processingTimeoutSec: 60,
        dailyScoreLimit: 5, // per user
    },
    jobs: {
        requireApproval: true, maxJobsPerEmployer: 20,
        featuredJobPrice: 0, jobExpiryDays: 90,
        autoCloseExpired: true,
    },
    users: {
        emailVerificationRequired: false,
        employerVerificationRequired: true,
        maxSavedJobs: 50,
    },
}

// ─── Admin Service ─────────────────────────────────────────────────────────────
export const adminService = {
    async login(email, password) {
        return api.post('/auth/login', { email, password })
    },

    // ── Dashboard ──────────────────────────────────────────────────────────────
    async getDashboard() {
        if (USE_MOCK) { await delay(500); return MOCK_REPORTS }
        return api.get('/admin/dashboard')
    },

    // ── Users ──────────────────────────────────────────────────────────────────
    async getUsers(params = {}) {
        if (USE_MOCK) {
            await delay(400)
            let list = [...MOCK_ADMIN_USERS]
            if (params.role) list = list.filter(u => u.role === params.role)
            if (params.status) list = list.filter(u => u.status === params.status)
            if (params.keyword) {
                const kw = params.keyword.toLowerCase()
                list = list.filter(u => u.name.toLowerCase().includes(kw) || u.email.toLowerCase().includes(kw))
            }
            return { data: list, total: list.length }
        }
        return api.get(`/admin/users?${new URLSearchParams(params)}`)
    },

    async getUser(id) {
        if (USE_MOCK) { await delay(300); return MOCK_ADMIN_USERS.find(u => u.id === Number(id)) }
        return api.get(`/admin/users/${id}`)
    },

    async updateUserStatus(id, status, reason = '') {
        if (USE_MOCK) { await delay(400); return { id, status, reason } }
        return api.patch(`/admin/users/${id}/status`, { status, reason })
    },

    async deleteUser(id) {
        if (USE_MOCK) { await delay(500); return { message: 'Đã xóa người dùng' } }
        return api.delete(`/admin/users/${id}`)
    },

    // ── Jobs ───────────────────────────────────────────────────────────────────
    async getJobs(params = {}) {
        if (USE_MOCK) {
            await delay(400)
            let list = [...MOCK_ADMIN_JOBS]
            const localStr = localStorage.getItem("nexcv_mock_jobs");
            if (localStr) {
                try {
                    const localJobs = JSON.parse(localStr).map(j => ({
                        id: j.id, title: j.title, company: j.company || 'Công ty TNHH NexCV',
                        companyId: j.recruiter_id, location: j.location, salary: j.salary_min ? `${(j.salary_min/1000000)} - ${(j.salary_max/1000000)} triệu` : 'Thỏa thuận',
                        level: j.level, type: j.job_type, category: 'Công nghệ thông tin',
                        status: j.status, featured: false, views: j.view_count, applied: j.application_count,
                        postedAt: j.created_at, deadline: j.expired_at, tags: j.required_skills, reportCount: 0,
                        description: j.description,
                        requirements: j.requirements,
                        benefits: j.benefits
                    }));
                    list = [...list, ...localJobs.filter(lj => !list.find(aj => aj.id === lj.id))];
                } catch { /* empty */ }
            }
            if (params.status) list = list.filter(j => j.status === params.status)
            if (params.keyword) {
                const kw = params.keyword.toLowerCase()
                list = list.filter(j => j.title.toLowerCase().includes(kw) || j.company.toLowerCase().includes(kw))
            }
            return { data: list, total: list.length }
        }
        return api.get(`/admin/jobs?${new URLSearchParams(params)}`)
    },

    async updateJobStatus(id, status) {
        if (USE_MOCK) { 
            await delay(400); 
            const localStr = localStorage.getItem("nexcv_mock_jobs");
            if (localStr) {
                try {
                    const localJobs = JSON.parse(localStr);
                    const idx = localJobs.findIndex(j => j.id === id);
                    if (idx !== -1) {
                        localJobs[idx].status = status;
                        localStorage.setItem("nexcv_mock_jobs", JSON.stringify(localJobs));
                    }
                } catch { /* empty */ }
            }
            return { id, status } 
        }
        return api.patch(`/admin/jobs/${id}/status`, { status })
    },

    async toggleJobFeatured(id, featured) {
        if (USE_MOCK) { await delay(300); return { id, featured } }
        return api.patch(`/admin/jobs/${id}/featured`, { featured })
    },

    async deleteJob(id) {
        if (USE_MOCK) { await delay(400); return { message: 'Đã xóa tin' } }
        return api.delete(`/admin/jobs/${id}`)
    },

    // ── CV Scores ──────────────────────────────────────────────────────────────
    async getCVScores(params = {}) {
        if (USE_MOCK) {
            await delay(400)
            let list = [...MOCK_CV_SCORES]
            if (params.keyword) {
                const kw = params.keyword.toLowerCase()
                list = list.filter(s => s.userName.toLowerCase().includes(kw) || s.userEmail.toLowerCase().includes(kw))
            }
            if (params.grade) list = list.filter(s => s.grade === params.grade)
            return { data: list, total: list.length }
        }
        return api.get(`/admin/cv-scores?${new URLSearchParams(params)}`)
    },

    async deleteCVScore(id) {
        if (USE_MOCK) { await delay(300); return { message: 'Đã xóa' } }
        return api.delete(`/admin/cv-scores/${id}`)
    },

    // ── Reports ────────────────────────────────────────────────────────────────
    async getReports() {
        if (USE_MOCK) { await delay(500); return MOCK_REPORTS }
        return api.get('/admin/reports')
    },

    // ── Settings ───────────────────────────────────────────────────────────────
    async getSettings() {
        if (USE_MOCK) { await delay(300); return MOCK_SETTINGS }
        return api.get('/admin/settings')
    },

    async updateSettings(section, data) {
        if (USE_MOCK) { await delay(600); return { section, ...data } }
        return api.patch(`/admin/settings/${section}`, data)
    },

    // ── Notifications ──────────────────────────────────────────────────────────
    async getNotifications(params = {}) {
        if (USE_MOCK) {
            await delay(300);
            const stored = localStorage.getItem('nexcv_mock_notifications');
            let list = stored ? JSON.parse(stored) : [];
            if (params.filter === 'unread') list = list.filter(n => n.unread);
            return { data: list, total: list.length, unreadCount: list.filter(n => n.unread).length };
        }
        const query = params.filter ? `?filter=${params.filter}` : '';
        return api.get(`/admin/notifications${query}`);
    },

    async markNotificationRead(id) {
        if (USE_MOCK) {
            await delay(200);
            const stored = localStorage.getItem('nexcv_mock_notifications');
            if (stored) {
                const list = JSON.parse(stored).map(n =>
                    n.id === id ? { ...n, unread: false } : n
                );
                localStorage.setItem('nexcv_mock_notifications', JSON.stringify(list));
            }
            return { success: true };
        }
        return api.patch(`/admin/notifications/${id}/read`);
    },

    async deleteNotification(id) {
        if (USE_MOCK) {
            await delay(200);
            const stored = localStorage.getItem('nexcv_mock_notifications');
            if (stored) {
                const list = JSON.parse(stored).filter(n => n.id !== id);
                localStorage.setItem('nexcv_mock_notifications', JSON.stringify(list));
            }
            return { success: true };
        }
        return api.delete(`/admin/notifications/${id}`);
    },

    async markAllNotificationsRead() {
        if (USE_MOCK) {
            await delay(300);
            const stored = localStorage.getItem('nexcv_mock_notifications');
            if (stored) {
                const list = JSON.parse(stored).map(n => ({ ...n, unread: false }));
                localStorage.setItem('nexcv_mock_notifications', JSON.stringify(list));
            }
            return { success: true };
        }
        return api.post('/admin/notifications/read-all');
    },
}