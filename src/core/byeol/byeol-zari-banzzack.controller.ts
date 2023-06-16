import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  Sse,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ByeolService } from './byeol.service';
import { BanzzackService } from '../banzzack/banzzack.service';
import { PostBanzzackDto } from '../banzzack/dto/request/post-banzzack.dto';
import { UserEntity } from '../../identity/user/entities/userEntity';
import { AuthGuard } from '@nestjs/passport';
import { BanzzackEntity } from '../banzzack/entities/banzzack.entity';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';

@Controller('byeols/:name/zaris/:constellationIAU/banzzacks')
@ApiTags('별/자리/반짝')
export class ByeolZariBanzzackController {
  constructor(
    private readonly byeolService: ByeolService,
    private readonly banzzackService: BanzzackService,
  ) {}

  private sseEmitters: Map<string, Subject<any>> = new Map();
  private lockSet = new Set<string>();

  private getSseEmitterKey(byeolName: string, constellationIAU: string) {
    return `${byeolName}_${constellationIAU}`;
  }

  private getLockSetKey(
    sseEmitterKey: string,
    starNumber: number,
    locker: number,
  ) {
    return `${sseEmitterKey}_${starNumber}_${locker}`;
  }

  private processSseEmitter(
    sseEmitterKey: string,
    byeolName: string,
    iau: string,
    starNumber: number,
    locked: boolean,
  ) {
    const emitter = this.sseEmitters.get(sseEmitterKey);
    if (emitter) {
      emitter.next({
        name: byeolName,
        constellationIAU: iau,
        starNumber,
        locked,
      });
    }
  }

  @Sse('event')
  @ApiOperation({ summary: '반짝이 락/언락 이벤트 수신' })
  sse(
    @Param('name') byeolName: string,
    @Param('constellationIAU') constellationIAU: string,
  ): Observable<any> {
    const sseEmitterKey = this.getSseEmitterKey(byeolName, constellationIAU);
    let emitter = this.sseEmitters.get(sseEmitterKey);

    if (!emitter) {
      const lockSetArray = Array.from(this.lockSet.entries()).map(([key]) => {
        const [byeolName, constellationIAU, starNumber] = key
          .split('_')
          .map((value) => +value[2]);
        return { byeolName, constellationIAU, starNumber };
      });

      emitter = new BehaviorSubject(lockSetArray);

      this.sseEmitters.set(sseEmitterKey, emitter);
    }

    return emitter.asObservable().pipe(map((data) => ({ data })));
  }

  @Patch('event')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '반짝이 락/언락 하기' })
  async patchLockAndUnlockEventBanzzack(
    @Req() req,
    @Param('name') byeolName: string,
    @Param('constellationIAU') constellationIAU: string,
    @Body() { starNumber, lock }: { starNumber: number; lock: boolean },
  ) {
    const user = req['user'];
    const sseEmitterKey = this.getSseEmitterKey(byeolName, constellationIAU);
    const lockSetKey = this.getLockSetKey(
      sseEmitterKey,
      starNumber,
      user.byeolId,
    );

    const lockSet = () => {
      if (this.lockSet.has(lockSetKey)) {
        throw new BadRequestException('이미 락이 걸려있어요');
      }
      this.lockSet.add(lockSetKey);
    };

    const unlockSet = () => {
      if (!this.lockSet.has(lockSetKey)) {
        throw new BadRequestException('락이 없어요');
      }
      this.lockSet.delete(lockSetKey);
    };

    lock ? lockSet() : unlockSet();

    this.processSseEmitter(
      sseEmitterKey,
      byeolName,
      constellationIAU,
      starNumber,
      lock,
    );

    return { lock };
  }

  @Get(':starNumber')
  @ApiOperation({ summary: '자리의 반짝이 가져오기' })
  @ApiOkResponse({
    description: '자리의 반짝이을 가져왔어요',
    type: BanzzackEntity,
  })
  getBanzzack(
    @Param('name') name: string,
    @Param('iau') iau: string,
    @Param('starNumber', ParseIntPipe) starNumber: number,
    @Req() req,
  ) {
    return this.banzzackService.findBanzzack(name, iau, starNumber);
  }

  @Post(':starNumber')
  @HttpCode(201)
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiBearerAuth()
  @ApiOperation({ summary: '반짝이 붙이기' })
  @ApiCreatedResponse({
    description: '반짝이를 붙였어요',
    type: BanzzackEntity,
  })
  postBanzzack(
    @Param('name') name: string,
    @Param('iau') iau: string,
    @Param('starNumber', ParseIntPipe) starNumber: number,
    @Req() req,
    @Body() postBanzzackDto: PostBanzzackDto,
  ) {
    const user: UserEntity = req['user'];
    return this.banzzackService.createBanzzack(
      user,
      name,
      iau,
      starNumber,
      postBanzzackDto.content,
    );
  }

  @Delete(':starNumber')
  @HttpCode(204)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '반짝이 떼기' })
  @ApiOkResponse({
    description: '반짝이를 떼었어요',
    type: BanzzackEntity,
  })
  deleteBanzzack(
    @Param('name') name: string,
    @Param('iau') iau: string,
    @Param('starNumber', ParseIntPipe) starNumber: number,
    @Req() req,
  ) {
    const user: UserEntity = req['user'];
    return this.banzzackService.deleteBanzzack(user, name, iau, starNumber);
  }
}
