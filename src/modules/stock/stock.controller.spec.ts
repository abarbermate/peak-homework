import { Test, TestingModule } from '@nestjs/testing';

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

  // TODO: Add test cases
});
