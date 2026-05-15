import { Controller, Post, Param, UseInterceptors, UploadedFile, BadRequestException, Body, UseGuards, Get, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CvScoringService } from './cv-scoring.service';
import { JobsService } from '../jobs/jobs.service';
import { JobDocument } from '../jobs/schemas/job.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cv-scoring')
export class CvScoringController {
  constructor(
    private readonly cvScoringService: CvScoringService,
    private readonly jobsService: JobsService,
  ) {}

  @Post('score/:jobId')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('cv'))
  async scoreCv(
    @Param('jobId') jobId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Vui lòng tải lên file CV (PDF)');
    }
    if (file.mimetype !== 'application/pdf' && !file.mimetype.includes('word') && !file.originalname.match(/\.(pdf|doc|docx)$/i)) {
      throw new BadRequestException('Chỉ hỗ trợ file PDF và Word (DOC/DOCX)');
    }

    const job = await this.jobsService.findOne(jobId);
    if (!job) {
      throw new BadRequestException('Không tìm thấy công việc');
    }

    const result = await this.cvScoringService.scoreCV(file, job as any);
    return {
      success: true,
      data: result
    };
  }

  @Post('candidate-score')
  @UseInterceptors(FileInterceptor('cv'))
  async scoreCandidateCv(
    @UploadedFile() file: Express.Multer.File,
    @Body('target_position') targetPosition?: string,
    @Body('jobId') jobId?: string,
    @Req() req?: any
  ) {
    try {
      if (!file) {
        throw new BadRequestException('Vui lòng tải lên file CV (PDF)');
      }
      if (file.mimetype !== 'application/pdf' && !file.mimetype.includes('word') && !file.originalname.match(/\.(pdf|doc|docx)$/i)) {
        throw new BadRequestException('Hiện tại hệ thống AI chỉ hỗ trợ định dạng PDF và Word (DOC/DOCX).');
      }

      let jobContext: JobDocument | undefined = undefined;
      if (jobId) {
        const found = await this.jobsService.findOne(jobId);
        if (found) jobContext = found as JobDocument;
      }

      // Cố gắng giải mã user từ token nếu có (để lưu lịch sử)
      let user: any = null;
      if (req && req.headers && req.headers.authorization) {
        try {
          const token = req.headers.authorization.split(' ')[1];
          // Simple payload decode without full verification just for attaching userId to history
          // In production, you would use a proper optional guard.
          const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
          user = { _id: payload.sub };
        } catch (e) {
          // ignore
        }
      }

      const result = await this.cvScoringService.scoreCandidateCV(file, targetPosition, jobContext, user);
      return result;
    } catch (error) {
      throw new BadRequestException(error.message || 'Lỗi khi phân tích CV');
    }
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  async getHistory(@Req() req: any) {
    return this.cvScoringService.getHistory(req.user._id);
  }
}
