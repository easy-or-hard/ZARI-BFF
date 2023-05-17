import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findUniqueProviderIdsOrThrow(provider_providerId: {
    providerId: number;
    provider: string;
  }) {
    return this.prisma.user.findUniqueOrThrow({
      where: { provider_providerId },
    });
  }

  async findByIdOrThrow(id: number) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id },
    });
  }

  async findOrCreateUser(createUserDto: CreateUserDto) {
    return this.prisma.user.upsert({
      where: {
        provider_providerId: {
          providerId: createUserDto.providerId,
          provider: createUserDto.provider,
        },
      },
      update: {},
      create: createUserDto,
    });
  }
}
