import { dinero, toSnapshot } from 'dinero.js';
import _ from 'lodash';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Platform, Trade } from '../..';
import { currencyFromCode } from '../../../util/dineroCurrencyUtil';
import { ExecutionDao } from './ExecutionDao';

@Entity('trade')
@Unique('trade_per_user_uniq', ['userId', 'symbol', 'opened', 'platform'])
export class TradeDao {
  @PrimaryGeneratedColumn() id?: number;

  @Column() userId: number;

  @Column() symbol: string;

  // TODO: Deal with timezones better
  @Column() opened: Date;

  @Column({
    type: 'enum',
    enum: Platform,
    enumName: 'platform',
  })
  platform: Platform;

  @Column() closed?: Date;

  @OneToMany(() => ExecutionDao, (execution) => execution.trade, {
    eager: true,
    cascade: true,
  })
  executions: ExecutionDao[];

  @Column() quantity: number;

  @Column('bool') isOpen: boolean;

  @Column('bool') isShort: boolean;

  @Column() closedPl: number;
  @Column('int') closedPlScale: number;

  @Column() outflow: number;
  @Column('int') outflowScale: number;

  @Column() currency: string;

  static fromTrade(trade: Trade): TradeDao {
    const dao = new TradeDao();
    dao.userId = 1; // Hardcode for now
    dao.symbol = trade.symbol;
    dao.opened = trade.executions[0].timestamp.toJSDate();
    dao.platform = trade.platform;
    dao.closed = trade.isOpen
      ? undefined
      : _.last(trade.executions)?.timestamp.toJSDate();
    dao.executions = trade.executions.map((execution) =>
      ExecutionDao.fromExeuction(execution)
    );
    dao.quantity = trade.quantity;
    dao.isOpen = trade.isOpen;
    dao.isShort = trade.isShort;
    const plSnapshot = toSnapshot(trade.closedPl);
    dao.closedPl = plSnapshot.amount;
    dao.closedPlScale = plSnapshot.scale;

    const outflowSnapshot = toSnapshot(trade.outflow);
    dao.outflow = outflowSnapshot.amount;
    dao.outflowScale = outflowSnapshot.scale;

    dao.currency = plSnapshot.currency.code;

    return dao;
  }

  toTrade(): Trade {
    return {
      platform: this.platform,
      symbol: this.symbol,
      quantity: this.quantity,
      executions: this.executions.map((execution) => execution.toExecution()),
      isOpen: this.isOpen,
      isShort: this.isShort,
      closedPl: dinero({
        amount: this.closedPl,
        scale: this.closedPlScale,
        currency: currencyFromCode(this.currency)!,
      }),
      outflow: dinero({
        amount: this.outflow,
        scale: this.outflowScale,
        currency: currencyFromCode(this.currency)!,
      }),
    };
  }
}
