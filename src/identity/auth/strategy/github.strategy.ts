import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { UserService } from '../../user/user.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      clientID: configService.getOrThrow('GITHUB_CLIENT_ID'),
      clientSecret: configService.getOrThrow('GITHUB_CLIENT_SECRET'),
      callbackURL: configService.getOrThrow('GITHUB_CALLBACK_URL'),
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    const createUserDto: CreateUserDto = {
      provider: profile.provider,
      providerId: +profile.id,
      email: profile.emails[0]?.value,
    };

    const user = await this.userService.findOrCreateUser(createUserDto);
    done(null, user);
  }
}
