export enum LogLevel {
  Emergency = 'emergency', // One or more systems are unusable.
  Fatal = 'fatal', // A person must take an action immediately
  Error = 'error', // Error events are likely to cause problems
  Warn = 'warn', // Warning events might cause problems in the future and deserve eyes
  Info = 'info', // Routine information, such as ongoing status or performance
  Debug = 'debug', // Debug or trace information
}

export interface LogData {
  organisation?: string; // Organisation or project name
  context?: string; // Bounded Context name
  app?: string; // Application or Microservice name
  sourceClass?: string; // Classname of the source
  correlationId?: string; // Correlation ID
  error?: Error; // Error object
  props?: NodeJS.Dict<unknown>; // Additional custom properties
  queryCount?: number;
  queryTime?: number;
  durationMs?: number;
  stack?: string;
}

export interface Logger {
  log(level: LogLevel, message: string | Error, data?: LogData, profile?: string): void;
  debug(message: string, data?: LogData, profile?: string): void;
  info(message: string, data?: LogData, profile?: string): void;
  warn(message: string | Error, data?: LogData, profile?: string): void;
  error(message: string | Error, data?: LogData, profile?: string): void;
  fatal(message: string | Error, data?: LogData, profile?: string): void;
  emergency(message: string | Error, data?: LogData, profile?: string): void;
  startProfile(id: string): void;
}
