import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ─── Dashboard ──────────────────────────────────────────────────────

  @Get('dashboard')
  getDashboard(): Promise<any> {
    return this.adminService.getDashboardStats();
  }

  @Get('reports')
  getReports(): Promise<any> {
    const stats = this.adminService.getDashboardStats();
    const activities = this.adminService.getRecentActivities();
    return Promise.all([stats, activities]).then(([s, a]) => ({
      ...s,
      recentActivities: a,
    }));
  }

  // ─── Users ──────────────────────────────────────────────────────────

  @Get('users')
  getUsers(@Query() params: any): Promise<any> {
    return this.adminService.getUsers(params);
  }

  @Get('users/:id')
  getUser(@Param('id') id: string): Promise<any> {
    return this.adminService.getUser(id);
  }

  @Patch('users/:id/status')
  updateUserStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('reason') reason?: string,
  ): Promise<any> {
    return this.adminService.updateUserStatus(id, status, reason);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string): Promise<any> {
    return this.adminService.deleteUser(id);
  }

  // ─── Jobs ───────────────────────────────────────────────────────────

  @Get('jobs')
  getJobs(@Query() params: any): Promise<any> {
    return this.adminService.getAdminJobs(params);
  }

  @Patch('jobs/:id/status')
  updateJobStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ): Promise<any> {
    return this.adminService.updateJobStatus(id, status);
  }

  @Patch('jobs/:id/featured')
  toggleJobFeatured(
    @Param('id') id: string,
    @Body('featured') featured: boolean,
  ): Promise<any> {
    return this.adminService.toggleJobFeatured(id, featured);
  }

  @Delete('jobs/:id')
  deleteJob(@Param('id') id: string): Promise<any> {
    return this.adminService.deleteJob(id);
  }

  // ─── CV Scores ──────────────────────────────────────────────────────

  @Get('cv-scores')
  getCVScores(@Query() params: any): Promise<any> {
    return this.adminService.getCVScores(params);
  }

  @Delete('cv-scores/:id')
  deleteCVScore(@Param('id') id: string): Promise<any> {
    return this.adminService.deleteCVScore(id);
  }

  // ─── Notifications ──────────────────────────────────────────────────

  @Get('notifications')
  getNotifications(@Request() req, @Query() params: any): Promise<any> {
    return this.adminService.getNotifications(req.user._id.toString(), params);
  }

  @Patch('notifications/:id/read')
  markNotificationRead(@Param('id') id: string): Promise<any> {
    return this.adminService.markNotificationRead(id);
  }

  @Post('notifications/read-all')
  markAllNotificationsRead(@Request() req): Promise<any> {
    return this.adminService.markAllNotificationsRead(req.user._id.toString());
  }

  @Delete('notifications/:id')
  deleteNotification(@Param('id') id: string): Promise<any> {
    return this.adminService.deleteNotification(id);
  }

  @Post('notifications')
  createNotification(@Body() data: any): Promise<any> {
    return this.adminService.createNotification(data);
  }

  // ─── Settings ───────────────────────────────────────────────────────

  @Get('settings')
  getSettings(): Promise<any> {
    return this.adminService.getSettings();
  }

  @Patch('settings/:section')
  updateSettings(
    @Param('section') section: string,
    @Body() data: any,
  ): Promise<any> {
    return this.adminService.updateSettings(section, data);
  }
}
