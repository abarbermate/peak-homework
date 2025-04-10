import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { ChartConfiguration } from 'chart.js';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { CronJob } from 'cron';
import { Repository } from 'typeorm';

import { AppConfigType } from '@app/common/configs/app.config';
import { Logger } from '@app/modules/logger/interfaces/logger.interface';
import { LoggerKey } from '@app/modules/logger/logger.service';
import { Stock } from '@app/modules/stock/entities/stock.entity';
import { ToggleCronStatus } from '@app/modules/stock/enums/toggle-cron-status';
import { FinnhubStockQuoter } from '@app/modules/stock-quote/finnhub-stock.quoter';
import { StockQuoter } from '@app/modules/stock-quote/interfaces/stock-quoter.interface';

@Injectable()
export class StockService implements OnModuleDestroy {
  private appConfig: AppConfigType | undefined;

  constructor(
    private readonly configService: ConfigService,
    private readonly schedulerRegistry: SchedulerRegistry,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(LoggerKey) private readonly logger: Logger,
    @InjectRepository(Stock) private readonly stockRepository: Repository<Stock>,
    @Inject(FinnhubStockQuoter) private readonly stockQuoteService: StockQuoter,
  ) {
    this.appConfig = this.configService.get<AppConfigType>('app');
  }

  async findBySymbol(symbol: string): Promise<Stock | null> {
    return this.stockRepository.findOne({
      where: { symbol },
      order: {
        timestamp: 'DESC',
      },
    });
  }

  async generateChartImage(symbol: string): Promise<Buffer | null> {
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 800, height: 400 });

    const prices = await this.stockRepository.find({
      where: { symbol },
      skip: 9,
      order: {
        timestamp: 'ASC',
      },
    });

    if (!prices || prices.length === 0) return null;

    const configuration: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels: prices.map((p) => new Date(p.timestamp).toLocaleString()),
        datasets: [
          {
            label: `${symbol} Stock price`,
            data: prices.map((p) => (p.price ?? 0) / 10 ** 6),
            fill: false,
            borderColor: '#4BC0C0FF',
            tension: 0.1,
          },
          {
            label: `${symbol} SMA`,
            data: prices.map((p) => (p.sma_last_ten ?? 0) / 10 ** 6),
            fill: false,
            borderColor: '#FF8800FF',
            tension: 0.1,
          },
        ],
      },
    };

    return chartJSNodeCanvas.renderToBuffer(configuration);
  }

  async toggleCronJobs(symbol: string): Promise<ToggleCronStatus> {
    const jobName = `cronjob_for_${symbol}`;
    try {
      await this.checkSymbolValidity(symbol);

      if (this.schedulerRegistry.doesExist('cron', jobName)) {
        const existingJob = this.schedulerRegistry.getCronJob(jobName);

        existingJob.stop();
        this.logger.info(`Stopped CronJob for ${symbol}`);

        this.schedulerRegistry.deleteCronJob(jobName);
        this.logger.info(`Deleted CronJob for ${symbol}`);

        return ToggleCronStatus.STOPPED;
      }

      const interval = this.appConfig?.cronInterval ?? '* * * * *';
      const newJob = new CronJob(interval, () => this.handleCron(symbol));

      await this.handleCron(symbol);

      this.schedulerRegistry.addCronJob(jobName, newJob);
      this.logger.info(`Added CronJob for ${symbol} with interval "${interval}"`);

      newJob.start();
      this.logger.info(`Started CronJob for ${symbol} with interval "${interval}"`);

      return ToggleCronStatus.STARTED;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);

      if (errorMessage === 'no_symbol') {
        this.logger.error(`Symbol ${symbol} does not exist.`);
        return ToggleCronStatus.NOT_FOUND;
      }

      this.logger.error(`Failed to toggle CronJob for ${symbol}: ${errorMessage}`);
      return ToggleCronStatus.ERROR;
    }
  }

  onModuleDestroy() {
    const jobs = this.schedulerRegistry.getCronJobs();
    const jobNames = Array.from(jobs.keys());
    this.logger.info(`Cleaning up ${jobNames.length} cron jobs...`);

    jobs.forEach((job, name) => {
      try {
        job.stop();
        this.logger.info(`Stopped CronJob: ${name}`);

        this.schedulerRegistry.deleteCronJob(name);
        this.logger.info(`Deleted CronJob: ${name}`);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        this.logger.error(`Failed to cleanup CronJob ${name}: ${errorMessage}`);
      }
    });
  }

  private async checkSymbolValidity(symbol: string) {
    if (!(await this.stockQuoteService.matchSymbol(symbol))) {
      throw new Error('no_symbol');
    }
  }

  private async handleCron(symbol: string): Promise<void> {
    const cacheKey = `last_stock_of_${symbol}`;

    const data = await this.stockQuoteService.getQuote(symbol);

    if (!data) {
      this.logger.warn(`No info for the current symbol ${symbol}. Skipping.`);
      return;
    }

    const lastPrice = await this.cacheManager.get<Stock>(cacheKey);

    const lastPriceTimestamp = lastPrice?.timestamp ? new Date(lastPrice?.timestamp).getTime() : 0;

    if (lastPriceTimestamp === data.timestamp.getTime()) {
      this.logger.warn(`Duplicate timestamp: ${data.timestamp.toISOString()} for ${symbol}. Skipping.`);
      return;
    }

    if (lastPriceTimestamp > data.timestamp.getTime()) {
      this.logger.error('Data is too old. Skipping.');
      return;
    }

    const lastTenPrices = await this.stockRepository.find({
      where: {
        symbol,
      },
      order: {
        timestamp: 'DESC',
      },
      take: 9, // 10. data point will be the new stock data from the API.
    });

    const newStockEntry = new Stock();

    Object.assign(newStockEntry, {
      symbol,
      ...data,
    });

    await this.cacheManager.set(cacheKey, newStockEntry);

    await this.stockRepository.save({
      ...newStockEntry,
      sma_last_ten: this.calculateMovingAverage([newStockEntry, ...lastTenPrices]),
    });

    this.logger.info(`Successfully updated stock entry for symbol ${symbol}`);
  }

  private calculateMovingAverage(lastTenPrices: Stock[]): number | null {
    if (lastTenPrices.length < 10) return null;

    const total = lastTenPrices.reduce((acc, curr) => acc + (curr.price ?? 0), 0);
    return Math.floor(total / lastTenPrices.length);
  }
}
