# DEX Screener Integration Module

This module provides comprehensive DEX (Decentralized Exchange) data integration with real-time price, volume, and liquidity tracking capabilities.

## Features Implemented

### ✅ Real-time Data Integration
- **DEX Screener API Integration**: Fetches real-time data from DEX Screener API
- **Multi-chain Support**: Supports multiple blockchains and DEXs
- **Token & Pair Tracking**: Track individual tokens and trading pairs
- **Historical Data Storage**: Stores price, volume, and liquidity history

### ✅ Alert System
- **Price Change Alerts**: Monitor price movements with configurable thresholds
- **Volume Spike Detection**: Alert on unusual volume activity
- **Liquidity Monitoring**: Track liquidity changes
- **Multiple Notification Channels**: Email, webhook, and push notifications
- **Customizable Conditions**: Greater than, less than, percentage changes

### ✅ Data Visualization
- **Interactive Charts**: Price, volume, and liquidity charts
- **Combined Views**: Multi-metric charts for comprehensive analysis
- **Market Overview**: Top gainers, losers, volume, and liquidity rankings
- **Historical Analysis**: Time-series data visualization

### ✅ Data Export
- **Multiple Formats**: CSV, JSON, and Excel export
- **Flexible Filtering**: Export by chain, DEX, time range, and specific pairs
- **Analytics Export**: Market overview and ranking data
- **Historical Data Export**: Price, volume, and liquidity history

### ✅ REST API Endpoints
- **Token Management**: CRUD operations for tracked tokens
- **Pair Management**: Search, track, and manage trading pairs
- **Historical Data**: Access to price, volume, and liquidity history
- **Chart Data**: Pre-formatted data for visualization
- **Alert Management**: Create, update, and manage alerts
- **Export Functionality**: Data export with download links

## API Endpoints

### Tokens
- `GET /dex-screener/tokens` - Get tracked tokens
- `POST /dex-screener/tokens` - Create new token
- `PUT /dex-screener/tokens/:id` - Update token
- `POST /dex-screener/tokens/:id/toggle-tracking` - Toggle tracking

### Pairs
- `GET /dex-screener/pairs` - Get tracked pairs
- `GET /dex-screener/pairs/search` - Search pairs
- `GET /dex-screener/pairs/top` - Get top pairs
- `GET /dex-screener/pairs/gainers` - Get top gainers
- `GET /dex-screener/pairs/losers` - Get top losers
- `GET /dex-screener/pairs/volume` - Get top volume pairs
- `GET /dex-screener/pairs/liquidity` - Get top liquidity pairs

### Historical Data
- `GET /dex-screener/pairs/:id/price-history` - Get price history
- `GET /dex-screener/pairs/:id/volume-history` - Get volume history
- `GET /dex-screener/pairs/:id/liquidity-history` - Get liquidity history

### Charts
- `GET /dex-screener/pairs/:id/charts/price` - Get price chart data
- `GET /dex-screener/pairs/:id/charts/volume` - Get volume chart data
- `GET /dex-screener/pairs/:id/charts/combined` - Get combined chart data
- `GET /dex-screener/market-overview/charts` - Get market overview charts

### Alerts
- `GET /dex-screener/alerts` - Get alerts
- `POST /dex-screener/alerts` - Create alert
- `PUT /dex-screener/alerts/:id` - Update alert
- `DELETE /dex-screener/alerts/:id` - Delete alert
- `POST /dex-screener/alerts/:id/toggle` - Toggle alert

### Export
- `POST /dex-screener/export` - Export data
- `GET /dex-screener/export/:filename` - Download exported file

## Database Schema

### Entities
- **DexToken**: Token information and current metrics
- **DexPair**: Trading pair data and current metrics
- **DexPriceHistory**: Historical price data
- **DexVolumeHistory**: Historical volume data
- **DexLiquidityHistory**: Historical liquidity data
- **DexAlert**: Alert configurations and settings

## Services

### DexScreenerApiService
- Fetches data from DEX Screener API
- Updates tracked pairs automatically
- Handles token and pair data synchronization

### DexDataService
- Manages token and pair data
- Provides data access methods
- Handles tracking toggles

### DexVisualizationService
- Generates chart configurations
- Creates market overview data
- Formats data for visualization

### DexAlertService
- Manages alert configurations
- Evaluates alert conditions
- Sends notifications

### DexExportService
- Handles data export in multiple formats
- Manages export files
- Provides download functionality

## Configuration

The module requires the following dependencies:
- `@nestjs/axios` for HTTP requests
- `@nestjs/typeorm` for database operations
- `@nestjs/websockets` for real-time updates (optional)
- `@nestjs/schedule` for cron jobs (optional)

## Usage Example

```typescript
// Get top gainers
const gainers = await dexDataService.getTopGainers('ethereum', 10);

// Create price alert
const alert = await dexAlertService.createAlert({
  userId: 'user123',
  name: 'ETH Price Alert',
  alertType: DexAlertType.PRICE_THRESHOLD,
  condition: DexAlertCondition.GREATER_THAN,
  parameters: { priceThreshold: 3000 },
  notificationChannels: ['email'],
  notificationConfig: { email: 'user@example.com' }
});

// Export data
const filename = await dexExportService.exportData({
  exportType: ExportType.PAIRS,
  format: ExportFormat.CSV,
  chainId: 'ethereum'
});
```

## Future Enhancements

- WebSocket real-time updates
- Advanced charting with more indicators
- Machine learning price predictions
- Social sentiment integration
- Portfolio tracking integration
- Advanced alert conditions
- Mobile push notifications
- API rate limiting and caching
