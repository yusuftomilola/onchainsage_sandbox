import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { DexPair } from './dex-pair.entity';

@Entity('dex_price_history')
@Index(['pairId', 'timestamp'])
@Index(['timestamp'])
export class DexPriceHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  pairId: string;

  @ManyToOne(() => DexPair, pair => pair.priceHistory)
  @JoinColumn({ name: 'pairId' })
  pair: DexPair;

  @Column({ type: 'decimal', precision: 20, scale: 8 })
  priceUsd: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  priceChange1h: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  priceChange24h: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  priceChange7d: number;

  @Column({ type: 'timestamp' })
  timestamp: Date;

  @CreateDateColumn()
  createdAt: Date;
}
