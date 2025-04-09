import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { createMockRepository } from '@app/common/utilities/mock-repository';
import { LoggerKey } from '@app/modules/logger/logger.service';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mockDefaultProviders<T extends abstract new (...args: any) => any>(Entities: T[]): Provider[] {
  return [
    {
      provide: CACHE_MANAGER,
      useValue: { get: jest.fn(), set: jest.fn() },
    },
    {
      provide: SchedulerRegistry,
      useValue: { addCronJob: jest.fn(), deleteCronJob: jest.fn() },
    },
    {
      provide: LoggerKey,
      useValue: { log: jest.fn(), info: jest.fn(), debug: jest.fn(), error: jest.fn() },
    },
    {
      provide: DataSource,
      useValue: { createQueryRunner: jest.fn() },
    },
    ...Entities.map((Entity) => ({
      provide: getRepositoryToken(Entity),
      useValue: createMockRepository<InstanceType<T>>(),
    })),
    {
      provide: ConfigService,
      useValue: { get: jest.fn() },
    },
  ];
}
