import { PickType } from '@nestjs/swagger';
import { BanzzackEntity } from '../../entities/banzzack.entity';

export default class DeleteUniqueBanzzackDto extends PickType(BanzzackEntity, [
  'zariId',
  'starNumber',
] as const) {}
