import api from "./api";

// ─── Mock data (dùng khi chưa có backend) ────────────────────────────────────
const MOCK_USER = {
  id: 1,
  name: "Nguyễn Văn An",
  email: "an.nguyen@example.com",
  avatar: null,
  phone: "0901234567",
  location: "TP. Hồ Chí Minh",
  title: "Frontend Developer",
  bio: "Passionate developer with 3 years of experience in React and TypeScript.",
  skills: ["React", "TypeScript", "Node.js", "TailwindCSS"],
  savedJobs: [1, 3],
  cvCount: 2,
  createdAt: "2024-01-15",
};
// Mock data cho employer
const MOCK_EMPLOYER_USER = {
  id: 99,
  name: "Trần Thị Bích",
  email: "employer@nexcv.vn",
  avatar: null,
  phone: "0909000001",
  role: "employer",
  companyName: "Công ty TNHH NexCV",
  companyWebsite: "https://nexcv.vn",
  industry: "Công nghệ thông tin",
  createdAt: "2024-01-01",
};
const USE_MOCK =
  import.meta.env.VITE_USE_MOCK === "true" || !import.meta.env.VITE_API_URL;

// ─── Mock delay helper ────────────────────────────────────────────────────────
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── Auth Service ─────────────────────────────────────────────────────────────
export const authService = {
  /**
   * Đăng nhập
   * @param {string} email
   * @param {string} password
   * @returns {{ token: string, user: object }}
   */
  async login(email, password) {
    if (USE_MOCK) {
      await delay(800);
      if (email === "demo@nexcv.vn" && password === "demo123") {
        return { token: "mock_token_abc123", user: MOCK_USER };
      }
      if (email === "employer@nexcv.vn" && password === "demo123") {
        return { token: "mock_token_employer_001", user: MOCK_EMPLOYER_USER };
      }
      throw { message: "Email hoặc mật khẩu không đúng" };
    }
    return api.post("/auth/login", { email, password });
  },

  /**
   * Đăng ký
   * @param {{ name, email, password, phone? }} data
   * @returns {{ token: string, user: object }}
   */
  async register(data) {
    if (USE_MOCK) {
      await delay(1000);
      return {
        token: "mock_token_new_" + Date.now(),
        user: {
          ...MOCK_USER,
          name: data.name,
          email: data.email,
          id: Date.now(),
        },
      };
    }
    return api.post("/auth/register", data);
  },

  /**
   * Lấy thông tin profile theo token
   * @param {string} token
   */
  async getProfile(token) {
    if (USE_MOCK) {
      await delay(300);
      if (token === "mock_token_employer_001") return MOCK_EMPLOYER_USER;
      if (token?.startsWith("mock_token")) return MOCK_USER;
      throw new Error("Invalid token");
    }
    return api.get("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  /**
   * Cập nhật profile
   * @param {object} data
   */
  async updateProfile(data) {
    if (USE_MOCK) {
      await delay(600);
      return { ...MOCK_USER, ...data };
    }
    return api.patch("/auth/me", data);
  },

  /**
   * Đổi mật khẩu
   */
  async changePassword(currentPassword, newPassword) {
    if (USE_MOCK) {
      await delay(600);
      return { message: "Đổi mật khẩu thành công" };
    }
    return api.post("/auth/change-password", { currentPassword, newPassword });
  },

  /**
   * Đăng xuất (invalidate server-side token nếu có)
   */
  async logout() {
    if (USE_MOCK) return;
    try {
      await api.post("/auth/logout");
    } catch {
      /* ignore */
    }
  },
};
