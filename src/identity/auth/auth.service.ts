import { Injectable } from '@nestjs/common';
import { GithubStrategy } from './strategy/github.strategy';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly githubStrategy: GithubStrategy,
    private readonly jwtService: JwtService,
  ) {}

  jwtSign(user: any) {
    return {
      access_token: this.jwtService.sign(user),
      // refresh_token: // TODO, 리프레시 토큰도 발급하고 로직을 구현해야함
    };
  }

  verifyJwt(jwt: any) {
    return this.jwtService.verify(jwt);
  }
}
