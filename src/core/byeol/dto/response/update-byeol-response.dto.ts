import { BaseResponseDto } from '../../../../lib/common/dto/response.dto';
import { ApiProperty } from '@nestjs/swagger';

export default class UpdateByeolResponseDto implements BaseResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;
  @ApiProperty({ example: '별 이름을 바꿨어요' })
  message: string;
}
