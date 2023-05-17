import { OkResponseDto } from '../../../../lib/common/dto/response.dto';
import { UserEntity } from '../../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export default class ReadUserResponseDto implements OkResponseDto<UserEntity> {
  @ApiProperty({ example: 200 })
  statusCode: number;
  @ApiProperty({ type: UserEntity, description: '유저 정보' })
  data: UserEntity;
  @ApiProperty({ example: '유저가 있어요' })
  message: string;
}
