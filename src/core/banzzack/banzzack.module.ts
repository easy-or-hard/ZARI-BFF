import { Module } from '@nestjs/common';
import { BanzzackService } from './banzzack.service';
import { BanzzackController } from './banzzack.controller';

@Module({
  controllers: [BanzzackController],
  providers: [BanzzackService],
})
export class BanzzackModule {}
