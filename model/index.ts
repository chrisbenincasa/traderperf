import { Dinero, DineroSnapshot } from 'dinero.js';
import { DateTime } from 'luxon';

export enum ExecutionType {
  BUY_TO_OPEN,
  SELL_TO_OPEN,
  BUY_TO_CLOSE,
  SELL_TO_CLOSE,
}

export interface ExecutionJson {
  symbol: string;
  executionType: ExecutionType;
  timestamp: DateTime;
  quantity: number;
  pps: DineroSnapshot<number>;
  totalOutflow: DineroSnapshot<number>;
}

export interface TradeJson {
  symbol: string;
  quantity: number;
  executions: ExecutionJson[];
  isOpen: boolean;
  isShort: boolean;
  closedPl: DineroSnapshot<number>;
  outflow: DineroSnapshot<number>;
}

export interface Execution {
  symbol: string;
  executionType: ExecutionType;
  timestamp: DateTime;
  quantity: number;
  pps: Dinero<number>;
  totalOutflow: Dinero<number>;
}

export interface Trade {
  symbol: string;
  quantity: number;
  executions: Execution[];
  isOpen: boolean;
  isShort: boolean;
  closedPl: Dinero<number>;
  outflow: Dinero<number>;
}
