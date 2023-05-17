import { BaseResponseDto } from '../../../../lib/common/dto/response.dto';
import { BanzzackEntity } from '../../entities/banzzack.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ReadBanzzackResponseDto implements BaseResponseDto {
  @ApiProperty({ example: 201 })
  statusCode: number;
  @ApiProperty({ example: '반짝이를 찾았어요' })
  message: string;
  @ApiProperty({ type: BanzzackEntity })
  data: BanzzackEntity;
}
