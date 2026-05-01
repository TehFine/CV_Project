import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  async findAll(@Query() query: any) {
    return this.jobsService.findAll(query);
  }

  @Get('categories')
  async getCategories() {
    return this.jobsService.getCategories();
  }

  @Post('seed')
  async seed() {
    return this.jobsService.seedData();
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-applications')
  async getMyApplications(@Request() req) {
    return this.jobsService.getMyApplications(req.user._id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @Post()
  async create(@Body() createJobDto: any) {
    const employerId = 'mock_employer_id'; 
    return this.jobsService.create(createJobDto, employerId);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateJobDto: any) {
    return this.jobsService.update(id, updateJobDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.jobsService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/apply')
  async apply(@Param('id') id: string, @Request() req, @Body() data: any) {
    return this.jobsService.apply(id, req.user._id, data);
  }
}
