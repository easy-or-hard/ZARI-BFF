import { Test, TestingModule } from '@nestjs/testing';
import { ZariController } from './zari.controller';
import { ZariService } from './zari.service';

describe('ZariController', () => {
  let controller: ZariController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ZariController],
      providers: [ZariService],
    }).compile();

    controller = module.get<ZariController>(ZariController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
