import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

// Hàm tạo JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecret', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Đăng ký người dùng mới
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role, companyName, companyWebsite } = req.body;

    // Kiểm tra xem email đã tồn tại hay chưa
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Email đã được đăng ký' });
    }

    // Tạo người dùng mới
    user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || 'candidate', // Mặc định là ứng viên nếu không truyền
      companyName: role === 'employer' ? companyName : undefined,
      companyWebsite: role === 'employer' ? companyWebsite : undefined,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Đăng nhập người dùng
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Vui lòng cung cấp email và mật khẩu' });
    }

    // Tìm kiếm user và pass
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' });
    }

    // Kiểm tra mật khẩu
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      token,
      user: user.toJSON() // Loại bỏ pass
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lấy thông tin profile hiện tại
// @route   GET /api/auth/me
// @access  Private
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Đổi mật khẩu
// @route   POST /api/auth/change-password
// @access  Private
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user.id).select('+password');
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ message: 'Mật khẩu hiện tại không đúng' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    next(error);
  }
};

// @desc    Đăng xuất
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
  try {
    // Với JWT, việc xoá token ở client là chủ yếu. Server có thể chỉ trả về 200 OK.
    res.status(200).json({ message: 'Đăng xuất thành công' });
  } catch (error) {
    next(error);
  }
};
