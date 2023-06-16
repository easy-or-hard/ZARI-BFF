import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../../user/dto/service/input/create-user.dto';
import { UserService } from '../../user/user.service';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.getOrThrow('GITHUB_CLIENT_ID'),
      clientSecret: configService.getOrThrow('GITHUB_CLIENT_SECRET'),
      callbackURL: configService.getOrThrow('GITHUB_CALLBACK_URL'),
      scope: ['user:email'],
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    const createUserDto: CreateUserDto = {
      provider: profile.provider,
      providerId: Number(profile.id),
      email: profile.emails[0]?.value,
      displayName: profile.displayName,
    };

    const includeByeolUser = await this.userService.findOrCreateUser(
      createUserDto,
    );

    // SSE 를 찾기 위한 키, UUID 가 들어있습니다.
    const { state } = req.query;
    if (state) {
      this.authService.signedIn(state as string, includeByeolUser);
    }

    done(null, includeByeolUser);
  }
}
