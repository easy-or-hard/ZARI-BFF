import { Injectable } from '@nestjs/common';
import { GithubStrategy } from './strategy/github.strategy';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly githubStrategy: GithubStrategy,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async jwtSign(user: User) {
    return {
      access_token: this.jwtService.sign(user),
    };
  }

  async create(createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
