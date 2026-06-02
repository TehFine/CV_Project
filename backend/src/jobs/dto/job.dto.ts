import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  IsNumber,
  Min,
  MinLength,
  IsEnum,
  IsDateString,
} from 'class-validator';

export class CreateJobDto {
  @IsNotEmpty({ message: 'Tiêu đề công việc không được để trống' })
  @MinLength(3, { message: 'Tiêu đề phải có ít nhất 3 ký tự' })
  title: string;

  @IsNotEmpty({ message: 'Tên công ty không được để trống' })
  companyName: string;

  @IsNotEmpty({ message: 'Địa điểm không được để trống' })
  location: string;

  @IsNotEmpty({ message: 'Danh mục không được để trống' })
  category: string;

  @IsNotEmpty({ message: 'Loại công việc không được để trống' })
  type: string;

  @IsNotEmpty({ message: 'Cấp bậc không được để trống' })
  level: string;

  @IsNotEmpty({ message: 'Mô tả công việc không được để trống' })
  @MinLength(10, { message: 'Mô tả phải có ít nhất 10 ký tự' })
  description: string;

  @IsOptional()
  @IsString()
  companyLogo?: string;

  @IsOptional()
  @IsString()
  salary?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  salaryMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  salaryMax?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requirements?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  benefits?: string[];

  @IsOptional()
  @IsDateString()
  deadline?: string;
}

export class UpdateJobDto {
  @IsOptional()
  @IsNotEmpty({ message: 'Tiêu đề công việc không được để trống' })
  @MinLength(3, { message: 'Tiêu đề phải có ít nhất 3 ký tự' })
  title?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Tên công ty không được để trống' })
  companyName?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Địa điểm không được để trống' })
  location?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Danh mục không được để trống' })
  category?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Loại công việc không được để trống' })
  type?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Cấp bậc không được để trống' })
  level?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Mô tả công việc không được để trống' })
  @MinLength(10, { message: 'Mô tả phải có ít nhất 10 ký tự' })
  description?: string;

  @IsOptional()
  @IsString()
  companyLogo?: string;

  @IsOptional()
  @IsString()
  salary?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  salaryMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  salaryMax?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requirements?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  benefits?: string[];

  @IsOptional()
  @IsDateString()
  deadline?: string;
}
