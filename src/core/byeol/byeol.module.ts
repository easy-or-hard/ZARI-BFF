import { Module } from '@nestjs/common';
import { ByeolService } from './byeol.service';
import { ByeolController } from './byeol.controller';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../../identity/auth/auth.module';

@Module({
  imports: [PassportModule, AuthModule],
  controllers: [ByeolController],
  providers: [ByeolService],
})
export class ByeolModule {}
