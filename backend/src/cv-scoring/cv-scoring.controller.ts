import { Controller, Post, Param, UseInterceptors, UploadedFile, BadRequestException, Body, UseGuards, Req, Get, Res, Delete, NotFoundException, ForbiddenException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CvScoringService } from './cv-scoring.service';
import { JobsService } from '../jobs/jobs.service';
import { JobDocument } from '../jobs/schemas/job.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('cv-scoring')
export class CvScoringController {
  constructor(
    private readonly cvScoringService: CvScoringService,
    private readonly jobsService: JobsService,
  ) { }

  @Get('view/:id')
  @UseGuards(JwtAuthGuard)
  async viewCv(@Param('id') id: string, @Req() req: any, @Res() res: any) {
    let score = await this.cvScoringService.findScoreById(id);
    if (!score || !score.pdfBuffer) {
      score = await this.cvScoringService.findScoreByCvUrl(id);
    }

    if (!score || !score.pdfBuffer) {
      throw new NotFoundException('Không tìm thấy file CV của ứng viên trong cơ sở dữ liệu.');
    }

    const hasAccess = await this.cvScoringService.checkCvAccessPermission(score, req.user);
    if (!hasAccess) {
      throw new ForbiddenException('Bạn không có quyền truy cập file CV này.');
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.send(score.pdfBuffer);
  }


  @Post('score/:jobId')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('cv'))
  async scoreCv(
    @Param('jobId') jobId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('candidateId') candidateId?: string,
  ) {
    let pdfBuffer: Buffer | undefined = undefined;

    if (file) {
      if (file.mimetype !== 'application/pdf') {
        throw new BadRequestException('Chỉ hỗ trợ file PDF');
      }
      pdfBuffer = file.buffer;
    } else if (candidateId) {
      const dbBuffer = await this.cvScoringService.getCandidatePdfBuffer(jobId, candidateId);
      if (dbBuffer) pdfBuffer = dbBuffer;
    }

    if (!pdfBuffer) {
      throw new BadRequestException('Không tìm thấy file CV hiện tại của ứng viên. Vui lòng tải lên file CV (PDF) mới.');
    }

    const job = await this.jobsService.findOne(jobId);
    if (!job) {
      throw new BadRequestException('Không tìm thấy công việc');
    }

    const result = await this.cvScoringService.scoreCV(pdfBuffer, job as any, candidateId);
    return {
      success: true,
      data: result
    };
  }

  @Post('candidate-score')
  @UseGuards(JwtAuthGuard)
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
      if (file.mimetype !== 'application/pdf' && !file.mimetype.includes('word') && !file.originalname.match(/\.(pdf|doc|docx)$/i)) {
        throw new BadRequestException('Hiện tại hệ thống AI chỉ hỗ trợ định dạng PDF và Word (DOC/DOCX).');
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

  @Get('history')
  @UseGuards(JwtAuthGuard)
  async getHistory(@Req() req: any) {
    return this.cvScoringService.getHistory(req.user._id);
  }

  @Get('scores/:id')
  @UseGuards(JwtAuthGuard)
  async getScoreById(@Param('id') id: string) {
    const score = await this.cvScoringService.getScoreById(id);
    if (!score) throw new NotFoundException('Không tìm thấy kết quả chấm điểm CV');
    return score;
  }

  @Delete('scores/:id')
  @UseGuards(JwtAuthGuard)
  async deleteScoreById(@Param('id') id: string) {
    const deleted = await this.cvScoringService.deleteScoreById(id);
    if (!deleted) throw new NotFoundException('Không tìm thấy kết quả chấm điểm CV');
    return { message: 'Đã xóa kết quả chấm điểm CV thành công' };
  }
}
