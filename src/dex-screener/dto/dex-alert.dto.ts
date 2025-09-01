import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, IsEnum, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DexAlertType, DexAlertCondition, DexAlertStatus } from '../entities/dex-alert.entity';

export class DexAlertDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: DexAlertType })
  @IsEnum(DexAlertType)
  alertType: DexAlertType;

  @ApiProperty({ enum: DexAlertCondition })
  @IsEnum(DexAlertCondition)
  condition: DexAlertCondition;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pairId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tokenId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  chainId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  dexId?: string;

  @ApiProperty()
  @IsObject()
  parameters: {
    threshold?: number;
    percentage?: number;
    timeWindow?: number;
    priceThreshold?: number;
    volumeThreshold?: number;
    liquidityThreshold?: number;
  };

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  notificationChannels: string[];

  @ApiProperty()
  @IsObject()
  notificationConfig: {
    email?: string;
    webhookUrl?: string;
    pushToken?: string;
  };

  @ApiPropertyOptional({ enum: DexAlertStatus })
  @IsOptional()
  @IsEnum(DexAlertStatus)
  status?: DexAlertStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isShared?: boolean;
}

export class CreateDexAlertDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: DexAlertType })
  @IsEnum(DexAlertType)
  alertType: DexAlertType;

  @ApiProperty({ enum: DexAlertCondition })
  @IsEnum(DexAlertCondition)
  condition: DexAlertCondition;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pairId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tokenId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  chainId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  dexId?: string;

  @ApiProperty()
  @IsObject()
  parameters: {
    threshold?: number;
    percentage?: number;
    timeWindow?: number;
    priceThreshold?: number;
    volumeThreshold?: number;
    liquidityThreshold?: number;
  };

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  notificationChannels: string[];

  @ApiProperty()
  @IsObject()
  notificationConfig: {
    email?: string;
    webhookUrl?: string;
    pushToken?: string;
  };
}

export class UpdateDexAlertDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: DexAlertCondition })
  @IsOptional()
  @IsEnum(DexAlertCondition)
  condition?: DexAlertCondition;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  parameters?: {
    threshold?: number;
    percentage?: number;
    timeWindow?: number;
    priceThreshold?: number;
    volumeThreshold?: number;
    liquidityThreshold?: number;
  };

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  notificationChannels?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  notificationConfig?: {
    email?: string;
    webhookUrl?: string;
    pushToken?: string;
  };

  @ApiPropertyOptional({ enum: DexAlertStatus })
  @IsOptional()
  @IsEnum(DexAlertStatus)
  status?: DexAlertStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isShared?: boolean;
}

export class DexAlertQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ enum: DexAlertType })
  @IsOptional()
  @IsEnum(DexAlertType)
  alertType?: DexAlertType;

  @ApiPropertyOptional({ enum: DexAlertStatus })
  @IsOptional()
  @IsEnum(DexAlertStatus)
  status?: DexAlertStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pairId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tokenId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  chainId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  dexId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  offset?: number;
}
