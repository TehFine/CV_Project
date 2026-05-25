# 📄 NexCV — Nền tảng Quản lý CV & Tuyển dụng Thông minh tích hợp AI

> Hệ thống Fullstack (NestJS & React) giúp người tìm việc thiết kế CV chuyên nghiệp, nộp đơn ứng tuyển và nhận đánh giá CV tự động bằng trí tuệ nhân tạo (AI). Đồng thời hỗ trợ Nhà tuyển dụng và Quản trị viên quản lý tin tuyển dụng, hồ sơ ứng viên và điểm đánh giá ATS một cách tối ưu.

---

## 🌟 Tính năng nổi bật theo phân quyền

### 1. 👤 Người tìm việc (Job Seeker)
- **Đăng ký & Đăng nhập**: Xác thực tài khoản ứng viên độc lập.
- **CV Builder (Bộ tạo CV kéo thả)**:
  - Thiết kế CV tương tác trực quan với các phần: Thông tin cá nhân, Ảnh đại diện, Học vấn, Kinh nghiệm làm việc, Kỹ năng chuyên môn, Ngoại ngữ.
  - Tích hợp tính năng in ấn / lưu CV dưới dạng PDF thân thiện.
- **AI CV Scoring (Chấm điểm CV bằng AI)**:
  - Tải file CV sẵn có (PDF hoặc DOCX) để chấm điểm tức thì.
  - Phân tích chi tiết theo tiêu chí ATS: Độ tương thích kỹ năng, Kinh nghiệm, Học vấn, Bố cục trình bày, Từ khóa tối ưu.
- **Duyệt & Tìm kiếm việc làm**: Xem danh sách việc làm, chi tiết công việc, lưu việc làm yêu thích và nộp đơn trực tiếp.
- **Quản lý lịch sử & Hồ sơ**:
  - Trang cá nhân với các tab quản lý thông tin, danh sách tin tuyển dụng đã lưu, đơn ứng tuyển đã nộp, và quản lý các file CV.
  - Xem lại lịch sử các lần chấm điểm CV trước đây.

### 2. 🏢 Nhà tuyển dụng (Employer)
- **Cổng thông tin tuyển dụng riêng**:
  - Trang chủ giới thiệu, tính năng AI Promo, cách thức hoạt động và danh sách tin tuyển dụng mới nhất.
  - Đăng ký, đăng nhập và quản lý hồ sơ công ty.
- **Đăng & Quản lý tin tuyển dụng**: Tạo mới và chỉnh sửa tin tuyển dụng với các thông số chi tiết như mô tả công việc (JD), yêu cầu kỹ năng và các tag phân loại.
- **Quản lý ứng viên thông minh**:
  - Xem danh sách ứng viên đã nộp đơn cho từng vị trí.
  - Hiển thị điểm số phân tích AI của từng ứng viên kèm theo nhận xét chi tiết để hỗ trợ lọc hồ sơ nhanh chóng.

### 3. 🛡️ Quản trị viên (Admin)
- **Dashboard phân tích tổng quan**: Báo cáo số liệu về người dùng, lượt ứng tuyển, và hệ thống CV.
- **Quản lý thực thể**:
  - Quản lý danh sách người dùng (khóa/mở khóa tài khoản).
  - Quản lý danh sách việc làm toàn hệ thống.
  - Quản lý lịch sử và xem lại kết quả chấm điểm CV của tất cả người dùng.
- **Báo cáo & Cấu hình**: Xem các thống kê chi tiết, gửi thông báo và quản lý cấu hình hệ thống.

---

## 🤖 Cơ chế AI Chấm điểm CV (CV Scoring)

Hệ thống sử dụng chiến lược **2 lớp (Dual-layer Evaluation)**:

1. **Google Gemini AI (Chính)**:    - Sử dụng model `gemini-3.1-flash-lite` để phân tích ngữ nghĩa tự nhiên.
   - Đối chiếu nội dung văn bản trích xuất từ CV với Mô tả công việc (JD) và Yêu cầu kỹ năng.
   - Phát hiện các CV không hợp lệ (Spam/Rác/Tài liệu sai lệch) và từ chối xử lý kèm lý do rõ ràng.
   - Phân tích và chấm điểm chi tiết (Thang điểm 100), phân loại Grade (A, B, C, D) kèm điểm mạnh, điểm yếu, phản hồi cụ thể cho từng mục.
2. **Local Knowledge Base (Fallback)**:
   - Bộ dữ liệu từ khóa phong phú được phân chia theo từng lĩnh vực chuyên môn (Frontend, Backend, Mobile, Data, Soft Skills...).
   - Tự động chạy thuật toán so khớp từ khóa (Keyword matching) để chấm điểm và đưa ra nhận xét cơ bản nếu gặp sự cố kết nối Gemini API.

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

### Backend (API Server)
- **Framework**: [NestJS](https://nestjs.com/) (Node.js & TypeScript)
- **Database**: [MongoDB](https://www.mongodb.com/) phối hợp với [Mongoose](https://mongoosejs.com/)
- **Authentication**: [Passport.js](http://www.passportjs.org/) kết hợp JWT (JSON Web Tokens) & mã hóa mật khẩu bằng `bcrypt`
- **File Parser**: `pdf-parse` (dành cho PDF) và `mammoth` (dành cho file Word `.docx` / `.doc`)
- **AI Integration**: Giao tiếp trực tiếp với Google Gemini API thông qua REST API chuyên dụng

### Frontend (Client App)
- **UI Core**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [TailwindCSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) (giao diện hiện đại, tối giản và chuyên nghiệp)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) (quản lý state gọn nhẹ, hiệu năng cao)
- **Drag and Drop**: [@dnd-kit](https://dndkit.com/) dùng trong việc xây dựng các mục CV
- **Visualizations**: [Recharts](https://recharts.org/) hiển thị biểu đồ phân tích năng lực và điểm số ATS
- **Animations**: [Framer Motion](https://www.framer.com/motion/) tạo chuyển động mượt mà

---

## 📁 Cấu trúc thư mục chi tiết

```
CV/
├── backend/                        # NestJS Server
│   ├── src/
│   │   ├── auth/                   # Đăng nhập, phân quyền, JWT Guards & Strategies
│   │   ├── users/                  # Module quản lý thông tin người dùng
│   │   ├── employer/               # Xử lý thông tin doanh nghiệp/nhà tuyển dụng
│   │   ├── jobs/                   # Quản lý tin tuyển dụng & đơn ứng tuyển (Applications)
│   │   ├── cv-scoring/             # Module cốt lõi xử lý file CV và chấm điểm AI
│   │   │   ├── constants/          # Knowledge Base từ khóa chuyên môn nội bộ
│   │   │   └── schemas/            # Cấu trúc dữ liệu MongoDB cho CvScore
│   │   ├── seed.ts                 # Script khởi tạo dữ liệu mẫu cho hệ thống
│   │   └── main.ts                 # Điểm khởi chạy của server
│   └── scratch/                    # Các file kịch bản thử nghiệm kết nối Gemini AI
│
└── frontend/                       # React Client (Vite)
    ├── src/
    │   ├── pages/                  # Các phân vùng chức năng chính
    │   │   ├── Home/               # Trang chủ giới thiệu & các thành phần quảng bá
    │   │   ├── CVBuilder/          # Module xây dựng CV với các thành phần kéo thả chuyên biệt
    │   │   ├── CV_AIScore/         # Upload CV và hiển thị kết quả phân tích AI trực quan
    │   │   ├── JobSeeker/          # Khu vực ứng viên (việc làm, lịch sử ứng tuyển, hồ sơ cá nhân)
    │   │   ├── Employer/           # Khu vực Nhà tuyển dụng (tin tuyển dụng, lọc hồ sơ ứng viên)
    │   │   └── Admin/              # Hệ thống quản lý toàn diện dành cho Quản trị viên
    │   ├── components/             # Các component tái sử dụng (UI, layouts,...)
    │   ├── context/                # Các React Context (Quản lý trạng thái xác thực...)
    │   └── services/               # Module gọi API backend
```

---

## 🚀 Hướng dẫn khởi chạy dự án

### Yêu cầu hệ thống
- **Node.js** phiên bản 18 trở lên.
- **MongoDB** (Local instance hoặc Cloud Atlas).
- **Google Gemini API Key** (Đăng ký tại [Google AI Studio](https://aistudio.google.com/)).

---

### Bước 1: Tải mã nguồn về máy
```bash
git clone https://github.com/TehFine/CV_Project.git
cd CV_Project
```

---

### Bước 2: Thiết lập và chạy Backend

1. Di chuyển vào thư mục backend và cài đặt thư viện:
   ```bash
   cd backend
   npm install
   ```

2. Tạo file `.env` tại gốc thư mục `backend/` và điền cấu hình:
   ```env
   MONGO_URI=mongodb://localhost:27017/nexcv
   JWT_SECRET=your_super_secret_jwt_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. (Tùy chọn) Chạy dữ liệu mẫu để kiểm tra tính năng nhanh hơn:
   ```bash
   npm run seed
   ```

4. Khởi chạy server ở chế độ phát triển:
   ```bash
   npm run start:dev
   ```
   > API Gateway sẽ hoạt động tại địa chỉ: `http://localhost:3000`

---

### Bước 3: Thiết lập và chạy Frontend

1. Mở một terminal mới, chuyển đến thư mục frontend và cài đặt thư viện:
   ```bash
   cd frontend
   npm install
   ```

2. Tạo file `.env` tại gốc thư mục `frontend/` và cấu hình đường dẫn API:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

3. Chạy ứng dụng client ở chế độ local dev:
   ```bash
   npm run dev
   ```
   > Truy cập ứng dụng tại trình duyệt qua địa chỉ: `http://localhost:5173`

---

## 🤝 Phân công đóng góp & Phát triển

Dự án được phân chia mô hình hóa theo cấu trúc Module hóa rõ ràng. Mọi chỉnh sửa mã nguồn hoặc nâng cấp tính năng đều được tối ưu hóa theo quy chuẩn TypeScript ở Backend và React Functional Components ở Frontend.
