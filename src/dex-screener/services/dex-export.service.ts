import { Injectable, Logger } from '@nestjs/common';
import { DexDataService } from './dex-data.service';
import { ExportFormat, ExportType } from '../dto/dex-export.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DexExportService {
  private readonly logger = new Logger(DexExportService.name);
  private readonly exportDir = path.join(process.cwd(), 'exports');

  constructor(private readonly dexDataService: DexDataService) {
    // Ensure export directory exists
    if (!fs.existsSync(this.exportDir)) {
      fs.mkdirSync(this.exportDir, { recursive: true });
    }
  }

  async exportData(request: any): Promise<string> {
    const { exportType, format, ...filters } = request;
    const filename = `${exportType}_${Date.now()}.${format}`;
    const filepath = path.join(this.exportDir, filename);

    try {
      switch (exportType) {
        case ExportType.TOKENS:
          await this.exportTokens(filepath, format, filters);
          break;
        case ExportType.PAIRS:
          await this.exportPairs(filepath, format, filters);
          break;
        case ExportType.PRICE_HISTORY:
          await this.exportPriceHistory(filepath, format, filters);
          break;
        case ExportType.VOLUME_HISTORY:
          await this.exportVolumeHistory(filepath, format, filters);
          break;
        case ExportType.LIQUIDITY_HISTORY:
          await this.exportLiquidityHistory(filepath, format, filters);
          break;
        case ExportType.ANALYTICS:
          await this.exportAnalytics(filepath, format, filters);
          break;
        default:
          throw new Error(`Unsupported export type: ${exportType}`);
      }

      this.logger.log(`Export completed: ${filename}`);
      return filename;
    } catch (error) {
      this.logger.error(`Export failed: ${error.message}`);
      throw error;
    }
  }

  private async exportTokens(filepath: string, format: ExportFormat, filters: any) {
    const tokens = await this.dexDataService.getTrackedTokens(filters.chainId);
    const data = tokens.map(token => ({
      chainId: token.chainId,
      address: token.address,
      symbol: token.symbol,
      name: token.name,
      decimals: token.decimals,
      priceUsd: token.priceUsd,
      priceChange24h: token.priceChange24h,
      volume24h: token.volume24h,
      marketCap: token.marketCap,
      fdv: token.fdv,
      liquidity: token.liquidity,
      isActive: token.isActive,
      isTracked: token.isTracked,
      createdAt: token.createdAt,
    }));

    await this.writeFile(filepath, format, data, 'tokens');
  }

  private async exportPairs(filepath: string, format: ExportFormat, filters: any) {
    const pairs = await this.dexDataService.getTrackedPairs(filters.chainId, filters.dexId);
    const data = pairs.map(pair => ({
      chainId: pair.chainId,
      dexId: pair.dexId,
      pairAddress: pair.pairAddress,
      baseToken: pair.baseToken?.symbol,
      quoteToken: pair.quoteToken?.symbol,
      priceUsd: pair.priceUsd,
      priceChange24h: pair.priceChange24h,
      priceChange1h: pair.priceChange1h,
      priceChange5m: pair.priceChange5m,
      volume24h: pair.volume24h,
      volume1h: pair.volume1h,
      volume5m: pair.volume5m,
      liquidityUsd: pair.liquidityUsd,
      fdv: pair.fdv,
      marketCap: pair.marketCap,
      isActive: pair.isActive,
      isTracked: pair.isTracked,
      createdAt: pair.createdAt,
    }));

    await this.writeFile(filepath, format, data, 'pairs');
  }

  private async exportPriceHistory(filepath: string, format: ExportFormat, filters: any) {
    if (!filters.pairIds || filters.pairIds.length === 0) {
      throw new Error('Pair IDs are required for price history export');
    }

    const startDate = filters.startDate ? new Date(filters.startDate) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const endDate = filters.endDate ? new Date(filters.endDate) : new Date();

    const allHistory = [];
    for (const pairId of filters.pairIds) {
      const history = await this.dexDataService.getPriceHistory(pairId, startDate, endDate);
      allHistory.push(...history.map(h => ({
        pairId: h.pairId,
        priceUsd: h.priceUsd,
        priceChange1h: h.priceChange1h,
        priceChange24h: h.priceChange24h,
        timestamp: h.timestamp,
      })));
    }

    await this.writeFile(filepath, format, allHistory, 'price_history');
  }

  private async exportVolumeHistory(filepath: string, format: ExportFormat, filters: any) {
    if (!filters.pairIds || filters.pairIds.length === 0) {
      throw new Error('Pair IDs are required for volume history export');
    }

    const startDate = filters.startDate ? new Date(filters.startDate) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const endDate = filters.endDate ? new Date(filters.endDate) : new Date();

    const allHistory = [];
    for (const pairId of filters.pairIds) {
      const history = await this.dexDataService.getVolumeHistory(pairId, startDate, endDate);
      allHistory.push(...history.map(h => ({
        pairId: h.pairId,
        volume24h: h.volume24h,
        volume1h: h.volume1h,
        volume5m: h.volume5m,
        volumeChange24h: h.volumeChange24h,
        timestamp: h.timestamp,
      })));
    }

    await this.writeFile(filepath, format, allHistory, 'volume_history');
  }

  private async exportLiquidityHistory(filepath: string, format: ExportFormat, filters: any) {
    if (!filters.pairIds || filters.pairIds.length === 0) {
      throw new Error('Pair IDs are required for liquidity history export');
    }

    const startDate = filters.startDate ? new Date(filters.startDate) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const endDate = filters.endDate ? new Date(filters.endDate) : new Date();

    const allHistory = [];
    for (const pairId of filters.pairIds) {
      const history = await this.dexDataService.getLiquidityHistory(pairId, startDate, endDate);
      allHistory.push(...history.map(h => ({
        pairId: h.pairId,
        liquidityUsd: h.liquidityUsd,
        liquidityChange24h: h.liquidityChange24h,
        liquidityChange1h: h.liquidityChange1h,
        timestamp: h.timestamp,
      })));
    }

    await this.writeFile(filepath, format, allHistory, 'liquidity_history');
  }

  private async exportAnalytics(filepath: string, format: ExportFormat, filters: any) {
    const [topGainers, topLosers, topVolume, topLiquidity] = await Promise.all([
      this.dexDataService.getTopGainers(filters.chainId, 100),
      this.dexDataService.getTopLosers(filters.chainId, 100),
      this.dexDataService.getTopVolume(filters.chainId, 100),
      this.dexDataService.getTopLiquidity(filters.chainId, 100),
    ]);

    const analytics = {
      topGainers: topGainers.map(p => ({
        pair: `${p.baseToken?.symbol}/${p.quoteToken?.symbol}`,
        priceChange24h: p.priceChange24h,
        priceUsd: p.priceUsd,
        volume24h: p.volume24h,
        liquidityUsd: p.liquidityUsd,
      })),
      topLosers: topLosers.map(p => ({
        pair: `${p.baseToken?.symbol}/${p.quoteToken?.symbol}`,
        priceChange24h: p.priceChange24h,
        priceUsd: p.priceUsd,
        volume24h: p.volume24h,
        liquidityUsd: p.liquidityUsd,
      })),
      topVolume: topVolume.map(p => ({
        pair: `${p.baseToken?.symbol}/${p.quoteToken?.symbol}`,
        volume24h: p.volume24h,
        priceUsd: p.priceUsd,
        priceChange24h: p.priceChange24h,
        liquidityUsd: p.liquidityUsd,
      })),
      topLiquidity: topLiquidity.map(p => ({
        pair: `${p.baseToken?.symbol}/${p.quoteToken?.symbol}`,
        liquidityUsd: p.liquidityUsd,
        priceUsd: p.priceUsd,
        priceChange24h: p.priceChange24h,
        volume24h: p.volume24h,
      })),
    };

    await this.writeFile(filepath, format, analytics, 'analytics');
  }

  private async writeFile(filepath: string, format: ExportFormat, data: any, sheetName: string) {
    switch (format) {
      case ExportFormat.CSV:
        await this.writeCSV(filepath, data);
        break;
      case ExportFormat.JSON:
        await this.writeJSON(filepath, data);
        break;
      case ExportFormat.EXCEL:
        await this.writeExcel(filepath, data, sheetName);
        break;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  private async writeCSV(filepath: string, data: any[]) {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(h => row[h]).join(','))
    ].join('\n');

    fs.writeFileSync(filepath, csvContent);
  }

  private async writeJSON(filepath: string, data: any) {
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  }

  private async writeExcel(filepath: string, data: any, sheetName: string) {
    // For now, write as CSV with .xlsx extension
    // In a real implementation, you would use a proper Excel library
    const csvFilepath = filepath.replace('.xlsx', '.csv');
    await this.writeCSV(csvFilepath, Array.isArray(data) ? data : [data]);
  }

  getExportPath(filename: string): string {
    return path.join(this.exportDir, filename);
  }

  deleteExport(filename: string): void {
    const filepath = path.join(this.exportDir, filename);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
  }
}
