import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job, JobDocument } from './schemas/job.schema';
import { Application, ApplicationDocument } from './schemas/application.schema';
import { SEED_JOBS } from './jobs-seed.data';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name) private jobModel: Model<JobDocument>,
    @InjectModel('Application') private applicationModel: Model<ApplicationDocument>,
  ) {}

  async findAll(query: any) {
    const { keyword, location, category, level, type, page = 1, limit = 20 } = query;
    
    const filter: any = { status: 'active' };

    if (keyword) {
      const searchRegex = { $regex: keyword, $options: 'i' };
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
      filter.category = category;
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (level) {
      filter.level = level;
    }

    if (type) {
      filter.type = type;
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
    return newJob.save();
  }

  async update(id: string, jobData: any, requesterId: string, requesterRole: string) {
    const job = await this.jobModel.findById(id).exec();
    if (!job) {
      throw new NotFoundException('Không tìm thấy công việc để cập nhật');
    }
    // Chỉ admin hoặc chủ sở hữu mới được cập nhật
    if (requesterRole !== 'admin' && job.employerId?.toString() !== requesterId) {
      throw new ForbiddenException('Bạn không có quyền chỉnh sửa tin tuyển dụng này');
    }
    return this.jobModel.findByIdAndUpdate(id, jobData, { new: true }).exec();
  }

  async remove(id: string, requesterId: string, requesterRole: string) {
    const job = await this.jobModel.findById(id).exec();
    if (!job) {
      throw new NotFoundException('Không tìm thấy công việc để xóa');
    }
    // Chỉ admin hoặc chủ sở hữu mới được xóa
    if (requesterRole !== 'admin' && job.employerId?.toString() !== requesterId) {
      throw new ForbiddenException('Bạn không có quyền xóa tin tuyển dụng này');
    }
    await this.jobModel.findByIdAndDelete(id).exec();
    return { message: 'Đã xóa công việc thành công' };
  }

  async apply(jobId: string, candidateId: string, data: any) {
    const job = await this.jobModel.findById(jobId);
    if (!job) {
      throw new NotFoundException('Không tìm thấy công việc');
    }

    const application = new this.applicationModel({
      jobId,
      candidateId,
      coverLetter: data.coverLetter,
      cvId: data.cvId,
    });

    await application.save();

    // Increment applied count
    job.applied += 1;
    await job.save();

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
}
