import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ZodiacService } from './zodiac.service';
import { CreateZodiacDto } from './dto/create-zodiac.dto';
import { UpdateZodiacDto } from './dto/update-zodiac.dto';
import { ZodiacEntity } from './entities/zodiac.entity';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

@Controller('zodiac')
@ApiTags('zodiac')
export class ZodiacController {
  constructor(private readonly zodiacService: ZodiacService) {}

  // TODO, 나중에 커스텀 별자리가 생기면 그때 사용해야 합니다. 지금은 사용하지 않습니다.
  @Post()
  @ApiCreatedResponse({ type: CreateZodiacDto })
  create(@Body() createZodiacDto: CreateZodiacDto) {
    return this.zodiacService.create(createZodiacDto);
  }

  @Get()
  @ApiCreatedResponse({ type: ZodiacEntity, isArray: true })
  findAll() {
    return this.zodiacService.findAll();
  }

  @Get(':id')
  @ApiCreatedResponse({ type: ZodiacEntity })
  findOne(@Param('id') id: number) {
    return this.zodiacService.findOne(+id);
  }

  // TODO, 별자리 수정기능은 커스텀 별자리에 한해서 수정이 돼야합니다.
  @Patch(':id')
  @ApiCreatedResponse({ type: UpdateZodiacDto })
  update(@Param('id') id: number, @Body() updateZodiacDto: UpdateZodiacDto) {
    return this.zodiacService.update(+id, updateZodiacDto);
  }

  // TODO, 커스텀 별자리에 대해서만 삭제가 돼야합니다.
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.zodiacService.remove(+id);
  }
}
