import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '@app/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    const config = new DocumentBuilder()
      .setTitle('Peak Homework')
      .setDescription('Homework project for Peak Backend interview')
      .setVersion('1.0.0')
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /health', () => {
    it('should return health status', () => {
      return request(app.getHttpServer()).get('/health').expect(200).expect('ok');
    });
  });

  describe('GET /api', () => {
    it('should return Swagger documentation', () => {
      return request(app.getHttpServer()).get('/api').expect(200).expect('Content-Type', /html/);
    });

    it('should return Swagger JSON', () => {
      return request(app.getHttpServer()).get('/api-json').expect(200).expect('Content-Type', /json/);
    });
  });
});
