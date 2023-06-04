import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
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
import { Request } from 'express';
import { CreateBanzzackDto } from './dto/service/create-banzzack.dto';
import { ByeolService } from '../byeol/byeol.service';
import { BanzzackEntity } from './entities/banzzack.entity';
import { PatchBanzzackDto } from './dto/request/patch-banzzack.dto';
import UpdateBanzzackDto from './dto/service/update-banzzack.dto';
import PostNotIncludeUniqueBanzzackDto from './dto/request/post-not-include-unique-banzzack.dto';
import UpdateUniqueBanzzackDto from './dto/service/update-unique-banzzack.dto';
import DeleteUniqueBanzzackDto from './dto/service/delete-unique-banzzack.dto';

@Controller('banzzack')
@ApiTags('반짝')
export class BanzzackController {
  constructor(
    private readonly banzzackService: BanzzackService,
    private readonly byeolService: ByeolService,
  ) {}

  // lock 을 위한 map 생성
  private lockMap = new Map<
    string,
    { locker: number; timer: NodeJS.Timeout }
  >();

  // 기존에는 dto 반짝이 생성에 필요한 정보를 다 넣어서 만들었으나.
  // 프론트에서 swr 을 적용하니 캐시에 불편함이 생겨서 반짝이 생성, 조회 시 url 을 동일하게 변경
  // @Post()
  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth()
  // @UsePipes(new ValidationPipe({ transform: true }))
  // @ApiOperation({ summary: '인증 정보로 반짝이 붙이기' })
  // @ApiCreatedResponse({
  //   type: BanzzackEntity,
  //   description: '반짝이를 붙였어요',
  // })
  // async create(
  //   @Req() req: Request,
  //   @Body() postBanzzackDto: PostBanzzackDto,
  // ) {
  //   const { byeolId } = req['user'];
  //   const { name: byeolName } = await this.byeolService.findById(byeolId);
  //   const createBanzzackServiceDto: CreateBanzzackDto = {
  //     byeolId,
  //     byeolName,
  //     ...postBanzzackDto,
  //   };
  //   return this.banzzackService.create(createBanzzackServiceDto);
  // }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: '유니크 키로 반짝이 붙이기' })
  @ApiCreatedResponse({
    type: BanzzackEntity,
    description: '반짝이를 붙였어요',
  })
  async createUnique(
    @Query('zariId', ParseIntPipe) zariId: number,
    @Query('starNumber', ParseIntPipe) starNumber: number,
    @Req() req: Request,
    @Body()
    postNotIncludeUniqueBanzzackDto: PostNotIncludeUniqueBanzzackDto,
  ) {
    const { byeolId } = req['user'];
    const { name: byeolName } = await this.byeolService.findById(byeolId);
    const createBanzzackServiceDto: CreateBanzzackDto = {
      byeolId,
      byeolName,
      zariId,
      starNumber,
      ...postNotIncludeUniqueBanzzackDto,
    };
    return this.banzzackService.create(createBanzzackServiceDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '아이디로 반짝이 찾기' })
  @ApiCreatedResponse({
    type: BanzzackEntity,
    description: '반짝이를 찾았어요',
  })
  async findId(@Param('id', ParseIntPipe) id: number) {
    return await this.banzzackService.findById(id);
  }

  @Get()
  @ApiOperation({ summary: '유니크 키로 반짝이 찾기' })
  @ApiCreatedResponse({
    type: BanzzackEntity,
    description: '반짝이를 찾았어요',
  })
  async findUnique(
    @Query('zariId', ParseIntPipe) zariId: number,
    @Query('starNumber', ParseIntPipe) starNumber: number,
  ) {
    const findByUniqueKey = {
      zariId,
      starNumber,
    };
    return await this.banzzackService.findUnique(findByUniqueKey);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiBearerAuth()
  @ApiOperation({ summary: '아이디로 반짝이 바꾸기' })
  @ApiOkResponse({
    description: '반유니크 키로 짝이를 바꿨어요',
    type: BanzzackEntity,
  })
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

  @Patch()
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiBearerAuth()
  @ApiOperation({ summary: '유니크 키로 반짝이 바꾸기' })
  @ApiOkResponse({
    description: '유니크 키로 반짝이를 바꿨어요',
    type: BanzzackEntity,
  })
  async updateUnique(
    @Query('zariId', ParseIntPipe) zariId: number,
    @Query('starNumber', ParseIntPipe) starNumber: number,
    @Req() req: Request,
    @Body() patchBanzzackDto: PatchBanzzackDto,
  ) {
    const { byeolId } = req['user'];
    const updateUniqueBanzzackDto: UpdateUniqueBanzzackDto = {
      zariId,
      starNumber,
      content: patchBanzzackDto.content,
    };
    return await this.banzzackService.updateUnique(
      byeolId,
      updateUniqueBanzzackDto,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '아이디로 반짝이 때기' })
  @ApiOkResponse({ description: '반짝이를 땟어요' })
  async delete(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const { byeolId } = req['user'];
    return await this.banzzackService.delete(id, byeolId);
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '유니크 키로 반짝이 때기' })
  @ApiOkResponse({ description: '반짝이를 땟어요' })
  async deleteUnique(
    @Query('zariId', ParseIntPipe) zariId: number,
    @Query('starNumber', ParseIntPipe) starNumber: number,
    @Req() req: Request,
  ) {
    const { byeolId } = req['user'];
    const deleteUniqueBanzzackDto: DeleteUniqueBanzzackDto = {
      zariId,
      starNumber,
    };
    return await this.banzzackService.deleteUnique(
      byeolId,
      deleteUniqueBanzzackDto,
    );
  }

  /**
   * 반짝이를 붙이는 중에는 다른 사람은 반짝이를 붙일 수 없다.
   * 소켓 통신으로 구현
   */
  @Post('lock')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async lockUnique(
    @Query('zariId', ParseIntPipe) zariId: number,
    @Query('starNumber', ParseIntPipe) starNumber: number,
    @Req() req: Request,
  ) {
    const { userId } = req['user']; // 사용자를 식별할 수 있는 정보가 필요합니다.
    const lockKey = `${zariId}-${starNumber}`;

    // 이미 락이 걸려있다면 false 를 반환
    if (this.lockMap.get(lockKey)) {
      return false;
    }

    // 10분 뒤에 락을 자동으로 해제
    const timer = setTimeout(() => {
      this.lockMap.delete(lockKey);
    }, 1000 * 60 * 10); // 10분

    // 락을 건다.
    this.lockMap.set(lockKey, { locker: userId, timer });
    return true;
  }

  /**
   * 잠궜던 반짝이 해제
   * 소켓 통신으로 구현
   */
  @Post('lock')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async releaseUnique(
    @Query('zariId', ParseIntPipe) zariId: number,
    @Query('starNumber', ParseIntPipe) starNumber: number,
    @Req() req: Request,
  ) {
    const { userId } = req['user']; // 사용자를 식별할 수 있는 정보가 필요합니다.
    const lockKey = `${zariId}-${starNumber}`;

    const { locker, timer } = this.lockMap.get(lockKey);
    if (locker !== userId) {
      // 락을 건 사람이 아니라면 false 를 반환
      // TODO, 에러 던지기로 바꾸기, 400 이 적당할듯합니다.
      return false;
    }

    try {
      // 작업이 끝나면 락을 해제합니다.
      this.lockMap.delete(lockKey);
      clearTimeout(timer);
      return true;
    } catch (error) {
      // 오류가 발생하면 락을 해제하고 에러를 던집니다.
      this.lockMap.delete(lockKey);
      clearTimeout(timer);
      throw error;
    }
  }
}
