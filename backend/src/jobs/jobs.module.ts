import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { AuthModule } from '../auth/auth.module';
import { Job, JobSchema } from './schemas/job.schema';
import { Application, ApplicationSchema } from './schemas/application.schema';
import { CvScore, CvScoreSchema } from '../cv-scoring/schemas/cv-score.schema';
import { Notification, NotificationSchema } from '../admin/schemas/notification.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [
    AdminModule,
    MongooseModule.forFeature([
      { name: Job.name, schema: JobSchema },
      { name: 'Application', schema: ApplicationSchema },
      { name: CvScore.name, schema: CvScoreSchema },
      { name: Notification.name, schema: NotificationSchema },
      { name: User.name, schema: UserSchema },
    ]),
    AuthModule,
  ],
  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}
