import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AUTH } from '../../lib/consts';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { UserService } from '../user/user.service';
import { OkResponseDto } from '../../lib/common/dto/response.dto';

@Controller('auth')
@ApiTags('인증')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  /**
   * ZARI 서비스를 사용하기 위해 OAuth 인증한 상태인지 확인하기 위한 메소드 입니다.
   * @param req
   */
  @Get('/is-user')
  @ApiOperation({ summary: 'Oauth 를 통해 가입한 유저인지 확인해요' })
  async isUser(@Req() req: Request) {
    const jwt = req.cookies[AUTH.JWT.ACCESS_TOKEN];
    let result: OkResponseDto<boolean>;
    if (!jwt) {
      result = {
        statusCode: 200,
        message: '유저가 아니에요',
        data: false,
      };
    } else {
      this.authService.verifyJwt(jwt);
      result = {
        statusCode: 200,
        message: '유저에요',
        data: true,
      };
    }

    return result;
  }

  /**
   * ZARI 서비스를 사용할 수 있는 상태(별) 인지 확인합니다
   * @param req
   */
  @Get('/is-byeol')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '실제 서비스를 사용할 수 있는 상태인지 확인해요' })
  async isByeol(@Req() req: Request) {
    const user = req['user'];
    let result: OkResponseDto<boolean>;
    if (!user.byeolId) {
      result = {
        statusCode: 200,
        message: '별이 아니에요',
        data: false,
      };
    } else {
      result = {
        statusCode: 200,
        message: '별이에요',
        data: true,
      };
    }

    return result;
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

  @Get('/github/socket')
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
    res.clearCookie(AUTH.JWT.ACCESS_TOKEN, { domain: '.xiyo.dev' });
    res.send({ statusCode: 200, message: '사인아웃 성공' });
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
    });
    res.setHeader('Authorization', `Bearer ${accessToken}`);
  }
}
