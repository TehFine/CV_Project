import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { JobsService } from './jobs/jobs.service';
import * as bcrypt from 'bcrypt';
import { Connection } from 'mongoose';
import { getModelToken, getConnectionToken } from '@nestjs/mongoose';
import { User } from './users/schemas/user.schema';
import { Job } from './jobs/schemas/job.schema';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const usersService = app.get(UsersService);
  const jobsService = app.get(JobsService);
  const connection = app.get<Connection>(getConnectionToken());

  console.log('--- Starting Database Seeding ---');

  // 1. Clear existing data (optional, but good for clean seed)
  // await connection.dropDatabase();
  // console.log('Database cleared');

  // 2. Create Employer
  const employerEmail = 'employer_demo@nexcv.vn';
  let employer = await usersService.findByEmail(employerEmail);

  if (!employer) {
    console.log('Creating demo employer...');
    const hashedPassword = await bcrypt.hash('demo123', 10);
    employer = await usersService.create({
      email: employerEmail,
      password: hashedPassword,
      name: 'NexCV Recruitment',
      role: 'employer',
      companyName: 'NexCV Technology',
      companyWebsite: 'https://nexcv.vn',
      industry: 'Technology',
      location: 'TP. Hồ Chí Minh'
    });
  }

  // 3. Create Sample Jobs
  const mockJobs = [
    {
      title: 'Senior Frontend Developer (React)',
      employerId: employer._id,
      companyName: 'NexCV Technology',
      location: 'TP. Hồ Chí Minh',
      salary: '25 - 40 triệu',
      salaryMin: 25000000,
      salaryMax: 40000000,
      category: 'Công nghệ thông tin',
      type: 'Full-time',
      level: 'Senior',
      tags: ['React', 'TypeScript', 'Tailwind'],
      description: 'Chúng tôi đang tìm kiếm Senior Frontend Developer gia nhập đội ngũ phát triển sản phẩm NexCV...',
      requirements: ['Ít nhất 3 năm kinh nghiệm React', 'Thành thạo TypeScript', 'Kỹ năng giải quyết vấn đề tốt'],
      benefits: ['Lương thưởng cạnh tranh', 'Bảo hiểm cao cấp', 'Môi trường làm việc năng động'],
      status: 'active',
      featured: true
    },
    {
      title: 'Node.js Backend Developer',
      employerId: employer._id,
      companyName: 'NexCV Technology',
      location: 'Hà Nội',
      salary: '20 - 35 triệu',
      salaryMin: 20000000,
      salaryMax: 35000000,
      category: 'Công nghệ thông tin',
      type: 'Full-time',
      level: 'Middle',
      tags: ['Node.js', 'NestJS', 'MongoDB'],
      description: 'Phát triển các API hệ thống cho nền tảng tuyển dụng sử dụng NestJS...',
      requirements: ['Kinh nghiệm với Node.js ít nhất 2 năm', 'Hiểu biết về MongoDB', 'Ưu tiên biết NestJS'],
      benefits: ['Thưởng dự án', 'Laptop Macbook Pro', 'Du lịch hàng năm'],
      status: 'active',
      featured: false
    },
    {
      title: 'UI/UX Designer',
      employerId: employer._id,
      companyName: 'NexCV Technology',
      location: 'TP. Hồ Chí Minh',
      salary: 'Thoả thuận',
      salaryMin: 0,
      salaryMax: 0,
      category: 'Thiết kế',
      type: 'Full-time',
      level: 'Junior',
      tags: ['Figma', 'UI/UX', 'Product Design'],
      description: 'Thiết kế trải nghiệm người dùng cho ứng dụng web và mobile...',
      requirements: ['Sử dụng thành thạo Figma', 'Có portfolio tốt', 'Yêu thích thiết kế hiện đại'],
      benefits: ['Môi trường sáng tạo', 'Trà chiều hàng ngày', 'Chế độ đào tạo'],
      status: 'active',
      featured: false
    },
    {
      title: 'Intern Recruitment Consultant',
      employerId: employer._id,
      companyName: 'NexCV Technology',
      location: 'Đà Nẵng',
      salary: '5 - 7 triệu',
      salaryMin: 5000000,
      salaryMax: 7000000,
      category: 'Nhân sự',
      type: 'Internship',
      level: 'Intern',
      tags: ['HR', 'Recruitment', 'Communication'],
      description: 'Hỗ trợ tìm kiếm và sàng lọc ứng viên tiềm năng cho các vị trí công nghệ...',
      requirements: ['Sinh viên năm cuối chuyên ngành nhân sự/ngoại ngữ', 'Giao tiếp tốt', 'Nhanh nhẹn'],
      benefits: ['Hỗ trợ dấu thực tập', 'Cơ hội trở thành nhân viên chính thức', 'Lương thực tập cạnh tranh'],
      status: 'active',
      featured: false
    }
  ];

  console.log('Creating sample jobs...');
  for (const jobData of mockJobs) {
    const { employerId, ...rest } = jobData;
    await jobsService.create(rest, employer._id.toString());
  }

  console.log('--- Seeding Completed Successfully! ---');
  await app.close();
}

bootstrap().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
