import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ConfigService } from '@nestjs/config';

// GITHUB_CLIENT_ID=5c80ecfa2f8cd74cce11
// GITHUB_CLIENT_SECRET=30356e498570e9160a93916f69cc5a1fc7155b25
// GITHUB_CALLBACK_URL=http://localhost:3000/auth/github/callback

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private readonly configService: ConfigService) {
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
    const user = {
      provider: profile.provider,
      providerId: Number(profile.id),
      email: profile.emails[0]?.value,
      json: profile,
    };

    done(null, user);
  }
}
