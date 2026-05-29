import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job, JobDocument } from '../jobs/schemas/job.schema';
import {
  Application,
  ApplicationDocument,
} from '../jobs/schemas/application.schema';
import {
  CvScore,
  CvScoreDocument,
} from '../cv-scoring/schemas/cv-score.schema';
import { AppLogger } from '../common/logger.service';

@Injectable()
export class EmployerService {
  private readonly logger = AppLogger.forContext(EmployerService.name);

  constructor(
    @InjectModel(Job.name) private jobModel: Model<JobDocument>,
    @InjectModel('Application')
    private applicationModel: Model<ApplicationDocument>,
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
    this.logger.log('Xem thống kê dashboard', {
      userId: employerId,
      action: 'view_dashboard',
    });
    const filter = employerId ? { employerId: employerId as any } : {};
    const totalJobs = await this.jobModel.countDocuments(filter);

    const employerJobs = await this.jobModel
      .find(filter as any)
      .select('_id views')
      .exec();
    const jobIds = employerJobs.map((j) => j._id);
    const totalViews = employerJobs.reduce((sum, j) => sum + (j.views || 0), 0);

    const appFilter: any = {
      jobId: { $in: jobIds as any },
      isArchivedByEmployer: { $ne: true },
    };
    const totalApps = await this.applicationModel.countDocuments(appFilter);
    const pendingApps = await this.applicationModel.countDocuments({
      ...appFilter,
      status: 'pending',
    });
    const reviewingApps = await this.applicationModel.countDocuments({
      ...appFilter,
      status: 'reviewing',
    });
    const interviewApps = await this.applicationModel.countDocuments({
      ...appFilter,
      status: 'interview',
    });
    const offeredApps = await this.applicationModel.countDocuments({
      ...appFilter,
      status: 'offered',
    });
    const rejectedApps = await this.applicationModel.countDocuments({
      ...appFilter,
      status: 'rejected',
    });

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
        createdAt: { $gte: start, $lt: end },
        isArchivedByEmployer: { $ne: true },
      });

      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      applicationsChart.push({
        date: `${day}/${month}`,
        count: count,
      });
    }

    return {
      total_jobs: totalJobs,
      active_jobs: await this.jobModel.countDocuments({
        ...filter,
        status: 'active',
      }),
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
    const jobIds = jobs.map((j) => j._id);

    // Count visible (non-archived) applications per job
    const counts = await this.applicationModel.aggregate([
      {
        $match: { jobId: { $in: jobIds }, isArchivedByEmployer: { $ne: true } },
      },
      { $group: { _id: '$jobId', count: { $sum: 1 } } },
    ]);
    const countMap: Record<string, number> = {};
    for (const c of counts) countMap[c._id.toString()] = c.count;

    return {
      data: jobs.map((j) => ({
        ...this.mapJobToFrontend(j),
        application_count: countMap[j._id.toString()] ?? 0,
      })),
    };
  }

  async getJob(id: string) {
    const job = await this.jobModel.findById(id).exec();
    if (!job) throw new NotFoundException('Không tìm thấy công việc');
    return this.mapJobToFrontend(job);
  }

  async getApplications(jobId: string) {
    const apps = await this.applicationModel
      .find({ jobId: jobId as any, isArchivedByEmployer: { $ne: true } })
      .populate('candidateId')
      .populate('aiScoreId')
      .sort({ createdAt: -1 })
      .exec();

    const data = apps.map((app) => {
      const seeker = app.candidateId as any;
      const aiScore = app.aiScoreId as any;

      const breakdown = { skills: 0, experience: 0, education: 0, keywords: 0 };
      if (aiScore?.analysis?.categories) {
        const cats = aiScore.analysis.categories;
        const skillsCat = cats.find(
          (c) => c.key === 'skills_match' || c.key === 'skills',
        );
        const expCat = cats.find((c) => c.key === 'experience');
        const eduCat = cats.find((c) => c.key === 'education');
        const kwCat = cats.find((c) => c.key === 'keywords');

        breakdown.skills = skillsCat ? skillsCat.score : aiScore.score || 0;
        breakdown.experience = expCat ? expCat.score : aiScore.score || 0;
        breakdown.education = eduCat ? eduCat.score : aiScore.score || 0;
        breakdown.keywords = kwCat ? kwCat.score : aiScore.score || 0;
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
        ai_score:
          aiScore &&
          (aiScore.score > 0 ||
            aiScore.overall > 0 ||
            aiScore.analysis?.overall > 0)
            ? {
                overall_score:
                  aiScore.analysis?.overall || aiScore.score * 10 || 0,
                breakdown,
                analysis: aiScore.analysis || {},
                review:
                  aiScore.analysis?.review || aiScore.analysis?.feedback || '',
              }
            : null,
      };
    });

    return { data };
  }

  async updateApplicationStatus(appId: string, status: string) {
    const app = await this.applicationModel.findById(appId);
    if (!app) {
      this.logger.fail('Cập nhật trạng thái hồ sơ thất bại - không tìm thấy', {
        action: 'update_status',
        applicationId: appId,
        status,
      });
      throw new NotFoundException('Không tìm thấy hồ sơ');
    }
    const oldStatus = app.status;
    app.status = status;
    await app.save();
    this.logger.success('Cập nhật trạng thái hồ sơ', {
      action: 'update_status',
      applicationId: appId,
      from: oldStatus,
      to: status,
      candidateId: app.candidateId?.toString(),
    });
    return { success: true };
  }

  async deleteApplication(appId: string) {
    const app = await this.applicationModel.findById(appId).exec();
    if (!app) {
      this.logger.fail('Xóa hồ sơ thất bại - không tìm thấy', {
        action: 'delete_application',
        applicationId: appId,
      });
      throw new NotFoundException('Không tìm thấy hồ sơ');
    }

    // Nếu chưa archive, ta sẽ archive và giảm số lượng applied của job đi 1
    if (!app.isArchivedByEmployer) {
      await this.jobModel
        .findByIdAndUpdate(app.jobId, { $inc: { applied: -1 } })
        .exec();
      app.isArchivedByEmployer = true;
      app.status = 'rejected';
      await app.save();
    }

    this.logger.success('Xóa (lưu trữ) hồ sơ ứng tuyển', {
      action: 'delete_application',
      applicationId: appId,
      candidateId: app.candidateId?.toString(),
    });
    return { success: true };
  }

  async bulkDeleteApplications(ids: string[]) {
    // Tìm các hồ sơ chưa bị archive để tính toán trừ số lượng cho các job
    const appsToArchive = await this.applicationModel
      .find({
        _id: { $in: ids },
        isArchivedByEmployer: { $ne: true },
      })
      .exec();

    // Tính số lượng cần trừ cho mỗi job
    const jobCounts: Record<string, number> = {};
    for (const app of appsToArchive) {
      const jid = app.jobId.toString();
      jobCounts[jid] = (jobCounts[jid] || 0) + 1;
    }

    const result = await this.applicationModel
      .updateMany(
        { _id: { $in: ids } },
        { $set: { status: 'rejected', isArchivedByEmployer: true } },
      )
      .exec();

    // Giảm số lượng applied của các job tương ứng
    for (const [jid, count] of Object.entries(jobCounts)) {
      await this.jobModel
        .findByIdAndUpdate(jid, { $inc: { applied: -count } })
        .exec();
    }

    this.logger.success('Xóa (lưu trữ) hàng loạt hồ sơ', {
      action: 'bulk_delete_applications',
      count: result.modifiedCount,
      ids,
    });
    return { success: true };
  }
}
