import { BaseResponseDto } from '../../../../lib/common/dto/response.dto';
import { ApiProperty } from '@nestjs/swagger';

export default class CreateByeolResponseDto implements BaseResponseDto {
  @ApiProperty({ example: 201 })
  statusCode: number;
  @ApiProperty({ example: '별을 만들었어요' })
  message: string;
}
