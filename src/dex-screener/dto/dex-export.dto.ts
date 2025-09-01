import { IsString, IsOptional, IsDateString, IsArray, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ExportFormat {
  CSV = 'csv',
  JSON = 'json',
  EXCEL = 'excel',
}

export enum ExportType {
  TOKENS = 'tokens',
  PAIRS = 'pairs',
  PRICE_HISTORY = 'price_history',
  VOLUME_HISTORY = 'volume_history',
  LIQUIDITY_HISTORY = 'liquidity_history',
  ALERTS = 'alerts',
  ANALYTICS = 'analytics',
}

export class DexExportRequestDto {
  @ApiProperty({ enum: ExportType })
  @IsEnum(ExportType)
  exportType: ExportType;

  @ApiProperty({ enum: ExportFormat })
  @IsEnum(ExportFormat)
  format: ExportFormat;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  pairIds?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tokenIds?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  chainIds?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dexIds?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  timeInterval?: string; // 1m, 5m, 1h, 1d, etc.

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fields?: string[]; // Specific fields to include in export
}

export class DexExportResponseDto {
  @ApiProperty()
  exportId: string;

  @ApiProperty()
  status: 'processing' | 'completed' | 'failed';

  @ApiPropertyOptional()
  downloadUrl?: string;

  @ApiPropertyOptional()
  error?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiPropertyOptional()
  completedAt?: Date;
}
