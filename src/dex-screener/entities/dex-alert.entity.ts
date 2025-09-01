import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum DexAlertType {
  PRICE_CHANGE = 'price_change',
  VOLUME_SPIKE = 'volume_spike',
  LIQUIDITY_CHANGE = 'liquidity_change',
  NEW_PAIR = 'new_pair',
  PRICE_THRESHOLD = 'price_threshold',
  VOLUME_THRESHOLD = 'volume_threshold',
}

export enum DexAlertCondition {
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  PERCENTAGE_CHANGE = 'percentage_change',
  ABSOLUTE_CHANGE = 'absolute_change',
}

export enum DexAlertStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  TRIGGERED = 'triggered',
  DISABLED = 'disabled',
}

@Entity('dex_alerts')
@Index(['userId', 'status'])
@Index(['alertType', 'status'])
@Index(['pairId', 'status'])
export class DexAlert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: DexAlertType,
  })
  alertType: DexAlertType;

  @Column({
    type: 'enum',
    enum: DexAlertCondition,
  })
  condition: DexAlertCondition;

  @Column({ nullable: true })
  pairId: string;

  @Column({ nullable: true })
  tokenId: string;

  @Column({ nullable: true })
  chainId: string;

  @Column({ nullable: true })
  dexId: string;

  @Column('json')
  parameters: {
    threshold?: number;
    percentage?: number;
    timeWindow?: number; // in minutes
    priceThreshold?: number;
    volumeThreshold?: number;
    liquidityThreshold?: number;
  };

  @Column('simple-array')
  notificationChannels: string[]; // email, push, webhook, etc.

  @Column('json')
  notificationConfig: {
    email?: string;
    webhookUrl?: string;
    pushToken?: string;
  };

  @Column({
    type: 'enum',
    enum: DexAlertStatus,
    default: DexAlertStatus.ACTIVE,
  })
  status: DexAlertStatus;

  @Column({ default: 0 })
  triggerCount: number;

  @Column({ type: 'timestamp', nullable: true })
  lastTriggeredAt: Date;

  @Column({ default: true })
  isEnabled: boolean;

  @Column({ default: false })
  isShared: boolean;

  @Column({ nullable: true })
  sharedId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
