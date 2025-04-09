import { Test, TestingModule } from '@nestjs/testing';

import { mockDefaultProviders } from '@app/common/utilities/mock-default-providers';
import { Stock } from '@app/modules/stock/entities/stock.entity';
import { FinnhubStockQuoter } from '@app/modules/stock-quote/finnhub-stock.quoter';

import { StockService } from './stock.service';

beforeAll(() => {
  process.env.NODE_ENV = 'test';
});

describe('StockService', () => {
  let service: StockService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StockService,
        ...mockDefaultProviders([Stock]),
        {
          provide: FinnhubStockQuoter,
          useValue: {
            getQuote: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<StockService>(StockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return null if no stock found for symbol', async () => {
    const stockRepo = service['stockRepository'];
    jest.spyOn(stockRepo, 'findOne').mockResolvedValue(null);

    const result = await service.findBySymbol('INVALID');
    expect(result).toBeNull();
  });

  it('should return stock data with calculated sma_last_ten', async () => {
    const stockRepo = service['stockRepository'];
    const now = new Date();

    const symbol = 'AAPL';
    const mockStock = {
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

    jest.spyOn(stockRepo, 'findOne').mockResolvedValue(mockStock);

    const result = await service.findBySymbol(symbol);

    expect(result).not.toBeNull();
    expect(result?.symbol).toBe(symbol);
    expect(result?.price).toBe(26174000);
    expect(result?.timestamp).toEqual(now);
    expect(result?.sma_last_ten).toBeCloseTo(25437000);
  });
});
