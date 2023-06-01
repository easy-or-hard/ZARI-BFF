import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'nestjs-prisma';
import { CreatePatchBanzzackRequestDto } from './dto/request/create-patch-banzzack.request.dto';
import { CreateBanzzackServiceDto } from './dto/service/create-banzzack.service.dto';

@Injectable()
export class BanzzackService {
  constructor(private prisma: PrismaService) {}

  async create(createBanzzackServiceDto: CreateBanzzackServiceDto) {
    try {
      return await this.prisma.banzzack.create({
        data: createBanzzackServiceDto,
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('이미 존재하는 반짝이입니다.');
      }
      throw e;
    }
  }

  async delete(id: number, byeolId: number) {
    const foundBanzzack = await this.prisma.banzzack.findUniqueOrThrow({
      where: { id },
      include: { zari: { select: { byeolId: true } } },
    });

    if (foundBanzzack.zari.byeolId === byeolId) {
      return this.prisma.banzzack.delete({
        where: { id },
      });
    }

    throw new BadRequestException('별자리의 주인만 삭제할 수 있어요');
  }

  async findById(id: number) {
    return this.prisma.banzzack.findUnique({
      where: { id },
    });
  }

  async update(
    byeolId: number,
    patchBanzzackRequestDto: CreatePatchBanzzackRequestDto,
  ) {
    const condition = {
      zariId: patchBanzzackRequestDto.zariId,
      starNumber: patchBanzzackRequestDto.starNumber,
    };
    const foundBanzzack = await this.prisma.banzzack.findUniqueOrThrow({
      where: { zariId_starNumber: condition },
      include: {
        zari: {
          include: {
            byeol: true,
          },
        },
      },
    });

    if (byeolId !== foundBanzzack.byeolId) {
      throw new BadRequestException('직접붙인 별만 수정 가능해요');
    }

    return this.prisma.banzzack.update({
      where: { zariId_starNumber: condition },
      data: {
        content: patchBanzzackRequestDto.content,
      },
    });
  }
}
