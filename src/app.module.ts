import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from '@app/app.controller';
import AppConfig from '@app/common/configs/app.config';
import LoggerConfig from '@app/common/configs/logger.config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [AppConfig, LoggerConfig] })],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
