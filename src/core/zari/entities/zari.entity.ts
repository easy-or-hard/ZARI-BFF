import { ApiProperty } from '@nestjs/swagger';
import { Zari } from '@prisma/client';
import { BanzzackEntity } from '../../banzzack/entities/banzzack.entity';
import { ConstellationEntity } from '../../Constellation/entities/constellationEntity';

export class ZariEntity implements Zari {
  @ApiProperty({ example: 1, type: Number })
  id: number;
  @ApiProperty({ example: 1, type: Number })
  ConstellationId: number;
  @ApiProperty({ example: 1, type: Number })
  byeolId: number;
  @ApiProperty({ example: true, type: Boolean, default: true })
  isPublic: boolean;
  @ApiProperty({ example: '2021-01-01T00:00:00.000Z', type: Date })
  createdAt: Date;
  @ApiProperty({ example: '2021-01-01T00:00:00.000Z', type: Date })
  updatedAt: Date;
  @ApiProperty({ example: 'Sgr', type: String })
  constellationIAU: string;

  @ApiProperty({ type: BanzzackEntity, isArray: true })
  banzzacks: BanzzackEntity[];

  @ApiProperty({ type: ConstellationEntity })
  constellation: ConstellationEntity;
}
