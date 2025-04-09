import { Test, TestingModule } from '@nestjs/testing';

import { mockDefaultProviders } from '@app/common/utilities/mock-default-providers';
import { Stock } from '@app/modules/stock/entities/stock.entity';

import { StockService } from './stock.service';

beforeAll(() => {
  process.env.NODE_ENV = 'test';
});

describe('StockService', () => {
  let service: StockService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [StockService, ...mockDefaultProviders([Stock])],
    }).compile();

    service = module.get<StockService>(StockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // TODO: Add test cases
});
