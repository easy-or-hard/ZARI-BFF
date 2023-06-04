import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ZariService } from './zari.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ZariEntity } from './entities/zari.entity';
import { IncludeConstellationByeolBanzzackZari } from './dto/include-banzzack-zari.dto';

@Controller('zari')
@ApiTags('자리')
export class ZariController {
  constructor(private readonly zariService: ZariService) {}

  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 자리 찾기' })
  @ApiOkResponse({
    description: '내 자리를 찾았어요',
    type: ZariEntity,
    isArray: true,
  })
  async findMyZari(@Req() req: Request) {
    const { id: userId } = req['user'];
    return this.zariService.findMyZaris(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: '자리 하나 찾기' })
  @ApiOkResponse({
    description: '자리를 찾았어요',
    type: IncludeConstellationByeolBanzzackZari,
  })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.zariService.findByIdOrThrow(id);
  }
}
