import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PatchByeolDto } from './dto/request/patch-byeol.dto';
import { PrismaService } from 'nestjs-prisma';
import { ConstellationService } from '../Constellation/constellation.service';
import { UserEntity } from '../../identity/user/entities/userEntity';

@Injectable()
export class ByeolService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly constellationService: ConstellationService,
  ) {}

  async findByName(name: string) {
    return this.findByUnique({ name });
  }

  async findByUnique(where: { id?: number; name?: string }) {
    return this.prisma.byeol.findUnique({
      where,
      include: {
        zaris: {
          select: {
            id: true,
            constellationIAU: true,
          },
        },
      },
    });
  }

  async findByIdOrThrow(id: number) {
    return this.prisma.byeol.findUniqueOrThrow({
      where: { id },
      include: {
        zaris: {
          select: {
            id: true,
            constellationIAU: true,
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
  async update(user: UserEntity, updateByeolDto: PatchByeolDto) {
    return this.prisma.byeol.update({
      where: { id: user.byeolId },
      data: updateByeolDto,
      include: {
        zaris: {
          select: {
            id: true,
            constellationIAU: true,
          },
        },
      },
    });
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

  findUniqueName(byeolName: string) {
    return this.prisma.byeol.findUnique({
      where: { name: byeolName },
      include: {
        zaris: true,
      },
    });
  }

  async findUniqueNameAndConstellationIAU(
    name: string,
    constellationIAU: string,
  ) {
    const byeol = await this.prisma.byeol.findUniqueOrThrow({
      where: { name },
      include: {
        zaris: {
          where: { constellationIAU },
          include: {
            banzzacks: {
              select: {
                id: true,
                starNumber: true,
              },
            },
          },
        },
      },
    });

    return byeol;
  }

  async notOwnerThenThrow(name: string, user: UserEntity) {
    const byeol = await this.prisma.byeol.findUnique({
      where: { name },
    });

    if (byeol.id !== user.byeolId)
      throw new UnauthorizedException('별의 소유자가 아닙니다.');
  }

  findBanzzacks(name, iau) {
    return this.prisma.byeol.findUnique({
      where: { name },
      select: {
        zaris: {
          where: { constellationIAU: iau },
          include: {
            banzzacks: true,
          },
        },
      },
    });
  }
}
