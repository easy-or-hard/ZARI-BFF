import { BaseResponseDto } from '../../../../lib/common/dto/response.dto';
import { ApiProperty } from '@nestjs/swagger';

export default class CreateBanzzackResponseDto implements BaseResponseDto {
  @ApiProperty({ example: 201 })
  statusCode: number;
  @ApiProperty({ example: '반짝이를 붙였어요' })
  message: string;
}
