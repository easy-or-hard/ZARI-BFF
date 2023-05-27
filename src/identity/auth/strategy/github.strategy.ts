import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { UserService } from '../../user/user.service';
import { Request } from 'express';
import { SignInGateway } from '../../../gateway/sign-in.gateway';
import { User } from '@prisma/client';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly signInGateway: SignInGateway,
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
    };

    const user: User = await this.userService.findOrCreateUser(createUserDto);

    // 소켓 통신을 위한 상태값, UUID 가 들어있습니다.
    const { state } = req.query;
    if (state) {
      if (user.byeolId) {
        await this.signInGateway.alreadyHaveAccount(state);
      } else {
        await this.signInGateway.newAccount(state);
      }
    }

    done(null, user);
  }
}
