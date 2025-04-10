import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';

import { AppConfigType } from '@app/common/configs/app.config';
import { Logger } from '@app/modules/logger/interfaces/logger.interface';
import { LoggerKey } from '@app/modules/logger/logger.service';
import { FinnhubResponseDto } from '@app/modules/stock-quote/dtos/finnhub-response.dto';
import { FinnhubSearchResponseDto } from '@app/modules/stock-quote/dtos/finnhub-search-response.dto';

import { StockQuote, StockQuoter } from './interfaces/stock-quoter.interface';

@Injectable()
export class FinnhubStockQuoter implements StockQuoter {
  private readonly config: AppConfigType | undefined;

  constructor(
    private readonly configService: ConfigService,
    @Inject(LoggerKey) private readonly logger: Logger,
  ) {
    this.config = this.configService.get<AppConfigType>('app');
  }

  async getQuote(symbol: string): Promise<StockQuote | null> {
    try {
      const { data } = await axios.get<FinnhubResponseDto>(`${this.config?.finnhubApiUrl ?? ''}/quote`, {
        params: { symbol },
        headers: {
          'X-Finnhub-Token': this.config?.finnhubApiToken,
        },
      });

      return {
        price: this.floatToInt(data.c),
        high_day: this.floatToInt(data.h),
        low_day: this.floatToInt(data.l),
        open_day: this.floatToInt(data.o),
        prev_close: this.floatToInt(data.pc),
        timestamp: this.timestampToMs(data.t),
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.status === 429) {
          this.logger.error('API limit reached');
        } else {
          this.logger.error(error.message);
        }
      } else {
        this.logger.error(String(error));
      }
      return null;
    }
  }

  async matchSymbol(symbol: string): Promise<boolean> {
    try {
      const { data } = await axios.get<FinnhubSearchResponseDto>(`${this.config?.finnhubApiUrl ?? ''}/search`, {
        params: { q: symbol },
        headers: {
          'X-Finnhub-Token': this.config?.finnhubApiToken,
        },
      });

      return !!data.count && data.result.some((item) => item.symbol === symbol);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.status === 429) {
          this.logger.error('API limit reached');
        } else {
          this.logger.error(error.message);
        }
      } else {
        this.logger.error(String(error));
      }
      return false;
    }
  }

  private floatToInt(value: number): number {
    return Math.floor(value * 10 ** 6);
  }

  private timestampToMs(timestamp: number): Date {
    return new Date(timestamp * 1000);
  }
}
