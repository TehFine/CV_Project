import {
  IsEmail,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  MinLength,
  Matches,
  IsUrl,
} from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string;

  @IsOptional()
  confirmPassword?: string;

  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  name: string;

  @IsEnum(['candidate', 'employer'], { message: 'Vai trò không hợp lệ' })
  role: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  companyName?: string;

  @IsOptional()
  companyWebsite?: string;

  @IsOptional()
  industry?: string;
}

export class LoginDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email?: string;

  @IsOptional()
  @Matches(/^(0[3-9][0-9]{8,9}|\+84[3-9][0-9]{8,9})$/, {
    message:
      'Số điện thoại không đúng định dạng (VD: 0901234567 hoặc +84901234567)',
  })
  phone?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Tên công ty không được để trống' })
  companyName?: string;

  @IsOptional()
  @IsUrl(
    { protocols: ['http', 'https'], require_protocol: false },
    { message: 'Website không đúng định dạng URL' },
  )
  companyWebsite?: string;

  @IsOptional()
  avatar?: string;

  @IsOptional()
  industry?: string;

  @IsOptional()
  description?: string;
}

export class ForgotPasswordDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;
}

export class ResetPasswordDto {
  @IsNotEmpty({ message: 'Token không được để trống' })
  token: string;

  @IsNotEmpty({ message: 'Mật khẩu mới không được để trống' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string;
}

export class ChangePasswordDto {
  @IsNotEmpty({ message: 'Mật khẩu hiện tại không được để trống' })
  currentPassword: string;

  @IsNotEmpty({ message: 'Mật khẩu mới không được để trống' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  newPassword: string;
}
