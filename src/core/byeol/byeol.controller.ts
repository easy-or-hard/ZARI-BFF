import {
  BadRequestException,
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
  UseInterceptors,
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
import { FileInterceptor } from '@nestjs/platform-express';
import CreateByeolResponseDto from './dto/response/create-byeol.response.dto';
import { ReadByeolOkResponseDto } from './dto/response/read-byeol-ok-response.dto';
import { UpdateByeolRequestDto } from './dto/request/update-byeol.request.dto';
import UpdateByeolResponseDto from './dto/response/update-byeol.response.dto';
import { CreateByeolRequestDto } from './dto/request/create-byeol.request.dto';
import { NotOkResponseDto } from '../../lib/common/dto/response.dto';

@Controller('byeol')
@ApiTags('byeol')
export class ByeolController {
  constructor(private readonly byeolService: ByeolService) {}

  /**
   * 별을 생성합니다.
   * @param req
   * @param createByeolRequestDto
   */
  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor(''))
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiBearerAuth()
  @ApiOperation({ summary: '별 만들기' })
  @ApiCreatedResponse({
    description: '별을 만들었어요',
    type: CreateByeolResponseDto,
  })
  async create(
    @Req() req: Request,
    @Body() createByeolRequestDto: CreateByeolRequestDto,
  ) {
    const { id: userId, byeolId } = req['user'];
    if (byeolId) {
      throw new BadRequestException('이미 별이 있어요');
    }
    await this.byeolService.create(userId, createByeolRequestDto);
    return { statusCode: 201, message: '별을 만들었어요' };
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
  @Get('/name/:name')
  @ApiOperation({ summary: '별 하나 찾기' })
  @ApiOkResponse({
    description: '별을 하나 찾았어요',
    type: ReadByeolOkResponseDto,
  })
  @ApiNotFoundResponse({ description: '별이 없어요' })
  async findByName(@Param('name') name: string) {
    const byeol = await this.byeolService.findByNameOrThrow(name);
    return { statusCode: 200, message: '별을 하나 찾았어요', data: byeol };
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
  async findById(@Param('id', ParseIntPipe) byeolId: number) {
    const byeol = await this.byeolService.findByIdOrThrow(byeolId);
    return { statusCode: 200, message: '별을 하나 찾았어요', data: byeol };
  }

  /**
   * 별의 이름이 중복되는지 확인합니다.
   * @param name
   */
  @Get('is-name-available/:name')
  @ApiOperation({ summary: '별 이름 확인하기' })
  @ApiOkResponse({ description: '사용 가능해요' })
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
    return {
      statusCode: 200,
      message: '사용 가능해요',
    };
  }

  /**
   * 별의 이름을 수정합니다.
   * @param req
   * @param updateByeolDto
   */
  @Patch()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '별 이름 바꾸기' })
  @ApiOkResponse({
    description: '별 이름을 바꿨어요',
    type: UpdateByeolResponseDto,
  })
  async update(
    @Req() req: Request,
    @Body() updateByeolDto: UpdateByeolRequestDto,
  ) {
    const { byeolId } = req['user'];
    await this.byeolService.update(byeolId, updateByeolDto);
    return { statusCode: 200, message: '별 이름을 바꿨어요' };
  }

  /**
   * 별을 비활성화 합니다.
   * 현재 삭제 할 수 없고 비활성화 됩니다.
   * @param req
   */
  @Delete('/de-activate')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 별 비활성화 하기' })
  @ApiOkResponse({
    description: '내 별을 비활성화 했어요',
  })
  async deActivate(@Req() req: Request) {
    const { byeolId } = req['user'];
    await this.byeolService.deactivate(byeolId);
    return { statusCode: 200, message: '내 별을 비활성화 했어요' };
  }

  /**
   * 비활성화 된 별을 활성화 합니다.
   * @param req
   */
  @Post('/activate')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 별 활성화 하기' })
  @ApiOkResponse({
    description: '내 별을 활성화 했어요',
  })
  async activate(@Req() req: Request) {
    const { byeolId } = req['user'];
    await this.byeolService.activate(byeolId);

    return { statusCode: 200, message: '내 별을 활성화 했어요' };
  }
}
