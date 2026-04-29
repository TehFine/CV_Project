import { Injectable } from '@nestjs/common';

@Injectable()
export class EmployerService {
  async getDashboardStats() {
    // Mock data to match frontend requirements
    return {
      total_jobs: 12,
      active_jobs: 8,
      total_applications: 156,
      pending_applications: 42,
      total_views: 12500,
      applications_chart: [
        { date: '22/04', count: 12 },
        { date: '23/04', count: 18 },
        { date: '24/04', count: 15 },
        { date: '25/04', count: 25 },
        { date: '26/04', count: 20 },
        { date: '27/04', count: 30 },
        { date: '28/04', count: 28 },
      ],
      status_breakdown: {
        pending: 42,
        reviewing: 35,
        interview: 15,
        offered: 8,
        rejected: 56,
      },
    };
  }

  async getJobs() {
    return { data: [] };
  }

  async getJob(id: string) {
    return {
      id,
      title: 'Vị trí đang tuyển',
    };
  }

  async getApplications(jobId: string) {
    return { data: [] };
  }

  async updateApplicationStatus(appId: string, status: string) {
    return { success: true };
  }
}
