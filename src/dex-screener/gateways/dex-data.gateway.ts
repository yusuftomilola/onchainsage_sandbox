import { Injectable, Logger } from '@nestjs/common';
import { DexDataService } from '../services/dex-data.service';

@Injectable()
export class DexDataGateway {
  private readonly logger = new Logger(DexDataGateway.name);
  private connectedClients = new Map<string, Set<string>>();

  constructor(private readonly dexDataService: DexDataService) {}

  handleConnection(clientId: string) {
    this.logger.log(`Client connected: ${clientId}`);
  }

  handleDisconnect(clientId: string) {
    this.logger.log(`Client disconnected: ${clientId}`);
    
    // Clean up subscriptions
    for (const [room, clients] of this.connectedClients.entries()) {
      clients.delete(clientId);
      if (clients.size === 0) {
        this.connectedClients.delete(room);
      }
    }
  }

  async subscribeToPair(clientId: string, pairId: string) {
    const room = `pair-${pairId}`;
    
    if (!this.connectedClients.has(room)) {
      this.connectedClients.set(room, new Set());
    }
    this.connectedClients.get(room)?.add(clientId);
    
    this.logger.log(`Client ${clientId} subscribed to pair ${pairId}`);
    
    // Return current data
    const pairs = await this.dexDataService.getTrackedPairs();
    const pair = pairs.find(p => p.id === pairId);
    return pair;
  }

  async unsubscribeFromPair(clientId: string, pairId: string) {
    const room = `pair-${pairId}`;
    
    if (this.connectedClients.has(room)) {
      this.connectedClients.get(room)?.delete(clientId);
      if (this.connectedClients.get(room)?.size === 0) {
        this.connectedClients.delete(room);
      }
    }
    
    this.logger.log(`Client ${clientId} unsubscribed from pair ${pairId}`);
  }

  async subscribeToToken(clientId: string, tokenId: string) {
    const room = `token-${tokenId}`;
    
    if (!this.connectedClients.has(room)) {
      this.connectedClients.set(room, new Set());
    }
    this.connectedClients.get(room)?.add(clientId);
    
    this.logger.log(`Client ${clientId} subscribed to token ${tokenId}`);
    
    // Return current data
    const tokens = await this.dexDataService.getTrackedTokens();
    const token = tokens.find(t => t.id === tokenId);
    return token;
  }

  async unsubscribeFromToken(clientId: string, tokenId: string) {
    const room = `token-${tokenId}`;
    
    if (this.connectedClients.has(room)) {
      this.connectedClients.get(room)?.delete(clientId);
      if (this.connectedClients.get(room)?.size === 0) {
        this.connectedClients.delete(room);
      }
    }
    
    this.logger.log(`Client ${clientId} unsubscribed from token ${tokenId}`);
  }

  async subscribeToMarketOverview(clientId: string, chainId?: string) {
    const room = `market-overview-${chainId || 'all'}`;
    
    if (!this.connectedClients.has(room)) {
      this.connectedClients.set(room, new Set());
    }
    this.connectedClients.get(room)?.add(clientId);
    
    this.logger.log(`Client ${clientId} subscribed to market overview`);
    
    // Return current market data
    const [topGainers, topLosers, topVolume, topLiquidity] = await Promise.all([
      this.dexDataService.getTopGainers(chainId, 10),
      this.dexDataService.getTopLosers(chainId, 10),
      this.dexDataService.getTopVolume(chainId, 10),
      this.dexDataService.getTopLiquidity(chainId, 10),
    ]);
    
    return {
      topGainers,
      topLosers,
      topVolume,
      topLiquidity,
    };
  }

  async unsubscribeFromMarketOverview(clientId: string, chainId?: string) {
    const room = `market-overview-${chainId || 'all'}`;
    
    if (this.connectedClients.has(room)) {
      this.connectedClients.get(room)?.delete(clientId);
      if (this.connectedClients.get(room)?.size === 0) {
        this.connectedClients.delete(room);
      }
    }
    
    this.logger.log(`Client ${clientId} unsubscribed from market overview`);
  }

  // Broadcast methods for real-time updates (placeholder for future WebSocket implementation)
  broadcastPairUpdate(pairId: string, data: any) {
    this.logger.log(`Broadcasting pair update for ${pairId}:`, data);
  }

  broadcastTokenUpdate(tokenId: string, data: any) {
    this.logger.log(`Broadcasting token update for ${tokenId}:`, data);
  }

  broadcastMarketOverview(chainId: string, data: any) {
    this.logger.log(`Broadcasting market overview for ${chainId}:`, data);
  }

  broadcastAlert(alert: any) {
    this.logger.log(`Broadcasting alert:`, alert);
  }

  getConnectedClientsCount(): number {
    return Array.from(this.connectedClients.values()).reduce((total, clients) => total + clients.size, 0);
  }

  getSubscribedRooms(): string[] {
    return Array.from(this.connectedClients.keys());
  }
}
