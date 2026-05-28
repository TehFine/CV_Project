import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Job, JobDocument } from './schemas/job.schema';
import { Application, ApplicationDocument } from './schemas/application.schema';
import { SEED_JOBS } from './jobs-seed.data';
import { CvScore, CvScoreDocument } from '../cv-scoring/schemas/cv-score.schema';
import { Notification, NotificationDocument } from '../admin/schemas/notification.schema';
import { NotificationsGateway } from '../admin/gateways/notifications.gateway';
import { AppLogger } from '../common/logger.service';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Settings, SettingsDocument } from '../admin/schemas/settings.schema';

@Injectable()
export class JobsService {
  private readonly logger = AppLogger.forContext(JobsService.name);

  constructor(
    @InjectModel(Job.name) private jobModel: Model<JobDocument>,
    @InjectModel('Application') private applicationModel: Model<ApplicationDocument>,
    @InjectModel(CvScore.name) private cvScoreModel: Model<CvScoreDocument>,
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Settings.name) private settingsModel: Model<SettingsDocument>,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async findAll(query: any) {
    const jobsSettings = await this.getJobsSettings();
    const { keyword, location, category, level, type, page = 1, limit = 20 } = query;
    
    const filter: any = { status: 'active' };

    // Exclude expired jobs based on jobExpiryDays
    const expiryDate = new Date(Date.now() - jobsSettings.jobExpiryDays * 24 * 60 * 60 * 1000);
    filter.createdAt = { $gte: expiryDate };

    // Helper: Tạo regex khớp cả có dấu và không dấu
    const getLenientRegex = (val: string) => {
      if (!val) return null;
      const unaccented = val.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/&/g, "va");
      const escaped = val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const escapedUnaccented = unaccented.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return { $regex: `${escaped}|${escapedUnaccented}`, $options: 'i' };
    };

    if (keyword) {
      const searchRegex = getLenientRegex(keyword);
      filter.$or = [
        { title: searchRegex },
        { companyName: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { location: searchRegex },
        { tags: searchRegex },
        { requirements: searchRegex },
        { benefits: searchRegex },
        { level: searchRegex },
        { type: searchRegex },
      ];
    }

    if (category) {
      filter.category = getLenientRegex(category);
    }

    if (location) {
      filter.location = getLenientRegex(location);
    }

    if (level) {
      filter.level = level;
    }

    if (type) {
      filter.type = getLenientRegex(type);
    }

    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      this.jobModel.find(filter)
        .sort({ featured: -1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .exec(),
      this.jobModel.countDocuments(filter),
    ]);

    return {
      data,
      total,
      page: Number(page),
      limit: Number(limit),
    };
  }

  async findOne(id: string) {
    const job = await this.jobModel.findById(id).exec();
    if (!job) {
      throw new NotFoundException('Không tìm thấy công việc');
    }

    // Check if job is expired
    const jobsSettings = await this.getJobsSettings();
    const expiryDate = new Date(Date.now() - jobsSettings.jobExpiryDays * 24 * 60 * 60 * 1000);
    if ((job as any).createdAt < expiryDate) {
      throw new NotFoundException('Tin tuyển dụng đã hết hạn');
    }
    
    // Increment views
    job.views += 1;
    await job.save();

    // Emit realtime update for admin
    try {
      this.notificationsGateway.emitJobViewsUpdated(id, job.views);
    } catch (e) {
      this.logger.warn('Failed to emit job views update via WebSocket', e as any);
    }
    
    return job;
  }

  async create(jobData: any, employerId: string) {
    const jobsSettings = await this.getJobsSettings();
    const usersSettings = await this.getUsersSettings();

    // Enforce employerVerificationRequired: NTD phải được xác minh trước khi đăng tin
    if (usersSettings.employerVerificationRequired) {
      const employer = await this.userModel.findById(employerId).exec();
      if (employer && !employer.verified) {
        throw new BadRequestException(
          'Tài khoản của bạn chưa được xác minh. Vui lòng hoàn tất xác minh pháp nhân trước khi đăng tin tuyển dụng.'
        );
      }
    }

    // Enforce maxJobsPerEmployer: check số lượng job đang active của NTD TRƯỚC khi tạo
    const activeJobCount = await this.jobModel.countDocuments({
      employerId: employerId as any,
      status: { $in: ['active', 'pending'] },
    }).exec();
    if (activeJobCount >= jobsSettings.maxJobsPerEmployer) {
      throw new BadRequestException(
        `Bạn đã đạt giới hạn ${jobsSettings.maxJobsPerEmployer} tin tuyển dụng. Vui lòng xóa bớt tin cũ trước khi đăng tin mới.`
      );
    }

    const newJob = new this.jobModel({
      ...jobData,
      employerId,
    });

    // Enforce requireApproval: nếu không cần duyệt, auto-approve ngay
    if (!jobsSettings.requireApproval && (!newJob.status || newJob.status === 'pending')) {
      newJob.status = 'active';
    }

    const saved = await newJob.save();
    this.logger.success('Tạo tin tuyển dụng mới', { userId: employerId, action: 'create_job', jobId: saved._id.toString(), title: jobData.title });

    // Tạo thông báo cho admin nếu tin cần duyệt
    if (saved.status === 'pending' || saved.status === 'draft') {
      try {
        const notif = await this.notificationModel.create({
          title: 'Tin tuyển dụng mới chờ duyệt',
          message: `Nhà tuyển dụng vừa đăng tin "${saved.title}" — trạng thái: ${saved.status === 'pending' ? 'chờ duyệt' : 'bản nháp'}. Vui lòng kiểm tra và phê duyệt.`,
          type: 'info',
          jobId: String(saved._id),
        } as any);
        this.logger.log('Đã tạo thông báo cho admin về tin mới', { action: 'notify_admin_new_job', jobId: saved._id.toString() });
        this.notificationsGateway.emitNotificationCreated({
          id: (notif as any)._id.toString(),
          title: (notif as any).title,
          message: (notif as any).message,
          type: (notif as any).type,
          time: 'Vừa xong',
          unread: true,
          jobId: (notif as any).jobId,
        });
      } catch (notifErr) {
        this.logger.error('Không thể tạo thông báo admin', notifErr as any);
      }
    }

    // Emit realtime update for admin dashboard
    try {
      this.notificationsGateway.emitDashboardUpdateNeeded();
    } catch (e) {
      this.logger.warn('Failed to emit dashboard update via WebSocket', e as any);
    }

    return saved;
  }

  async update(id: string, jobData: any, requesterId: string, requesterRole: string) {
    const job = await this.jobModel.findById(id).exec();
    if (!job) {
      throw new NotFoundException('Không tìm thấy công việc để cập nhật');
    }
    if (requesterRole !== 'admin' && job.employerId?.toString() !== requesterId) {
      this.logger.fail('Cập nhật job thất bại - không có quyền', { userId: requesterId, action: 'update_job', jobId: id });
      throw new ForbiddenException('Bạn không có quyền chỉnh sửa tin tuyển dụng này');
    }
    const updated = await this.jobModel.findByIdAndUpdate(id, jobData, { new: true }).exec();
    this.logger.success('Cập nhật tin tuyển dụng', { userId: requesterId, action: 'update_job', jobId: id, title: jobData.title });
    return updated;
  }

  async remove(id: string, requesterId: string, requesterRole: string) {
    const job = await this.jobModel.findById(id).exec();
    if (!job) {
      throw new NotFoundException('Không tìm thấy công việc để xóa');
    }
    if (requesterRole !== 'admin' && job.employerId?.toString() !== requesterId) {
      this.logger.fail('Xóa job thất bại - không có quyền', { userId: requesterId, action: 'delete_job', jobId: id });
      throw new ForbiddenException('Bạn không có quyền xóa tin tuyển dụng này');
    }

    // Tự động từ chối tất cả đơn ứng tuyển chưa được xử lý khi xóa job
    const rejectResult = await this.applicationModel.updateMany(
      { jobId: id as any, status: { $in: ['pending', 'reviewing', 'interview'] } as any },
      { $set: { status: 'rejected' } },
    ).exec();
    this.logger.log(`Đã từ chối ${rejectResult.modifiedCount} đơn ứng tuyển do job bị xóa`, { action: 'auto_reject_applications', jobId: id });

    await this.jobModel.findByIdAndDelete(id).exec();
    this.logger.success('Xóa tin tuyển dụng', { userId: requesterId, action: 'delete_job', jobId: id, title: job.title });
    return { message: 'Đã xóa công việc thành công' };
  }

  async apply(jobId: string, candidateId: string, data: any, file?: Express.Multer.File) {
    const job = await this.jobModel.findById(jobId);
    if (!job) {
      this.logger.fail('Ứng tuyển thất bại - job không tồn tại', { userId: candidateId, action: 'apply_job', jobId });
      throw new NotFoundException('Không tìm thấy công việc');
    }

    // Check if job is expired
    const jobsSettings = await this.getJobsSettings();
    const expiryDate = new Date(Date.now() - jobsSettings.jobExpiryDays * 24 * 60 * 60 * 1000);
    if ((job as any).createdAt < expiryDate) {
      throw new BadRequestException('Tin tuyển dụng này đã hết hạn, không thể ứng tuyển.');
    }

    // SPAM PREVENTION: Check if already applied
    const existingApp = await this.applicationModel.findOne({ jobId: jobId as any, candidateId: candidateId as any });
    if (existingApp) {
      this.logger.fail('Ứng tuyển thất bại - đã ứng tuyển', { userId: candidateId, action: 'apply_job', jobId });
      throw new BadRequestException('Bạn đã từng ứng tuyển vị trí này rồi.');
    }

    // Check AI settings for file validation
    const aiSettings = await this.getAiSettings();

    let cvId = data.cvId || 'uploaded_cv.pdf';
    let aiScoreId: any = undefined;

    if (file) {
      // Normalize Vietnamese filename before validation
      file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');

      const maxBytes = aiSettings.maxFileSizeMB * 1024 * 1024;
      if (file.size > maxBytes) {
        throw new BadRequestException(`Dung lượng file vượt quá giới hạn ${aiSettings.maxFileSizeMB}MB.`);
      }
      const ext = file.originalname.split('.').pop()?.toLowerCase();
      if (!ext || !aiSettings.supportedFormats.includes(ext)) {
        throw new BadRequestException(`Định dạng file không được hỗ trợ. Các định dạng: ${aiSettings.supportedFormats.join(', ')}`);
      }
      const originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
      const newScore = new this.cvScoreModel({
        userId: candidateId as any,
        jobId: jobId as any,
        pdfBuffer: file.buffer,
        cvUrl: originalname,
        overall: 0,
        fileName: originalname,
        categories: [],
        strengths: [],
        improvements: []
      });
      await newScore.save();
      aiScoreId = newScore._id;
      cvId = originalname;
    } else {
      const specificScore = await this.cvScoreModel.findOne({
        userId: candidateId as any,
        jobId: jobId as any,
      }).sort({ createdAt: -1 }).exec();

      if (specificScore) {
        cvId = specificScore.cvUrl || cvId;
        aiScoreId = specificScore._id;
      } else {
        // Remove general score fallback. Must have specific match or upload a CV.
        throw new BadRequestException('Bạn chưa đính kèm CV. Vui lòng đính kèm CV để ứng tuyển.');
      }
    }

    const application = new this.applicationModel({
      jobId,
      candidateId,
      coverLetter: data.coverLetter,
      cvId,
      aiScoreId,
    });

    await application.save();

    job.applied += 1;
    await job.save();

    // Emit realtime update for admin
    try {
      this.notificationsGateway.emitJobApplicationsUpdated(jobId, job.applied);
    } catch (e) {
      this.logger.warn('Failed to emit job applications update via WebSocket', e as any);
    }

    // Emit realtime update for admin dashboard
    try {
      this.notificationsGateway.emitDashboardUpdateNeeded();
    } catch (e) {
      this.logger.warn('Failed to emit dashboard update via WebSocket', e as any);
    }

    this.logger.success('Ứng tuyển thành công', { userId: candidateId, action: 'apply_job', jobId, title: job.title });

    return { message: 'Ứng tuyển thành công', applicationId: application._id };
  }

  async getMyApplications(candidateId: string) {
    return this.applicationModel
      .find({ candidateId: candidateId as any })
      .populate('jobId')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getCategories() {
    return this.jobModel.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { name: '$_id', count: 1, _id: 0 } },
      { $sort: { count: -1 } }
    ]);
  }

  // ─── Settings from DB ────────────────────────────────────────────────

  private async getAiSettings(): Promise<{
    maxFileSizeMB: number;
    supportedFormats: string[];
  }> {
    const defaults = { maxFileSizeMB: 10, supportedFormats: ['pdf', 'doc', 'docx'] };
    try {
      const doc = await this.settingsModel.findOne({ key: 'global' }).exec();
      if (!doc) return defaults;
      const ai = (doc as any).ai || {};
      return { ...defaults, ...ai };
    } catch {
      return defaults;
    }
  }

  private async getJobsSettings(): Promise<{
    requireApproval: boolean;
    maxJobsPerEmployer: number;
    jobExpiryDays: number;
  }> {
    const defaults = { requireApproval: true, maxJobsPerEmployer: 20, jobExpiryDays: 90 };
    try {
      const doc = await this.settingsModel.findOne({ key: 'global' }).exec();
      if (!doc) return defaults;
      const jobs = (doc as any).jobs || {};
      return { ...defaults, ...jobs };
    } catch {
      return defaults;
    }
  }

  private async getUsersSettings(): Promise<{
    employerVerificationRequired: boolean;
    maxSavedJobs: number;
  }> {
    const defaults = { employerVerificationRequired: true, maxSavedJobs: 50 };
    try {
      const doc = await this.settingsModel.findOne({ key: 'global' }).exec();
      if (!doc) return defaults;
      const users = (doc as any).users || {};
      return { ...defaults, ...users };
    } catch {
      return defaults;
    }
  }

  async seedData() {
    await this.jobModel.deleteMany({});
    const result = await this.jobModel.insertMany(SEED_JOBS());
    return { message: `Da seed ${result.length} jobs vao database`, count: result.length };
  }

  async toggleSaveJob(jobId: string, userId: string): Promise<{ saved: boolean }> {
    const job = await this.jobModel.findById(jobId);
    if (!job) throw new NotFoundException('Không tìm thấy công việc');

    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');

    const jobObjId = new Types.ObjectId(jobId);
    const idx = (user.savedJobs || []).findIndex(id => id.toString() === jobId);

    if (idx === -1) {
      // Enforce maxSavedJobs: check limit before saving
      const usersSettings = await this.getUsersSettings();
      const currentSavedCount = (user.savedJobs || []).length;
      if (currentSavedCount >= usersSettings.maxSavedJobs) {
        throw new BadRequestException(
          `Bạn chỉ có thể lưu tối đa ${usersSettings.maxSavedJobs} công việc. Vui lòng bỏ lưu công việc cũ trước khi lưu công việc mới.`
        );
      }

      await this.userModel.findByIdAndUpdate(userId, { $addToSet: { savedJobs: jobObjId } });
      this.logger.log('Lưu việc làm', { userId, jobId, action: 'save_job' });
      return { saved: true };
    } else {
      // Already saved → unsave
      await this.userModel.findByIdAndUpdate(userId, { $pull: { savedJobs: jobObjId } });
      this.logger.log('Bỏ lưu việc làm', { userId, jobId, action: 'unsave_job' });
      return { saved: false };
    }
  }

  async getSavedJobs(userId: string) {
    const user = await this.userModel.findById(userId).populate('savedJobs').exec();
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');
    return user.savedJobs || [];
  }
}
