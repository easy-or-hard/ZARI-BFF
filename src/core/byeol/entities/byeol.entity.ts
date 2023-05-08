import { ApiProperty } from '@nestjs/swagger';
import { Byeol } from '@prisma/client';

export class ByeolEntity implements Byeol {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '킹태희' })
  name: string;

  @ApiProperty({ example: 1 })
  zodiacId: bigint;

  @ApiProperty({ example: '2021-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2021-01-01T00:00:00.000Z' })
  updatedAt: Date;
}
