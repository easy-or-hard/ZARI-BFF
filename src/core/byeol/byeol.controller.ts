import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
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
import CreateByeolResponseDto from './dto/response/create-byeol-response.dto';
import { ReadByeolOkResponseDto } from './dto/response/read-byeol-ok-response.dto';
import { PatchByeolDto } from './dto/request/patch-byeol.dto';
import { CreateByeolDto } from './dto/service/create-byeol.dto';
import { NotOkResponseDto } from '../../lib/common/dto/response.dto';
import { ByeolEntity } from './entities/byeol.entity';
import PostByeolDto from './dto/request/post-unique-byeol.dto';

@Controller('byeol')
@ApiTags('별')
export class ByeolController {
  constructor(private readonly byeolService: ByeolService) {}

  /**
   * 유니크 키로 별을 생성합니다.
   * @param name
   * @param req
   * @param postByeolDto
   */
  @Post()
  @HttpCode(201)
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiBearerAuth()
  @ApiOperation({ summary: '유니크 키로 별 만들기' })
  @ApiCreatedResponse({
    description: '별을 만들었어요',
    type: CreateByeolResponseDto,
  })
  async postUnique(
    @Query('name', NameValidationPipe) name: string,
    @Req() req: Request,
    @Body() postByeolDto: PostByeolDto,
  ) {
    const { id: userId, byeolId } = req['user'];
    if (byeolId) {
      throw new BadRequestException('이미 별이 있어요');
    }

    const createByeol: CreateByeolDto = {
      name,
      ...postByeolDto,
    };
    return this.byeolService.create(userId, createByeol);
  }

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
    type: ReadByeolOkResponseDto,
  })
  @ApiNotFoundResponse({ description: '별이 없어요' })
  async findMe(
    @Req() req: Request,
  ): Promise<ReadByeolOkResponseDto | NotOkResponseDto> {
    const { byeolId } = req['user'];
    if (!byeolId) {
      return { statusCode: 404, message: '별이 없어요' } as NotOkResponseDto;
    }
    const byeol = await this.byeolService.findByIdOrThrow(byeolId);
    return {
      statusCode: 200,
      message: '내 별을 찾았어요',
      data: byeol,
    } as ReadByeolOkResponseDto;
  }

  /**
   * 별의 이름으로 하나의 정보를 가져옵니다.
   * @param name
   */
  @Get()
  @ApiOperation({ summary: '유니크 키로 별 하나 찾기' })
  @ApiOkResponse({
    description: '별을 하나 찾았어요',
    type: ByeolEntity,
  })
  @ApiNotFoundResponse({ description: '별이 없어요' })
  async findUnique(@Query('name') name: string) {
    return this.byeolService.findUnique(name);
  }

  /**
   * 별의 이름이 중복되는지 확인합니다.
   * Get(:id) 보다 먼저 위치해야합니다.
   * @param name
   */
  @Get('/is-name-available')
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
  async isNameAvailable(@Query('name', NameValidationPipe) name: string) {
    await this.byeolService.canNotUseNameThenThrow(name); // 사용 불가능하면 내부에서 에러를 발생시킵니다.
    return true;
  }

  /**
   * 별의 아이디로 하나의 정보를 가져옵니다.
   * @param byeolId
   */
  @Get(':id')
  @ApiOperation({ summary: '별 하나 찾기' })
  @ApiOkResponse({
    description: '별을 하나 찾았어요',
    type: ReadByeolOkResponseDto,
  })
  @ApiNotFoundResponse({ description: '별이 없어요' })
  async findId(@Param('id', ParseIntPipe) byeolId: number) {
    const byeol = await this.byeolService.findByIdOrThrow(byeolId);
    return { statusCode: 200, message: '별을 하나 찾았어요', data: byeol };
  }


  /**
   * 별의 이름을 수정합니다.
   * @param id
   * @param req
   * @param updateByeolDto
   */
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '별 이름 바꾸기' })
  @ApiOkResponse({
    type: ByeolEntity,
    description: '별 이름을 바꿨어요',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Body() updateByeolDto: UpdateByeolRequestDto,
  ) {
    const { byeolId } = req['user'];
    // TODO, 관리자도 수정할 수 있게 나중에 변경하기
    if (byeolId !== id) {
      throw new UnauthorizedException('별 소유자가 아닙니다.');
    }
    return this.byeolService.update(id, updateByeolDto);
  }

  /**
   * 별을 비활성화 합니다.
   * 현재 삭제 할 수 없고 비활성화 됩니다.
   * @param id
   * @param req
   */
  @Patch('/:id/de-activate')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '별 비활성화 하기' })
  @ApiOkResponse({
    type: Boolean,
    description: '별을 비활성화 했어요',
  })
  async deActivate(@Param('id', ParseIntPipe) id, @Req() req: Request) {
    const { byeolId } = req['user'];
    // TODO, 관리자도 수정할 수 있게 나중에 변경하기
    if (byeolId !== id) {
      throw new UnauthorizedException('별 소유자가 아닙니다.');
    }
    return this.byeolService.deactivate(id);
  }

  /**
   * 비활성화 된 별을 활성화 합니다.
   * @param id
   * @param req
   */
  @Patch('/:id/activate')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '별 활성화 하기' })
  @ApiOkResponse({
    type: Boolean,
    description: '별을 활성화 했어요',
  })
  async activate(@Param('id', ParseIntPipe) id, @Req() req: Request) {
    const { byeolId } = req['user'];
    // TODO, 관리자도 수정할 수 있게 나중에 변경하기
    if (byeolId !== id) {
      throw new UnauthorizedException('별 소유자가 아닙니다.');
    }
    return this.byeolService.activate(id);
  }
}
