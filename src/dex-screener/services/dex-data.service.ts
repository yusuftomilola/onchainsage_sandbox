import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { DexToken } from '../entities/dex-token.entity';
import { DexPair } from '../entities/dex-pair.entity';
import { DexPriceHistory } from '../entities/dex-price-history.entity';
import { DexVolumeHistory } from '../entities/dex-volume-history.entity';
import { DexLiquidityHistory } from '../entities/dex-liquidity-history.entity';

@Injectable()
export class DexDataService {
  private readonly logger = new Logger(DexDataService.name);

  constructor(
    @InjectRepository(DexToken)
    private readonly tokenRepository: Repository<DexToken>,
    @InjectRepository(DexPair)
    private readonly pairRepository: Repository<DexPair>,
    @InjectRepository(DexPriceHistory)
    private readonly priceHistoryRepository: Repository<DexPriceHistory>,
    @InjectRepository(DexVolumeHistory)
    private readonly volumeHistoryRepository: Repository<DexVolumeHistory>,
    @InjectRepository(DexLiquidityHistory)
    private readonly liquidityHistoryRepository: Repository<DexLiquidityHistory>,
  ) {}

  async getTrackedTokens(chainId?: string) {
    const where: any = { isTracked: true, isActive: true };
    if (chainId) where.chainId = chainId;
    
    return this.tokenRepository.find({
      where,
      order: { volume24h: 'DESC' },
    });
  }

  async getTrackedPairs(chainId?: string, dexId?: string) {
    const where: any = { isTracked: true, isActive: true };
    if (chainId) where.chainId = chainId;
    if (dexId) where.dexId = dexId;
    
    return this.pairRepository.find({
      where,
      relations: ['baseToken', 'quoteToken'],
      order: { volume24h: 'DESC' },
    });
  }

  async getPriceHistory(pairId: string, startDate: Date, endDate: Date, limit = 1000) {
    return this.priceHistoryRepository.find({
      where: {
        pairId,
        timestamp: Between(startDate, endDate),
      },
      order: { timestamp: 'ASC' },
      take: limit,
    });
  }

  async getVolumeHistory(pairId: string, startDate: Date, endDate: Date, limit = 1000) {
    return this.volumeHistoryRepository.find({
      where: {
        pairId,
        timestamp: Between(startDate, endDate),
      },
      order: { timestamp: 'ASC' },
      take: limit,
    });
  }

  async getLiquidityHistory(pairId: string, startDate: Date, endDate: Date, limit = 1000) {
    return this.liquidityHistoryRepository.find({
      where: {
        pairId,
        timestamp: Between(startDate, endDate),
      },
      order: { timestamp: 'ASC' },
      take: limit,
    });
  }

  async getTopGainers(chainId?: string, limit = 50) {
    const where: any = { isActive: true };
    if (chainId) where.chainId = chainId;
    
    return this.pairRepository.find({
      where,
      relations: ['baseToken', 'quoteToken'],
      order: { priceChange24h: 'DESC' },
      take: limit,
    });
  }

  async getTopLosers(chainId?: string, limit = 50) {
    const where: any = { isActive: true };
    if (chainId) where.chainId = chainId;
    
    return this.pairRepository.find({
      where,
      relations: ['baseToken', 'quoteToken'],
      order: { priceChange24h: 'ASC' },
      take: limit,
    });
  }

  async getTopVolume(chainId?: string, limit = 50) {
    const where: any = { isActive: true };
    if (chainId) where.chainId = chainId;
    
    return this.pairRepository.find({
      where,
      relations: ['baseToken', 'quoteToken'],
      order: { volume24h: 'DESC' },
      take: limit,
    });
  }

  async getTopLiquidity(chainId?: string, limit = 50) {
    const where: any = { isActive: true };
    if (chainId) where.chainId = chainId;
    
    return this.pairRepository.find({
      where,
      relations: ['baseToken', 'quoteToken'],
      order: { liquidityUsd: 'DESC' },
      take: limit,
    });
  }

  async toggleTokenTracking(tokenId: string) {
    const token = await this.tokenRepository.findOne({ where: { id: tokenId } });
    if (token) {
      token.isTracked = !token.isTracked;
      return await this.tokenRepository.save(token);
    }
    return null;
  }

  async togglePairTracking(pairId: string) {
    const pair = await this.pairRepository.findOne({ where: { id: pairId } });
    if (pair) {
      pair.isTracked = !pair.isTracked;
      return await this.pairRepository.save(pair);
    }
    return null;
  }
}
