import { Dinero, DineroSnapshot, toSnapshot } from 'dinero.js';
import _ from 'lodash';
import { DateTime } from 'luxon';
import { dineroFromSnapshot } from '../util/dineroUtil';

export type TraderperfRequest<T> = {
  data: T;
};

export type TraderperfResponse<T> = {
  data: T;
};

export enum ExecutionType {
  BUY_TO_OPEN = 'buy_to_open',
  SELL_TO_OPEN = 'sell_to_open',
  BUY_TO_CLOSE = 'buy_to_close',
  SELL_TO_CLOSE = 'sell_to_close',
}

export enum Platform {
  INTERACTIVE_BROKERS = 'interactive_brokers',
  THINKORSWIM = 'thinkorswim',
  TASTYWORKS = 'tastyworks',
}

export const allPlatforms: Platform[] = (() => {
  const values = Object.values(Platform);
  const ret: Platform[] = [];
  for (let index = 0; index < values.length; index++) {
    const element = values[index];
    if (_.isString(element)) {
      ret.push(element);
    }
  }
  return ret.sort();
})();

export const platformToPrettyString = (p: Platform): string => {
  switch (p) {
    case Platform.INTERACTIVE_BROKERS:
      return 'Interactive Brokers';
    case Platform.THINKORSWIM:
      return 'ThinkOrSwim';
    case Platform.TASTYWORKS:
      return 'Tastyworks';
  }
};

export interface ExecutionJson {
  platform: Platform;
  symbol: string;
  executionType: ExecutionType;
  timestamp: number;
  quantity: number;
  pps: DineroSnapshot<number>;
  totalOutflow: DineroSnapshot<number>;
}

export interface Execution {
  platform: Platform;
  symbol: string;
  executionType: ExecutionType;
  timestamp: DateTime;
  quantity: number;
  pps: Dinero<number>;
  totalOutflow: Dinero<number>;
}

export const fromExeuctionJson = (executionJson: ExecutionJson): Execution => {
  return {
    platform: executionJson.platform,
    symbol: executionJson.symbol,
    executionType: executionJson.executionType,
    // TODO: Deal with timezones better
    timestamp: DateTime.fromMillis(executionJson.timestamp),
    quantity: executionJson.quantity,
    pps: dineroFromSnapshot(executionJson.pps),
    totalOutflow: dineroFromSnapshot(executionJson.totalOutflow),
  };
};

export const toExecutionJson = (execution: Execution): ExecutionJson => {
  return {
    platform: execution.platform,
    symbol: execution.symbol,
    executionType: execution.executionType,
    // TODO: Deal with timezones better
    timestamp: execution.timestamp.toMillis(),
    quantity: execution.quantity,
    pps: toSnapshot(execution.pps),
    totalOutflow: toSnapshot(execution.totalOutflow),
  };
};

export interface TradeJson {
  platform: Platform;
  symbol: string;
  quantity: number;
  executions: ExecutionJson[];
  isOpen: boolean;
  isShort: boolean;
  closedPl: DineroSnapshot<number>;
  outflow: DineroSnapshot<number>;
}

export interface Trade {
  platform: Platform;
  symbol: string;
  quantity: number;
  executions: Execution[];
  isOpen: boolean;
  isShort: boolean;
  closedPl: Dinero<number>;
  outflow: Dinero<number>;
}

export const toTradeJson = (trade: Trade): TradeJson => {
  return {
    platform: trade.platform,
    symbol: trade.symbol,
    quantity: trade.quantity,
    executions: trade.executions.map(toExecutionJson),
    isOpen: trade.isOpen,
    isShort: trade.isShort,
    closedPl: toSnapshot(trade.closedPl),
    outflow: toSnapshot(trade.outflow),
  };
};

export const fromTradeJson = (tradeJson: TradeJson): Trade => {
  return {
    platform: tradeJson.platform,
    symbol: tradeJson.symbol,
    quantity: tradeJson.quantity,
    executions: tradeJson.executions.map(fromExeuctionJson),
    isOpen: tradeJson.isOpen,
    isShort: tradeJson.isShort,
    closedPl: dineroFromSnapshot(tradeJson.closedPl),
    outflow: dineroFromSnapshot(tradeJson.outflow),
  };
};
