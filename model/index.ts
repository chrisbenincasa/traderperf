import { Dinero, DineroSnapshot, toSnapshot } from 'dinero.js';
import _ from 'lodash';
import { DateTime } from 'luxon';

export type TraderperfRequest<T> = {
  data: T;
};

export type TraderperfResponse<T> = {
  data: T;
};

export enum ExecutionType {
  BUY_TO_OPEN,
  SELL_TO_OPEN,
  BUY_TO_CLOSE,
  SELL_TO_CLOSE,
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
  timestamp: string;
  quantity: number;
  pps: DineroSnapshot<number>;
  totalOutflow: DineroSnapshot<number>;
}

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

export interface Execution {
  platform: Platform;
  symbol: string;
  executionType: ExecutionType;
  timestamp: DateTime;
  quantity: number;
  pps: Dinero<number>;
  totalOutflow: Dinero<number>;
}

export const toExecutionJson = (execution: Execution): ExecutionJson => {
  return {
    platform: execution.platform,
    symbol: execution.symbol,
    executionType: execution.executionType,
    timestamp: execution.timestamp,
    quantity: execution.quantity,
    pps: toSnapshot(execution.pps),
    totalOutflow: toSnapshot(execution.totalOutflow),
  };
};

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
