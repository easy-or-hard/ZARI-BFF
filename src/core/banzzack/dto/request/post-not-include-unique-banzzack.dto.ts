import { PickType } from '@nestjs/swagger';
import { BanzzackEntity } from '../../entities/banzzack.entity';

export default class PostNotIncludeUniqueBanzzackDto extends PickType(
  BanzzackEntity,
  ['content'] as const,
) {}
