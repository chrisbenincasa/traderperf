import { dinero, toSnapshot } from 'dinero.js';
import { DateTime } from 'luxon';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Execution, ExecutionType, Platform } from '../..';
import { currencyFromCode } from '../../../util/dineroCurrencyUtil';
import { TradeDao } from './TradeDao';

@Entity('execution')
@Unique('execution_per_user_uniq', [
  'userId',
  'symbol',
  'executionTimestamp',
  'platform',
])
export class ExecutionDao {
  @PrimaryGeneratedColumn() id: number;

  @Column() userId: number;

  @Column() symbol: string;

  // TODO: Deal with timezones better
  @Column() executionTimestamp: Date;

  @Column({
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

  @Column() pricePerShare: number;
  @Column('int') pricePerShareScale: number;

  @Column() totalOutflow: number;
  @Column('int') totalOutflowScale: number;

  @Column() currency: string;

  @ManyToOne(() => TradeDao, (trade) => trade.executions) trade: TradeDao;

  static fromExeuction(execution: Execution): ExecutionDao {
    const dao = new ExecutionDao();
    dao.userId = 1; // Hardcode right now
    dao.symbol = execution.symbol;
    dao.executionTimestamp = execution.timestamp.toJSDate();
    dao.platform = execution.platform;
    dao.executionType = execution.executionType;
    dao.quantity = execution.quantity;
    const ppsSnapshot = toSnapshot(execution.pps);
    dao.pricePerShare = ppsSnapshot.amount;
    dao.pricePerShareScale = ppsSnapshot.scale;
    dao.currency = ppsSnapshot.currency.code;
    const outflowSnapshot = toSnapshot(execution.totalOutflow);
    dao.totalOutflow = outflowSnapshot.amount;
    dao.totalOutflowScale = outflowSnapshot.scale;
    return dao;
  }

  toExecution(): Execution {
    return {
      platform: this.platform,
      symbol: this.symbol,
      executionType: this.executionType,
      timestamp: DateTime.fromJSDate(this.executionTimestamp),
      quantity: this.quantity,
      pps: dinero({
        amount: this.pricePerShare,
        scale: this.pricePerShareScale,
        currency: currencyFromCode(this.currency)!,
      }),
      totalOutflow: dinero({
        amount: this.totalOutflow,
        scale: this.totalOutflowScale,
        currency: currencyFromCode(this.currency)!,
      }),
    };
  }
}
