import { registerAs } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config();

const config = {
  accessLogFormat: process.env.LOG_FORMAT ?? ':method :url :status :response-time ms',
  logLevel: process.env.LOG_LEVEL ?? 'warning',
};

export default registerAs('logger', () => config);
export type LoggerConfigType = typeof config;
