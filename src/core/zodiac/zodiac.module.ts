import { Module } from '@nestjs/common';
import { ZodiacService } from './zodiac.service';
import { ZodiacController } from './zodiac.controller';

@Module({
  controllers: [ZodiacController],
  providers: [ZodiacService],
})
export class ZodiacModule {}
