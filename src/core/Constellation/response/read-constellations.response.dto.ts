import { BaseResponseDto } from '../../../lib/common/dto/response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ConstellationEntity } from '../entities/constellationEntity';

export default class ReadConstellationsResponseDto implements BaseResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;
  @ApiProperty({ example: '별자리를 찾앗어요' })
  message: string;
  @ApiProperty({ type: ConstellationEntity, isArray: true })
  data: ConstellationEntity[];
}
