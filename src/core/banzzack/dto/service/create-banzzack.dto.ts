import { BanzzackEntity } from '../../entities/banzzack.entity';
import { PickType } from '@nestjs/swagger';

export class CreateBanzzackDto extends PickType(BanzzackEntity, [
  'byeolId',
  'byeolName',
  'content',
  'starNumber',
  'zariId',
] as const) {}
