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

  @Get('/github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() {
    // do not need implementation
  }

  @Get('/github/callback')
  @UseGuards(AuthGuard('github'))
  async githubAuthCallback(@Req() req, @Res() res: Response) {
    const user = await this.authService.authenticateUserWithoutSignUp(req.user);
    const jwt = await this.authService.jwtSign(user);

    res.cookie(AUTH.JWT.ACCESS_TOKEN, jwt.access_token, {
      httpOnly: true,
      secure: true,
    });
    res.setHeader('Authorization', `Bearer ${jwt.access_token}`);
    res.send(jwt.access_token);
  }

  @Post('/local/sign-up')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signUp(createUserDto);
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
  async signIn(@Req() req, @Res() res: Response) {
    const user = req.user;
    const jwt = await this.authService.jwtSign(user);

    res.cookie(AUTH.JWT.ACCESS_TOKEN, jwt.access_token, {
      httpOnly: true,
      secure: true,
    });
    res.setHeader('Authorization', `Bearer ${jwt.access_token}`);
    res.send({ ...user, access_token: jwt.access_token });
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post('/jwt')
  async jwtAuth(@Req() req) {
    return { ...req.user, message: '토큰 검증 성공' };
  }

  @Get('/sign-out')
  async signOut(@Res() res: Response) {
    res.clearCookie(AUTH.JWT.ACCESS_TOKEN);
    res.send({ message: '사인아웃 성공' });
  }
}
