import { Module } from '@nestjs/common';
import { BanzzackService } from './banzzack.service';
import { ByeolModule } from '../byeol/byeol.module';
import { BanzzackController } from './banzzack.controller';

@Module({
  imports: [ByeolModule],
  controllers: [BanzzackController],
  providers: [BanzzackService],
  exports: [BanzzackService],
})
export class BanzzackModule {}
