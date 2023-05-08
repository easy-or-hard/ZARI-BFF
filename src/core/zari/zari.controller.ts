import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ZariService } from './zari.service';
import { CreateZariDto } from './dto/create-zari.dto';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Zari } from './entities/zari.entity';

@Controller('zari')
@ApiTags('zari')
export class ZariController {
  constructor(private readonly zariService: ZariService) {}

  @Post()
  @ApiCreatedResponse({ type: CreateZariDto })
  create(@Body() createZariDto: CreateZariDto) {
    return this.zariService.create(createZariDto);
  }

  @Get('myZari/:id')
  @ApiCreatedResponse({ type: Zari, isArray: true })
  findMyZari(@Param('id') id: number) {
    return this.zariService.findMyZari(+id);
  }

  @Get(':id')
  @ApiCreatedResponse({ type: Zari })
  findOne(@Param('id') id: number) {
    return this.zariService.findOne(+id);
  }
}
