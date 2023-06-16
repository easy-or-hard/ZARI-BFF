import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { PostByeolZariByDateDto } from '../byeol/dto/request/post-byeol-zari-by-date.dto';
import { UserEntity } from '../../identity/user/entities/userEntity';
import { ConstellationService } from '../Constellation/constellation.service';
import { UniqueZariDto } from './dto/service/unique-zari.dto';

@Injectable()
export class ZariService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly constellationService: ConstellationService,
  ) {}

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

  deleteUniqueByeolIdConstellationIAUZari(unique: UniqueZariDto) {
    return this.prisma.zari.delete({
      where: { byeolId_constellationIAU: unique },
    });
  }
  createByUnique(user: UserEntity, constellationIAU: string) {
    const data = {
      constellationIAU,
      byeolId: user.byeolId,
    };

    return this.prisma.zari.create({ data });
  }

  async createByDate(user: UserEntity, date: PostByeolZariByDateDto) {
    const constellation = await this.constellationService.findByDateOrThrow(
      date,
    );

    return this.createByUnique(user, constellation.IAU);
  }

  async findByByeolName(name: string) {
    return this.prisma.byeol.findUnique({
      where: { name },
      include: { zaris: true },
    });
  }

  async findByByeolNameAndConstellationIAU(
    name: string,
    constellationIAU: string,
  ) {
    const { zaris } = await this.prisma.byeol.findUniqueOrThrow({
      where: { name },
      select: {
        zaris: { where: { constellationIAU }, select: { id: true } },
      },
    });

    return this.prisma.zari.findUnique({
      where: { id: zaris[0].id },
      include: { banzzacks: true, constellation: true },
    });
  }
}
