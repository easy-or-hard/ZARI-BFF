import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PatchByeolDto } from './dto/request/patch-byeol.dto';
import { PrismaService } from 'nestjs-prisma';
import { UserEntity } from '../../identity/user/entities/userEntity';

@Injectable()
export class ByeolService {
  constructor(private readonly prisma: PrismaService) {}

  async findByUnique(where: { id?: number; name?: string }) {
    return this.prisma.byeol.findUnique({
      where,
      include: {
        zaris: true,
      },
    });
  }

  async findByIdOrThrow(user: UserEntity) {
    const id = user.byeolId;
    return this.prisma.byeol.findUniqueOrThrow({
      where: { id },
      include: {
        zaris: true,
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
        zaris: true,
      },
    });
  }

  /**
   * 별의 이름이 사용 불가능하면 예외를 발생시킵니다.
   * @param name
   */
  async canNotUseNameThenThrow(name: string) {
    const byeol = await this.findByUnique({ name });

    if (byeol) {
      throw new ConflictException('누군가 사용중이에요');
    }
  }

  async notOwnerThenThrow(name: string, user: UserEntity) {
    const byeol = await this.prisma.byeol.findUnique({
      where: { name },
    });

    if (byeol.id !== user.byeolId)
      throw new UnauthorizedException('별의 소유자가 아닙니다.');
  }
}
