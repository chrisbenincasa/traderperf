import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ExecutionType, Platform } from '../..';
import { Trade } from './Trade';

@Entity()
export class Execution {
  @PrimaryColumn() userId?: number;

  @PrimaryColumn() symbol: string;

  @PrimaryColumn() executionTimestamp: Date;

  @PrimaryColumn({
    type: 'enum',
    enum: Platform,
    enumName: 'platform',
  })
  platform: Platform;

  @Column({
    type: 'enum',
    enum: ExecutionType,
  })
  executionType: ExecutionType;

  @Column() quantity: number;

  @Column('money') pricePerShare: number;
  @Column('int') pricePerShareScale: number;

  @Column('money') totalOutflow: number;
  @Column('int') totalOutflowScale: number;

  @Column() currency: string;

  @ManyToOne(() => Trade, (trade) => trade.executions) trade: Trade;
}
