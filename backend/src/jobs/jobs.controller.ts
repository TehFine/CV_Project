import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  ForbiddenException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JobsService } from './jobs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  // ── Public static routes (must be before :id) ──────────────────────────────

  @Get()
  async findAll(@Query() query: any) {
    return this.jobsService.findAll(query);
  }

  @Get('categories')
  async getCategories() {
    return this.jobsService.getCategories();
  }

  // ── Protected static routes (must be before :id) ───────────────────────────

  @UseGuards(JwtAuthGuard)
  @Get('my-applications')
  async getMyApplications(@Request() req) {
    return this.jobsService.getMyApplications(req.user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-saved-jobs')
  async getSavedJobs(@Request() req) {
    return this.jobsService.getSavedJobs(req.user._id);
  }

  // ── Parameterized routes (after all static routes) ─────────────────────────

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/save')
  async toggleSave(@Param('id') id: string, @Request() req) {
    if (req.user.role !== 'candidate') {
      throw new ForbiddenException('Chỉ ứng viên mới có thể lưu công việc');
    }
    return this.jobsService.toggleSaveJob(id, req.user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/apply')
  @UseInterceptors(FileInterceptor('cv'))
  async apply(
    @Param('id') id: string,
    @Request() req,
    @Body() data: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (req.user.role !== 'candidate') {
      throw new ForbiddenException(
        'Chỉ ứng viên mới được ứng tuyển vào công việc',
      );
    }
    return this.jobsService.apply(id, req.user._id, data, file);
  }

  // ── Protected: Employer only ───────────────────────────────────────────────

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('employer', 'admin')
  @Post()
  async create(@Request() req, @Body() createJobDto: any) {
    return this.jobsService.create(createJobDto, req.user._id.toString());
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('employer', 'admin')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateJobDto: any,
  ) {
    return this.jobsService.update(
      id,
      updateJobDto,
      req.user._id.toString(),
      req.user.role,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('employer', 'admin')
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return this.jobsService.remove(id, req.user._id.toString(), req.user.role);
  }

  // ── Protected: Admin only ──────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('seed')
  async seed() {
    return this.jobsService.seedData();
  }
}
