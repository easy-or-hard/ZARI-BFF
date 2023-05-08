import { Injectable } from '@nestjs/common';
import { CreateBanzzackDto } from './dto/create-banzzack.dto';
import { UpdateBanzzackDto } from './dto/update-banzzack.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class BanzzackService {
  constructor(private prisma: PrismaService) {}

  async create(createBanzzackDto: CreateBanzzackDto) {
    return this.prisma.banzzack.create({ data: createBanzzackDto });
  }

  findOne(id: number) {
    return `This action returns a #${id} banzzack`;
  }

  update(id: number, updateBanzzackDto: UpdateBanzzackDto) {
    return `This action updates a #${id} ${updateBanzzackDto} banzzack`;
  }

  remove(id: number) {
    return `This action removes a #${id} banzzack`;
  }
}
