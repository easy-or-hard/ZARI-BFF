import {
  Controller,
  Get,
  Param,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { ZariService } from './zari.service';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ZariEntity } from './entities/zari.entity';
import { Role } from '../../identity/user/decorators/role.decorator';
import { UserRole } from '@prisma/client';
import { RoleGuard } from '../../identity/auth/guards/role.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('zari')
@ApiTags('zari')
export class ZariController {
  constructor(private readonly zariService: ZariService) {}

  @Get()
  @Role(UserRole.BYEOL)
  @UseGuards(AuthGuard('jwt'), AuthGuard('jwt'), RoleGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ZariEntity, isArray: true })
  async findMyZari(@Req() req: Request) {
    const { id: userId } = req['user'];
    return await this.zariService.findMyZari(userId);
  }

  @Get(':id')
  @ApiCreatedResponse({ type: ZariEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.zariService.findById(id);
  }
}
