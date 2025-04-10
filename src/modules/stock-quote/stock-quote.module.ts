import { Module } from '@nestjs/common';

import { FinnhubStockQuoter } from '@app/modules/stock-quote/finnhub-stock.quoter';

@Module({
  providers: [FinnhubStockQuoter],
  exports: [FinnhubStockQuoter],
})
export class StockQuoteModule {}
