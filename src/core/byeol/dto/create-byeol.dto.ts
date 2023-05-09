import { ApiProperty, PickType } from '@nestjs/swagger';
import { ByeolEntity } from '../entities/byeol.entity';
import { MaxLength } from 'class-validator';

export class CreateByeolDto extends PickType(ByeolEntity, ['name'] as const) {
  @MaxLength(3)
  @ApiProperty({ example: 'Sgr', type: String, description: '별자리의 IAU' })
  constellationIAU: string;
}
