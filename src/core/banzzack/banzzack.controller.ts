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
import CreateBanzzackResponseDto from './dto/response/create-banzzack.response.dto';
import { ReadBanzzackResponseDto } from './dto/response/read-banzzack.response.dto';

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
    type: CreateBanzzackResponseDto,
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
    await this.banzzackService.create(createBanzzackServiceDto);

    return {
      statusCode: 201,
      message: '반짝이를 붙였어요',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: '반짝이 찾기' })
  @ApiCreatedResponse({
    type: ReadBanzzackResponseDto,
    description: '반짝이를 찾았어요',
  })
  async findById(@Param('id', ParseIntPipe) id: number) {
    const banzzack = await this.banzzackService.findById(id);
    return { statusCode: 200, message: '반짝이를 찾았어요', data: banzzack };
  }

  @Patch()
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiBearerAuth()
  @ApiOperation({ summary: '반짝이 바꾸기' })
  @ApiOkResponse({ description: '반짝이를 바꿨어요' })
  async update(
    @Req() req: Request,
    @Body() patchBanzzackRequestDto: CreatePatchBanzzackRequestDto,
  ) {
    const { byeolId } = req['user'];
    await this.banzzackService.update(byeolId, patchBanzzackRequestDto);

    return {
      statusCode: 200,
      message: '반짝이를 바꿨어요',
      data: true,
    };
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
