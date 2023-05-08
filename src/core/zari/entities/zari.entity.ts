import { ApiProperty } from '@nestjs/swagger';

export class Zari {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 5 })
  zodiacId: number;

  @ApiProperty({ example: 2 })
  byeolId: number;

  @ApiProperty({ example: '2021-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2021-01-01T00:00:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ example: true })
  isPublic: boolean;
}
