import { Test, TestingModule } from '@nestjs/testing';
import { CvScoringService } from './cv-scoring.service';

describe('CvScoringService', () => {
  let service: CvScoringService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CvScoringService],
    }).compile();

    service = module.get<CvScoringService>(CvScoringService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
