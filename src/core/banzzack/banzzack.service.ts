import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateBanzzackDto } from './dto/service/create-banzzack.dto';
import UpdateBanzzackDto from './dto/service/update-banzzack.dto';
import UpdateUniqueBanzzackDto from './dto/service/update-unique-banzzack.dto';
import DeleteUniqueBanzzackDto from './dto/service/delete-unique-banzzack.dto';
import { UserEntity } from '../../identity/user/entities/userEntity';
import { BanzzackEntity } from './entities/banzzack.entity';

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

  async findBanzzack(byeolName: string, iau: string, starNumber: number) {
    if (!byeolName || !iau || !starNumber) {
      const defaultBanzzack: BanzzackEntity = {
        id: 0,
        content:
          '안녕하세요!\n' +
          '자리에 함께 할 수 있어서 기뻐요~\n' +
          '\n' +
          '친구와 함께 반짝이를 붙이면서 나의 자리를 완성해보세요!\n' +
          '별자리가 완성되면 특별한 이벤트도 볼 수 있어요!\n' +
          '우측 상단의 링크 아이콘을 눌러 링크를 복사하세요!\n' +
          '\n' +
          '이 반짝이는 자동으로 삭제돼요 :D\n' +
          'Have a good talk!',
        byeolId: 0,
        byeolName: 'ZARI admin',
        zariId: 0,
        starNumber: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return defaultBanzzack;
    }
    const byeol = await this.prisma.byeol.findUnique({
      where: { name: byeolName },
      select: {
        id: true,
      },
    });

    const zari = await this.prisma.zari.findUnique({
      where: {
        byeolId_constellationIAU: { byeolId: byeol.id, constellationIAU: iau },
      },
    });

    const condition = {
      zariId: zari.id,
      starNumber,
    };

    return this.prisma.banzzack.findUnique({
      where: { zariId_starNumber: condition },
    });
  }

  async createBanzzack(
    user: UserEntity,
    byeolName: string,
    iau: string,
    starNumber: number,
    content: string,
  ) {
    const [targetByeol, writerByeol] = await Promise.all([
      this.prisma.byeol.findUnique({
        where: { name: byeolName },
        select: {
          id: true,
        },
      }),
      this.prisma.byeol.findUnique({
        where: { id: user.byeolId },
        select: {
          name: true,
        },
      }),
    ]);

    const zari = await this.prisma.zari.findUnique({
      where: {
        byeolId_constellationIAU: {
          byeolId: targetByeol.id,
          constellationIAU: iau,
        },
      },
    });

    return this.prisma.banzzack.create({
      data: {
        byeolId: user.byeolId,
        byeolName: writerByeol.name,
        zariId: zari.id,
        starNumber,
        content,
      },
    });
  }

  async deleteBanzzack(
    user: UserEntity,
    byeolName: string,
    iau: string,
    starNumber: number,
  ) {
    const byeol = await this.prisma.byeol.findUnique({
      where: { name: byeolName },
      select: {
        id: true,
      },
    });

    const zari = await this.prisma.zari.findUnique({
      where: {
        byeolId_constellationIAU: { byeolId: byeol.id, constellationIAU: iau },
      },
    });

    const condition = {
      zariId: zari.id,
      starNumber,
    };

    const banzzack = await this.prisma.banzzack.findUnique({
      where: { zariId_starNumber: condition },
    });

    // TODO, 관리자도 뗄수 있게 변경하기
    if (banzzack.byeolId !== user.byeolId) {
      throw new BadRequestException('별자리의 주인만 땔 수 있어요');
    }

    return this.prisma.banzzack.delete({
      where: { zariId_starNumber: condition },
    });
  }
}
