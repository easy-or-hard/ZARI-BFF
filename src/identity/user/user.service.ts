import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'nestjs-prisma';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.prismaService.user.create({
      data: createUserDto,
    });
  }

  async findUniqueProviderIdsOrThrow(providerIds: {
    providerId: number;
    provider: string;
  }) {
    return this.prismaService.user.findUniqueOrThrow({
      where: { provider_providerId: providerIds },
    });
  }

  async findUniqueProviderIds(providerIds: {
    providerId: number;
    provider: string;
  }) {
    return this.prismaService.user.findUnique({
      where: { provider_providerId: providerIds },
    });
  }

  async findById(userId): Promise<User> {
    return this.prismaService.user.findUnique({
      where: { id: userId },
    });
  }

  async findByIdOrThrow(userId: any) {
    return this.prismaService.user.findUniqueOrThrow({
      where: { id: userId },
    });
  }

  async findOrCreateUser(createUserDto: CreateUserDto) {
    return this.prismaService.user.upsert({
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
