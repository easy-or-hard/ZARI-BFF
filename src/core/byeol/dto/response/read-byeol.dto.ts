import { ApiProperty } from '@nestjs/swagger';
import IncludeZariByeolDto from '../include-zari-byeol.dto';
import { BaseResponseDto } from '../../../../lib/common/dto/response.dto';

export default class ReadByeolDto implements BaseResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;
  @ApiProperty({ example: '별을 찾앗어요' })
  message: string;
  @ApiProperty({ type: IncludeZariByeolDto })
  data: IncludeZariByeolDto;
}
