import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';

import { LoggerConfigType } from '@app/common/configs/logger.config';
import { LogData, Logger, LogLevel } from '@app/modules/logger/interfaces/logger.interface';

export const WinstonLoggerTransportsKey = Symbol();

@Injectable()
export default class WinstonLogger implements Logger {
  private logger: winston.Logger;
  private config: LoggerConfigType | undefined;

  public constructor(
    @Inject(WinstonLoggerTransportsKey) transports: winston.transport[],
    configService: ConfigService,
  ) {
    this.config = configService.get<LoggerConfigType>('logger');
    // Create winston logger
    this.logger = winston.createLogger(this.getLoggerFormatOptions(transports));
  }

  public log(level: LogLevel, message: string | Error, data?: LogData, profile?: string) {
    const logData = {
      level: level,
      message: message instanceof Error ? message.message : message,
      error: message instanceof Error ? message : undefined,
      ...data,
    };

    if (profile) {
      this.logger.profile(profile, logData);
    } else {
      this.logger.log(logData);
    }
  }

  public debug(message: string, data?: LogData, profile?: string) {
    this.log(LogLevel.Debug, message, data, profile);
  }

  public info(message: string, data?: LogData, profile?: string) {
    this.log(LogLevel.Info, message, data, profile);
  }

  public warn(message: string | Error, data?: LogData, profile?: string) {
    this.log(LogLevel.Warn, message, data, profile);
  }

  public error(message: string | Error, data?: LogData, profile?: string) {
    this.log(LogLevel.Error, message, data, profile);
  }

  public fatal(message: string | Error, data?: LogData, profile?: string) {
    this.log(LogLevel.Fatal, message, data, profile);
  }

  public emergency(message: string | Error, data?: LogData, profile?: string) {
    this.log(LogLevel.Emergency, message, data, profile);
  }

  public startProfile(id: string) {
    this.logger.profile(id);
  }

  private getLoggerFormatOptions(transports: winston.transport[]) {
    // Setting log levels for winston
    const levels: Record<string, number> = {};
    let cont = 0;
    Object.values(LogLevel).forEach((level) => {
      levels[level] = cont;
      cont++;
    });

    return {
      level: this.config?.logLevel,
      levels: levels,
      format: winston.format.combine(
        // Add timestamp and format the date
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        // Errors will be logged with stack trace
        winston.format.errors({ stack: true }),
        // Add custom Log fields to the log
        winston.format((info) => {
          // Info contains an Error property
          if (info.error && info.error instanceof Error) {
            info.stack = info.error.stack;
            info.error = undefined;
          }

          // Fill with relevant info if needed
          // It's temp disabled in console.transport.ts
          info.label = `${info.organisation}.${info.context}.${info.app}`;

          return info;
        })(),
        // Add custom fields to the data property
        winston.format.metadata({
          key: 'data',
          fillExcept: ['timestamp', 'level', 'message'],
        }),
        // Format the log as JSON
        winston.format.json(),
      ),
      transports: transports,
      exceptionHandlers: transports,
      rejectionHandlers: transports,
    };
  }
}
