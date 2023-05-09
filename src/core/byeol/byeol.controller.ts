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
  ParseIntPipe,
  Res,
} from '@nestjs/common';
import { ByeolService } from './byeol.service';
import { CreateByeolDto } from './dto/create-byeol.dto';
import { UpdateByeolDto } from './dto/update-byeol.dto';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { ByeolEntity } from './entities/byeol.entity';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { UserRole } from '@prisma/client';
import { Role } from '../../identity/user/decorators/role.decorator';
import { RoleGuard } from '../../identity/auth/guards/role.guard';
import { AUTH } from '../../lib/consts';
import { AuthService } from '../../identity/auth/auth.service';
import { UserService } from '../../identity/user/user.service';

@Controller('byeol')
@ApiTags('byeol')
export class ByeolController {
  constructor(
    private readonly byeolService: ByeolService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  /**
   * 별을 생성합니다.
   * @param req
   * @param res
   * @param createByeolDto
   */
  @Post()
  @Role(UserRole.USER)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: '로그인 한 상태의 유저의 별을 생성합니다.',
    type: CreateByeolDto,
  })
  async create(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createByeolDto: CreateByeolDto,
  ) {
    const { id: userId } = req['user'];

    const [, roleUpdatedUser] = await this.byeolService.create(
      userId,
      createByeolDto,
    );
    const jwt = await this.authService.jwtSign(roleUpdatedUser);

    res.cookie(AUTH.JWT.ACCESS_TOKEN, jwt.access_token, {
      httpOnly: true,
      secure: true,
    });
    res.setHeader('Authorization', `Bearer ${jwt.access_token}`);
    res.send({ ...roleUpdatedUser, access_token: jwt.access_token });
  }

  /**
   * 나의 별 정보를 가져옵니다.
   * @param req
   */
  @Get()
  @Role(UserRole.BYEOL)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: '나의 별 정보를 가져옵니다.',
    type: ByeolEntity,
  })
  async findMyByeol(@Req() req: Request) {
    const { byeolId } = req['user'];
    return await this.byeolService.findById(byeolId);
  }

  /**
   * 별의 아이디로 하나의 정보를 가져옵니다.
   * @param byeolId
   */
  @Get('/id/:id')
  @ApiOkResponse({
    description: '별의 ID로 하나의 별 정보를 가져옵니다.',
    type: ByeolEntity,
  })
  async findById(@Param('id', ParseIntPipe) byeolId: number) {
    return await this.byeolService.findById(byeolId);
  }

  /**
   * 별의 이름으로 하나의 정보를 가져옵니다.
   * @param byeolName
   */
  @Get('/name/:name')
  @ApiOkResponse({
    description: '별의 이름으로 하나의 별 정보를 가져옵니다.',
    type: ByeolEntity,
  })
  async findByName(@Param('name') byeolName: string) {
    return await this.byeolService.findByName(byeolName);
  }

  /**
   * 별의 이름이 중복되는지 확인합니다.
   * @param name
   */
  @Get('is-name-available/:name')
  @ApiProperty({
    type: Boolean,
    description: '별의 이름으로 사용가능하면 응답코드 200을 반환합니다.',
  })
  @ApiOkResponse({
    description: '별의 이름으로 사용가능합니다.',
  })
  @ApiConflictResponse({
    description: '별의 이름으로 사용할 수 없습니다.',
  })
  async isNameAvailable(@Param('name') name: string) {
    return await this.byeolService.isNameAvailable(name);
  }

  /**
   * 별의 이름을 수정합니다.
   * @param req
   * @param updateByeolDto
   */
  @Patch()
  @Role(UserRole.BYEOL)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: '별을 수정했습니다.',
    type: ByeolEntity,
  })
  async update(@Req() req: Request, @Body() updateByeolDto: UpdateByeolDto) {
    const { byeolId } = req['user'];
    return await this.byeolService.update(byeolId, updateByeolDto);
  }

  /**
   * 별을 비활성화 합니다.
   * 현재 삭제 할 수 없고 비활성화 됩니다.
   * @param req
   * @param res
   */
  @Delete('/de-activate')
  @Role(UserRole.BYEOL)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: '별과 자리를 비활성화 했습니다.',
  })
  async deActivate(@Req() req: Request, @Res() res: Response) {
    const { id: userId, byeolId } = req['user'];
    await this.byeolService.deActivate(byeolId);
    const updatedUser = await this.userService.findById(userId);
    const jwt = await this.authService.jwtSign(updatedUser);

    res.cookie(AUTH.JWT.ACCESS_TOKEN, jwt.access_token, {
      httpOnly: true,
      secure: true,
    });
    res.setHeader('Authorization', `Bearer ${jwt.access_token}`);
    res.send({
      ...updatedUser,
      access_token: jwt.access_token,
      message: '별과 자리를 비활성화 했습니다.',
    });
  }

  /**
   * 비활성화 된 별을 활성화 합니다.
   * @param req
   * @param res
   */
  @Post('/activate')
  @Role(UserRole.USER)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: '별을 활성화 했습니다. 자리는 직접 활성화 하십시오.',
  })
  async activate(@Req() req: Request, @Res() res: Response) {
    const { id: userId, byeolId } = req['user'];
    await this.byeolService.activate(byeolId);
    const updatedUser = await this.userService.findById(userId);
    const jwt = await this.authService.jwtSign(updatedUser);

    res.cookie(AUTH.JWT.ACCESS_TOKEN, jwt.access_token, {
      httpOnly: true,
      secure: true,
    });
    res.setHeader('Authorization', `Bearer ${jwt.access_token}`);
    res.send({
      ...updatedUser,
      access_token: jwt.access_token,
      message: '별과 자리를 비활성화 했습니다.',
    });
  }
}
