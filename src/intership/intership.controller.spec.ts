import { Test, TestingModule } from '@nestjs/testing';
import { IntershipController } from './intership.controller';
import { IntershipService } from './intership.service';

describe('IntershipController', () => {
  let controller: IntershipController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IntershipController],
      providers: [IntershipService],
    }).compile();

    controller = module.get<IntershipController>(IntershipController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
