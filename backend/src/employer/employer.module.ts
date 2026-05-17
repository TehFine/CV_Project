import { Module } from '@nestjs/common';
import { EmployerController } from './employer.controller';
import { EmployerService } from './employer.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Job, JobSchema } from '../jobs/schemas/job.schema';
import { ApplicationSchema } from '../jobs/schemas/application.schema';
import { CvScore, CvScoreSchema } from '../cv-scoring/schemas/cv-score.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Job.name, schema: JobSchema },
      { name: 'Application', schema: ApplicationSchema },
      { name: CvScore.name, schema: CvScoreSchema },
    ]),
  ],
  controllers: [EmployerController],
  providers: [EmployerService],
})
export class EmployerModule {}
