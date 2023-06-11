import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import ReadUserResponseDto from './dto/controller/response/read-user-response.dto';
import { UserEntity } from './entities/userEntity';

@Controller('user')
@ApiTags('유저')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '유저 찾기' })
  @ApiOkResponse({ type: UserEntity, description: '유저를 찾았어요' })
  async findAll(@Req() req: Request) {
    const { id } = req['user'];
    return this.userService.findByIdOrThrow(id);
  }
}
