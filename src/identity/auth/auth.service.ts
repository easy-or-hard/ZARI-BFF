import { Injectable } from '@nestjs/common';
import { GithubStrategy } from './strategy/github.strategy';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly githubStrategy: GithubStrategy,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async jwtSign(user: any) {
    const payload = {
      id: user.id,
      byeolId: user.byeolId,
      providerId: user.providerId,
      provider: user.provider,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async authenticateUserWithoutSignUp(createUserDto: CreateUserDto) {
    let user = await this.userService.findUnique({
      providerId: createUserDto.providerId,
      provider: createUserDto.provider,
    });

    if (!user) {
      user = await this.userService.create(createUserDto);
    }

    return user;
  }

  async signIn(user) {
    const payload = { id: user.id };
    return this.jwtService.sign(payload);
  }

  async signUp(createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }
}
