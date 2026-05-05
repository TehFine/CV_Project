import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CvScoringService } from './cv-scoring.service';
import { CvScoringController } from './cv-scoring.controller';
import { JobsModule } from '../jobs/jobs.module';

@Module({
  imports: [ConfigModule, JobsModule],
  providers: [CvScoringService],
  controllers: [CvScoringController],
  exports: [CvScoringService]
})
export class CvScoringModule {}
