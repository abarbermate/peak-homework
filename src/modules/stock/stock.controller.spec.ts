import { Test, TestingModule } from '@nestjs/testing';

import { StockDto } from '@app/modules/stock/dtos/stock.dto';
import { Stock } from '@app/modules/stock/entities/stock.entity';
import { ToggleCronStatus } from '@app/modules/stock/enums/toggle-cron-status';
import { StockService } from '@app/modules/stock/stock.service';

import { StockController } from './stock.controller';

beforeAll(() => {
  process.env.NODE_ENV = 'test';
});

describe('StockController', () => {
  let controller: StockController;
  let service: StockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockController],
      providers: [
        {
          provide: StockService,
          useValue: {
            findBySymbol: jest.fn(),
            toggleCronJobs: jest.fn(),
            calculateMovingAverage: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<StockController>(StockController);
    service = module.get<StockService>(StockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
  });

  it('should return stock data for given symbol', async () => {
    const symbol = 'AAPL';

    const mockResponse = {
      id: '767b51c8-fac9-4079-8904-9ccc54d655d2',
      symbol: symbol,
      price: 26174000,
      high_day: 26331000,
      low_day: 26068000,
      open_day: 26107000,
      prev_close: 25945000,
      sma_last_ten: 25437000,
      timestamp: new Date(),
    } as Stock;

    const mockResult = new StockDto({
      id: '767b51c8-fac9-4079-8904-9ccc54d655d2',
      symbol: symbol,
      price: 26174000,
      sma_last_ten: 25437000,
      timestamp: new Date(),
    });

    (service.findBySymbol as jest.Mock).mockResolvedValue(mockResponse);

    const result = await controller.findBySymbol(symbol);
    expect(service.findBySymbol).toHaveBeenCalledWith(symbol);
    expect(result).toEqual(mockResult);
  });

  it('should toggle cron jobs', async () => {
    const symbol = 'AAPL';
    (service.toggleCronJobs as jest.Mock).mockResolvedValue(ToggleCronStatus.STARTED);

    const result1 = await controller.toggleCronJobs(symbol);
    expect(service.toggleCronJobs).toHaveBeenCalledWith(symbol);
    expect(result1).toEqual(ToggleCronStatus.STARTED);

    (service.toggleCronJobs as jest.Mock).mockResolvedValue(ToggleCronStatus.STOPPED);

    const result2 = await controller.toggleCronJobs(symbol);
    expect(service.toggleCronJobs).toHaveBeenCalledWith(symbol);
    expect(result2).toEqual(ToggleCronStatus.STOPPED);

    (service.toggleCronJobs as jest.Mock).mockResolvedValue(ToggleCronStatus.ERROR);

    const result3 = await controller.toggleCronJobs(symbol);
    expect(service.toggleCronJobs).toHaveBeenCalledWith(symbol);
    expect(result3).toEqual(ToggleCronStatus.ERROR);
  });
});
