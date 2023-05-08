import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ByeolService } from './byeol.service';
import { CreateByeolDto } from './dto/create-byeol.dto';
import { UpdateByeolDto } from './dto/update-byeol.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { ByeolEntity } from './entities/byeol.entity';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UserRole } from '@prisma/client';
import { Role } from '../../identity/user/decorators/role.decorator';
import { RoleGuard } from '../../identity/auth/guards/role.guard';

@Controller('byeol')
@ApiTags('byeol')
export class ByeolController {
  constructor(private readonly byeolService: ByeolService) {}

  @Post()
  @Role(UserRole.USER)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @ApiCreatedResponse({
    description: '로그인 한 상태의 유저의 별을 생성합니다.',
    type: CreateByeolDto,
  })
  @ApiBearerAuth()
  create(@Req() req: Request, @Body() createByeolDto: CreateByeolDto) {
    const { id } = req['user'];
    return this.byeolService.create(id, createByeolDto);
  }

  @Get()
  @ApiCreatedResponse({
    description: '자신이 생성한 별자리 목록을 가져옵니다.',
    type: ByeolEntity,
    isArray: true,
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  findAll() {
    return this.byeolService.findAll();
  }

  @Get(':id')
  @ApiCreatedResponse({
    description: '하나의 별자리를 가져옵니다.',
    type: ByeolEntity,
  })
  findOne(@Param('id') id: number) {
    return this.byeolService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateByeolDto: UpdateByeolDto) {
    return this.byeolService.update(+id, updateByeolDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.byeolService.remove(+id);
  }

  @Get('check-duplicate/:name')
  @ApiProperty({ type: Boolean })
  async isNameDuplicate(@Param('name') name: string) {
    return await this.byeolService.isNameDuplicate(name);
  }
}
