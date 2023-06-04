import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ZariService {
  constructor(private prisma: PrismaService) {}

  async findByIdOrThrow(id: number) {
    return this.prisma.zari.findUnique({
      where: { id },
      include: {
        banzzacks: true,
        byeol: true,
        constellation: true,
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

  async lockBanzzack(id: number, banzzackId: number) {
    
  }

  async releaseBanzzack(id: number, banzzackId: number) {
    
  }
}
