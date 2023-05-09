import { BanzzackEntity } from '../entities/banzzack.entity';
import { PickType } from '@nestjs/swagger';

export class CreateControllerBanzzackDto extends PickType(BanzzackEntity, [
  'content',
] as const) {}
