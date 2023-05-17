import { BaseResponseDto } from '../../../../lib/common/dto/response.dto';
import { ApiProperty } from '@nestjs/swagger';

export default class UpdateBanzzackResponseDto implements BaseResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;
  @ApiProperty({ example: '반짝이를 바꿨어요' })
  message: string;
}
