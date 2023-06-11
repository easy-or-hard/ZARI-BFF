import { Module } from '@nestjs/common';
import { ZariService } from './zari.service';

@Module({
  providers: [ZariService],
  exports: [ZariService],
})
export class ZariModule {}
