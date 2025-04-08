import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor() {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful health check',
    schema: {
      type: 'string',
      example: 'ok',
    },
  })
  @HttpCode(HttpStatus.OK)
  @Get('/health')
  health(): string {
    return 'ok';
  }
}
