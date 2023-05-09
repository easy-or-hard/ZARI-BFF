import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GithubStrategy } from './strategy/github.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserService } from '../user/user.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from './strategy/local.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '365d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    UserService,
    AuthService,
    GithubStrategy,
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [PassportModule, AuthService, UserService],
})
export class AuthModule {}
