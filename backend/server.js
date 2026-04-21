import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import routes from './src/routes/index.js';

// Nạp biến môi trường
dotenv.config();

// Khởi tạo ứng dụng
const app = express();

// Kết nối Cơ sở dữ liệu
connectDB();

// Middleware
app.use(cors()); // Cho phép cross-origin request từ frontend
app.use(express.json()); // Phân giải JSON payload
app.use(express.urlencoded({ extended: true }));

// Gắn các API Routes
app.use('/api', routes);

// Route mặc định kiểm tra health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Backend is running correctly' });
});

// Middleware xử lý lỗi tập trung
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Lỗi server nội bộ'
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
