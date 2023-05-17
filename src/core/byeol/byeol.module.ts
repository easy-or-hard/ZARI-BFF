import { Module } from '@nestjs/common';
import { ByeolService } from './byeol.service';
import { ByeolController } from './byeol.controller';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../../identity/auth/auth.module';
import { ConstellationModule } from '../Constellation/constellationModule';

@Module({
  imports: [PassportModule, AuthModule, ConstellationModule],
  controllers: [ByeolController],
  providers: [ByeolService],
  exports: [ByeolService],
})
export class ByeolModule {}
