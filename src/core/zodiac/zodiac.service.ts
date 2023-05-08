import { Injectable } from '@nestjs/common';
import { CreateZodiacDto } from './dto/create-zodiac.dto';
import { UpdateZodiacDto } from './dto/update-zodiac.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ZodiacService {
  constructor(private prisma: PrismaService) {}

  create(createZodiacDto: CreateZodiacDto) {
    return this.prisma.zodiac.create({ data: createZodiacDto });
  }

  findAll() {
    return this.prisma.zodiac.findMany();
  }

  findOne(id: number) {
    return this.prisma.zodiac.findFirst({ where: { id } });
  }

  update(id: number, updateZodiacDto: UpdateZodiacDto) {
    return this.prisma.zodiac.update({
      where: { id },
      data: updateZodiacDto,
    });
  }

  remove(id: number) {
    return this.prisma.zodiac.delete({ where: { id } });
  }
}
