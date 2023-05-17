import { Module } from '@nestjs/common';
import { BanzzackService } from './banzzack.service';
import { BanzzackController } from './banzzack.controller';
import { ByeolModule } from '../byeol/byeol.module';

@Module({
  imports: [ByeolModule],
  controllers: [BanzzackController],
  providers: [BanzzackService],
})
export class BanzzackModule {}
