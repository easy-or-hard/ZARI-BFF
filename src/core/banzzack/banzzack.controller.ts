import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BanzzackService } from './banzzack.service';
import { BanzzackEntity } from './entities/banzzack.entity';

@Controller('banzzacks')
@ApiTags('반짝')
export class BanzzackController {
  constructor(private readonly banzzackService: BanzzackService) {}

  /**
   * 반짝이 정보를 가져옵니다
   * @param id
   */
  @Get(':id')
  @ApiOperation({ summary: '반짝이 찾기' })
  @ApiOkResponse({
    description: '반짝이를 찾았어요',
    type: BanzzackEntity,
  })
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.banzzackService.findById(id);
  }
}
