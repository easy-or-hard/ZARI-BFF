import { Injectable } from '@nestjs/common';
import { UpdateByeolDto } from './dto/update-byeol.dto';
import { PrismaService } from 'nestjs-prisma';
import { Byeol, UserRole } from '@prisma/client';

@Injectable()
export class ByeolService {
  constructor(private prisma: PrismaService) {}

  async create(userId, createByeolDto) {
    const { name, zariId } = createByeolDto;

    return await this.prisma.$transaction(async (tx) => {
      const createdByeol = tx.byeol.create({
        data: {
          name: name,
          zaris: {
            connect: { id: zariId },
          },
          users: {
            connect: { id: userId },
          },
        },
      });

      const updatedUser = tx.user.update({
        where: { id: userId },
        data: { role: UserRole.BYEOL },
      });

      await Promise.all([createdByeol, updatedUser]);

      return createdByeol;
    });
  }

  async findAll() {
    const byeols: Byeol[] = await this.prisma.byeol.findMany();
    return byeols;
  }

  async findOne(id: number) {
    const byeol: Byeol = await this.prisma.byeol.findUniqueOrThrow({
      where: { id },
      include: {
        zaris: true,
      },
    });
    return byeol;
  }

  update(id: number, updateByeolDto: UpdateByeolDto) {
    return this.prisma.byeol.update({
      where: { id },
      data: updateByeolDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.byeol.delete({ where: { id } });
  }

  async isNameDuplicate(name: string) {
    const byeol: Byeol = await this.prisma.byeol.findUniqueOrThrow({
      where: { name },
    });
    return !!byeol;
  }
}
