import { ApiProperty } from '@nestjs/swagger';
import { Byeol } from '@prisma/client';
import { IsNumber, IsString, MaxLength } from 'class-validator';

export class ByeolEntity implements Byeol {
  @IsNumber()
  @ApiProperty({ example: 1, type: Number })
  id: number;

  @IsString()
  @MaxLength(16)
  @ApiProperty({ example: '킹태희', type: String })
  name: string;

  @ApiProperty({ example: '2021-01-01T00:00:00.000Z', type: Date })
  createdAt: Date;

  @ApiProperty({ example: '2021-01-01T00:00:00.000Z', type: Date })
  updatedAt: Date;

  @ApiProperty({ example: true, type: Boolean })
  isActivate: boolean;
}
