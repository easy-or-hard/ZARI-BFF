import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'nestjs-prisma';
import { CreateBanzzackServiceDto } from './dto/service/create-banzzack.service.dto';
import UpdateBanzzackDto from './dto/service/update-banzzack.dto';

@Injectable()
export class BanzzackService {
  constructor(private prisma: PrismaService) {}

  async create(createBanzzackServiceDto: CreateBanzzackServiceDto) {
    try {
      return this.prisma.banzzack.create({
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
}
