import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ZariService {
  constructor(private prisma: PrismaService) {}

  async findByIdOrThrow(id: number) {
    return this.prisma.zari.findFirstOrThrow({
      where: { id, isPublic: true },
      include: {
        banzzacks: true,
      },
    });
  }

  async findMyZaris(userId: number) {
    const foundUser = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: {
        byeol: { include: { zaris: true } },
      },
    });

    return foundUser.byeol.zaris;
  }
}
