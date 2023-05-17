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

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

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
  async githubAuthCallback(@Req() req: Request, @Res() res: Response) {
    const user: User = req['user'];
    const jwt = await this.authService.jwtSign(user);

    this.setAuthCookie(res, jwt.access_token);
    res.send({
      statusCode: 200,
      message: '사인인 성공',
      data: { ...user, access_token: jwt.access_token },
    });
  }

  @Post('/local/sign-up')
  async signUp(@Res() res: Response, @Body() createUserDto: CreateUserDto) {
    const user = await this.userService.findOrCreateUser(createUserDto);
    const jwt = await this.authService.jwtSign(user);

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
  async signIn(@Req() req: Request, @Res() res: Response) {
    const user = req['user'];
    const jwt = await this.authService.jwtSign(user);

    this.setAuthCookie(res, jwt.access_token);
    res.send({
      statusCode: 200,
      message: '사인인 성공',
      data: { ...user, access_token: jwt.access_token },
    });
  }

  @Get('/sign-out')
  async signOut(@Res() res: Response) {
    res.clearCookie(AUTH.JWT.ACCESS_TOKEN);
    res.send({ statusCode: 200, message: '사인아웃 성공' });
  }

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
