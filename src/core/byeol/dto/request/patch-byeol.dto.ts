import { PickType } from '@nestjs/swagger';
import { ByeolEntity } from '../../entities/byeol.entity';

export class PatchByeolDto extends PickType(ByeolEntity, [
  'name',
] as const) {}
