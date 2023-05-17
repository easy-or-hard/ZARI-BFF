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
import ReadZarisResponseDto from './dto/response/read-zaris.response.dto';
import ReadZariResponseDto from './dto/response/read-zari.response.dto';

@Controller('zari')
@ApiTags('zari')
export class ZariController {
  constructor(private readonly zariService: ZariService) {}

  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 자리 찾기' })
  @ApiOkResponse({
    description: '내 자리를 찾았어요',
    type: ReadZarisResponseDto,
  })
  async findMyZari(@Req() req: Request) {
    const { id: userId } = req['user'];
    const zaris = await this.zariService.findMyZaris(userId);
    return { statusCode: 200, message: '내 자리를 찾았어요', data: zaris };
  }

  @Get(':id')
  @ApiOperation({ summary: '자리 하나 찾기' })
  @ApiOkResponse({ description: '자리를 찾았어요', type: ReadZariResponseDto })
  async findById(@Param('id', ParseIntPipe) id: number) {
    const zari = await this.zariService.findByIdOrThrow(id);
    return { statusCode: 200, message: '자리를 찾았어요', data: zari };
  }
}
