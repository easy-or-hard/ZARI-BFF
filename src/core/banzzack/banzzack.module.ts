import { Module } from '@nestjs/common';
import { BanzzackService } from './banzzack.service';
import { ByeolModule } from '../byeol/byeol.module';

@Module({
  imports: [ByeolModule],
  providers: [BanzzackService],
  exports: [BanzzackService],
})
export class BanzzackModule {}
