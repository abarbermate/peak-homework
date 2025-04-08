import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import AppConfig from '@app/common/configs/app.config';
import LoggerConfig from '@app/common/configs/logger.config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [AppConfig, LoggerConfig] })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
