import { CacheModuleOptions } from '@nestjs/cache-manager';
import { registerAs } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config();

const config: CacheModuleOptions = {
  host: process.env.CACHE_HOST ?? 'localhost',
  port: parseInt(process.env.CACHE_PORT ?? '6379'),
  redisUrl: `redis://${process.env.CACHE_HOST ?? 'localhost'}:${parseInt(process.env.CACHE_PORT ?? '6379')}`,
  ttl: 3600000,
  lruSize: 5000,
};

export default registerAs('cache-config', () => config);
export type CacheConfigType = typeof config;
