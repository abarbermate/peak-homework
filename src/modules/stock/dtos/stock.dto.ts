import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsNotEmpty, IsUUID } from 'class-validator';
import { Entity } from 'typeorm';

import { Stock } from '@app/modules/stock/entities/stock.entity';

@Entity()
export class StockDto {
  @ApiProperty({ description: 'Unique identifier', example: '550e8400-e29b-41d4-a716-446655440000', format: 'uuid' })
  @IsUUID('4')
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Stock symbol', example: 'AAPL' })
  @IsNotEmpty()
  symbol?: string;

  @ApiProperty({ description: 'Stock price', example: 150.25 })
  @IsNotEmpty()
  price?: number;

  @ApiProperty({
    description:
      'Simple Moving Average of the last 10 stock prices of the given symbol (converted to integer using multiply by 10^6)',
    example: 2543700,
    nullable: true,
  })
  sma_last_ten: number | null;

  @ApiProperty({ description: 'Timestamp of the stock entry', example: '2023-04-09T14:00:00Z' })
  @IsISO8601()
  @IsNotEmpty()
  timestamp: Date;

  constructor(data: Pick<Stock, 'id' | 'symbol' | 'price' | 'sma_last_ten' | 'timestamp'>) {
    this.id = data.id;
    this.symbol = data.symbol;
    this.price = data.price ? data.price / 10 ** 6 : undefined;
    this.sma_last_ten = data.sma_last_ten ? data.sma_last_ten / 10 ** 6 : null;
    this.timestamp = data.timestamp;
  }
}
