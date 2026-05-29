import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LogInterceptor } from './common/log.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Set global prefix
  app.setGlobalPrefix('api');

  // Get config
  const configService = app.get(ConfigService);

  // Enable CORS with configurable origins
  const corsOrigin = configService.get<string>('CORS_ORIGIN', '*');
  const origins = corsOrigin
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const isWildcard = origins.includes('*');
  app.enableCors({
    origin: isWildcard ? '*' : origins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: !isWildcard,
  });

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  // Global HTTP logging interceptor
  app.useGlobalInterceptors(new LogInterceptor());

  const port = configService.get('PORT') || 3000;
  await app.listen(port);
  logger.log(`🚀 Server running on http://localhost:${port}/api`);
}
bootstrap();
