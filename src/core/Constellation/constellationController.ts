import { Controller, Get, Param } from '@nestjs/common';
import { ConstellationService } from './constellation.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import ReadConstellationResponseDto from './response/read-constellation.response.dto';
import ReadConstellationsResponseDto from './response/read-constellations.response.dto';

@Controller('constellation')
@ApiTags('별자리')
export class ConstellationController {
  constructor(private readonly constellationService: ConstellationService) {}

  @Get()
  @ApiOperation({ summary: '모든 별자리 찾기' })
  @ApiOkResponse({
    description: '모든 별자리를 찾았어요',
    type: ReadConstellationsResponseDto,
  })
  async findAll() {
    const constellations = await this.constellationService.findAll();
    return {
      statusCode: 200,
      message: '모든 별자리를 찾았어요',
      data: constellations,
    };
  }

  @Get(':IAU')
  @ApiOperation({ summary: '별자리 하나 찾기' })
  @ApiOkResponse({
    description: '별자리를 찾았어요',
    type: ReadConstellationResponseDto,
  })
  async findOne(@Param('IAU') IAU: string) {
    const constellation = await this.constellationService.findOne(IAU);
    return {
      statusCode: 200,
      message: '별자리 하나 찾았어요',
      data: constellation,
    };
  }
}
