import { Inject, Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { INQUIRER } from '@nestjs/core';

import { LogData, Logger, LogLevel } from '@app/modules/logger/interfaces/logger.interface';

export const LoggerBaseKey = Symbol();
export const LoggerKey = Symbol();

@Injectable({ scope: Scope.TRANSIENT })
export default class LoggerService implements Logger {
  private readonly sourceClass: string;
  private context: string | undefined;
  private readonly app: string | undefined;

  public constructor(
    @Inject(LoggerBaseKey) private logger: Logger,
    configService: ConfigService,
    @Inject(INQUIRER) parentClass: object,
  ) {
    // Set the source class from the parent class
    this.sourceClass = parentClass?.constructor?.name;
    this.app = configService.get<string>('APP');
  }

  public log(level: LogLevel, message: string | Error, data?: LogData, profile?: string) {
    return this.logger.log(level, message, this.getLogData(data), profile);
  }

  public debug(message: string, data?: LogData, profile?: string) {
    return this.logger.debug(message, this.getLogData(data), profile);
  }

  public info(message: string, data?: LogData, profile?: string) {
    return this.logger.info(message, this.getLogData(data), profile);
  }

  public warn(message: string | Error, data?: LogData, profile?: string) {
    return this.logger.warn(message, this.getLogData(data), profile);
  }

  public error(message: string | Error, data?: LogData, profile?: string) {
    return this.logger.error(message, this.getLogData(data), profile);
  }

  public fatal(message: string | Error, data?: LogData, profile?: string) {
    return this.logger.fatal(message, this.getLogData(data), profile);
  }

  public emergency(message: string | Error, data?: LogData, profile?: string) {
    return this.logger.emergency(message, this.getLogData(data), profile);
  }

  public startProfile(id: string) {
    this.logger.startProfile(id);
  }

  private getLogData(data?: LogData): LogData {
    return {
      ...data,
      organisation: data?.organisation || 'No org',
      context: data?.context || this.context,
      app: data?.app || this.app,
      sourceClass: data?.sourceClass || this.sourceClass,
    };
  }
}
