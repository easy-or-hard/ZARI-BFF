import { BaseResponseDto } from '../../../../lib/common/dto/response.dto';
import { ApiProperty } from '@nestjs/swagger';

export default class IsNameAvailableResponseDto implements BaseResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;
  @ApiProperty({ example: '이름을 사용할 수 있어요' })
  message: string;
  @ApiProperty({ example: true })
  data: boolean;
}
