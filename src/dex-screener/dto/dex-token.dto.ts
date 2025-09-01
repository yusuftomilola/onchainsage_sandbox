import { IsString, IsOptional, IsNumber, IsBoolean, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DexTokenDto {
  @ApiProperty()
  @IsString()
  chainId: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  symbol: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  decimals?: number;

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
  volume24h?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  marketCap?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  fdv?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  liquidity?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  metadata?: {
    logoURI?: string;
    website?: string;
    twitter?: string;
    telegram?: string;
    discord?: string;
    description?: string;
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

export class CreateDexTokenDto {
  @ApiProperty()
  @IsString()
  chainId: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  symbol: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  decimals?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  metadata?: {
    logoURI?: string;
    website?: string;
    twitter?: string;
    telegram?: string;
    discord?: string;
    description?: string;
  };
}

export class UpdateDexTokenDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  decimals?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  metadata?: {
    logoURI?: string;
    website?: string;
    twitter?: string;
    telegram?: string;
    discord?: string;
    description?: string;
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
