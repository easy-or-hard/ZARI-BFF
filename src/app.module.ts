import { Module } from '@nestjs/common';
import { ByeolModule } from './core/byeol/byeol.module';
import { ConstellationModule } from './core/Constellation/constellationModule';
import { BanzzackModule } from './core/banzzack/banzzack.module';
import { ZariModule } from './core/zari/zari.module';
import { PrismaModule } from 'nestjs-prisma';
import { AuthModule } from './identity/auth/auth.module';
import { UserModule } from './identity/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    ConstellationModule,
    ByeolModule,
    ZariModule,
    UserModule,
    BanzzackModule,
    GatewayModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
