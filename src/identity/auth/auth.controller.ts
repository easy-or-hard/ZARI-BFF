import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Redirect,
  Req,
  Res,
  Sse,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { CreateUserDto } from '../user/dto/service/input/create-user.dto';
import { AUTH } from '../../lib/consts';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { UserService } from '../user/user.service';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { EventAuthDto } from './dto/event-auth.dto';

@Controller('auth')
@ApiTags('인증')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Sse('event')
  sse(@Req() req: Request): Observable<any> {
    const jwt = req.cookies[AUTH.JWT.ACCESS_TOKEN];
    let grade;
    if (jwt) {
      const user = this.authService.verifyJwt(jwt);
      grade = user.byeolId ? 'BYEOL' : 'USER';
    } else {
      grade = 'GUEST';
    }

    const eventAuthDto: EventAuthDto = {
      grade,
      uuid: uuidv4(),
    };
    return this.authService.sse(eventAuthDto);
  }

  /**
   * ZARI 서비스를 사용할 수 있는 상태(별) 인지 확인합니다
   * @param req
   */
  @Get('/is-byeol')
  @ApiOperation({ summary: '실제 서비스를 사용할 수 있는 상태인지 확인해요' })
  @ApiOkResponse({ type: Boolean, description: '불리언 값으로 별을 확인' })
  async isByeol(@Req() req: Request) {
    const jwt = req.cookies[AUTH.JWT.ACCESS_TOKEN];
    if (!jwt) {
      return false;
    } else {
      const user = this.authService.verifyJwt(jwt);
      return !!user;
    }
  }

  @Post('/jwt')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async jwtAuth(@Req() req: Request) {
    const user = req['user'];
    return { ...user, message: 'jwt 토큰 검증 성공' };
  }

  @Get('/github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() {
    // do not need implementation
  }

  @Get('/github/event')
  @Redirect()
  async githubSocketAuth(@Query('state') state: string) {
    const clientId = this.configService.getOrThrow('GITHUB_CLIENT_ID');
    const scope = 'user:email';
    const baseUrl = 'https://github.com/login/oauth/authorize';

    return {
      url: `${baseUrl}?client_id=${clientId}&scope=${scope}&state=${state}`,
    };
  }

  @Get('/github/callback')
  @UseGuards(AuthGuard('github'))
  githubAuthCallback(@Req() req: Request, @Res() res: Response) {
    const user: User = req['user'];
    const jwt = this.authService.jwtSign(user);

    this.setAuthCookie(res, jwt.access_token);
    // 새창을 닫는 이벤트를 보내준다. 최종 응답을 보내주는 쪽에서 화면의 소멸을 책임집니다.
    res.send(`
<!DOCTYPE html>
<html lang="kr">
<head><script>window.close()</script></head>
<body>
      statusCode: 200,
      message: '사인인 성공',
      data: true,
</body>
    `);
  }

  @Post('/local/sign-up')
  async signUp(@Res() res: Response, @Body() createUserDto: CreateUserDto) {
    const user = await this.userService.findOrCreateUser(createUserDto);
    const jwt = this.authService.jwtSign(user);

    this.setAuthCookie(res, jwt.access_token);
    res.send({
      statusCode: 201,
      message: '회원가입 성공',
      data: {
        ...user,
        access_token: jwt.access_token,
      },
    });
  }

  @Post('/local/sign-in')
  @UseGuards(AuthGuard('local'))
  @ApiOperation({ summary: 'Sign in with local authentication' })
  @ApiBody({
    description: 'User credentials',
    schema: {
      type: 'object',
      properties: {
        providerId: { type: 'number', example: 7 },
        provider: { type: 'string', example: 'local' },
      },
      required: ['username', 'password'],
    },
  })
  @ApiCreatedResponse({ description: 'User signed in successfully' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  signIn(@Req() req: Request, @Res() res: Response) {
    const user = req['user'];
    const jwt = this.authService.jwtSign(user);

    this.setAuthCookie(res, jwt.access_token);
    res.send({
      statusCode: 200,
      message: '사인인 성공',
      data: { ...user, access_token: jwt.access_token },
    });
  }

  @Get('/sign-out')
  async signOut(@Res() res: Response) {
    res.clearCookie(AUTH.JWT.ACCESS_TOKEN, {
      domain: this.configService.get('COOKIE_DOMAIN'),
    });
    res.send({ statusCode: 200, message: '사인아웃 성공', data: true });
  }

  /**
   * 쿠키 발급시 보안 옵션 설정
   * @param res
   * @param accessToken
   * @private
   */
  private setAuthCookie(res: Response, accessToken: string) {
    res.cookie(AUTH.JWT.ACCESS_TOKEN, accessToken, {
      domain: this.configService.get('COOKIE_DOMAIN'),
      httpOnly: this.configService.get('COOKIE_HTTP_ONLY'),
      secure: this.configService.get('COOKIE_SECURE'),
      sameSite: this.configService.get('COOKIE_SAME_SITE'),
      maxAge: 60 * 60 * 24 * 365 * 1000,
    });
    res.setHeader('Authorization', `Bearer ${accessToken}`);
  }
}
