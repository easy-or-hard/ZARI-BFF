import { ApiProperty } from '@nestjs/swagger';
import { Zodiac } from '@prisma/client';

export class ZodiacEntity implements Zodiac {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '사수' })
  symbol: string;

  @ApiProperty({ example: '11-22' })
  startMonthDay: string;

  @ApiProperty({ example: '12-21' })
  endMonthDay: string;

  @ApiProperty({ example: '2021-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2021-01-01T00:00:00.000Z' })
  updatedAt: Date;
}
