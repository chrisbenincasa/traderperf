import { dinero, toSnapshot } from 'dinero.js';
import _ from 'lodash';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Platform, Trade } from '../..';
import { currencyFromCode } from '../../../util/dineroCurrencyUtil';
import { ExecutionDao } from './ExecutionDao';

@Entity('trade')
export class TradeDao {
  @PrimaryColumn() userId?: number;

  @PrimaryColumn() symbol: string;

  // TODO: Deal with timezones better
  @PrimaryColumn() opened: Date;

  @PrimaryColumn({
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
