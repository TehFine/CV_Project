import api from './api'

// ─── Admin Service ─────────────────────────────────────────────────────────────
export const adminService = {
    async login(email, password) {
        return api.post('/auth/login', { email, password })
    },

    // ── Dashboard ──────────────────────────────────────────────────────────────
    async getDashboard() {
        return api.get('/admin/dashboard')
    },

    // ── Users ──────────────────────────────────────────────────────────────────
    async getUsers(params = {}) {
        return api.get(`/admin/users?${new URLSearchParams(params)}`)
    },

    async getUser(id) {
        return api.get(`/admin/users/${id}`)
    },

    async updateUserStatus(id, status, reason = '') {
        return api.patch(`/admin/users/${id}/status`, { status, reason })
    },

    async deleteUser(id) {
        return api.delete(`/admin/users/${id}`)
    },

    // ── Jobs ───────────────────────────────────────────────────────────────────
    async getJobs(params = {}) {
        return api.get(`/admin/jobs?${new URLSearchParams(params)}`)
    },

    async updateJobStatus(id, status) {
        return api.patch(`/admin/jobs/${id}/status`, { status })
    },

    async toggleJobFeatured(id, featured) {
        return api.patch(`/admin/jobs/${id}/featured`, { featured })
    },

    async deleteJob(id) {
        return api.delete(`/admin/jobs/${id}`)
    },

    // ── CV Scores ──────────────────────────────────────────────────────────────
    async getCVScores(params = {}) {
        return api.get(`/admin/cv-scores?${new URLSearchParams(params)}`)
    },

    async deleteCVScore(id) {
        return api.delete(`/admin/cv-scores/${id}`)
    },

    // ── Reports ────────────────────────────────────────────────────────────────
    async getReports() {
        return api.get('/admin/reports')
    },

    // ── Settings ───────────────────────────────────────────────────────────────
    async getSettings() {
        return api.get('/admin/settings')
    },

    async updateSettings(section, data) {
        return api.patch(`/admin/settings/${section}`, data)
    },

    // ── Notifications ──────────────────────────────────────────────────────────
    async getNotifications(params = {}) {
        const query = params.filter ? `?filter=${params.filter}` : '';
        return api.get(`/admin/notifications${query}`);
    },

    async markNotificationRead(id) {
        return api.patch(`/admin/notifications/${id}/read`);
    },

    async deleteNotification(id) {
        return api.delete(`/admin/notifications/${id}`);
    },

    async markAllNotificationsRead() {
        return api.post('/admin/notifications/read-all');
    },
}
