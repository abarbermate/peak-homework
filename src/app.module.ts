import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from '@app/app.controller';
import AppConfig from '@app/common/configs/app.config';
import DatabaseConfig, { DatabaseConfigType } from '@app/common/configs/database.config';
import LoggerConfig from '@app/common/configs/logger.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [AppConfig, LoggerConfig] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot({ load: [DatabaseConfig] })],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get<DatabaseConfigType>('database') ?? {},
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
