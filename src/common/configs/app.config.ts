import { registerAs } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config();

const config = {
  stockQuoteProvider: process.env.STOCK_QUOTE_PROVIDER ?? 'finnhub',
  finnhubApiUrl: process.env.FINNHUB_API_URL ?? 'https://finnhub.io/api/v1',
  finnhubApiToken: process.env.FINNHUB_API_TOKEN,
  cronInterval: process.env.CRON_INTERVAL ?? '* * * * *',
};

export default registerAs('app', () => config);
export type AppConfigType = typeof config;
