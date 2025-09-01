import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { DexToken } from '../entities/dex-token.entity';
import { DexPair } from '../entities/dex-pair.entity';
import { DexPriceHistory } from '../entities/dex-price-history.entity';
import { DexVolumeHistory } from '../entities/dex-volume-history.entity';
import { DexLiquidityHistory } from '../entities/dex-liquidity-history.entity';

interface DexScreenerToken {
  chainId: string;
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  priceUsd: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
  fdv: number;
  liquidity: number;
  logoURI?: string;
}

interface DexScreenerPair {
  chainId: string;
  dexId: string;
  pairAddress: string;
  baseToken: DexScreenerToken;
  quoteToken: DexScreenerToken;
  priceUsd: number;
  priceChange24h: number;
  priceChange1h: number;
  priceChange5m: number;
  volume24h: number;
  volume1h: number;
  volume5m: number;
  liquidityUsd: number;
  fdv: number;
  marketCap: number;
  pairCreatedAt: number;
  pairUrl: string;
  dexUrl: string;
}

@Injectable()
export class DexScreenerApiService {
  private readonly logger = new Logger(DexScreenerApiService.name);
  private readonly baseUrl = 'https://api.dexscreener.com/latest';

  constructor(
    private readonly httpService: HttpService,
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

  // @Cron(CronExpression.EVERY_30_SECONDS)
  async fetchAndUpdateTrackedPairs() {
    try {
      const trackedPairs = await this.pairRepository.find({
        where: { isTracked: true, isActive: true },
        relations: ['baseToken', 'quoteToken'],
      });

      for (const pair of trackedPairs) {
        await this.updatePairData(pair.pairAddress);
      }

      this.logger.log(`Updated ${trackedPairs.length} tracked pairs`);
    } catch (error) {
      this.logger.error('Error updating tracked pairs:', error);
    }
  }

  async getTokenByAddress(chainId: string, address: string): Promise<DexScreenerToken[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/dex/tokens/${address}`)
      );
      return response.data.pairs?.map(pair => pair.baseToken).filter(token => 
        token.chainId === chainId
      ) || [];
    } catch (error) {
      this.logger.error(`Error fetching token ${address} on ${chainId}:`, error);
      return [];
    }
  }

  async getPairByAddress(pairAddress: string): Promise<DexScreenerPair | null> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/dex/pairs/${pairAddress}`)
      );
      return response.data.pair || null;
    } catch (error) {
      this.logger.error(`Error fetching pair ${pairAddress}:`, error);
      return null;
    }
  }

  async searchPairs(query: string, limit = 20): Promise<DexScreenerPair[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/dex/search/?q=${encodeURIComponent(query)}`)
      );
      return response.data.pairs?.slice(0, limit) || [];
    } catch (error) {
      this.logger.error(`Error searching pairs for "${query}":`, error);
      return [];
    }
  }

  async getTopPairs(chainId?: string, limit = 100): Promise<DexScreenerPair[]> {
    try {
      const url = chainId 
        ? `${this.baseUrl}/dex/tokens/${chainId}`
        : `${this.baseUrl}/dex/pairs/ethereum`;
      
      const response = await firstValueFrom(this.httpService.get(url));
      return response.data.pairs?.slice(0, limit) || [];
    } catch (error) {
      this.logger.error(`Error fetching top pairs:`, error);
      return [];
    }
  }

  private async updatePairData(pairAddress: string) {
    try {
      const pairData = await this.getPairByAddress(pairAddress);
      if (!pairData) return;

      // Update or create tokens
      const baseToken = await this.upsertToken(pairData.baseToken);
      const quoteToken = await this.upsertToken(pairData.quoteToken);

      // Update or create pair
      const pair = await this.upsertPair(pairData, baseToken.id, quoteToken.id);

      // Store historical data
      await this.storeHistoricalData(pair.id, pairData);

    } catch (error) {
      this.logger.error(`Error updating pair data for ${pairAddress}:`, error);
    }
  }

  private async upsertToken(tokenData: DexScreenerToken): Promise<DexToken> {
    let token = await this.tokenRepository.findOne({
      where: { chainId: tokenData.chainId, address: tokenData.address }
    });

    if (!token) {
      token = this.tokenRepository.create({
        chainId: tokenData.chainId,
        address: tokenData.address,
        symbol: tokenData.symbol,
        name: tokenData.name,
        decimals: tokenData.decimals,
        metadata: { logoURI: tokenData.logoURI },
      });
    }

    // Update current data
    token.priceUsd = tokenData.priceUsd;
    token.priceChange24h = tokenData.priceChange24h;
    token.volume24h = tokenData.volume24h;
    token.marketCap = tokenData.marketCap;
    token.fdv = tokenData.fdv;
    token.liquidity = tokenData.liquidity;

    return await this.tokenRepository.save(token);
  }

  private async upsertPair(pairData: DexScreenerPair, baseTokenId: string, quoteTokenId: string): Promise<DexPair> {
    let pair = await this.pairRepository.findOne({
      where: { pairAddress: pairData.pairAddress }
    });

    if (!pair) {
      pair = this.pairRepository.create({
        chainId: pairData.chainId,
        dexId: pairData.dexId,
        pairAddress: pairData.pairAddress,
        baseTokenId,
        quoteTokenId,
        metadata: {
          pairUrl: pairData.pairUrl,
          dexUrl: pairData.dexUrl,
        },
      });
    }

    // Update current data
    pair.priceUsd = pairData.priceUsd;
    pair.priceChange24h = pairData.priceChange24h;
    pair.priceChange1h = pairData.priceChange1h;
    pair.priceChange5m = pairData.priceChange5m;
    pair.volume24h = pairData.volume24h;
    pair.volume1h = pairData.volume1h;
    pair.volume5m = pairData.volume5m;
    pair.liquidityUsd = pairData.liquidityUsd;
    pair.fdv = pairData.fdv;
    pair.marketCap = pairData.marketCap;
    pair.pairCreatedAt = new Date(pairData.pairCreatedAt);

    return await this.pairRepository.save(pair);
  }

  private async storeHistoricalData(pairId: string, pairData: DexScreenerPair) {
    const timestamp = new Date();

    // Store price history
    const priceHistory = this.priceHistoryRepository.create({
      pairId,
      priceUsd: pairData.priceUsd,
      priceChange1h: pairData.priceChange1h,
      priceChange24h: pairData.priceChange24h,
      timestamp,
    });
    await this.priceHistoryRepository.save(priceHistory);

    // Store volume history
    const volumeHistory = this.volumeHistoryRepository.create({
      pairId,
      volume24h: pairData.volume24h,
      volume1h: pairData.volume1h,
      volume5m: pairData.volume5m,
      timestamp,
    });
    await this.volumeHistoryRepository.save(volumeHistory);

    // Store liquidity history
    const liquidityHistory = this.liquidityHistoryRepository.create({
      pairId,
      liquidityUsd: pairData.liquidityUsd,
      timestamp,
    });
    await this.liquidityHistoryRepository.save(liquidityHistory);
  }
}
