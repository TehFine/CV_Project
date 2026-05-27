import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Job, JobDocument } from './schemas/job.schema';
import { Application, ApplicationDocument } from './schemas/application.schema';
import { SEED_JOBS } from './jobs-seed.data';
import { CvScore, CvScoreDocument } from '../cv-scoring/schemas/cv-score.schema';
import { Notification, NotificationDocument } from '../admin/schemas/notification.schema';
import { AppLogger } from '../common/logger.service';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class JobsService {
  private readonly logger = AppLogger.forContext(JobsService.name);

  constructor(
    @InjectModel(Job.name) private jobModel: Model<JobDocument>,
    @InjectModel('Application') private applicationModel: Model<ApplicationDocument>,
    @InjectModel(CvScore.name) private cvScoreModel: Model<CvScoreDocument>,
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findAll(query: any) {
    const { keyword, location, category, level, type, page = 1, limit = 20 } = query;
    
    const filter: any = { status: 'active' };

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
    
    // Increment views
    job.views += 1;
    await job.save();
    
    return job;
  }

  async create(jobData: any, employerId: string) {
    const newJob = new this.jobModel({
      ...jobData,
      employerId,
    });
    const saved = await newJob.save();
    this.logger.success('Tạo tin tuyển dụng mới', { userId: employerId, action: 'create_job', jobId: saved._id.toString(), title: jobData.title });

    // Tạo thông báo cho admin nếu tin cần duyệt
    if (saved.status === 'pending' || saved.status === 'draft') {
      try {
        await this.notificationModel.create({
          title: 'Tin tuyển dụng mới chờ duyệt',
          message: `Nhà tuyển dụng vừa đăng tin "${saved.title}" — trạng thái: ${saved.status === 'pending' ? 'chờ duyệt' : 'bản nháp'}. Vui lòng kiểm tra và phê duyệt.`,
          type: 'info',
          jobId: String(saved._id),
        } as any);
        this.logger.log('Đã tạo thông báo cho admin về tin mới', { action: 'notify_admin_new_job', jobId: saved._id.toString() });
      } catch (notifErr) {
        this.logger.error('Không thể tạo thông báo admin', notifErr as any);
      }
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
    await this.jobModel.findByIdAndDelete(id).exec();
    this.logger.success('Xóa tin tuyển dụng', { userId: requesterId, action: 'delete_job', jobId: id, title: job.title });
    return { message: 'Đã xóa công việc thành công' };
  }

  async apply(jobId: string, candidateId: string, data: any) {
    const job = await this.jobModel.findById(jobId);
    if (!job) {
      this.logger.fail('Ứng tuyển thất bại - job không tồn tại', { userId: candidateId, action: 'apply_job', jobId });
      throw new NotFoundException('Không tìm thấy công việc');
    }

    let cvId = data.cvId || 'uploaded_cv.pdf';
    let aiScoreId: any = undefined;

    const specificScore = await this.cvScoreModel.findOne({
      userId: candidateId as any,
      jobId: jobId as any,
    }).sort({ createdAt: -1 }).exec();

    if (specificScore) {
      cvId = specificScore.cvUrl || cvId;
      aiScoreId = specificScore._id;
    } else {
      const generalScore = await this.cvScoreModel.findOne({
        userId: candidateId as any,
      }).sort({ createdAt: -1 }).exec();

      if (generalScore) {
        cvId = generalScore.cvUrl || cvId;
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
      // Not saved yet → save it
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
