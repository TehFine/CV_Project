import { Controller, Post, Param, UseInterceptors, UploadedFile, BadRequestException, Body, UseGuards, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CvScoringService } from './cv-scoring.service';
import { JobsService } from '../jobs/jobs.service';
import { JobDocument } from '../jobs/schemas/job.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cv-scoring')
@UseGuards(JwtAuthGuard)
export class CvScoringController {
  constructor(
    private readonly cvScoringService: CvScoringService,
    private readonly jobsService: JobsService,
  ) {}

  @Post('score/:jobId')
  @UseInterceptors(FileInterceptor('cv'))
  async scoreCv(
    @Param('jobId') jobId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('candidateId') candidateId?: string,
  ) {
    if (!file) {
      throw new BadRequestException('Vui lòng tải lên file CV (PDF)');
    }
    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('Chỉ hỗ trợ file PDF');
    }

    const job = await this.jobsService.findOne(jobId);
    if (!job) {
      throw new BadRequestException('Không tìm thấy công việc');
    }

    const result = await this.cvScoringService.scoreCV(file.buffer, job as any, candidateId);
    return {
      success: true,
      data: result
    };
  }

  @Post('candidate-score')
  @UseInterceptors(FileInterceptor('cv'))
  async scoreCandidateCv(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
    @Body('target_position') targetPosition?: string,
    @Body('jobId') jobId?: string,
  ) {
    try {
      if (!file) {
        throw new BadRequestException('Vui lòng tải lên file CV (PDF)');
      }
      // file could be pdf, docx, etc. but we only support pdf parsing currently.
      if (file.mimetype !== 'application/pdf') {
        throw new BadRequestException('Hiện tại hệ thống AI chỉ hỗ trợ định dạng PDF.');
      }

      let jobContext: JobDocument | undefined = undefined;
      if (jobId) {
        const found = await this.jobsService.findOne(jobId);
        if (found) jobContext = found as JobDocument;
      }

      const userId = req.user?.id || req.user?._id;
      const result = await this.cvScoringService.scoreCandidateCV(file.buffer, file.originalname, targetPosition, jobContext, userId);
      return result;
    } catch (error) {
      throw new BadRequestException(error.message || 'Lỗi khi phân tích CV');
    }
  }
}
