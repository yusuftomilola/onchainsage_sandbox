import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { DexPair } from './dex-pair.entity';

@Entity('dex_volume_history')
@Index(['pairId', 'timestamp'])
@Index(['timestamp'])
export class DexVolumeHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  pairId: string;

  @ManyToOne(() => DexPair, pair => pair.volumeHistory)
  @JoinColumn({ name: 'pairId' })
  pair: DexPair;

  @Column({ type: 'decimal', precision: 20, scale: 8 })
  volume24h: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  volume1h: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  volume5m: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  volumeChange24h: number;

  @Column({ type: 'timestamp' })
  timestamp: Date;

  @CreateDateColumn()
  createdAt: Date;
}
