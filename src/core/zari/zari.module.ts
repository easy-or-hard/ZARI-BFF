import { Module } from '@nestjs/common';
import { ZariService } from './zari.service';
import { ZariController } from './zari.controller';

@Module({
  controllers: [ZariController],
  providers: [ZariService],
})
export class ZariModule {}
