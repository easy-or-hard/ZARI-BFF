import { ZariEntity } from '../entities/zari.entity';
import { ApiProperty } from '@nestjs/swagger';
import { BanzzackEntity } from '../../banzzack/entities/banzzack.entity';
import { ConstellationEntity } from '../../Constellation/entities/constellationEntity';
import { ByeolEntity } from '../../byeol/entities/byeol.entity';

export class IncludeConstellationByeolBanzzackZari extends ZariEntity {
  @ApiProperty({ type: ConstellationEntity })
  constellation: ConstellationEntity;
  @ApiProperty({ type: BanzzackEntity })
  byeol: ByeolEntity;
  @ApiProperty({ type: BanzzackEntity, isArray: true })
  banzzacks: BanzzackEntity[];
}
