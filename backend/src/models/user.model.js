import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập họ tên'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Vui lòng nhập email'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email không hợp lệ'],
    },
    password: {
      type: String,
      required: [true, 'Vui lòng nhập mật khẩu'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['candidate', 'employer', 'admin'],
      default: 'candidate',
    },
    phone: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
      default: null,
    },
    // Các field bổ sung cho candidate
    location: { type: String, default: null },
    title: { type: String, default: null },
    bio: { type: String, default: null },
    skills: { type: [String], default: [] },
    savedJobs: { type: [mongoose.Schema.Types.ObjectId], ref: 'Job', default: [] },
    cvCount: { type: Number, default: 0 },
    
    // Các field bổ sung cho employer
    companyName: { type: String, default: null },
    companyWebsite: { type: String, default: null },
    industry: { type: String, default: null },
  },
  { timestamps: true }
);

// Băm mật khẩu rước khi lưu
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Hàm kiểm tra mật khẩu
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Loại bỏ mật khẩu khi trả dữ liệu về
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model('User', userSchema);
export default User;
