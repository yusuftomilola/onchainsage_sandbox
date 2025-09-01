import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

// Entities
import { DexToken } from './entities/dex-token.entity';
import { DexPair } from './entities/dex-pair.entity';
import { DexPriceHistory } from './entities/dex-price-history.entity';
import { DexVolumeHistory } from './entities/dex-volume-history.entity';
import { DexLiquidityHistory } from './entities/dex-liquidity-history.entity';
import { DexAlert } from './entities/dex-alert.entity';

// Services
import { DexScreenerApiService } from './services/dex-screener-api.service';
import { DexDataService } from './services/dex-data.service';
import { DexVisualizationService } from './services/dex-visualization.service';
import { DexAlertService } from './services/dex-alert.service';
import { DexExportService } from './services/dex-export.service';

// Controllers
import { DexScreenerController } from './controllers/dex-screener.controller';

// Gateways
import { DexDataGateway } from './gateways/dex-data.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DexToken,
      DexPair,
      DexPriceHistory,
      DexVolumeHistory,
      DexLiquidityHistory,
      DexAlert,
    ]),
    HttpModule,
  ],
  controllers: [DexScreenerController],
  providers: [
    DexScreenerApiService,
    DexDataService,
    DexVisualizationService,
    DexAlertService,
    DexExportService,
    DexDataGateway,
  ],
  exports: [
    DexScreenerApiService,
    DexDataService,
    DexVisualizationService,
    DexAlertService,
    DexExportService,
  ],
})
export class DexScreenerModule {}
