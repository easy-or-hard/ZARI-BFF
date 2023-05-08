import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { USER_ROLE_KEY } from '../../user/decorators/role.decorator';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  private role: UserRole;
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    this.role = this.reflector.getAllAndOverride<UserRole>(USER_ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    return super.canActivate(context);
  }

  handleRequest(err, user) {
    // 두 번 실행되는데, 한번은 인증이 정상적인 경우
    // 한번은 err, user 둘 다 아무것도 없는경우
    // 문제는 없지만 왜그런지 모르겠네...

    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
