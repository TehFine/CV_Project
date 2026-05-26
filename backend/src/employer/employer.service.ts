import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job, JobDocument } from '../jobs/schemas/job.schema';
import { Application, ApplicationDocument } from '../jobs/schemas/application.schema';
import { CvScore, CvScoreDocument } from '../cv-scoring/schemas/cv-score.schema';
import { AppLogger } from '../common/logger.service';

@Injectable()
export class EmployerService {
  private readonly logger = AppLogger.forContext(EmployerService.name);

  constructor(
    @InjectModel(Job.name) private jobModel: Model<JobDocument>,
    @InjectModel('Application') private applicationModel: Model<ApplicationDocument>,
    @InjectModel(CvScore.name) private cvScoreModel: Model<CvScoreDocument>,
  ) {}

  private mapJobToFrontend(job: any) {
    return {
      id: job._id.toString(),
      title: job.title,
      companyName: job.companyName,
      location: job.location,
      job_type: (job.type || 'full-time').toLowerCase(),
      level: (job.level || 'junior').toLowerCase(),
      salary_min: job.salaryMin || 0,
      salary_max: job.salaryMax || 0,
      required_skills: job.tags || [],
      status: job.status || 'active',
      view_count: job.views || 0,
      application_count: job.applied || 0,
      created_at: job.createdAt,
      updated_at: job.updatedAt,
    };
  }

  async getDashboardStats(employerId: string) {
    this.logger.log('Xem thống kê dashboard', { userId: employerId, action: 'view_dashboard' });
    const filter = employerId ? { employerId: employerId as any } : {};
    const totalJobs = await this.jobModel.countDocuments(filter as any);

    const employerJobs = await this.jobModel.find(filter as any).select('_id views').exec();
    const jobIds = employerJobs.map(j => j._id);
    const totalViews = employerJobs.reduce((sum, j) => sum + (j.views || 0), 0);

    const appFilter: any = { jobId: { $in: jobIds as any } };
    const totalApps = await this.applicationModel.countDocuments(appFilter);
    const pendingApps = await this.applicationModel.countDocuments({ ...appFilter, status: 'pending' } as any);
    const reviewingApps = await this.applicationModel.countDocuments({ ...appFilter, status: 'reviewing' } as any);
    const interviewApps = await this.applicationModel.countDocuments({ ...appFilter, status: 'interview' } as any);
    const offeredApps = await this.applicationModel.countDocuments({ ...appFilter, status: 'offered' } as any);
    const rejectedApps = await this.applicationModel.countDocuments({ ...appFilter, status: 'rejected' } as any);

    const applicationsChart: any[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      d.setHours(0, 0, 0, 0);

      const start = new Date(d);
      const end = new Date(d);
      end.setDate(d.getDate() + 1);

      const count = await this.applicationModel.countDocuments({
        jobId: { $in: jobIds as any },
        createdAt: { $gte: start, $lt: end }
      } as any);

      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      applicationsChart.push({
        date: `${day}/${month}`,
        count: count
      });
    }

    return {
      total_jobs: totalJobs,
      active_jobs: await this.jobModel.countDocuments({ ...filter, status: 'active' } as any),
      total_applications: totalApps,
      pending_applications: pendingApps,
      total_views: totalViews,
      applications_chart: applicationsChart,
      status_breakdown: {
        pending: pendingApps,
        reviewing: reviewingApps,
        interview: interviewApps,
        offered: offeredApps,
        rejected: rejectedApps,
      },
    };
  }

  async getJobs(employerId: string) {
    const filter = employerId ? { employerId: employerId as any } : {};
    const jobs = await this.jobModel.find(filter).exec();
    return { data: jobs.map(j => this.mapJobToFrontend(j)) };
  }

  async getJob(id: string) {
    const job = await this.jobModel.findById(id).exec();
    if (!job) throw new NotFoundException('Không tìm thấy công việc');
    return this.mapJobToFrontend(job);
  }

  async getApplications(jobId: string) {
    const apps = await this.applicationModel
      .find({ jobId: jobId as any })
      .populate('candidateId')
      .populate('aiScoreId')
      .sort({ createdAt: -1 })
      .exec();

    const data = apps.map(app => {
      const seeker = app.candidateId as any;
      const aiScore = app.aiScoreId as any;

      const breakdown = { skills: 0, experience: 0, education: 0, keywords: 0 };
      if (aiScore?.analysis?.categories) {
        const cats = aiScore.analysis.categories;
        const skillsCat = cats.find(c => c.key === 'skills_match' || c.key === 'skills');
        const expCat = cats.find(c => c.key === 'experience');
        const eduCat = cats.find(c => c.key === 'education');
        const kwCat = cats.find(c => c.key === 'keywords');

        breakdown.skills = skillsCat ? skillsCat.score : (aiScore.score || 0);
        breakdown.experience = expCat ? expCat.score : (aiScore.score || 0);
        breakdown.education = eduCat ? eduCat.score : (aiScore.score || 0);
        breakdown.keywords = kwCat ? kwCat.score : (aiScore.score || 0);
      } else if (aiScore) {
        // Fallback for simple scores
        const scoreVal = (aiScore.score || 0) * 10; // Convert 1-10 to 1-100
        breakdown.skills = scoreVal;
        breakdown.experience = scoreVal;
        breakdown.education = scoreVal;
        breakdown.keywords = scoreVal;
      }

      return {
        id: app._id,
        job_id: app.jobId,
        seeker_id: seeker?._id,
        resume_id: app.cvId,
        status: app.status,
        cover_letter: app.coverLetter,
        applied_at: (app as any).createdAt,
        updated_at: (app as any).updatedAt,
        seeker: {
          id: seeker?._id,
          full_name: seeker?.name || 'Ứng viên ẩn danh',
          email: seeker?.email || 'no-email@email.com',
          avatar_url: null,
        },
        resume: {
          title: app.cvId || 'CV_Ung_Vien.pdf',
          pdf_url: app.cvId ? `/api/cv-scoring/view/${app.cvId}` : '#',
        },
        ai_score: aiScore ? {
          overall_score: aiScore.analysis?.overall || (aiScore.score * 10) || 0,
          breakdown,
          analysis: aiScore.analysis || {},
          review: aiScore.analysis?.review || aiScore.analysis?.feedback || ''
        } : null
      };
    });

    return { data };
  }

  async updateApplicationStatus(appId: string, status: string) {
    const app = await this.applicationModel.findById(appId);
    if (!app) {
      this.logger.fail('Cập nhật trạng thái hồ sơ thất bại - không tìm thấy', { action: 'update_status', applicationId: appId, status });
      throw new NotFoundException('Không tìm thấy hồ sơ');
    }
    const oldStatus = app.status;
    app.status = status;
    await app.save();
    this.logger.success('Cập nhật trạng thái hồ sơ', { action: 'update_status', applicationId: appId, from: oldStatus, to: status, candidateId: app.candidateId?.toString() });
    return { success: true };
  }

  async deleteApplication(appId: string) {
    const app = await this.applicationModel.findByIdAndDelete(appId).exec();
    if (!app) {
      this.logger.fail('Xóa hồ sơ thất bại - không tìm thấy', { action: 'delete_application', applicationId: appId });
      throw new NotFoundException('Không tìm thấy hồ sơ');
    }
    this.logger.success('Xóa hồ sơ ứng tuyển', { action: 'delete_application', applicationId: appId, candidateId: app.candidateId?.toString() });
    return { success: true };
  }

  async bulkDeleteApplications(ids: string[]) {
    const result = await this.applicationModel.deleteMany({ _id: { $in: ids } }).exec();
    this.logger.success('Xóa hàng loạt hồ sơ', { action: 'bulk_delete_applications', count: result.deletedCount, ids });
    return { success: true };
  }
}
