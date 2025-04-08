import * as winston from 'winston';

import { LogData, LogLevel } from '@app/modules/logger/interfaces/logger.interface';

enum LogColors {
  red = '\x1b[31m',
  green = '\x1b[32m',
  yellow = '\x1b[33m',
  blue = '\x1b[34m',
  magenta = '\x1b[35m',
  cyan = '\x1b[36m',
  pink = '\x1b[38;5;206m',
  white = '\x1b[37m',
}

interface CustomLogInfo extends winston.Logform.TransformableInfo {
  data?: LogData;
}

export default class ConsoleTransport {
  public static createColorize() {
    return new winston.transports.Console({
      format: winston.format.combine(
        winston.format.printf((log: CustomLogInfo) => {
          const color = this.mapLogLevelColor(log.level as LogLevel);
          const logLevel = this.colorize(color, log.level.toUpperCase());
          const sourceClass = log.data?.sourceClass
            ? `${this.colorize(LogColors.cyan, `[${log.data.sourceClass}]`)}`
            : '';
          const correlationId = log.data?.correlationId
            ? this.colorize(LogColors.magenta, `[${log.data.correlationId}]`)
            : '';
          const queryCount =
            log.data?.sourceClass === 'RequestLogger' && log.data?.queryCount
              ? this.colorize(LogColors.yellow, `[${log.data.queryCount}/${log.data.queryTime}]`)
              : '';
          const message = this.colorize(color, log.message + (log.data?.error ? ' - ' + log.data.error : ''));
          const duration =
            log.data?.durationMs !== undefined ? this.colorize(color, ' +' + log.data.durationMs + 'ms') : '';
          const stack = log.data?.stack ? this.colorize(color, `  - ${log.data.stack}`) : '';
          const props = log.data?.props ? `\n  - Props: ${JSON.stringify(log.data.props, null, 4)}` : '';
          return `${log.timestamp}\t${logLevel} ${sourceClass} ${correlationId}${queryCount} ${message} ${duration} ${stack} ${props}`;
        }),
      ),
    });
  }

  private static colorize(color: LogColors, message: string): string {
    return `${color}${message}\x1b[0m`;
  }

  private static mapLogLevelColor(level: LogLevel): LogColors {
    switch (level) {
      case LogLevel.Debug:
        return LogColors.white;
      case LogLevel.Info:
        return LogColors.green;
      case LogLevel.Warn:
        return LogColors.yellow;
      case LogLevel.Error:
        return LogColors.red;
      case LogLevel.Fatal:
        return LogColors.magenta;
      case LogLevel.Emergency:
        return LogColors.pink;
      default:
        return LogColors.cyan;
    }
  }
}
