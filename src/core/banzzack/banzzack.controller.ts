import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BanzzackService } from './banzzack.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreatePatchBanzzackRequestDto } from './dto/request/create-patch-banzzack.request.dto';
import { Request } from 'express';
import { CreateBanzzackServiceDto } from './dto/service/create-banzzack.service.dto';
import { ByeolService } from '../byeol/byeol.service';
import { BanzzackEntity } from './entities/banzzack.entity';
import { PatchBanzzackDto } from './dto/request/patch-banzzack.dto';
import UpdateBanzzackDto from './dto/service/update-banzzack.dto';

@Controller('banzzack')
@ApiTags('반짝')
export class BanzzackController {
  constructor(
    private readonly banzzackService: BanzzackService,
    private readonly byeolService: ByeolService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: '반짝이 붙이기' })
  @ApiCreatedResponse({
    type: BanzzackEntity,
    description: '반짝이를 붙였어요',
  })
  async create(
    @Req() req: Request,
    @Body() createBanzzackRequestDto: CreatePatchBanzzackRequestDto,
  ) {
    const { byeolId } = req['user'];
    const { name: byeolName } = await this.byeolService.findById(byeolId);
    const createBanzzackServiceDto: CreateBanzzackServiceDto = {
      byeolId,
      byeolName,
      ...createBanzzackRequestDto,
    };
    return this.banzzackService.create(createBanzzackServiceDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '반짝이 찾기' })
  @ApiCreatedResponse({
    type: BanzzackEntity,
    description: '반짝이를 찾았어요',
  })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.banzzackService.findById(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiBearerAuth()
  @ApiOperation({ summary: '반짝이 바꾸기' })
  @ApiOkResponse({ description: '반짝이를 바꿨어요', type: BanzzackEntity })
  async update(
    @Param('id', ParseIntPipe) id,
    @Req() req: Request,
    @Body() patchBanzzackDto: PatchBanzzackDto,
  ) {
    const { byeolId } = req['user'];
    const updateBanzzackDto: UpdateBanzzackDto = {
      id: +id,
      content: patchBanzzackDto.content,
    };
    return await this.banzzackService.update(byeolId, updateBanzzackDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '반짝이 때기' })
  @ApiOkResponse({ description: '반짝이를 땟어요' })
  async delete(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    const { byeolId } = req['user'];
    return await this.banzzackService.delete(id, byeolId);
  }
}
