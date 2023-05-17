import { ZariEntity } from '../entities/zari.entity';
import { ApiProperty } from '@nestjs/swagger';
import { BanzzackEntity } from '../../banzzack/entities/banzzack.entity';

export class IncludeBanzzackZari extends ZariEntity {
  @ApiProperty({ type: BanzzackEntity, isArray: true })
  banzzacks: BanzzackEntity[];
}
