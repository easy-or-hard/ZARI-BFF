import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../../user/dto/service/input/create-user.dto';
import { UserService } from '../../user/user.service';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      clientID: configService.getOrThrow('KAKAO_CLIENT_ID'),
      clientSecret: configService.getOrThrow('KAKAO_CLIENT_SECRET'),
      callbackURL: configService.getOrThrow('KAKAO_CALLBACK_URL'),
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
