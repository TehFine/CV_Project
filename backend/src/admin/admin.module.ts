import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Job, JobSchema } from '../jobs/schemas/job.schema';
import { Application, ApplicationSchema } from '../jobs/schemas/application.schema';
import { CvScore, CvScoreSchema } from '../cv-scoring/schemas/cv-score.schema';
import { Notification, NotificationSchema } from './schemas/notification.schema';
import { NotificationsGateway } from './gateways/notifications.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Job.name, schema: JobSchema },
      { name: Application.name, schema: ApplicationSchema },
      { name: CvScore.name, schema: CvScoreSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService, NotificationsGateway],
  exports: [AdminService, NotificationsGateway],
})
export class AdminModule {}
