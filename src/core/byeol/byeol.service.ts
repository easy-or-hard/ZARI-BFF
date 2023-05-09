import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateByeolDto } from './dto/update-byeol.dto';
import { PrismaService } from 'nestjs-prisma';
import { UserRole } from '@prisma/client';
import { CreateByeolDto } from './dto/create-byeol.dto';

@Injectable()
export class ByeolService {
  constructor(private prisma: PrismaService) {}

  async create(userId, createByeolDto: CreateByeolDto) {
    const { name, constellationIAU } = createByeolDto;

    return this.prisma.$transaction(async (tx) => {
      const createdByeol = tx.byeol.create({
        data: {
          name: name,
          zaris: {
            create: {
              constellationIAU,
            },
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

      return Promise.all([createdByeol, updatedUser]);
    });
  }

  async findById(id: number) {
    return this.findByUniqueOrThrow({ id });
  }

  async findByName(name: string) {
    return this.findByUniqueOrThrow({ name });
  }

  async findByUniqueOrThrow(where: { id?: number; name?: string }) {
    const byeol = await this.prisma.byeol.findUniqueOrThrow({
      where,
      include: {
        zaris: true,
      },
    });

    if (!byeol.isActivate) {
      throw new NotFoundException('비활성화 된 별입니다.');
    }

    return byeol;
  }

  /**
   * 별을 업데이트 합니다.
   * @param id
   * @param updateByeolDto
   */
  async update(id: number, updateByeolDto: UpdateByeolDto) {
    return this.prisma.byeol.update({
      where: { id },
      data: updateByeolDto,
    });
  }

  /**
   * 별의 이름이 사용가능하면 트루를 반환합니다.
   * 사용 불가능하면 예외를 발생시킵니다.
   * @param name
   */
  async isNameAvailable(name: string) {
    const byeol = await this.prisma.byeol.findUnique({
      where: { name },
    });

    if (byeol) {
      throw new ConflictException('이미 존재하는 별 이름입니다.');
    }

    return true;
  }

  /**
   * 별을 비활성화 합니다.
   * 유저의 롤은 별 레벨에서 유저 레벨로
   * 별은 활성화 상태를 펄스로
   * @param id
   */
  async deActivate(id: number) {
    return this.prisma.$transaction(async (tx) => {
      const updatedByeol = await tx.byeol.update({
        where: { id },
        data: {
          isActivate: false,
        },
        include: {
          zaris: true,
          users: true,
        },
      });

      const roleUpdatedUser = tx.user.updateMany({
        where: { byeolId: id },
        data: { role: UserRole.USER },
      });

      tx.zari.updateMany({
        where: { byeolId: id },
        data: {
          isPublic: false,
        },
      });

      return Promise.all([updatedByeol, roleUpdatedUser]);
    });
  }

  /**
   * 비활성화 된 별과 유저를 활성화 합니다.
   * 유저는 롤을 별로
   * 별은 활성화 상태를 트루로
   * @param id
   */
  async activate(id: number) {
    return this.prisma.$transaction(async (tx) => {
      const updatedByeol = await tx.byeol.update({
        where: { id },
        data: {
          isActivate: true,
        },
        include: {
          zaris: true,
          users: true,
        },
      });

      const roleUpdatedUser = tx.user.updateMany({
        where: { byeolId: id },
        data: { role: UserRole.BYEOL },
      });

      return Promise.all([updatedByeol, roleUpdatedUser]);
    });
  }
}
