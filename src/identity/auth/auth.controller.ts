import {
  Body,
  Controller,
  Get,
  Post,
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
import { Response } from 'express';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AUTH } from '../../lib/consts';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post('/jwt')
  async jwtAuth(@Req() req: Request) {
    const user = req['user'];
    return { ...user, message: 'jwt 토큰 검증 성공' };
  }

  @Get('/github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() {
    // do not need implementation
  }

  @Get('/github/callback')
  @UseGuards(AuthGuard('github'))
  async githubAuthCallback(@Req() req: Request, @Res() res: Response) {
    const user = req['user'];
    const jwt = await this.authService.jwtSign(user);

    res.cookie(AUTH.JWT.ACCESS_TOKEN, jwt.access_token, {
      httpOnly: true,
      secure: true,
    });
    res.setHeader('Authorization', `Bearer ${jwt.access_token}`);
    res.send({ ...user, access_token: jwt.access_token });
  }

  @Post('/local/sign-up')
  async signUp(@Res() res: Response, @Body() createUserDto: CreateUserDto) {
    const user = await this.authService.create(createUserDto);
    const jwt = await this.authService.jwtSign(user);

    res.cookie(AUTH.JWT.ACCESS_TOKEN, jwt.access_token, {
      httpOnly: true,
      secure: true,
    });
    res.setHeader('Authorization', `Bearer ${jwt.access_token}`);
    res.send({
      ...user,
      access_token: jwt.access_token,
      message: '회원가입 성공',
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
        providerId: { type: 'number', example: 1 },
        provider: { type: 'string', example: 'none' },
      },
      required: ['username', 'password'],
    },
  })
  @ApiCreatedResponse({ description: 'User signed in successfully' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async signIn(@Req() req: Request, @Res() res: Response) {
    const user = req['user'];
    const jwt = await this.authService.jwtSign(user);

    res.cookie(AUTH.JWT.ACCESS_TOKEN, jwt.access_token, {
      httpOnly: true,
      secure: true,
    });
    res.setHeader('Authorization', `Bearer ${jwt.access_token}`);
    res.send({
      ...user,
      access_token: jwt.access_token,
      message: '사인인 성공',
    });
  }

  @Get('/sign-out')
  async signOut(@Res() res: Response) {
    res.clearCookie(AUTH.JWT.ACCESS_TOKEN);
    res.send({ message: '사인아웃 성공' });
  }
}
