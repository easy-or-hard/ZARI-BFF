import { Injectable } from '@nestjs/common';
import { GithubStrategy } from './strategy/github.strategy';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly githubStrategy: GithubStrategy,
    private readonly jwtService: JwtService,
  ) {}

  async jwtSign(user: any) {
    return {
      access_token: this.jwtService.sign(user),
    };
  }
}
