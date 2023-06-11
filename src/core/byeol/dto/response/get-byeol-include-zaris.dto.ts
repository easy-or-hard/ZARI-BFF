import { ByeolEntity } from '../../entities/byeol.entity';
import { PickType } from '@nestjs/swagger';
import { ZariEntity } from '../../../zari/entities/zari.entity';

class ZariUnique extends PickType(ZariEntity, [
  'id',
  'constellationIAU',
] as const) {}

export default class GetByeolIncludeZarisDto extends ByeolEntity {
  zaris: ZariUnique[];
}
