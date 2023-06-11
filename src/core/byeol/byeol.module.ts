import { Module } from '@nestjs/common';
import { ByeolService } from './byeol.service';
import { ByeolController } from './byeol.controller';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../../identity/auth/auth.module';
import { ConstellationModule } from '../Constellation/constellation.module';
import { ByeolZariController } from './byoel-zari.controller';
import { ByeolZariBanzzackController } from './byeol-zari-banzzack.controller';
import { ZariModule } from '../zari/zari.module';
import { BanzzackModule } from '../banzzack/banzzack.module';
import { ZariService } from '../zari/zari.service';
import { BanzzackService } from '../banzzack/banzzack.service';

@Module({
  imports: [
    PassportModule,
    AuthModule,
    // BanzzackModule,
    // ZariModule,
    ConstellationModule,
  ],
  controllers: [
    ByeolController,
    ByeolZariController,
    ByeolZariBanzzackController,
  ],
  providers: [ByeolService, ZariService, BanzzackService],
  exports: [ByeolService],
})
export class ByeolModule {}
