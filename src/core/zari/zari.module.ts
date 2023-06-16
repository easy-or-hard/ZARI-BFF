import { Module } from '@nestjs/common';
import { ZariService } from './zari.service';
import { ConstellationModule } from '../Constellation/constellation.module';

@Module({
  imports: [ConstellationModule],
  providers: [ZariService],
  exports: [ZariService],
})
export class ZariModule {}
