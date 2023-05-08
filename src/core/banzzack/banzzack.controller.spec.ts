import { Test, TestingModule } from '@nestjs/testing';
import { BanzzackController } from './banzzack.controller';
import { BanzzackService } from './banzzack.service';

describe('BanzzackController', () => {
  let controller: BanzzackController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BanzzackController],
      providers: [BanzzackService],
    }).compile();

    controller = module.get<BanzzackController>(BanzzackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
