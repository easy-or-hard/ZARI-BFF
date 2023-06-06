import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { ZariService } from './zari.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ZariEntity } from './entities/zari.entity';
import { IncludeConstellationByeolBanzzackZari } from './dto/include-banzzack-zari.dto';
import {
  BehaviorSubject,
  interval,
  map,
  Observable,
  Subject,
  Subscription,
  take,
} from 'rxjs';

@Controller('zari')
@ApiTags('자리')
export class ZariController {
  constructor(private readonly zariService: ZariService) {}
  private sseEmitters: Map<number, Subject<any>> = new Map();
  private lockMap = new Map<
    string,
    { user: { byeolId: number; name: string }; timer: Subscription }
  >();

  @Sse(':id/event')
  sse(@Param('id', ParseIntPipe) id: number): Observable<any> {
    let emitter = this.sseEmitters.get(id);

    if (!emitter) {
      // Convert the current state of lockMap to an array
      const lockMapArray = Array.from(this.lockMap.entries()).map(
        ([key, value]) => {
          const [id, starNumber] = key.split('_').map(Number);
          return { starNumber, locked: true };
        },
      );

      // Create a BehaviorSubject with the current state of lockMap as the initial value
      emitter = new BehaviorSubject(lockMapArray);

      this.sseEmitters.set(id, emitter);
    }

    return emitter.asObservable().pipe(map((data) => ({ data })));
  }

  @Post(':id/banzzack/:starNumber/lock')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '자리의 특정 반짝이에 락 하기' })
  async lockBanzzack(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Param('starNumber', ParseIntPipe) starNumber: number,
  ) {
    const { byeolId } = req['user'];

    // Lock the banzzack
    const key = `${id}_${starNumber}`;
    if (this.lockMap.has(key)) {
      throw new BadRequestException('Banzzack is already locked');
    }

    // Set the lock with the user and timer
    const timer = interval(3000)
      .pipe(take(1))
      .subscribe(() => {
        this.lockMap.delete(key);
        const emitter = this.sseEmitters.get(id);
        if (emitter) {
          emitter.next({ starNumber, locked: false });
        }
      });

    this.lockMap.set(key, { user: { byeolId, name: null }, timer });

    // Trigger the SSE event
    const emitter = this.sseEmitters.get(id);
    if (emitter) {
      emitter.next({ starNumber, locked: true });
    }

    return true;
  }

  @Delete(':id/banzzack/:starNumber/release')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '자리의 특정 반짝이에 릴리즈 하기' })
  async releaseBanzzack(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Param('starNumber', ParseIntPipe) starNumber: number,
  ) {
    if (starNumber === 0) {
      return true;
    }

    const { byeolId } = req['user'];

    // Release the banzzack
    const key = `${id}_${starNumber}`;
    const lock = this.lockMap.get(key);
    if (!lock) {
      return true;
    } else if (lock && lock.user.byeolId !== byeolId) {
      throw new BadRequestException('Banzzack is not locked by this user');
    }

    lock.timer.unsubscribe();
    this.lockMap.delete(key);

    // Trigger the SSE event
    const emitter = this.sseEmitters.get(id);
    if (emitter) {
      emitter.next({ starNumber, locked: false });
    }

    return true;
  }

  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 자리 찾기' })
  @ApiOkResponse({
    description: '내 자리를 찾았어요',
    type: ZariEntity,
    isArray: true,
  })
  async findMyZari(@Req() req: Request) {
    const { id: userId } = req['user'];
    return this.zariService.findMyZaris(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: '자리 하나 찾기' })
  @ApiOkResponse({
    description: '자리를 찾았어요',
    type: IncludeConstellationByeolBanzzackZari,
  })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.zariService.findByIdOrThrow(id);
  }
}
