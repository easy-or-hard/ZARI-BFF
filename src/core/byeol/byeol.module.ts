import { Module } from '@nestjs/common';
import { ByeolService } from './byeol.service';
import { ByeolController } from './byeol.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PassportModule],
  controllers: [ByeolController],
  providers: [ByeolService],
})
export class ByeolModule {}
