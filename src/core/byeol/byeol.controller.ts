import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ByeolService } from './byeol.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { NameValidationPipe } from './pipes/name-validation.pipe';
import { PatchByeolDto } from './dto/request/patch-byeol.dto';
import { ByeolEntity } from './entities/byeol.entity';
import { UserEntity } from '../../identity/user/entities/userEntity';
import GetByeolIncludeZarisDto from './dto/response/get-byeol-include-zaris.dto';

@Controller('byeols')
@ApiTags('별')
export class ByeolController {
  constructor(private readonly byeolService: ByeolService) {}

  /**
   * 나의 별 정보를 가져옵니다.
   * @param req
   */
  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 별 찾기' })
  @ApiOkResponse({
    description: '내 별을 찾았어요',
    type: GetByeolIncludeZarisDto,
  })
  @ApiNotFoundResponse({ description: '별이 없어요' })
  async getMe(@Req() req: Request) {
    const user: UserEntity = req['user'];
    return this.byeolService.findByIdOrThrow(user.byeolId);
  }

  @Get(':name')
  @ApiOperation({ summary: '별 찾기' })
  @ApiOkResponse({
    description: '별을 찾았어요',
    type: GetByeolIncludeZarisDto,
  })
  getByeol(@Param('name', NameValidationPipe) name: string) {
    return this.byeolService.findByName(name);
  }

  /**
   * 현재의 정보를 새로운 유니크 키로 바꿉니다.(이름 변경)
   * @param name
   * @param req
   * @param patchByeolDto
   */
  @Patch(':name')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiBearerAuth()
  @ApiOperation({ summary: '현재 별 정보를 변경' })
  @ApiCreatedResponse({
    description: '별을 수정했어요',
    type: ByeolEntity,
  })
  async patchByeol(
    @Param('name', NameValidationPipe) name: string,
    @Req() req: Request,
    @Body() patchByeolDto: PatchByeolDto,
  ) {
    const user: UserEntity = req['user'];

    return this.byeolService.update(user, patchByeolDto);
  }

  /**
   * 별의 이름이 중복되는지 확인합니다.
   * Get(:id) 보다 먼저 위치해야합니다.
   * @param name
   */
  @Get(':name/is-name-available')
  @ApiOperation({ summary: '별 이름 확인하기' })
  @ApiOkResponse({
    type: Boolean,
    description: '사용 가능해요',
  })
  @ApiBadRequestResponse({
    description: `
    두 가지 케이스 중 하나가 나옵니다
  1. 두글자 이상 적어주세요
  2. 특수문자/공백은 사용할 수 없어요
  `,
  })
  @ApiConflictResponse({ description: '누군가 사용중이에요' })
  async isNameAvailable(@Param('name', NameValidationPipe) name: string) {
    await this.byeolService.canNotUseNameThenThrow(name); // 사용 불가능하면 내부에서 에러를 발생시킵니다.
    return true;
  }
}
