import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/service/input/create-user.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findUniqueProviderIdsOrThrow(provider_providerId: {
    providerId: string;
    provider: string;
  }) {
    return this.prisma.user.findUniqueOrThrow({
      where: { provider_providerId },
    });
  }

  async findByIdOrThrow(id: number) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id },
      include: { byeol: true },
    });
  }

  /**
   * 유저의 생성은 곧 별의 생성
   * @param createUserDto
   */
  async findOrCreateUser(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        provider_providerId: {
          providerId: createUserDto.providerId,
          provider: createUserDto.provider,
        },
      },
      include: { byeol: true },
    });
    if (user) {
      return user;
    }

    let uniqueName = createUserDto.displayName;
    while (true) {
      const foundUser = await this.prisma.byeol.findUnique({
        where: { name: uniqueName },
        select: { name: true },
      });

      if (foundUser) {
        const uniqueCode = this.generateShortCode(4);
        uniqueName = `${createUserDto.displayName}${uniqueCode}`;
      } else {
        break;
      }
    }

    return this.prisma.user.create({
      data: {
        provider: createUserDto.provider,
        providerId: createUserDto.providerId,
        email: createUserDto.email,
        byeol: {
          create: {
            name: uniqueName,
          },
        },
      },
      include: { byeol: true },
    });
  }

  generateShortCode(length: number): string {
    const characters = '0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return result;
  }
}
