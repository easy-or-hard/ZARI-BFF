import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  ParseIntPipe,
  Param,
  Delete,
  Get,
  Patch,
} from '@nestjs/common';
import { BanzzackService } from './banzzack.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '../../identity/user/decorators/role.decorator';
import { UserRole } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../../identity/auth/guards/role.guard';
import { CreateControllerBanzzackDto } from './dto/create-controller-banzzack.dto';
import { Request } from 'express';

@Controller('banzzack')
@ApiTags('banzzack')
export class BanzzackController {
  constructor(private readonly banzzackService: BanzzackService) {}

  @Post(':zariId')
  @Role(UserRole.BYEOL)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: CreateControllerBanzzackDto,
    description: '반짝이가 생성되었습니다.',
  })
  async create(
    @Req() req: Request,
    @Param('zariId', ParseIntPipe) zariId: number,
    @Body() createControllerBanzzackDto: CreateControllerBanzzackDto,
  ) {
    const { id: userId } = req['user'];
    return await this.banzzackService.create(
      userId,
      zariId,
      createControllerBanzzackDto,
    );
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.banzzackService.findById(id);
  }

  @Patch(':id')
  @Role(UserRole.BYEOL)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: '성공적으로 수정되었습니다.' })
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() createControllerBanzzackDto: CreateControllerBanzzackDto,
  ) {
    const { byeolId } = req['user'];
    return await this.banzzackService.update(
      id,
      byeolId,
      createControllerBanzzackDto,
    );
  }

  @Delete(':id')
  @Role(UserRole.BYEOL)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: '성공적으로 삭제되었습니다.' })
  async delete(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    const { byeolId } = req['user'];
    return await this.banzzackService.delete(id, byeolId);
  }
}
