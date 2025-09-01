import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, OneToMany } from 'typeorm';
import { DexPair } from './dex-pair.entity';

@Entity('dex_tokens')
@Index(['chainId', 'address'])
@Index(['symbol'])
export class DexToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  chainId: string;

  @Column()
  address: string;

  @Column()
  symbol: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  decimals: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  priceUsd: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  priceChange24h: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  volume24h: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  marketCap: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  fdv: number; // Fully Diluted Valuation

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  liquidity: number;

  @Column({ type: 'json', nullable: true })
  metadata: {
    logoURI?: string;
    website?: string;
    twitter?: string;
    telegram?: string;
    discord?: string;
    description?: string;
  };

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isTracked: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => DexPair, pair => pair.baseToken)
  basePairs: DexPair[];

  @OneToMany(() => DexPair, pair => pair.quoteToken)
  quotePairs: DexPair[];
}
