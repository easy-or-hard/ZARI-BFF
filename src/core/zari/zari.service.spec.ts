import { Test, TestingModule } from '@nestjs/testing';
import { ZariService } from './zari.service';

describe('ZariService', () => {
  let service: ZariService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ZariService],
    }).compile();

    service = module.get<ZariService>(ZariService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
