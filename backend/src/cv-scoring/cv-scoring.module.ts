import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CvScoringService } from './cv-scoring.service';
import { CvScoringController } from './cv-scoring.controller';
import { JobsModule } from '../jobs/jobs.module';
import { CvScore, CvScoreSchema } from './schemas/cv-score.schema';

@Module({
  imports: [
    ConfigModule, 
    JobsModule,
    MongooseModule.forFeature([{ name: CvScore.name, schema: CvScoreSchema }])
  ],
  providers: [CvScoringService],
  controllers: [CvScoringController],
  exports: [CvScoringService]
})
export class CvScoringModule {}
