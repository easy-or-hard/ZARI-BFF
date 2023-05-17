import { Banzzack } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class BanzzackEntity implements Banzzack {
  @ApiProperty({ example: 1, type: Number })
  id: number;
  @ApiProperty({ example: '당신은 정말 별 같아요.', type: String })
  content: string;
  @ApiProperty({ example: 1, type: Number })
  byeolId: number;
  @ApiProperty({
    example: '킹태희',
    type: String,
    description: '반짝이를 입력당시의 별 이름을 기록합니다.',
  })
  byeolName: string;
  @ApiProperty({ example: 14, type: Number, description: '소속 별의 갯수' })
  starNumber: number;
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({ example: 1, type: Number })
  zariId: number;
  @ApiProperty({ example: '2021-01-01T00:00:00.000Z', type: Date })
  createdAt: Date;
  @ApiProperty({ example: '2021-01-01T00:00:00.000Z', type: Date })
  updatedAt: Date;
}
