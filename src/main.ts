import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from '@app/app.module';
import { ValidationException } from '@app/common/exceptions/validation.exception';
import { ValidationExceptionFilter } from '@app/common/filters/validation-exception.filter';
import { runMigrations } from '@app/common/migrations';

async function bootstrap() {
  if (process.env.RUN_MIGRATIONS_ON_STARTUP === 'true') {
    await runMigrations();
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(helmet());
  app.useGlobalFilters(new ValidationExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: false,
      whitelist: true,
      transform: true,
      validationError: {
        target: false,
        value: true,
      },
      exceptionFactory: (errors) => {
        return new ValidationException('Validation exception', errors);
      },
    }),
  );

  const defaultCorsOrigins = [/http:\/\/localhost:4000/, /https:\/\/(.*)\.vercel\.app/];

  app.enableCors({
    origin: process.env.CORS_DOMAINS?.split(',')?.map((item) => new RegExp(item)) ?? defaultCorsOrigins,
    credentials: true,
  });

  app.enableVersioning({
    type: VersioningType.URI,
  });

  const config = new DocumentBuilder()
    .setTitle('Peak Homework')
    .setDescription('Homework project for Peak Backend interview')
    .setVersion('1.0.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
