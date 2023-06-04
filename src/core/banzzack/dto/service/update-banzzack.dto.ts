import { PickType } from '@nestjs/swagger';
import { BanzzackEntity } from '../../entities/banzzack.entity';

export default class UpdateBanzzackDto extends PickType(BanzzackEntity, [
  'id',
  'content',
] as const) {}
