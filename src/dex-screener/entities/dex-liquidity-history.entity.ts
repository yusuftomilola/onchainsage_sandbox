import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { DexPair } from './dex-pair.entity';

@Entity('dex_liquidity_history')
@Index(['pairId', 'timestamp'])
@Index(['timestamp'])
export class DexLiquidityHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  pairId: string;

  @ManyToOne(() => DexPair, pair => pair.liquidityHistory)
  @JoinColumn({ name: 'pairId' })
  pair: DexPair;

  @Column({ type: 'decimal', precision: 20, scale: 8 })
  liquidityUsd: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  liquidityChange24h: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  liquidityChange1h: number;

  @Column({ type: 'timestamp' })
  timestamp: Date;

  @CreateDateColumn()
  createdAt: Date;
}
