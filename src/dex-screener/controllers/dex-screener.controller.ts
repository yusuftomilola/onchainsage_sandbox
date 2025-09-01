import { Controller, Get, Post, Put, Delete, Body, Param, Query, Res, HttpStatus, HttpException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { DexScreenerApiService } from '../services/dex-screener-api.service';
import { DexDataService } from '../services/dex-data.service';
import { DexVisualizationService } from '../services/dex-visualization.service';
import { DexAlertService } from '../services/dex-alert.service';
import { DexExportService } from '../services/dex-export.service';
import { DexDataGateway } from '../gateways/dex-data.gateway';
import { CreateDexTokenDto, UpdateDexTokenDto } from '../dto/dex-token.dto';
import { CreateDexPairDto, UpdateDexPairDto } from '../dto/dex-pair.dto';
import { CreateDexAlertDto, UpdateDexAlertDto, DexAlertQueryDto } from '../dto/dex-alert.dto';
import { DexExportRequestDto } from '../dto/dex-export.dto';

@ApiTags('DEX Screener')
@Controller('dex-screener')
export class DexScreenerController {
  constructor(
    private readonly dexScreenerApiService: DexScreenerApiService,
    private readonly dexDataService: DexDataService,
    private readonly dexVisualizationService: DexVisualizationService,
    private readonly dexAlertService: DexAlertService,
    private readonly dexExportService: DexExportService,
    private readonly dexDataGateway: DexDataGateway,
  ) {}

  // Token endpoints
  @Get('tokens')
  @ApiOperation({ summary: 'Get tracked tokens' })
  @ApiQuery({ name: 'chainId', required: false })
  async getTrackedTokens(@Query('chainId') chainId?: string) {
    try {
      const tokens = await this.dexDataService.getTrackedTokens(chainId);
      return {
        statusCode: HttpStatus.OK,
        message: 'Tokens retrieved successfully',
        data: tokens,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('tokens')
  @ApiOperation({ summary: 'Create a new token' })
  async createToken(@Body() createTokenDto: CreateDexTokenDto) {
    try {
      // Implementation would create token in database
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Token created successfully',
        data: createTokenDto,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('tokens/:id')
  @ApiOperation({ summary: 'Update a token' })
  @ApiParam({ name: 'id', description: 'Token ID' })
  async updateToken(@Param('id') id: string, @Body() updateTokenDto: UpdateDexTokenDto) {
    try {
      // Implementation would update token in database
      return {
        statusCode: HttpStatus.OK,
        message: 'Token updated successfully',
        data: { id, ...updateTokenDto },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('tokens/:id/toggle-tracking')
  @ApiOperation({ summary: 'Toggle token tracking' })
  @ApiParam({ name: 'id', description: 'Token ID' })
  async toggleTokenTracking(@Param('id') id: string) {
    try {
      const token = await this.dexDataService.toggleTokenTracking(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'Token tracking toggled successfully',
        data: token,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Pair endpoints
  @Get('pairs')
  @ApiOperation({ summary: 'Get tracked pairs' })
  @ApiQuery({ name: 'chainId', required: false })
  @ApiQuery({ name: 'dexId', required: false })
  async getTrackedPairs(@Query('chainId') chainId?: string, @Query('dexId') dexId?: string) {
    try {
      const pairs = await this.dexDataService.getTrackedPairs(chainId, dexId);
      return {
        statusCode: HttpStatus.OK,
        message: 'Pairs retrieved successfully',
        data: pairs,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('pairs/search')
  @ApiOperation({ summary: 'Search pairs' })
  @ApiQuery({ name: 'q', description: 'Search query' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limit results' })
  async searchPairs(@Query('q') query: string, @Query('limit') limit = 20) {
    try {
      const pairs = await this.dexScreenerApiService.searchPairs(query, limit);
      return {
        statusCode: HttpStatus.OK,
        message: 'Pairs found successfully',
        data: pairs,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('pairs/top')
  @ApiOperation({ summary: 'Get top pairs' })
  @ApiQuery({ name: 'chainId', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getTopPairs(@Query('chainId') chainId?: string, @Query('limit') limit = 100) {
    try {
      const pairs = await this.dexScreenerApiService.getTopPairs(chainId, limit);
      return {
        statusCode: HttpStatus.OK,
        message: 'Top pairs retrieved successfully',
        data: pairs,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('pairs/gainers')
  @ApiOperation({ summary: 'Get top gainers' })
  @ApiQuery({ name: 'chainId', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getTopGainers(@Query('chainId') chainId?: string, @Query('limit') limit = 50) {
    try {
      const gainers = await this.dexDataService.getTopGainers(chainId, limit);
      return {
        statusCode: HttpStatus.OK,
        message: 'Top gainers retrieved successfully',
        data: gainers,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('pairs/losers')
  @ApiOperation({ summary: 'Get top losers' })
  @ApiQuery({ name: 'chainId', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getTopLosers(@Query('chainId') chainId?: string, @Query('limit') limit = 50) {
    try {
      const losers = await this.dexDataService.getTopLosers(chainId, limit);
      return {
        statusCode: HttpStatus.OK,
        message: 'Top losers retrieved successfully',
        data: losers,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('pairs/volume')
  @ApiOperation({ summary: 'Get top volume pairs' })
  @ApiQuery({ name: 'chainId', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getTopVolume(@Query('chainId') chainId?: string, @Query('limit') limit = 50) {
    try {
      const volume = await this.dexDataService.getTopVolume(chainId, limit);
      return {
        statusCode: HttpStatus.OK,
        message: 'Top volume pairs retrieved successfully',
        data: volume,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('pairs/liquidity')
  @ApiOperation({ summary: 'Get top liquidity pairs' })
  @ApiQuery({ name: 'chainId', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getTopLiquidity(@Query('chainId') chainId?: string, @Query('limit') limit = 50) {
    try {
      const liquidity = await this.dexDataService.getTopLiquidity(chainId, limit);
      return {
        statusCode: HttpStatus.OK,
        message: 'Top liquidity pairs retrieved successfully',
        data: liquidity,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('pairs/:id/toggle-tracking')
  @ApiOperation({ summary: 'Toggle pair tracking' })
  @ApiParam({ name: 'id', description: 'Pair ID' })
  async togglePairTracking(@Param('id') id: string) {
    try {
      const pair = await this.dexDataService.togglePairTracking(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'Pair tracking toggled successfully',
        data: pair,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Historical data endpoints
  @Get('pairs/:id/price-history')
  @ApiOperation({ summary: 'Get price history for a pair' })
  @ApiParam({ name: 'id', description: 'Pair ID' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getPriceHistory(
    @Param('id') id: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit = 1000,
  ) {
    try {
      const start = startDate ? new Date(startDate) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const end = endDate ? new Date(endDate) : new Date();
      
      const history = await this.dexDataService.getPriceHistory(id, start, end, limit);
      return {
        statusCode: HttpStatus.OK,
        message: 'Price history retrieved successfully',
        data: history,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('pairs/:id/volume-history')
  @ApiOperation({ summary: 'Get volume history for a pair' })
  @ApiParam({ name: 'id', description: 'Pair ID' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getVolumeHistory(
    @Param('id') id: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit = 1000,
  ) {
    try {
      const start = startDate ? new Date(startDate) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const end = endDate ? new Date(endDate) : new Date();
      
      const history = await this.dexDataService.getVolumeHistory(id, start, end, limit);
      return {
        statusCode: HttpStatus.OK,
        message: 'Volume history retrieved successfully',
        data: history,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('pairs/:id/liquidity-history')
  @ApiOperation({ summary: 'Get liquidity history for a pair' })
  @ApiParam({ name: 'id', description: 'Pair ID' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getLiquidityHistory(
    @Param('id') id: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit = 1000,
  ) {
    try {
      const start = startDate ? new Date(startDate) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const end = endDate ? new Date(endDate) : new Date();
      
      const history = await this.dexDataService.getLiquidityHistory(id, start, end, limit);
      return {
        statusCode: HttpStatus.OK,
        message: 'Liquidity history retrieved successfully',
        data: history,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Visualization endpoints
  @Get('pairs/:id/charts/price')
  @ApiOperation({ summary: 'Get price chart data' })
  @ApiParam({ name: 'id', description: 'Pair ID' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  async getPriceChart(
    @Param('id') id: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    try {
      const start = startDate ? new Date(startDate) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const end = endDate ? new Date(endDate) : new Date();
      
      const chart = await this.dexVisualizationService.generatePriceChart(id, start, end);
      return {
        statusCode: HttpStatus.OK,
        message: 'Price chart data retrieved successfully',
        data: chart,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('pairs/:id/charts/volume')
  @ApiOperation({ summary: 'Get volume chart data' })
  @ApiParam({ name: 'id', description: 'Pair ID' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  async getVolumeChart(
    @Param('id') id: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    try {
      const start = startDate ? new Date(startDate) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const end = endDate ? new Date(endDate) : new Date();
      
      const chart = await this.dexVisualizationService.generateVolumeChart(id, start, end);
      return {
        statusCode: HttpStatus.OK,
        message: 'Volume chart data retrieved successfully',
        data: chart,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('pairs/:id/charts/combined')
  @ApiOperation({ summary: 'Get combined chart data' })
  @ApiParam({ name: 'id', description: 'Pair ID' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  async getCombinedChart(
    @Param('id') id: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    try {
      const start = startDate ? new Date(startDate) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const end = endDate ? new Date(endDate) : new Date();
      
      const chart = await this.dexVisualizationService.generateCombinedChart(id, start, end);
      return {
        statusCode: HttpStatus.OK,
        message: 'Combined chart data retrieved successfully',
        data: chart,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('market-overview/charts')
  @ApiOperation({ summary: 'Get market overview charts' })
  @ApiQuery({ name: 'chainId', required: false })
  async getMarketOverviewCharts(@Query('chainId') chainId?: string) {
    try {
      const charts = await this.dexVisualizationService.generateMarketOverviewCharts(chainId);
      return {
        statusCode: HttpStatus.OK,
        message: 'Market overview charts retrieved successfully',
        data: charts,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Alert endpoints
  @Get('alerts')
  @ApiOperation({ summary: 'Get alerts' })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'status', required: false })
  async getAlerts(@Query() query: DexAlertQueryDto) {
    try {
      const alerts = await this.dexAlertService.getAlerts(query.userId, query.status);
      return {
        statusCode: HttpStatus.OK,
        message: 'Alerts retrieved successfully',
        data: alerts,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('alerts')
  @ApiOperation({ summary: 'Create a new alert' })
  async createAlert(@Body() createAlertDto: CreateDexAlertDto) {
    try {
      const alert = await this.dexAlertService.createAlert(createAlertDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Alert created successfully',
        data: alert,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('alerts/:id')
  @ApiOperation({ summary: 'Update an alert' })
  @ApiParam({ name: 'id', description: 'Alert ID' })
  async updateAlert(@Param('id') id: string, @Body() updateAlertDto: UpdateDexAlertDto) {
    try {
      const alert = await this.dexAlertService.updateAlert(id, updateAlertDto);
      return {
        statusCode: HttpStatus.OK,
        message: 'Alert updated successfully',
        data: alert,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('alerts/:id')
  @ApiOperation({ summary: 'Delete an alert' })
  @ApiParam({ name: 'id', description: 'Alert ID' })
  async deleteAlert(@Param('id') id: string) {
    try {
      await this.dexAlertService.deleteAlert(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'Alert deleted successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('alerts/:id/toggle')
  @ApiOperation({ summary: 'Toggle alert enabled/disabled' })
  @ApiParam({ name: 'id', description: 'Alert ID' })
  async toggleAlert(@Param('id') id: string) {
    try {
      const alert = await this.dexAlertService.toggleAlert(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'Alert toggled successfully',
        data: alert,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Export endpoints
  @Post('export')
  @ApiOperation({ summary: 'Export DEX data' })
  async exportData(@Body() exportRequest: DexExportRequestDto) {
    try {
      const filename = await this.dexExportService.exportData(exportRequest);
      return {
        statusCode: HttpStatus.OK,
        message: 'Export completed successfully',
        data: { filename, downloadUrl: `/dex-screener/export/${filename}` },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('export/:filename')
  @ApiOperation({ summary: 'Download exported file' })
  @ApiParam({ name: 'filename', description: 'Export filename' })
  async downloadExport(@Param('filename') filename: string, @Res() res: Response) {
    try {
      const filepath = this.dexExportService.getExportPath(filename);
      res.download(filepath, filename);
    } catch (error) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }
  }

  // WebSocket status
  @Get('websocket/status')
  @ApiOperation({ summary: 'Get WebSocket connection status' })
  async getWebSocketStatus() {
    try {
      return {
        statusCode: HttpStatus.OK,
        message: 'WebSocket status retrieved successfully',
        data: {
          connectedClients: this.dexDataGateway.getConnectedClientsCount(),
          subscribedRooms: this.dexDataGateway.getSubscribedRooms(),
        },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
