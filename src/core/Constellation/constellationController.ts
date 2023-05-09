import { Controller, Get, Param } from '@nestjs/common';
import { ConstellationService } from './constellation.service';
import { ConstellationEntity } from './entities/constellationEntity';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

@Controller('Constellation')
@ApiTags('Constellation')
export class ConstellationController {
  constructor(private readonly constellationService: ConstellationService) {}

  @Get()
  @ApiCreatedResponse({ type: ConstellationEntity, isArray: true })
  findAll() {
    return this.constellationService.findAll();
  }

  @Get(':IAU')
  @ApiCreatedResponse({ type: ConstellationEntity })
  findOne(@Param('IAU') IAU: string) {
    return this.constellationService.findOne(IAU);
  }
}
