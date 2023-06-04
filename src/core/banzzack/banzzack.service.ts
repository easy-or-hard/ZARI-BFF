import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'nestjs-prisma';
import { CreateBanzzackDto } from './dto/service/create-banzzack.dto';
import UpdateBanzzackDto from './dto/service/update-banzzack.dto';
import UpdateUniqueBanzzackDto from './dto/service/update-unique-banzzack.dto';
import DeleteUniqueBanzzackDto from './dto/service/delete-unique-banzzack.dto';

@Injectable()
export class BanzzackService {
  constructor(private prisma: PrismaService) {}

  async create(createBanzzackDto: CreateBanzzackDto) {
    return this.prisma.banzzack.create({
      data: createBanzzackDto,
    });
  }

  async delete(id: number, byeolId: number) {
    const foundBanzzack = await this.prisma.banzzack.findUniqueOrThrow({
      where: { id },
      include: { zari: { select: { byeolId: true } } },
    });

    if (foundBanzzack.zari.byeolId !== byeolId) {
      throw new BadRequestException('별자리의 주인만 땔 수 있어요');
    }

    return this.prisma.banzzack.delete({
      where: { id },
    });
  }

  async findById(id: number) {
    return this.prisma.banzzack.findUnique({
      where: { id },
    });
  }

  async update(byeolId: number, updateBanzzackDto: UpdateBanzzackDto) {
    const condition = {
      id: updateBanzzackDto.id,
    };
    const foundBanzzack = await this.prisma.banzzack.findUniqueOrThrow({
      where: condition,
      include: {
        zari: {
          include: {
            byeol: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (byeolId !== foundBanzzack.byeolId) {
      throw new BadRequestException('직접붙인 별만 수정 가능해요');
    }

    return this.prisma.banzzack.update({
      where: condition,
      data: {
        content: updateBanzzackDto.content,
      },
    });
  }

  async findUnique(findByUniqueKey: { zariId: number; starNumber: number }) {
    return this.prisma.banzzack.findUnique({
      where: { zariId_starNumber: findByUniqueKey },
    });
  }

  async updateUnique(
    byeolId: number,
    updateUniqueBanzzackDto: UpdateUniqueBanzzackDto,
  ) {
    const condition = {
      zariId_starNumber: {
        zariId: updateUniqueBanzzackDto.zariId,
        starNumber: updateUniqueBanzzackDto.starNumber,
      },
    };

    const foundBanzzack = await this.prisma.banzzack.findUniqueOrThrow({
      where: condition,
      include: {
        zari: {
          include: {
            byeol: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (byeolId !== foundBanzzack.byeolId) {
      throw new BadRequestException('직접붙인 별만 수정 가능해요');
    }

    return this.prisma.banzzack.update({
      where: condition,
      data: {
        content: updateUniqueBanzzackDto.content,
      },
    });
  }

  async deleteUnique(
    byeolId: number,
    deleteUniqueBanzzackDto: DeleteUniqueBanzzackDto,
  ) {
    const condition = { zariId_starNumber: deleteUniqueBanzzackDto };

    const foundBanzzack = await this.prisma.banzzack.findUniqueOrThrow({
      where: condition,
      include: { zari: { select: { byeolId: true } } },
    });

    if (foundBanzzack.zari.byeolId !== byeolId) {
      throw new BadRequestException('별자리의 주인만 땔 수 있어요');
    }

    return this.prisma.banzzack.delete({
      where: condition,
    });
  }
}
