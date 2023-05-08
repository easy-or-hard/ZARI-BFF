import { Injectable } from '@nestjs/common';
import { CreateZariDto } from './dto/create-zari.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ZariService {
  constructor(private prisma: PrismaService) {}
  create(createZariDto: CreateZariDto) {
    return this.prisma.zari.create({ data: createZariDto });
  }

  findMyZari(id: number) {
    return this.prisma.zari.findMany({ where: { byeolId: id } });
  }

  findOne(id: number) {
    return this.prisma.zari.findFirstOrThrow({
      where: { id },
      include: { banzzacks: true },
    });
  }
}
