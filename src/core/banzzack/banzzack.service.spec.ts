import { Test, TestingModule } from '@nestjs/testing';
import { BanzzackService } from './banzzack.service';

describe('BanzzackService', () => {
  let service: BanzzackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BanzzackService],
    }).compile();

    service = module.get<BanzzackService>(BanzzackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
