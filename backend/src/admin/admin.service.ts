import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Job, JobDocument } from '../jobs/schemas/job.schema';
import { Application, ApplicationDocument } from '../jobs/schemas/application.schema';
import { CvScore, CvScoreDocument } from '../cv-scoring/schemas/cv-score.schema';
import { Notification, NotificationDocument } from './schemas/notification.schema';
import { AppLogger } from '../common/logger.service';

@Injectable()
export class AdminService {
  private readonly logger = AppLogger.forContext(AdminService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Job.name) private jobModel: Model<JobDocument>,
    @InjectModel(Application.name) private applicationModel: Model<ApplicationDocument>,
    @InjectModel(CvScore.name) private cvScoreModel: Model<CvScoreDocument>,
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
  ) {}

  // ─── Dashboard ──────────────────────────────────────────────────────

  async getDashboardStats() {
    this.logger.log('Xem thống kê dashboard admin', { action: 'admin_dashboard' });
    const totalUsers = await this.userModel.countDocuments();
    const totalEmployers = await this.userModel.countDocuments({ role: 'employer' } as any);
    const totalCandidates = await this.userModel.countDocuments({ role: 'candidate' } as any);

    const totalJobs = await this.jobModel.countDocuments();
    const activeJobs = await this.jobModel.countDocuments({ status: 'active' } as any);
    const pendingJobs = await this.jobModel.countDocuments({ status: 'pending' } as any);

    const totalApplications = await this.applicationModel.countDocuments();
    const totalCvScores = await this.cvScoreModel.countDocuments();

    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newUsersThisMonth = await this.userModel.countDocuments({ createdAt: { $gte: firstOfMonth } } as any);

    // User growth (last 6 months)
    const userGrowth: any[] = [];
    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const candidates = await this.userModel.countDocuments({ role: 'candidate', createdAt: { $gte: start, $lt: end } } as any);
      const employers = await this.userModel.countDocuments({ role: 'employer', createdAt: { $gte: start, $lt: end } } as any);
      const monthNames = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
      userGrowth.push({
        month: `${monthNames[start.getMonth()]}/${start.getFullYear()}`,
        candidates,
        employers,
      });
    }

    // Jobs by category
    const jobsByCategory = await this.jobModel.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { category: '$_id', count: 1, _id: 0 } },
      { $sort: { count: -1 } },
    ]) as any[];

    // CV score distribution
    const scoreDistribution = [
      { grade: 'A (85-100)', count: await this.cvScoreModel.countDocuments({ overall: { $gte: 85 } } as any) },
      { grade: 'B (70-84)', count: await this.cvScoreModel.countDocuments({ overall: { $gte: 70, $lt: 85 } } as any) },
      { grade: 'C (55-69)', count: await this.cvScoreModel.countDocuments({ overall: { $gte: 55, $lt: 70 } } as any) },
      { grade: 'D (<55)', count: await this.cvScoreModel.countDocuments({ overall: { $lt: 55 } } as any) },
    ];

    // Average CV score
    const avgScoreAgg = await this.cvScoreModel.aggregate([
      { $group: { _id: null, avg: { $avg: '$overall' } } },
    ]).exec();
    const avgCVScore = avgScoreAgg.length > 0 ? Math.round(avgScoreAgg[0].avg) : 0;

    // Top locations
    const locationAgg = await this.jobModel.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$location', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]).exec();

    const topLocations = await Promise.all((locationAgg || []).map(async (loc: any) => {
      const users = await this.userModel.countDocuments({ role: 'employer', location: loc._id } as any);
      return { city: loc._id, jobs: loc.count, users };
    }));

    // Recent activities
    const recentActivities = await this.getRecentActivities(6);

    return {
      overview: {
        totalUsers,
        newUsersThisMonth,
        totalEmployers,
        totalJobs,
        activeJobs,
        totalApplications,
        totalCvScores,
        avgCVScore,
      },
      userGrowth,
      jobsByCategory: jobsByCategory.map((j: any) => ({ ...j, pct: activeJobs > 0 ? Math.round((j.count / activeJobs) * 100) : 0 })),
      cvScoreDistribution: scoreDistribution.map(s => ({
        ...s,
        pct: totalCvScores > 0 ? Math.round((s.count / totalCvScores) * 100) : 0,
      })),
      topLocations,
      recentActivities,
    };
  }

  async getRecentActivities(limit = 10) {
    const recent: any[] = [];

    // Recent user registrations
    const recentUsers = await this.userModel.find().sort({ createdAt: -1 } as any).limit(5).exec();
    for (const u of recentUsers) {
      recent.push({
        type: 'new_user',
        message: `${u.role === 'employer' ? 'NTD' : 'Ứng viên'} mới: ${u.name}`,
        time: this.timeAgo((u as any).createdAt),
        icon: u.role === 'employer' ? '🏢' : '👤',
      });
    }

    // Recent job posts
    const recentJobs = await this.jobModel.find().sort({ createdAt: -1 } as any).limit(5).exec();
    for (const j of recentJobs) {
      recent.push({
        type: 'new_job',
        message: `Tin tuyển dụng mới: ${j.title}${j.status === 'pending' ? ' (chờ duyệt)' : ''}`,
        time: this.timeAgo((j as any).createdAt),
        icon: '📋',
      });
    }

    // Recent CV scores
    const recentScores = await this.cvScoreModel.find().sort({ createdAt: -1 } as any).limit(5).exec();
    for (const s of recentScores) {
      recent.push({
        type: 'cv_score',
        message: `CV được chấm điểm: ${(s as any).overall || (s as any).score || 0}/100`,
        time: this.timeAgo((s as any).createdAt),
        icon: '✨',
      });
    }

    // Sort by time and limit
    recent.sort((a, b) => {
      const timeA = this.parseTimeAgo(a.time);
      const timeB = this.parseTimeAgo(b.time);
      return timeA - timeB;
    });

    return recent.slice(0, limit).map((r, i) => ({ id: i + 1, ...r }));
  }

  // ─── Users ──────────────────────────────────────────────────────────

  async getUsers(params: { role?: string; status?: string; keyword?: string; page?: number; limit?: number }): Promise<any> {
    this.logger.log('Xem danh sách người dùng', { action: 'admin_get_users', ...params });
    const filter: any = {};
    if (params.role) filter.role = params.role;
    if (params.status) filter.status = params.status;
    if (params.keyword) {
      const kw = params.keyword;
      filter.$or = [
        { name: { $regex: kw, $options: 'i' } },
        { email: { $regex: kw, $options: 'i' } },
      ];
    }

    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.userModel.find(filter).sort({ createdAt: -1 } as any).skip(skip).limit(limit).exec(),
      this.userModel.countDocuments(filter),
    ]);

    // Enrich with additional stats
    const enriched = await Promise.all(data.map(async (u) => {
      const userObj = u.toObject ? u.toObject() : u;
      const { password, ...safeUser } = userObj;

      if (u.role === 'candidate') {
        const cvCount = await this.cvScoreModel.countDocuments({ userId: u._id } as any);
        const appliedJobs = await this.applicationModel.countDocuments({ candidateId: u._id } as any);
        return { ...safeUser, cvCount, appliedJobs };
      }

      if (u.role === 'employer') {
        const postedJobs = await this.jobModel.countDocuments({ employerId: u._id } as any);
        const employerJobs = await this.jobModel.find({ employerId: u._id } as any).select('_id').exec();
        const jobIds = employerJobs.map(j => j._id);
        const totalApplicants = await this.applicationModel.countDocuments({
          jobId: { $in: jobIds },
        } as any);
        return { ...safeUser, postedJobs, totalApplicants };
      }

      return safeUser;
    }));

    return { data: enriched, total, page, limit };
  }

  async getUser(id: string): Promise<any> {
    this.logger.log('Xem chi tiết người dùng', { action: 'admin_get_user', targetUserId: id });
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');
    const userObj = user.toObject ? user.toObject() : user;
    const { password, ...safeUser } = userObj;
    return safeUser;
  }

  async updateUserStatus(id: string, status: string, reason = '') {
    const user = await this.userModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
    if (!user) {
      this.logger.fail('Cập nhật trạng thái user thất bại - không tìm thấy', { action: 'admin_update_user_status', targetUserId: id, status });
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    this.logger.success('Cập nhật trạng thái user', { action: 'admin_update_user_status', targetUserId: id, status, reason: reason || 'none' });
    // Create notification for user status change
    await this.notificationModel.create({
      userId: id,
      title: 'Cập nhật trạng thái tài khoản',
      message: `Tài khoản của bạn đã được chuyển sang trạng thái: ${status}${reason ? `. Lý do: ${reason}` : ''}`,
      type: status === 'banned' ? 'warning' : 'info',
    } as any);
    return { success: true };
  }

  async deleteUser(id: string) {
    const user = await this.userModel.findByIdAndDelete(id).exec();
    if (!user) {
      this.logger.fail('Xóa user thất bại - không tìm thấy', { action: 'admin_delete_user', targetUserId: id });
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    this.logger.success('Xóa user', { action: 'admin_delete_user', targetUserId: id, name: user.name, email: user.email });
    return { message: 'Đã xóa người dùng thành công' };
  }

  // ─── Jobs ────────────────────────────────────────────────────────────

  async getAdminJobs(params: { status?: string; keyword?: string; page?: number; limit?: number }): Promise<any> {
    const filter: any = {};
    if (params.status) filter.status = params.status;
    if (params.keyword) {
      const kw = params.keyword;
      filter.$or = [
        { title: { $regex: kw, $options: 'i' } },
        { companyName: { $regex: kw, $options: 'i' } },
      ];
    }

    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.jobModel.find(filter).sort({ createdAt: -1 } as any).skip(skip).limit(limit).populate('employerId', 'name email').exec(),
      this.jobModel.countDocuments(filter),
    ]);

    const enriched: any[] = data.map(j => {
      const job = j.toObject ? j.toObject() : j;
      const employer = job.employerId as any;
      return {
        id: job._id,
        title: job.title,
        company: job.companyName,
        companyId: employer?._id,
        location: job.location,
        salary: job.salary || (job.salaryMin ? `${(job.salaryMin / 1000000)} - ${(job.salaryMax / 1000000)} triệu` : 'Thỏa thuận'),
        level: job.level,
        type: job.type,
        category: job.category,
        status: job.status,
        featured: job.featured || false,
        views: job.views || 0,
        applied: job.applied || 0,
        postedAt: (job as any).createdAt,
        deadline: job.deadline,
        tags: job.tags || [],
        description: job.description,
        requirements: job.requirements,
        benefits: job.benefits,
      };
    });

    return { data: enriched, total, page, limit };
  }

  async updateJobStatus(id: string, status: string) {
    const job = await this.jobModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
    if (!job) {
      this.logger.fail('Cập nhật trạng thái job thất bại', { action: 'admin_update_job_status', jobId: id, status });
      throw new NotFoundException('Không tìm thấy công việc');
    }
    this.logger.success('Cập nhật trạng thái job', { action: 'admin_update_job_status', jobId: id, status, title: job.title });

    // Notify employer about status change
    await this.notificationModel.create({
      userId: job.employerId,
      title: 'Cập nhật trạng thái tin tuyển dụng',
      message: `Tin tuyển dụng "${job.title}" đã được chuyển sang trạng thái: ${status}`,
      type: status === 'active' ? 'success' : status === 'rejected' ? 'warning' : 'info',
      jobId: String(job._id),
    } as any);

    return { success: true };
  }

  async toggleJobFeatured(id: string, featured: boolean) {
    const job = await this.jobModel.findByIdAndUpdate(id, { featured }, { new: true }).exec();
    if (!job) throw new NotFoundException('Không tìm thấy công việc');
    return { success: true, featured: job.featured };
  }

  async deleteJob(id: string) {
    const job = await this.jobModel.findByIdAndDelete(id).exec();
    if (!job) {
      this.logger.fail('Xóa job thất bại - không tìm thấy', { action: 'admin_delete_job', jobId: id });
      throw new NotFoundException('Không tìm thấy công việc');
    }
    this.logger.success('Xóa job', { action: 'admin_delete_job', jobId: id, title: job.title });
    return { message: 'Đã xóa tin tuyển dụng thành công' };
  }

  // ─── CV Scores ───────────────────────────────────────────────────────

  async getCVScores(params: { keyword?: string; grade?: string; page?: number; limit?: number }) {
    const filter: any = {};
    if (params.grade) filter.grade = params.grade;
    if (params.keyword) {
      filter.$or = [
        { fileName: { $regex: params.keyword, $options: 'i' } },
        { targetPosition: { $regex: params.keyword, $options: 'i' } },
      ];
    }

    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.cvScoreModel.find(filter)
        .sort({ createdAt: -1 } as any)
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name email')
        .exec(),
      this.cvScoreModel.countDocuments(filter),
    ]);

    const enriched = data.map(s => {
      const score = s.toObject ? s.toObject() : s;
      const user = score.userId as any;
      const cats = (score as any).analysis?.categories || [];
      const categories: any = { skills: 0, experience: 0, education: 0, format: 0, keywords: 0 };
      const catMap: any = { skills_match: 'skills', skills: 'skills', experience: 'experience', education: 'education', format: 'format', keywords: 'keywords' };
      for (const c of cats) {
        const key = catMap[c.key];
        if (key) categories[key] = c.score;
      }

      return {
        id: score._id,
        userId: user?._id,
        userName: user?.name || 'N/A',
        userEmail: user?.email || 'N/A',
        fileName: score.fileName || (score as any).cvUrl || 'CV.pdf',
        overall: (score as any).overall || (score as any).score || 0,
        grade: (score as any).grade || 'N/A',
        targetPosition: (score as any).targetPosition || '',
        scoredAt: (score as any).createdAt,
        categories,
      };
    });

    return { data: enriched, total, page, limit };
  }

  async deleteCVScore(id: string) {
    const score = await this.cvScoreModel.findByIdAndDelete(id).exec();
    if (!score) {
      this.logger.fail('Xóa điểm CV thất bại - không tìm thấy', { action: 'admin_delete_cv_score', scoreId: id });
      throw new NotFoundException('Không tìm thấy điểm CV');
    }
    this.logger.success('Xóa điểm CV', { action: 'admin_delete_cv_score', scoreId: id });
    return { message: 'Đã xóa điểm CV thành công' };
  }

  // ─── Notifications ───────────────────────────────────────────────────

  async getNotifications(userId: string, params: { filter?: string; page?: number; limit?: number }) {
    const query: any = {};
    // Admin can see all notifications, or filter by userId
    if (params.filter === 'unread') query.read = false;

    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const [data, total, unreadCount] = await Promise.all([
      this.notificationModel.find(query).sort({ createdAt: -1 } as any).skip(skip).limit(limit).exec(),
      this.notificationModel.countDocuments(query),
      this.notificationModel.countDocuments({ read: false } as any),
    ]);

    return {
      data: data.map((n: any) => ({
        id: n._id,
        title: n.title,
        message: n.message,
        type: n.type,
        time: this.timeAgo(n.createdAt),
        unread: !n.read,
        jobId: n.jobId,
      })),
      total,
      unreadCount,
      page,
      limit,
    };
  }

  async markNotificationRead(id: string) {
    await this.notificationModel.findByIdAndUpdate(id, { read: true }).exec();
    this.logger.log('Đánh dấu thông báo đã đọc', { action: 'admin_mark_notification_read', notificationId: id });
    return { success: true };
  }

  async markAllNotificationsRead(userId: string) {
    const result = await this.notificationModel.updateMany({ read: false } as any, { read: true }).exec();
    this.logger.log('Đánh dấu tất cả thông báo đã đọc', { action: 'admin_mark_all_read', count: result.modifiedCount });
    return { success: true };
  }

  async deleteNotification(id: string) {
    await this.notificationModel.findByIdAndDelete(id).exec();
    this.logger.log('Xóa thông báo', { action: 'admin_delete_notification', notificationId: id });
    return { success: true };
  }

  async createNotification(data: { userId?: string; title: string; message: string; type?: string; jobId?: string }) {
    const created = await this.notificationModel.create({
      userId: data.userId,
      title: data.title,
      message: data.message,
      type: data.type || 'info',
      jobId: data.jobId,
    } as any);
    this.logger.success('Tạo thông báo mới', { action: 'admin_create_notification', notificationId: created._id.toString(), title: data.title });
    return created;
  }

  // ─── Settings ────────────────────────────────────────────────────────

  async getSettings() {
    // Return default settings (could be stored in DB in production)
    return {
      site: {
        siteName: 'NexCV',
        siteUrl: 'https://nexcv.vn',
        contactEmail: 'support@nexcv.vn',
        contactPhone: '0901234567',
        maintenanceMode: false,
      },
      ai: {
        cvScoreEnabled: true,
        maxFileSizeMB: 10,
        supportedFormats: ['pdf', 'doc', 'docx'],
        processingTimeoutSec: 60,
        dailyScoreLimit: 5,
      },
      jobs: {
        requireApproval: true,
        maxJobsPerEmployer: 20,
        featuredJobPrice: 0,
        jobExpiryDays: 90,
        autoCloseExpired: true,
      },
      users: {
        emailVerificationRequired: false,
        employerVerificationRequired: true,
        maxSavedJobs: 50,
      },
    };
  }

  async updateSettings(section: string, data: any) {
    this.logger.success('Cập nhật cài đặt hệ thống', { action: 'admin_update_settings', section });
    // In production, save to DB. For now, just echo back.
    return { section, ...data, updatedAt: new Date().toISOString() };
  }

  // ─── Helpers ─────────────────────────────────────────────────────────

  private timeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return 'Vừa xong';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} phút trước`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour} giờ trước`;
    const diffDay = Math.floor(diffHour / 24);
    if (diffDay < 30) return `${diffDay} ngày trước`;
    return `${Math.floor(diffDay / 30)} tháng trước`;
  }

  private parseTimeAgo(timeStr: string): number {
    const now = Date.now();
    if (timeStr === 'Vừa xong') return now;
    const min = timeStr.match(/(\d+) phút/);
    if (min) return now - parseInt(min[1]) * 60000;
    const hour = timeStr.match(/(\d+) giờ/);
    if (hour) return now - parseInt(hour[1]) * 3600000;
    const day = timeStr.match(/(\d+) ngày/);
    if (day) return now - parseInt(day[1]) * 86400000;
    return now;
  }
}
