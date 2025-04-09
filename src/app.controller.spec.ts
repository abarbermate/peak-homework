import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from '@app/app.controller';

beforeAll(() => {
  process.env.NODE_ENV = 'test';
});

describe('AppController', () => {
  let controller: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('root', () => {
    it('health should return "ok"', () => {
      expect(controller.health()).toBe('ok');
    });
  });
});
