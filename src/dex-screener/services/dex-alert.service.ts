import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DexAlert, DexAlertType, DexAlertCondition, DexAlertStatus } from '../entities/dex-alert.entity';
import { DexDataService } from './dex-data.service';

@Injectable()
export class DexAlertService {
  private readonly logger = new Logger(DexAlertService.name);

  constructor(
    @InjectRepository(DexAlert)
    private readonly alertRepository: Repository<DexAlert>,
    private readonly dexDataService: DexDataService,
  ) {}

  // @Cron(CronExpression.EVERY_MINUTE)
  async checkAlerts() {
    try {
      const activeAlerts = await this.alertRepository.find({
        where: { status: DexAlertStatus.ACTIVE, isEnabled: true },
      });

      for (const alert of activeAlerts) {
        await this.evaluateAlert(alert);
      }

      this.logger.log(`Checked ${activeAlerts.length} active alerts`);
    } catch (error) {
      this.logger.error('Error checking alerts:', error);
    }
  }

  async createAlert(alertData: Partial<DexAlert>): Promise<DexAlert> {
    const alert = this.alertRepository.create(alertData);
    return await this.alertRepository.save(alert);
  }

  async getAlerts(userId?: string, status?: DexAlertStatus): Promise<DexAlert[]> {
    const where: any = {};
    if (userId) where.userId = userId;
    if (status) where.status = status;

    return this.alertRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async updateAlert(id: string, updateData: Partial<DexAlert>): Promise<DexAlert | null> {
    await this.alertRepository.update(id, updateData);
    return await this.alertRepository.findOne({ where: { id } });
  }

  async deleteAlert(id: string): Promise<void> {
    await this.alertRepository.delete(id);
  }

  async toggleAlert(id: string): Promise<DexAlert | null> {
    const alert = await this.alertRepository.findOne({ where: { id } });
    if (alert) {
      alert.isEnabled = !alert.isEnabled;
      return await this.alertRepository.save(alert);
    }
    return null;
  }

  private async evaluateAlert(alert: DexAlert): Promise<void> {
    try {
      let shouldTrigger = false;
      let triggerData: any = {};

      switch (alert.alertType) {
        case DexAlertType.PRICE_CHANGE:
          shouldTrigger = await this.checkPriceChangeAlert(alert, triggerData);
          break;
        case DexAlertType.VOLUME_SPIKE:
          shouldTrigger = await this.checkVolumeSpikeAlert(alert, triggerData);
          break;
        case DexAlertType.LIQUIDITY_CHANGE:
          shouldTrigger = await this.checkLiquidityChangeAlert(alert, triggerData);
          break;
        case DexAlertType.PRICE_THRESHOLD:
          shouldTrigger = await this.checkPriceThresholdAlert(alert, triggerData);
          break;
        case DexAlertType.VOLUME_THRESHOLD:
          shouldTrigger = await this.checkVolumeThresholdAlert(alert, triggerData);
          break;
      }

      if (shouldTrigger) {
        await this.triggerAlert(alert, triggerData);
      }
    } catch (error) {
      this.logger.error(`Error evaluating alert ${alert.id}:`, error);
    }
  }

  private async checkPriceChangeAlert(alert: DexAlert, triggerData: any): Promise<boolean> {
    if (!alert.pairId) return false;

    const pairs = await this.dexDataService.getTrackedPairs();
    const pair = pairs.find(p => p.id === alert.pairId);
    if (!pair) return false;

    const change = pair.priceChange24h;
    triggerData.currentPrice = pair.priceUsd;
    triggerData.priceChange = change;

    switch (alert.condition) {
      case DexAlertCondition.GREATER_THAN:
        return change > (alert.parameters.threshold || 0);
      case DexAlertCondition.LESS_THAN:
        return change < (alert.parameters.threshold || 0);
      case DexAlertCondition.PERCENTAGE_CHANGE:
        return Math.abs(change) > (alert.parameters.percentage || 0);
      default:
        return false;
    }
  }

  private async checkVolumeSpikeAlert(alert: DexAlert, triggerData: any): Promise<boolean> {
    if (!alert.pairId) return false;

    const pairs = await this.dexDataService.getTrackedPairs();
    const pair = pairs.find(p => p.id === alert.pairId);
    if (!pair) return false;

    const volume = pair.volume24h;
    triggerData.currentVolume = volume;

    switch (alert.condition) {
      case DexAlertCondition.GREATER_THAN:
        return volume > (alert.parameters.volumeThreshold || 0);
      case DexAlertCondition.PERCENTAGE_CHANGE:
        // Compare with historical average (simplified)
        return volume > (alert.parameters.volumeThreshold || 0) * 2;
      default:
        return false;
    }
  }

  private async checkLiquidityChangeAlert(alert: DexAlert, triggerData: any): Promise<boolean> {
    if (!alert.pairId) return false;

    const pairs = await this.dexDataService.getTrackedPairs();
    const pair = pairs.find(p => p.id === alert.pairId);
    if (!pair) return false;

    const liquidity = pair.liquidityUsd;
    triggerData.currentLiquidity = liquidity;

    switch (alert.condition) {
      case DexAlertCondition.GREATER_THAN:
        return liquidity > (alert.parameters.liquidityThreshold || 0);
      case DexAlertCondition.LESS_THAN:
        return liquidity < (alert.parameters.liquidityThreshold || 0);
      default:
        return false;
    }
  }

  private async checkPriceThresholdAlert(alert: DexAlert, triggerData: any): Promise<boolean> {
    if (!alert.pairId) return false;

    const pairs = await this.dexDataService.getTrackedPairs();
    const pair = pairs.find(p => p.id === alert.pairId);
    if (!pair) return false;

    const price = pair.priceUsd;
    triggerData.currentPrice = price;

    switch (alert.condition) {
      case DexAlertCondition.GREATER_THAN:
        return price > (alert.parameters.priceThreshold || 0);
      case DexAlertCondition.LESS_THAN:
        return price < (alert.parameters.priceThreshold || 0);
      default:
        return false;
    }
  }

  private async checkVolumeThresholdAlert(alert: DexAlert, triggerData: any): Promise<boolean> {
    if (!alert.pairId) return false;

    const pairs = await this.dexDataService.getTrackedPairs();
    const pair = pairs.find(p => p.id === alert.pairId);
    if (!pair) return false;

    const volume = pair.volume24h;
    triggerData.currentVolume = volume;

    switch (alert.condition) {
      case DexAlertCondition.GREATER_THAN:
        return volume > (alert.parameters.volumeThreshold || 0);
      case DexAlertCondition.LESS_THAN:
        return volume < (alert.parameters.volumeThreshold || 0);
      default:
        return false;
    }
  }

  private async triggerAlert(alert: DexAlert, triggerData: any): Promise<void> {
    // Check cooldown period (5 minutes)
    const cooldownPeriod = 5 * 60 * 1000;
    if (alert.lastTriggeredAt && 
        Date.now() - alert.lastTriggeredAt.getTime() < cooldownPeriod) {
      return;
    }

    // Update alert
    alert.triggerCount += 1;
    alert.lastTriggeredAt = new Date();
    await this.alertRepository.save(alert);

    // Send notifications
    await this.sendNotifications(alert, triggerData);

    this.logger.log(`Alert triggered: ${alert.name} (${alert.id})`);
  }

  private async sendNotifications(alert: DexAlert, triggerData: any): Promise<void> {
    const message = this.formatAlertMessage(alert, triggerData);

    for (const channel of alert.notificationChannels) {
      try {
        switch (channel) {
          case 'email':
            await this.sendEmailNotification(alert, message);
            break;
          case 'webhook':
            await this.sendWebhookNotification(alert, message);
            break;
          case 'push':
            await this.sendPushNotification(alert, message);
            break;
        }
      } catch (error) {
        this.logger.error(`Failed to send ${channel} notification for alert ${alert.id}:`, error);
      }
    }
  }

  private formatAlertMessage(alert: DexAlert, triggerData: any): string {
    const baseMessage = `DEX Alert: ${alert.name}`;
    
    switch (alert.alertType) {
      case DexAlertType.PRICE_CHANGE:
        return `${baseMessage} - Price changed by ${triggerData.priceChange?.toFixed(2)}%`;
      case DexAlertType.VOLUME_SPIKE:
        return `${baseMessage} - Volume spike: $${triggerData.currentVolume?.toLocaleString()}`;
      case DexAlertType.LIQUIDITY_CHANGE:
        return `${baseMessage} - Liquidity: $${triggerData.currentLiquidity?.toLocaleString()}`;
      case DexAlertType.PRICE_THRESHOLD:
        return `${baseMessage} - Price reached $${triggerData.currentPrice?.toFixed(2)}`;
      case DexAlertType.VOLUME_THRESHOLD:
        return `${baseMessage} - Volume reached $${triggerData.currentVolume?.toLocaleString()}`;
      default:
        return baseMessage;
    }
  }

  private async sendEmailNotification(alert: DexAlert, message: string): Promise<void> {
    // Implement email notification logic
    this.logger.log(`Email notification sent to ${alert.notificationConfig.email}: ${message}`);
  }

  private async sendWebhookNotification(alert: DexAlert, message: string): Promise<void> {
    // Implement webhook notification logic
    this.logger.log(`Webhook notification sent to ${alert.notificationConfig.webhookUrl}: ${message}`);
  }

  private async sendPushNotification(alert: DexAlert, message: string): Promise<void> {
    // Implement push notification logic
    this.logger.log(`Push notification sent: ${message}`);
  }
}