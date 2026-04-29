import { Controller, Get, UseGuards, Param, Body, Patch } from '@nestjs/common';
import { EmployerService } from './employer.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('employer')
@UseGuards(JwtAuthGuard)
export class EmployerController {
  constructor(private readonly employerService: EmployerService) {}

  @Get('dashboard/stats')
  getDashboardStats() {
    return this.employerService.getDashboardStats();
  }

  @Get('jobs')
  getJobs() {
    return this.employerService.getJobs();
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
