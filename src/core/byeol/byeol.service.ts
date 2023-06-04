import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateByeolRequestDto } from './dto/request/update-byeol.request.dto';
import { PrismaService } from 'nestjs-prisma';
import { CreateByeolRequestDto } from './dto/request/create-byeol.request.dto';
import { ConstellationService } from '../Constellation/constellation.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ByeolService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly constellationService: ConstellationService,
  ) {}

  async create(userId, createByeolDto: CreateByeolRequestDto) {
    const { name, birthMonth, birthDay } = createByeolDto;

    const constellation = await this.constellationService.findByDateOrThrow({
      birthMonth,
      birthDay,
    });

    try {
      await this.prisma.byeol.create({
        data: {
          name: name,
          zaris: {
            create: {
              constellationIAU: constellation.IAU,
            },
          },
          users: {
            connect: { id: userId },
          },
        },
      });
    } catch (e) {
      if (!(e instanceof Prisma.PrismaClientKnownRequestError)) {
        throw e;
      }

      switch (e.code) {
        case 'P2002':
          throw new ConflictException('누군가 사용중이에요');
        case 'P2016':
          throw new NotFoundException('유저를 찾을 수 없어요');
        default:
          throw e;
      }
    }
  }

  async findById(id: number) {
    return this.findByUnique({ id });
  }

  async findByName(name: string) {
    return this.findByUnique({ name });
  }

  async findByUnique(where: { id?: number; name?: string }) {
    return this.prisma.byeol.findUnique({
      where,
      include: {
        zaris: true,
      },
    });
  }

  async findByIdOrThrow(id: number) {
    return this.prisma.byeol.findUniqueOrThrow({
      where: { id },
      include: { zaris: true },
    });
  }

  async findByNameOrThrow(name: string) {
    return this.findByUniqueOrThrow({ name });
  }

  async findByUniqueOrThrow(where: { id?: number; name?: string }) {
    return this.prisma.byeol.findUniqueOrThrow({
      where,
      include: {
        zaris: {
          include: {
            banzzacks: true,
          },
        },
      },
    });
  }

  /**
   * 별을 업데이트 합니다.
   * @param id
   * @param updateByeolDto
   */
  async update(id: number, updateByeolDto: UpdateByeolRequestDto) {
    return this.prisma.byeol.update({
      where: { id },
      data: updateByeolDto,
    });
  }

  async hasFoundByIdThenThrow(byeolId: number) {
    const byeol = await this.findById(byeolId);

    if (byeol) {
      throw new BadRequestException('이미 별이 있어요');
    }
  }

  async hasNotFoundByIdThenThrow(byeolId: number) {
    const byeol = await this.findById(byeolId);

    if (byeol) {
      throw new NotFoundException('별이 없어요');
    }
  }

  /**
   * 별의 이름이 사용 불가능하면 예외를 발생시킵니다.
   * @param name
   */
  async canNotUseNameThenThrow(name: string) {
    const byeol = await this.findByName(name);

    if (byeol) {
      throw new ConflictException('누군가 사용중이에요');
    }
  }

  /**
   * 별을 비활성화 합니다.
   * @param id
   */
  async deactivate(id: number) {
    const updatedByeol = this.prisma.byeol.update({
      where: { id },
      data: {
        isActivate: false,
      },
    });

    const updatedZari = this.prisma.zari.updateMany({
      where: { byeolId: id },
      data: {
        isPublic: false,
      },
    });

    await this.prisma.$transaction([updatedByeol, updatedZari]);
    return updatedByeol;
  }

  /**
   * 비활성화 된 별과 유저를 활성화 합니다.
   * @param id
   */
  async activate(id: number) {
    this.prisma.byeol.update({
      where: { id },
      data: {
        isActivate: true,
      },
    });
  }
}
