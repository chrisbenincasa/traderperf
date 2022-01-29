import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ExecutionType } from '../..';
import { Trade } from './Trade';

@Entity()
export class Execution {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() symbol: string;
  @Column() executionTimestamp: Date;
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
