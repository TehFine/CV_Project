import {
  IsEnum,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUserStatusDto {
  @IsEnum(['active', 'banned', 'pending', 'inactive'], {
    message: 'Trạng thái người dùng không hợp lệ',
  })
  @IsNotEmpty({ message: 'Trạng thái không được để trống' })
  status: string;

  @IsOptional()
  @IsString({ message: 'Lý do phải là chuỗi ký tự' })
  reason?: string;
}

export class UpdateJobStatusDto {
  @IsEnum(['active', 'pending', 'closed', 'rejected', 'draft'], {
    message: 'Trạng thái công việc không hợp lệ',
  })
  @IsNotEmpty({ message: 'Trạng thái không được để trống' })
  status: string;
}

export class ToggleJobFeaturedDto {
  @Type(() => Boolean)
  @IsBoolean({ message: 'Giá trị featured phải là true hoặc false' })
  featured: boolean;
}

export class CreateNotificationDto {
  @IsOptional()
  @IsString({ message: 'UserId không hợp lệ' })
  userId?: string;

  @IsNotEmpty({ message: 'Tiêu đề thông báo không được để trống' })
  @MinLength(1, { message: 'Tiêu đề thông báo không được để trống' })
  title: string;

  @IsNotEmpty({ message: 'Nội dung thông báo không được để trống' })
  @MinLength(1, { message: 'Nội dung thông báo không được để trống' })
  message: string;

  @IsOptional()
  @IsEnum(['info', 'success', 'warning'], {
    message: 'Loại thông báo không hợp lệ',
  })
  type?: string;

  @IsOptional()
  @IsString({ message: 'jobId không hợp lệ' })
  jobId?: string;
}
