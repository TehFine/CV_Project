import api from "./api";

// ─── Auth Service ─────────────────────────────────────────────────────────────
export const authService = {
  /**
   * Đăng nhập
   * @param {string} email
   * @param {string} password
   * @returns {{ token: string, user: object }}
   */
  async login(email, password) {
    return api.post("/auth/login", { email, password });
  },

  /**
   * Đăng ký
   * @param {{ name, email, password, phone? }} data
   * @returns {{ token: string, user: object }}
   */
  async register(data) {
    return api.post("/auth/register", data);
  },

  /**
   * Lấy thông tin profile theo token
   * @param {string} token
   */
  async getProfile(token) {
    return api.get("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  /**
   * Cập nhật profile
   * @param {object} data
   */
  async updateProfile(data) {
    return api.patch("/auth/me", data);
  },

  /**
   * Đổi mật khẩu
   */
  async changePassword(currentPassword, newPassword) {
    return api.post("/auth/change-password", { currentPassword, newPassword });
  },

  /**
   * Quên mật khẩu - gửi yêu cầu reset
   * @param {string} email
   */
  async forgotPassword(email) {
    return api.post("/auth/forgot-password", { email });
  },

  /**
   * Đặt lại mật khẩu với token
   * @param {string} token
   * @param {string} password
   */
  async resetPassword(token, password) {
    return api.post("/auth/reset-password", { token, password });
  },

  /**
   * Đăng xuất (invalidate server-side token nếu có)
   */
  async logout() {
    try {
      await api.post("/auth/logout");
    } catch {
      /* ignore */
    }
  },
};
