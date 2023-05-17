import { Controller, Get, Param } from '@nestjs/common';
import { ConstellationService } from './constellation.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import ReadConstellationResponseDto from './response/read-constellation.response.dto';
import ReadConstellationsResponseDto from './response/read-constellations.response.dto';

@Controller('constellation')
@ApiTags('constellation')
export class ConstellationController {
  constructor(private readonly constellationService: ConstellationService) {}

  @Get()
  @ApiOperation({ summary: '별자리 찾기' })
  @ApiOkResponse({
    description: '별자리를 찾았어요',
    type: ReadConstellationsResponseDto,
  })
  findAll() {
    return this.constellationService.findAll();
  }

  @Get(':IAU')
  @ApiOperation({ summary: '별자리 하나 찾기' })
  @ApiOkResponse({
    description: '별자리를 찾았어요',
    type: ReadConstellationResponseDto,
  })
  findOne(@Param('IAU') IAU: string) {
    return this.constellationService.findOne(IAU);
  }
}
