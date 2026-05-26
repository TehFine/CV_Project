import { Injectable, UnauthorizedException, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { AppLogger } from '../common/logger.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    // Check if user exists
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      this.logger.fail('Đăng ký thất bại', { email, action: 'register', reason: 'Email đã tồn tại' });
      throw new ConflictException('Email đã tồn tại');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const { confirmPassword, ...userData } = registerDto;
    const user = await this.usersService.create({
      ...userData,
      password: hashedPassword,
    });

    // Generate token
    const token = this.generateToken(user);

    this.logger.success('Đăng ký thành công', { userId: user._id.toString(), email, userRole: user.role, action: 'register' });

    return {
      token,
      user: this.sanitizeUser(user),
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      this.logger.fail('Đăng nhập thất bại', { email, action: 'login', reason: 'Email không tồn tại' });
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      this.logger.fail('Đăng nhập thất bại', { userId: user._id.toString(), email, action: 'login', reason: 'Sai mật khẩu' });
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Generate token
    const token = this.generateToken(user);

    this.logger.success('Đăng nhập thành công', { userId: user._id.toString(), email, userRole: user.role, action: 'login' });

    return {
      token,
      user: this.sanitizeUser(user),
    };
  }

  private generateToken(user: any) {
    const payload = { email: user.email, sub: user._id, role: user.role };
    return this.jwtService.sign(payload);
  }

  sanitizeUser(user: any) {
    const userObj = user.toObject ? user.toObject() : user;
    delete userObj.password;
    return userObj;
  }

  // ─── Password Reset ────────────────────────────────────────────────

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      this.logger.log('Yêu cầu reset mật khẩu cho email không tồn tại', { email, action: 'forgot_password' });
      return { message: 'Nếu email tồn tại trong hệ thống, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu.' };
    }

    // Generate a short-lived reset token (valid for 1 hour)
    const resetToken = this.jwtService.sign(
      { sub: user._id, type: 'password_reset' },
      { expiresIn: '1h' },
    );

    // Store the reset token hash in the user document
    const resetTokenHash = await bcrypt.hash(resetToken, 6);
    await this.usersService.update(user._id.toString(), {
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: new Date(Date.now() + 3600000), // 1 hour
    });

    this.logger.success('Đã tạo token reset mật khẩu', { userId: user._id.toString(), email, action: 'forgot_password' });

    return {
      message: 'Nếu email tồn tại trong hệ thống, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu.',
      ...(process.env.NODE_ENV !== 'production' && { resetToken }),
    };
  }

  async resetPassword(token: string, newPassword: string) {
    let payload: any;
    try {
      payload = this.jwtService.verify(token);
    } catch {
      this.logger.fail('Reset mật khẩu thất bại - token không hợp lệ/hết hạn', { action: 'reset_password' });
      throw new BadRequestException('Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn');
    }

    if (payload.type !== 'password_reset') {
      this.logger.fail('Reset mật khẩu thất bại - sai loại token', { action: 'reset_password', sub: payload.sub });
      throw new BadRequestException('Token không hợp lệ');
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user || !user.resetPasswordToken) {
      this.logger.fail('Reset mật khẩu thất bại - không tìm thấy user hoặc token đã dùng', { action: 'reset_password', sub: payload.sub });
      throw new BadRequestException('Token đặt lại mật khẩu không hợp lệ hoặc đã được sử dụng');
    }

    const isValid = await bcrypt.compare(token, user.resetPasswordToken);
    if (!isValid) {
      this.logger.fail('Reset mật khẩu thất bại - token sai', { action: 'reset_password', userId: user._id.toString() });
      throw new BadRequestException('Token đặt lại mật khẩu không hợp lệ');
    }

    if (!user.resetPasswordExpires || new Date() > new Date(user.resetPasswordExpires)) {
      this.logger.fail('Reset mật khẩu thất bại - token hết hạn', { action: 'reset_password', userId: user._id.toString() });
      throw new BadRequestException('Token đặt lại mật khẩu đã hết hạn');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.update(payload.sub, {
      password: hashedPassword,
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
    });

    this.logger.success('Reset mật khẩu thành công', { userId: user._id.toString(), action: 'reset_password' });

    return { message: 'Mật khẩu đã được đặt lại thành công' };
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      this.logger.fail('Đổi mật khẩu thất bại - không tìm thấy user', { userId, action: 'change_password' });
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      this.logger.fail('Đổi mật khẩu thất bại - sai mật khẩu hiện tại', { userId, action: 'change_password' });
      throw new UnauthorizedException('Mật khẩu hiện tại không đúng');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.update(userId, { password: hashedPassword });

    this.logger.success('Đổi mật khẩu thành công', { userId, action: 'change_password' });

    return { message: 'Đổi mật khẩu thành công' };
  }

  private readonly logger = AppLogger.forContext(AuthService.name);
}
