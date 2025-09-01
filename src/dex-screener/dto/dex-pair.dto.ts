import { IsString, IsOptional, IsNumber, IsBoolean, IsObject, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DexPairDto {
  @ApiProperty()
  @IsString()
  chainId: string;

  @ApiProperty()
  @IsString()
  dexId: string;

  @ApiProperty()
  @IsString()
  pairAddress: string;

  @ApiProperty()
  @IsString()
  baseTokenId: string;

  @ApiProperty()
  @IsString()
  quoteTokenId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  priceUsd?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  priceChange24h?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  priceChange1h?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  priceChange5m?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  volume24h?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  volume1h?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  volume5m?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  liquidityUsd?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  fdv?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  marketCap?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  pairCreatedAt?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  metadata?: {
    pairUrl?: string;
    dexUrl?: string;
    infoUrl?: string;
  };

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isTracked?: boolean;
}

export class CreateDexPairDto {
  @ApiProperty()
  @IsString()
  chainId: string;

  @ApiProperty()
  @IsString()
  dexId: string;

  @ApiProperty()
  @IsString()
  pairAddress: string;

  @ApiProperty()
  @IsString()
  baseTokenId: string;

  @ApiProperty()
  @IsString()
  quoteTokenId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  metadata?: {
    pairUrl?: string;
    dexUrl?: string;
    infoUrl?: string;
  };
}

export class UpdateDexPairDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  priceUsd?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  priceChange24h?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  priceChange1h?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  priceChange5m?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  volume24h?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  volume1h?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  volume5m?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  liquidityUsd?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  fdv?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  marketCap?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  metadata?: {
    pairUrl?: string;
    dexUrl?: string;
    infoUrl?: string;
  };

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isTracked?: boolean;
}
