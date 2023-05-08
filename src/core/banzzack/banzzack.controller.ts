import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BanzzackService } from './banzzack.service';
import { CreateBanzzackDto } from './dto/create-banzzack.dto';
import { UpdateBanzzackDto } from './dto/update-banzzack.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('banzzack')
@ApiTags('banzzack')
export class BanzzackController {
  constructor(private readonly banzzackService: BanzzackService) {}

  @Post()
  create(@Body() createBanzzackDto: CreateBanzzackDto) {
    return this.banzzackService.create(createBanzzackDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.banzzackService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateBanzzackDto: UpdateBanzzackDto,
  ) {
    return this.banzzackService.update(+id, updateBanzzackDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.banzzackService.remove(+id);
  }
}
