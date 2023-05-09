import { PickType } from '@nestjs/swagger';
import { ZariEntity } from '../entities/zari.entity';

export class CreateZariDto extends PickType(ZariEntity, [
  'constellationIAU',
  'byeolId',
] as const) {}
