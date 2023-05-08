import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.prismaService.user.create({
      data: createUserDto,
    });

    delete user.json;

    return user;
  }

  async findUniqueOrThrow(provider_providerId: any) {
    const user = await this.prismaService.user.findUniqueOrThrow({
      where: { provider_providerId },
    });

    delete user.json;

    return user;
  }

  async findUnique(provider_providerId: any) {
    const user = await this.prismaService.user.findUnique({
      where: { provider_providerId },
    });

    delete user.json;

    return user;
  }
}
