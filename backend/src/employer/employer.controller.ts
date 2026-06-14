import {
  Controller,
  Get,
  UseGuards,
  Param,
  Body,
  Patch,
  Request,
  Delete,
  Post,
} from '@nestjs/common';
import { EmployerService } from './employer.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  UpdateApplicationStatusDto,
  BulkDeleteApplicationsDto,
} from './dto/employer.dto';

@Controller('employer')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('employer', 'admin')
export class EmployerController {
  constructor(private readonly employerService: EmployerService) {}

  @Get('dashboard/stats')
  getDashboardStats(@Request() req) {
    const userId = req.user?._id || req.user?.id;
    return this.employerService.getDashboardStats(userId);
  }

  @Get('jobs')
  getJobs(@Request() req) {
    const userId = req.user?._id || req.user?.id;
    return this.employerService.getJobs(userId);
  }

  @Get('jobs/:id')
  getJob(@Param('id') id: string) {
    return this.employerService.getJob(id);
  }

  @Get('jobs/:id/applications')
  getApplications(@Param('id') id: string) {
    return this.employerService.getApplications(id);
  }

  @Patch('applications/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateApplicationStatusDto,
  ) {
    return this.employerService.updateApplicationStatus(
      id,
      updateStatusDto.status,
    );
  }

  @Delete('applications/:id')
  deleteApplication(@Param('id') id: string) {
    return this.employerService.deleteApplication(id);
  }

  @Post('applications/bulk-delete')
  bulkDeleteApplications(@Body() bulkDeleteDto: BulkDeleteApplicationsDto) {
    return this.employerService.bulkDeleteApplications(bulkDeleteDto.ids);
  }

  @Get('candidates/:id/profile')
  getCandidateProfile(@Param('id') id: string) {
    return this.employerService.getCandidateProfile(id);
  }
}
