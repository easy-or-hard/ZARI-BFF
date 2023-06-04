import { PickType } from '@nestjs/swagger';
import { BanzzackEntity } from '../../entities/banzzack.entity';

export default class UpdateUniqueBanzzackDto extends PickType(BanzzackEntity, [
  'zariId',
  'starNumber',
  'content',
] as const) {}
