import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { USER_ROLE_KEY } from '../../user/decorators/role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const role = this.reflector.getAllAndOverride<UserRole>(USER_ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!role) {
      throw new InternalServerErrorException(
        '롤이 정의 되지 않았습니다. 서버에서 @Role() 데코레이터를 사용해서 정의해주세요.',
      );
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      throw new UnauthorizedException();
    }

    if (role !== user.role) {
      throw new UnauthorizedException(
        `롤이 맞지 않습니다. API가 요구한 롤: ${role} 사용자 롤: ${user.role}`,
      );
    }
    return true;
  }
}
