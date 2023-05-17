import { PickType } from '@nestjs/swagger';
import { ByeolEntity } from '../../entities/byeol.entity';

export class UpdateByeolRequestDto extends PickType(ByeolEntity, [
  'name',
] as const) {}
