import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job, JobDocument } from '../jobs/schemas/job.schema';
import { Application, ApplicationDocument } from '../jobs/schemas/application.schema';
import { CvScore, CvScoreDocument } from '../cv-scoring/schemas/cv-score.schema';

@Injectable()
export class EmployerService {
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
    const filter = employerId ? { employerId: employerId as any } : {};
    const totalJobs = await this.jobModel.countDocuments(filter as any);

    const employerJobs = await this.jobModel.find(filter as any).select('_id').exec();
    const jobIds = employerJobs.map(j => j._id);

    const appFilter: any = { jobId: { $in: jobIds as any } };
    const totalApps = await this.applicationModel.countDocuments(appFilter);
    const pendingApps = await this.applicationModel.countDocuments({ ...appFilter, status: 'pending' } as any);
    const reviewingApps = await this.applicationModel.countDocuments({ ...appFilter, status: 'reviewing' } as any);
    const interviewApps = await this.applicationModel.countDocuments({ ...appFilter, status: 'interview' } as any);
    const offeredApps = await this.applicationModel.countDocuments({ ...appFilter, status: 'offered' } as any);
    const rejectedApps = await this.applicationModel.countDocuments({ ...appFilter, status: 'rejected' } as any);

    return {
      total_jobs: totalJobs,
      active_jobs: await this.jobModel.countDocuments({ ...filter, status: 'active' } as any),
      total_applications: totalApps,
      pending_applications: pendingApps,
      total_views: 120,
      applications_chart: [
        { date: '22/04', count: 12 },
        { date: '23/04', count: 18 },
        { date: '24/04', count: 15 },
        { date: '25/04', count: 25 },
        { date: '26/04', count: 20 },
        { date: '27/04', count: 30 },
        { date: '28/04', count: 28 },
      ],
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
          breakdown
        } : null
      };
    });

    return { data };
  }

  async updateApplicationStatus(appId: string, status: string) {
    const app = await this.applicationModel.findById(appId);
    if (!app) throw new NotFoundException('Không tìm thấy hồ sơ');
    app.status = status;
    await app.save();
    return { success: true };
  }
}
