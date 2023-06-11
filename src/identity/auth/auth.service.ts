import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import { UserEntity } from '../user/entities/userEntity';
import { EventAuthDto } from './dto/event-auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  private sseEmitters: Map<string, Subject<any>> = new Map();

  sse(eventAuthDto: EventAuthDto): Observable<any> {
    const emitter = new BehaviorSubject(eventAuthDto);
    this.sseEmitters.set(eventAuthDto.uuid, emitter);
    return emitter.asObservable().pipe(map((data) => ({ data })));
  }

  signedIn(uuid: string, user: UserEntity) {
    const emitter = this.sseEmitters.get(uuid);
    emitter.next({ uuid, grade: user.byeolId ? 'BYEOL' : 'USER' });
  }

  jwtSign(user: any) {
    return {
      access_token: this.jwtService.sign(user),
      // refresh_token: // TODO, 리프레시 토큰도 발급하고 로직을 구현해야함
    };
  }

  /**
   * 검증시 실패하면 401 에러가 발생합니다.
   * @param jwt
   */
  verifyJwt(jwt: any) {
    try {
      return this.jwtService.verify(jwt);
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
