import { Controller, Get, Param } from '@nestjs/common';
import { ConstellationService } from './constellation.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConstellationEntity } from './entities/constellationEntity';

@Controller('constellation')
@ApiTags('별자리')
export class ConstellationController {
  constructor(private readonly constellationService: ConstellationService) {}

  @Get()
  @ApiOperation({ summary: '모든 별자리 찾기' })
  @ApiOkResponse({
    description: '모든 별자리를 찾았어요',
    type: ConstellationEntity,
    isArray: true,
  })
  async findAll() {
    return this.constellationService.findAll();
  }

  @Get(':constellationIAU')
  @ApiOperation({ summary: '별자리 하나 찾기' })
  @ApiOkResponse({
    description: '별자리를 찾았어요',
    type: ConstellationEntity,
  })
  async findOne(@Param('constellationIAU') constellationIAU: string) {
    return this.constellationService.findOne(constellationIAU);
  }
}
