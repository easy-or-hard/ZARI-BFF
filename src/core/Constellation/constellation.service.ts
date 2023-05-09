import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ConstellationService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.constellation.findMany();
  }

  findOne(IAU: string) {
    return this.prisma.constellation.findFirst({ where: { IAU } });
  }
}
