import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ConstellationService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.constellation.findMany();
  }

  async findOne(IAU: string) {
    return this.prisma.constellation.findUniqueOrThrow({ where: { IAU } });
  }

  /**
   * 결과가 받드시 나와야하고,
   * 별자리 데이터가 비었거나, 날짜를 잘못 입력했을 경우 에러를 던진다.
   * @param birthMonth
   * @param birthDay
   */
  async findByDateOrThrow({
    birthMonth,
    birthDay,
  }: {
    birthMonth: number;
    birthDay: number;
  }) {
    const constellation = await this.prisma.constellation.findFirst({
      where: {
        OR: [
          {
            AND: [
              {
                startMonth: {
                  equals: birthMonth,
                },
              },
              {
                startDay: {
                  lte: birthDay,
                },
              },
            ],
          },
          {
            AND: [
              {
                endMonth: {
                  equals: birthMonth,
                },
              },
              {
                endDay: {
                  gte: birthDay,
                },
              },
            ],
          },
        ],
      },
      select: {
        IAU: true,
      },
    });

    if (!constellation) {
      throw new NotFoundException('별자리 데이터가 없습니다.');
    }

    return constellation;
  }
}
