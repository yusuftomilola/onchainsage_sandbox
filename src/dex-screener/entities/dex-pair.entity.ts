import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { DexToken } from './dex-token.entity';
import { DexPriceHistory } from './dex-price-history.entity';
import { DexVolumeHistory } from './dex-volume-history.entity';
import { DexLiquidityHistory } from './dex-liquidity-history.entity';

@Entity('dex_pairs')
@Index(['chainId', 'dexId'])
@Index(['pairAddress'])
@Index(['baseTokenId', 'quoteTokenId'])
export class DexPair {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  chainId: string;

  @Column()
  dexId: string;

  @Column()
  pairAddress: string;

  @Column()
  baseTokenId: string;

  @Column()
  quoteTokenId: string;

  @ManyToOne(() => DexToken, token => token.basePairs)
  @JoinColumn({ name: 'baseTokenId' })
  baseToken: DexToken;

  @ManyToOne(() => DexToken, token => token.quotePairs)
  @JoinColumn({ name: 'quoteTokenId' })
  quoteToken: DexToken;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  priceUsd: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  priceChange24h: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  priceChange1h: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  priceChange5m: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  volume24h: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  volume1h: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  volume5m: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  liquidityUsd: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  fdv: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  marketCap: number;

  @Column({ type: 'json', nullable: true })
  pairCreatedAt: Date;

  @Column({ type: 'json', nullable: true })
  metadata: {
    pairUrl?: string;
    dexUrl?: string;
    infoUrl?: string;
  };

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isTracked: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => DexPriceHistory, history => history.pair)
  priceHistory: DexPriceHistory[];

  @OneToMany(() => DexVolumeHistory, history => history.pair)
  volumeHistory: DexVolumeHistory[];

  @OneToMany(() => DexLiquidityHistory, history => history.pair)
  liquidityHistory: DexLiquidityHistory[];
}
