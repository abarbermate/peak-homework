import { Controller, Get, HttpCode, HttpStatus, NotFoundException, Param, Put, StreamableFile } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { StockDto } from '@app/modules/stock/dtos/stock.dto';
import { ToggleCronStatus } from '@app/modules/stock/enums/toggle-cron-status';
import { StockService } from '@app/modules/stock/stock.service';

@ApiTags('Stock')
@Controller('stock')
export class StockController {
  constructor(private stockService: StockService) {}

  @ApiOperation({ summary: 'Get stock by symbol', description: 'Returns the stock of the given symbol' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Stock found.', type: StockDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Stock not found.' })
  @HttpCode(HttpStatus.OK)
  @Get('/:symbol')
  async findBySymbol(@Param('symbol') symbol: string): Promise<StockDto> {
    const stock = await this.stockService.findBySymbol(symbol);

    if (!stock) {
      throw new NotFoundException('Stock not found');
    }

    return new StockDto(stock);
  }

  @ApiOperation({ summary: 'Get stock chart by symbol', description: 'Returns the stocks chart of the given symbol' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Stock found.', type: StockDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Stock not found.' })
  @HttpCode(HttpStatus.OK)
  @Get('/:symbol/chart')
  async chartBySymbol(@Param('symbol') symbol: string): Promise<StreamableFile> {
    const image = await this.stockService.generateChartImage(symbol);

    if (!image) {
      throw new NotFoundException('Stock not found or no chart data');
    }

    return new StreamableFile(image, {
      type: 'image/png',
    });
  }

  @ApiOperation({ summary: 'Toggle cron jobs', description: 'Start/Stop the periodic checks for the given symbol' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Periodic checks started/stopped' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Stock not found.' })
  @HttpCode(HttpStatus.OK)
  @Put('/:symbol')
  async toggleCronJobs(@Param('symbol') symbol: string): Promise<ToggleCronStatus> {
    const result = await this.stockService.toggleCronJobs(symbol);
    if (result === ToggleCronStatus.NOT_FOUND) {
      throw new NotFoundException('Stock not found');
    }
    return result;
  }
}
