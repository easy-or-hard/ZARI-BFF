import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { Byeol } from '@prisma/client';
import { IsNumber, IsString, MaxLength } from 'class-validator';
import { ZariEntity } from '../../zari/entities/zari.entity';

class OmitZariEntity extends OmitType(ZariEntity, ['banzzacks'] as const) {}

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

  @ApiProperty({ type: OmitZariEntity, isArray: true })
  zaris: OmitZariEntity[];
}
