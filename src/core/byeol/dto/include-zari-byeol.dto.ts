import { ByeolEntity } from '../entities/byeol.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ZariEntity } from '../../zari/entities/zari.entity';

export default class IncludeZariByeolDto extends ByeolEntity {
  @ApiProperty({ type: ZariEntity, isArray: true })
  zaris: ZariEntity[];
}
