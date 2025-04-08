import { ConsoleLogger } from '@nestjs/common';
import { LoggerService } from '@nestjs/common/services/logger.service';

import { Logger } from '@app/modules/logger/interfaces/logger.interface';

export default class NestjsLoggerService extends ConsoleLogger implements LoggerService {
  public constructor(private logger: Logger) {
    super();
  }

  public log(message: string, ...optionalParams: never) {
    return this.logger.info(message, this.getLogData(optionalParams));
  }

  public error(message: string, ...optionalParams: never) {
    return this.logger.error(message, this.getLogData(optionalParams));
  }

  public warn(message: string, ...optionalParams: never) {
    return this.logger.warn(message, this.getLogData(optionalParams));
  }

  public debug(message: string, ...optionalParams: never) {
    return this.logger.debug(message, this.getLogData(optionalParams));
  }

  public verbose(message: string, ...optionalParams: never) {
    return this.logger.info(message, this.getLogData(optionalParams));
  }

  private getLogData(...optionalParams: never[]) {
    return {
      sourceClass: optionalParams[0] ? optionalParams[0] : undefined,
    };
  }
}
