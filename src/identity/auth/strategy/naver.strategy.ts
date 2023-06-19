import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../../user/dto/service/input/create-user.dto';
import { UserService } from '../../user/user.service';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      clientID: configService.getOrThrow('NAVER_CLIENT_ID'),
      clientSecret: configService.getOrThrow('NAVER_CLIENT_SECRET'),
      callbackURL: configService.getOrThrow('NAVER_CALLBACK_URL'),
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (err: any, user: any, info?: any) => void,
  ) {
    const createUserDto: CreateUserDto = {
      provider: profile.provider,
      providerId: profile.id + '',
      email: profile.emails?.[0]?.value,
      displayName: profile.displayName,
    };

    const includeByeolUser = await this.userService.findOrCreateUser(
      createUserDto,
    );

    done(null, includeByeolUser);
  }
}
