import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateControllerBanzzackDto } from './dto/create-controller-banzzack.dto';

@Injectable()
export class BanzzackService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: number,
    zariId: number,
    createControllerBanzzackDto: CreateControllerBanzzackDto,
  ) {
    const awaitUser = this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: {
        byeol: true,
      },
    });

    const awaitZari = this.prisma.zari.findUniqueOrThrow({
      where: { id: zariId },
      include: {
        banzzacks: true,
        constellation: true,
      },
    });

    const [foundUser, foundZari] = await Promise.all([awaitUser, awaitZari]);
    if (
      foundZari.banzzacks.length >= foundZari.constellation.constellationCount
    ) {
      throw new BadRequestException(
        '기록할 수 있는 반짝이의 수를 초과하였습니다.',
      );
    }

    return this.prisma.banzzack.create({
      data: {
        content: createControllerBanzzackDto.content,
        byeolId: foundUser.byeol.id,
        byeolName: foundUser.byeol.name,
        starNumber: foundZari.banzzacks.length + 1,
        zariId,
      },
    });
  }

  async delete(id: number, byeolId: number) {
    const foundBanzzack = await this.prisma.banzzack.findUniqueOrThrow({
      where: { id },
      include: {
        zari: {
          include: {
            byeol: true,
          },
        },
      },
    });

    if (
      byeolId === foundBanzzack.zari.byeolId ||
      byeolId === foundBanzzack.byeolId
    ) {
      return this.prisma.banzzack.delete({
        where: { id },
      });
    }

    throw new BadRequestException('작성자가 아닙니다. 삭제할 수 없습니다.');
  }

  async findById(id: number) {
    return this.prisma.banzzack.findUnique({
      where: { id },
    });
  }

  async update(
    id: number,
    byeolId: any,
    createControllerBanzzackDto: CreateControllerBanzzackDto,
  ) {
    const foundBanzzack = await this.prisma.banzzack.findUniqueOrThrow({
      where: { id },
      include: {
        zari: {
          include: {
            byeol: true,
          },
        },
      },
    });

    if (byeolId === foundBanzzack.byeolId) {
      return this.prisma.banzzack.update({
        where: { id },
        data: {
          content: createControllerBanzzackDto.content,
        },
      });
    }

    throw new BadRequestException('작성자가 아닙니다. 수정할 수 없습니다.');
  }
}
