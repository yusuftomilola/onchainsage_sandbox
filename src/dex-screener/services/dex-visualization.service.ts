import { Injectable, Logger } from '@nestjs/common';
import { DexDataService } from './dex-data.service';

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    fill?: boolean;
  }[];
}

export interface ChartConfig {
  type: string;
  data: ChartData;
  options: any;
}

@Injectable()
export class DexVisualizationService {
  private readonly logger = new Logger(DexVisualizationService.name);

  constructor(private readonly dexDataService: DexDataService) {}

  async generatePriceChart(pairId: string, startDate: Date, endDate: Date): Promise<ChartConfig> {
    const priceHistory = await this.dexDataService.getPriceHistory(pairId, startDate, endDate);
    
    return {
      type: 'line',
      data: {
        labels: priceHistory.map(p => p.timestamp.toISOString()),
        datasets: [{
          label: 'Price (USD)',
          data: priceHistory.map(p => p.priceUsd),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
        }],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: false,
            title: { display: true, text: 'Price (USD)' },
          },
          x: {
            title: { display: true, text: 'Time' },
          },
        },
      },
    };
  }

  async generateVolumeChart(pairId: string, startDate: Date, endDate: Date): Promise<ChartConfig> {
    const volumeHistory = await this.dexDataService.getVolumeHistory(pairId, startDate, endDate);
    
    return {
      type: 'bar',
      data: {
        labels: volumeHistory.map(v => v.timestamp.toISOString()),
        datasets: [{
          label: 'Volume (24h)',
          data: volumeHistory.map(v => v.volume24h),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
        }],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Volume (USD)' },
          },
          x: {
            title: { display: true, text: 'Time' },
          },
        },
      },
    };
  }

  async generateLiquidityChart(pairId: string, startDate: Date, endDate: Date): Promise<ChartConfig> {
    const liquidityHistory = await this.dexDataService.getLiquidityHistory(pairId, startDate, endDate);
    
    return {
      type: 'line',
      data: {
        labels: liquidityHistory.map(l => l.timestamp.toISOString()),
        datasets: [{
          label: 'Liquidity (USD)',
          data: liquidityHistory.map(l => l.liquidityUsd),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: true,
        }],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: false,
            title: { display: true, text: 'Liquidity (USD)' },
          },
          x: {
            title: { display: true, text: 'Time' },
          },
        },
      },
    };
  }

  async generateCombinedChart(pairId: string, startDate: Date, endDate: Date): Promise<ChartConfig> {
    const [priceHistory, volumeHistory, liquidityHistory] = await Promise.all([
      this.dexDataService.getPriceHistory(pairId, startDate, endDate),
      this.dexDataService.getVolumeHistory(pairId, startDate, endDate),
      this.dexDataService.getLiquidityHistory(pairId, startDate, endDate),
    ]);

    const labels = priceHistory.map(p => p.timestamp.toISOString());
    
    return {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Price (USD)',
            data: priceHistory.map(p => p.priceUsd),
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            yAxisID: 'y',
          },
          {
            label: 'Volume (24h)',
            data: volumeHistory.map(v => v.volume24h),
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            yAxisID: 'y1',
          },
          {
            label: 'Liquidity (USD)',
            data: liquidityHistory.map(l => l.liquidityUsd),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            yAxisID: 'y2',
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: { display: true, text: 'Price (USD)' },
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: { display: true, text: 'Volume (USD)' },
            grid: { drawOnChartArea: false },
          },
          y2: {
            type: 'linear',
            display: false,
            title: { display: true, text: 'Liquidity (USD)' },
          },
          x: {
            title: { display: true, text: 'Time' },
          },
        },
      },
    };
  }

  async generateMarketOverviewCharts(chainId?: string) {
    const [topGainers, topLosers, topVolume, topLiquidity] = await Promise.all([
      this.dexDataService.getTopGainers(chainId, 10),
      this.dexDataService.getTopLosers(chainId, 10),
      this.dexDataService.getTopVolume(chainId, 10),
      this.dexDataService.getTopLiquidity(chainId, 10),
    ]);

    return {
      topGainers: this.createTopPairsChart(topGainers, 'Top Gainers', 'priceChange24h'),
      topLosers: this.createTopPairsChart(topLosers, 'Top Losers', 'priceChange24h'),
      topVolume: this.createTopPairsChart(topVolume, 'Top Volume', 'volume24h'),
      topLiquidity: this.createTopPairsChart(topLiquidity, 'Top Liquidity', 'liquidityUsd'),
    };
  }

  private createTopPairsChart(pairs: any[], title: string, field: string): ChartConfig {
    return {
      type: 'bar',
      data: {
        labels: pairs.map(p => `${p.baseToken.symbol}/${p.quoteToken.symbol}`),
        datasets: [{
          label: title,
          data: pairs.map(p => p[field]),
          backgroundColor: this.getColorForField(field),
          borderColor: this.getColorForField(field, true),
        }],
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: title },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: this.getYAxisLabel(field) },
          },
        },
      },
    };
  }

  private getColorForField(field: string, isBorder = false): string {
    const colors = {
      priceChange24h: isBorder ? 'rgb(75, 192, 192)' : 'rgba(75, 192, 192, 0.6)',
      volume24h: isBorder ? 'rgb(54, 162, 235)' : 'rgba(54, 162, 235, 0.6)',
      liquidityUsd: isBorder ? 'rgb(255, 99, 132)' : 'rgba(255, 99, 132, 0.6)',
    };
    return colors[field] || (isBorder ? 'rgb(153, 102, 255)' : 'rgba(153, 102, 255, 0.6)');
  }

  private getYAxisLabel(field: string): string {
    const labels = {
      priceChange24h: 'Price Change (%)',
      volume24h: 'Volume (USD)',
      liquidityUsd: 'Liquidity (USD)',
    };
    return labels[field] || 'Value';
  }
}
