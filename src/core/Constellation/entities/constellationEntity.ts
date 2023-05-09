import { ApiProperty } from '@nestjs/swagger';
import { Constellation } from '@prisma/client';

/**
 * TODO, CONSTELLATION 의 객체를 만드는 방법이 생기면 이 주석을 변경해주세요.
 * 현재 이 객체를 만들 수 있는 방법은 쿼리 입력 밖에 없습니다.
 *
 */
export class ConstellationEntity implements Constellation {
  @ApiProperty({ example: '궁수', type: String })
  name: string;

  @ApiProperty({ example: 'Sgr', type: String })
  IAU: string;

  @ApiProperty({ example: 6, type: Number, description: '별자리 별의 개수' })
  constellationCount: number;

  @ApiProperty({ example: 1, type: Number, description: '별자리의 시작 월' })
  startMonth: number;

  @ApiProperty({ example: 1, type: Number, description: '별자리의 시작 일' })
  startDay: number;

  @ApiProperty({ example: 1, type: Number, description: '별자리의 끝 월' })
  endMonth: number;

  @ApiProperty({ example: 1, type: Number, description: '별자리의 끝 일' })
  endDay: number;

  @ApiProperty({ example: '2021-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2021-01-01T00:00:00.000Z' })
  updatedAt: Date;
}
