import { UserEntity } from '../../../entities/userEntity';
import { ByeolEntity } from '../../../../../core/byeol/entities/byeol.entity';
import { ApiProperty } from '@nestjs/swagger';

export class IncludeByeolUserDto extends UserEntity {
  @ApiProperty({ type: ByeolEntity, description: '별 정보' })
  byeol: ByeolEntity;
}
