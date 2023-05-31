import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../../../../lib/common/dto/response.dto';
import { IncludeConstellationByeolBanzzackZari } from '../include-banzzack-zari.dto';

export default class ReadZariResponseDto implements BaseResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;
  @ApiProperty({ example: '자리를 찾앗어요' })
  message: string;
  @ApiProperty({ type: IncludeConstellationByeolBanzzackZari })
  data: IncludeConstellationByeolBanzzackZari;
}
