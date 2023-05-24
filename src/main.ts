import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaClientExceptionFilter, PrismaService } from 'nestjs-prisma';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log', 'verbose'],
  });

  const configService = app.get(ConfigService);

  app.enableCors({
    origin: [
      configService.get('ZARI_FRONT_URL'),
      'https://zari-frontend.vercel.app/',
      'http://localhost:20080',
    ], // Allow requests from Next.js server
    credentials: true, // Allow cookies to be sent with requests
  });

  const config = new DocumentBuilder()
    .setTitle('Zari API')
    .setDescription('자리 API 설명 입니다.')
    .addBearerAuth() // JWT 인증 추가
    .addOAuth2({
      type: 'oauth2',
      flows: {
        authorizationCode: {
          authorizationUrl: 'https://github.com/login/oauth/authorize',
          tokenUrl: 'https://github.com/login/oauth/access_token',
          scopes: {
            'user:email': 'Access user email',
          },
        },
      },
    })
    .build();

  app.use(cookieParser());
  // TODO, 나중에 활성화 시키기
  // app.useGlobalInterceptors(new TimeoutInterceptor());
  app.useGlobalPipes(new ValidationPipe());

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // prisma
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
  const prismaService: PrismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  await app.listen(configService.get('PORT'));
}

bootstrap();
