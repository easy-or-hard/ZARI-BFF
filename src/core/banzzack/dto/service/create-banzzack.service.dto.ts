import { BanzzackEntity } from '../../entities/banzzack.entity';
import { PickType } from '@nestjs/swagger';

export class CreateBanzzackServiceDto extends PickType(BanzzackEntity, [
  'byeolId',
  'byeolName',
  'content',
  'starNumber',
  'zariId',
] as const) {}
