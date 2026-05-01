import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { AuthModule } from '../auth/auth.module';
import { Job, JobSchema } from './schemas/job.schema';
import { Application, ApplicationSchema } from './schemas/application.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Job.name, schema: JobSchema },
      { name: 'Application', schema: ApplicationSchema },
    ]),
    AuthModule,
  ],
  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}
