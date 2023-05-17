import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../../../../lib/common/dto/response.dto';
import { ZariEntity } from '../../entities/zari.entity';

export default class ReadZarisResponseDto implements BaseResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;
  @ApiProperty({ example: '자리를 찾앗어요' })
  message: string;
  @ApiProperty({ type: ZariEntity, isArray: true })
  data: ZariEntity[];
}
