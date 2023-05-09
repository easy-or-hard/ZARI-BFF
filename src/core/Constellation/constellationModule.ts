import { Module } from '@nestjs/common';
import { ConstellationService } from './constellation.service';
import { ConstellationController } from './constellationController';

@Module({
  controllers: [ConstellationController],
  providers: [ConstellationService],
})
export class ConstellationModule {}
