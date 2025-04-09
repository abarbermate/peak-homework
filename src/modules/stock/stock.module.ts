import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Stock } from '@app/modules/stock/entities/stock.entity';
import { StockQuoteModule } from '@app/modules/stock-quote/stock-quote.module';

import { StockController } from './stock.controller';
import { StockService } from './stock.service';

@Module({
  imports: [StockQuoteModule, TypeOrmModule.forFeature([Stock])],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule {}
