import { BanzzackEntity } from '../../entities/banzzack.entity';
import { PickType } from '@nestjs/swagger';

export class PostBanzzackDto extends PickType(BanzzackEntity, [
  'content',
] as const) {}
