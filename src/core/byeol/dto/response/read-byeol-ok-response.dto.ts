import { BaseResponseDto } from '../../../../lib/common/dto/response.dto';
import { ApiProperty } from '@nestjs/swagger';
import IncludeZariByeolDto from '../include-zari-byeol.dto';

export class ReadByeolOkResponseDto implements BaseResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;
  @ApiProperty({ example: '별을 찾았어요' })
  message: string;
  @ApiProperty({ type: IncludeZariByeolDto })
  data: IncludeZariByeolDto;
}
