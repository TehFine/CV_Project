import { Test, TestingModule } from '@nestjs/testing';
import { CvScoringController } from './cv-scoring.controller';

describe('CvScoringController', () => {
  let controller: CvScoringController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CvScoringController],
    }).compile();

    controller = module.get<CvScoringController>(CvScoringController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
