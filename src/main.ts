import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';

import { AppModule } from '@app/app.module';
import { ValidationException } from '@app/common/exceptions/validation.exception';
import { ValidationExceptionFilter } from '@app/common/filters/validation-exception.filter';

async function bootstrap() {
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

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
