import { BanzzackEntity } from '../../entities/banzzack.entity';
import { PickType } from '@nestjs/swagger';

export class CreateBanzzackRequestDto extends PickType(BanzzackEntity, [
  'content',
  'starNumber',
  'zariId',
] as const) {}
