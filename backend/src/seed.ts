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
  let frontendJob: any = null;
  
  // Clear old jobs, applications, and scores for a clean test environment
  await connection.model('Job').deleteMany({});
  await connection.model('Application').deleteMany({});
  await connection.model('CvScore').deleteMany({});

  for (const jobData of mockJobs) {
    const { employerId, ...rest } = jobData;
    const created = await jobsService.create(rest, employer._id.toString());
    if (created.title.includes('Senior Frontend Developer')) {
      frontendJob = created;
    }
  }

  // 4. Seed Candidates and Applications
  console.log('Seeding candidate accounts and applications...');
  const userModel = connection.model('User');
  const applicationModel = connection.model('Application');
  const cvScoreModel = connection.model('CvScore');

  // Candidate 1: Nguyễn Văn An
  const candidate1Email = 'candidate_demo1@nexcv.vn';
  let candidate1 = await userModel.findOne({ email: candidate1Email });
  if (!candidate1) {
    console.log('Creating candidate Nguyễn Văn An...');
    const hashedPassword = await bcrypt.hash('demo123', 10);
    candidate1 = await userModel.create({
      email: candidate1Email,
      password: hashedPassword,
      name: 'Nguyễn Văn An',
      role: 'candidate',
    });
  }

  // Candidate 2: Trần Thị Bích
  const candidate2Email = 'candidate_demo2@nexcv.vn';
  let candidate2 = await userModel.findOne({ email: candidate2Email });
  if (!candidate2) {
    console.log('Creating candidate Trần Thị Bích...');
    const hashedPassword = await bcrypt.hash('demo123', 10);
    candidate2 = await userModel.create({
      email: candidate2Email,
      password: hashedPassword,
      name: 'Trần Thị Bích',
      role: 'candidate',
    });
  }

  if (frontendJob) {
    // Clear old applications for clean seeding
    await applicationModel.deleteMany({ jobId: frontendJob._id });
    await cvScoreModel.deleteMany({ jobId: frontendJob._id });

    console.log(`Seeding applications for job: ${frontendJob.title}...`);

    // Create CvScore for Nguyễn Văn An
    const mockAnalysis = {
      overall: 85,
      grade: 'A',
      gradeLabel: 'Tốt',
      strengths: ['Kinh nghiệm vững vàng với React và TypeScript', 'Kỹ năng làm việc nhóm tốt'],
      improvements: ['Nên bổ sung thêm kiến thức về Docker/CI-CD'],
      categories: [
        { key: 'skills_match', label: 'Kỹ năng', score: 88, feedback: 'Đáp ứng 90% kỹ năng yêu cầu', suggestions: ['Học thêm Next.js'] },
        { key: 'experience', label: 'Kinh nghiệm', score: 85, feedback: '3 năm kinh nghiệm thực tế', suggestions: [] },
        { key: 'education', label: 'Học vấn', score: 80, feedback: 'Đại học chuyên ngành CNTT', suggestions: [] },
        { key: 'format', label: 'Trình bày', score: 90, feedback: 'CV thiết kế đẹp, rõ ràng', suggestions: [] },
        { key: 'keywords', label: 'Từ khóa ATS', score: 82, feedback: 'Chứa nhiều từ khóa liên quan như React, Redux', suggestions: [] }
      ]
    };

    const mockPdfBuffer1 = Buffer.from(`%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << >> /Contents 4 0 R >>
endobj
4 0 obj
<< /Length 44 >>
stream
BT
/F1 12 Tf
72 712 Td
(CV Nguyen Van An - Senior Frontend Developer) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000213 00000 n
trailer
<< /Size 5 /Root 1 0 R >>
startxref
308
%%EOF`);

    const mockPdfBuffer2 = Buffer.from(`%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << >> /Contents 4 0 R >>
endobj
4 0 obj
<< /Length 44 >>
stream
BT
/F1 12 Tf
72 712 Td
(CV Tran Thi Bich - UI/UX Designer) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000213 00000 n
trailer
<< /Size 5 /Root 1 0 R >>
startxref
308
%%EOF`);

    const cvScore = await cvScoreModel.create({
      userId: candidate1._id,
      jobId: frontendJob._id,
      cvUrl: 'cv_nguyen_van_an.pdf',
      score: 85,
      analysis: mockAnalysis,
      type: 'candidate_self_score',
      pdfBuffer: mockPdfBuffer1
    });

    const cvScoreBich = await cvScoreModel.create({
      userId: candidate2._id,
      cvUrl: 'cv_tran_thi_bich.pdf',
      score: 70,
      analysis: {
        overall: 70,
        grade: 'B',
        gradeLabel: 'Khá',
        strengths: ['Giao diện bắt mắt'],
        improvements: ['Cần bổ sung thêm kỹ năng React nâng cao'],
        categories: []
      },
      type: 'general_analysis',
      pdfBuffer: mockPdfBuffer2
    });

    // Create Application for Nguyễn Văn An (With existing score!)
    await applicationModel.create({
      jobId: frontendJob._id,
      candidateId: candidate1._id,
      coverLetter: 'Tôi là lập trình viên React với hơn 3 năm kinh nghiệm làm việc thực tế, mong muốn được gia nhập đội ngũ NexCV...',
      cvId: cvScore._id.toString(),
      status: 'pending',
      aiScoreId: cvScore._id
    });

    // Create Application for Trần Thị Bích (Without score, so recruiter can click Score manually!)
    await applicationModel.create({
      jobId: frontendJob._id,
      candidateId: candidate2._id,
      coverLetter: 'Em chào anh chị, em có 2 năm kinh nghiệm thiết kế giao diện ReactJS, em rất mong được phỏng vấn...',
      cvId: 'cv_tran_thi_bich.pdf',
      status: 'reviewing'
    });

    console.log('Seeding applications done!');
  }

  console.log('--- Seeding Completed Successfully! ---');
  await app.close();
}

bootstrap().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
