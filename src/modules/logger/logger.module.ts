import { Global, Inject, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import morgan from 'morgan';
import type { ConsoleTransportInstance } from 'winston/lib/winston/transports';

import loggerConfig, { LoggerConfigType } from '@app/common/configs/logger.config';
import { Logger } from '@app/modules/logger/interfaces/logger.interface';
import LoggerService, { LoggerBaseKey, LoggerKey } from '@app/modules/logger/logger.service';
import NestjsLoggerService from '@app/modules/logger/nestjs-logger.service';
import ConsoleTransport from '@app/modules/logger/winston/transports/console.transport';
import WinstonLogger, { WinstonLoggerTransportsKey } from '@app/modules/logger/winston/winston-logger.service';

@Global()
@Module({
  imports: [ConfigModule.forFeature(loggerConfig)],
  controllers: [],
  providers: [
    {
      provide: LoggerBaseKey,
      useClass: WinstonLogger,
    },
    {
      provide: LoggerKey,
      useClass: LoggerService,
    },
    {
      provide: NestjsLoggerService,
      useFactory: (logger: Logger) => new NestjsLoggerService(logger),
      inject: [LoggerKey],
    },

    {
      provide: WinstonLoggerTransportsKey,
      useFactory: () => {
        const transports: ConsoleTransportInstance[] = [];

        transports.push(ConsoleTransport.createColorize());

        return transports;
      },
      inject: [ConfigService],
    },
  ],
  exports: [LoggerKey, NestjsLoggerService],
})
export class LoggerModule implements NestModule {
  private config: LoggerConfigType | undefined;

  public constructor(
    @Inject(LoggerKey) private logger: Logger,
    private configService: ConfigService,
  ) {
    this.config = this.configService.get<LoggerConfigType>('logger');
  }

  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(
        morgan(this.config?.accessLogFormat ?? '', {
          skip: (req) => req.url === '/health',
          stream: {
            write: (message: string) => {
              this.logger.debug(message.trim(), {
                sourceClass: 'RequestLogger',
              });
            },
          },
        }),
      )
      .forRoutes('*');
  }
}
