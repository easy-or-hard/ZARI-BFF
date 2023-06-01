import { BanzzackEntity } from '../../entities/banzzack.entity';
import { PickType } from '@nestjs/swagger';

export class CreatePatchBanzzackRequestDto extends PickType(BanzzackEntity, [
  'content',
  'starNumber',
  'zariId',
] as const) {}
