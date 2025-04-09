import { createKeyv, Keyv } from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheableMemory } from 'cacheable';

import { AppController } from '@app/app.controller';
import AppConfig from '@app/common/configs/app.config';
import CacheConfig, { CacheConfigType } from '@app/common/configs/cache.config';
import DatabaseConfig, { DatabaseConfigType } from '@app/common/configs/database.config';
import LoggerConfig from '@app/common/configs/logger.config';
import { LoggerModule } from '@app/modules/logger/logger.module';
import { StockModule } from '@app/modules/stock/stock.module';
import { StockQuoteModule } from '@app/modules/stock-quote/stock-quote.module';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule.forRoot({ load: [CacheConfig] })],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          stores: [
            new Keyv({
              store: new CacheableMemory({
                ttl: configService.get<CacheConfigType>('config')?.ttl,
                lruSize: configService.get<CacheConfigType>('config')?.lruSize,
              }),
            }),
            createKeyv(configService.get<CacheConfigType>('config')?.redisUrl ?? 'redis://localhost:6379'),
          ],
        };
      },
    }),
    ConfigModule.forRoot({ isGlobal: true, load: [AppConfig, LoggerConfig] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot({ load: [DatabaseConfig] })],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get<DatabaseConfigType>('database') ?? {},
    }),
    ScheduleModule.forRoot(),
    LoggerModule,
    StockModule,
    StockQuoteModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
