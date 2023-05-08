import { Module } from '@nestjs/common';
import { ByeolModule } from './core/byeol/byeol.module';
import { ZodiacModule } from './core/zodiac/zodiac.module';
import { BanzzackModule } from './core/banzzack/banzzack.module';
import { ZariModule } from './core/zari/zari.module';
import { PrismaModule } from 'nestjs-prisma';
import { AuthModule } from './identity/auth/auth.module';
import { UserModule } from './identity/user/user.module';
import { ConfigModule } from '@nestjs/config';

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
    ByeolModule,
    ZodiacModule,
    BanzzackModule,
    ZariModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
