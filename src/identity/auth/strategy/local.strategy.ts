import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {
    super({
      usernameField: 'providerId',
      passwordField: 'provider',
    });
  }

  async validate(providerId: number, provider: string): Promise<any> {
    return await this.userService.findUniqueProviderIdsOrThrow({
      providerId,
      provider,
    });
  }
}
