import { Controller, Get, UseGuards, Param, Body, Patch, Request } from '@nestjs/common';
import { EmployerService } from './employer.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

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
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.employerService.updateApplicationStatus(id, status);
  }
}
