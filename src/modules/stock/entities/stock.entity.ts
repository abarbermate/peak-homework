import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsNotEmpty, IsUUID } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, Index } from 'typeorm';

@Entity()
@Index(['symbol', 'timestamp'], { unique: true })
export class Stock extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Unique identifier', example: '550e8400-e29b-41d4-a716-446655440000', format: 'uuid' })
  @IsUUID('4')
  @IsNotEmpty()
  id!: string;

  @Column({ type: 'text' })
  @ApiProperty({ description: 'Symbol of the stock', example: 'AAPL' })
  @IsNotEmpty()
  symbol?: string;

  @Column({ type: 'integer' })
  @ApiProperty({ description: 'Current stock price (converted to integer using multiply by 10^6)', example: 26174000 })
  @IsNotEmpty()
  price?: number;

  @Column({ type: 'integer' })
  @ApiProperty({
    description: 'High price of the stock of the day (converted to integer using multiply by 10^6)',
    example: 26331000,
  })
  @IsNotEmpty()
  high_day?: number;

  @Column({ type: 'integer' })
  @ApiProperty({
    description: 'Low price of the stock of the day (converted to integer using multiply by 10^6)',
    example: 26068000,
  })
  @IsNotEmpty()
  low_day?: number;

  @Column({ type: 'integer' })
  @ApiProperty({
    description: 'Open price of the stock of the day (converted to integer using multiply by 10^6)',
    example: 26107000,
  })
  @IsNotEmpty()
  open_day?: number;

  @Column({ type: 'integer' })
  @ApiProperty({
    description: 'Previous close price of the stock of the day (converted to integer using multiply by 10^6)',
    example: 25945000,
  })
  @IsNotEmpty()
  prev_close?: number;

  @Column({ type: 'integer', nullable: true })
  @ApiProperty({
    description:
      'Simple Moving Average of the last 10 stock prices of the given symbol (converted to integer using multiply by 10^6)',
    example: 25437000,
    nullable: true,
  })
  sma_last_ten?: number | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({ description: 'Timestamp of the stock entry', example: '2025-04-09T14:00:00.000Z' })
  @IsISO8601()
  @IsNotEmpty()
  timestamp!: Date;
}
