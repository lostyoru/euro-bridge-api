import { Test, TestingModule } from '@nestjs/testing';
import { IntershipService } from './intership.service';

describe('IntershipService', () => {
  let service: IntershipService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IntershipService],
    }).compile();

    service = module.get<IntershipService>(IntershipService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
