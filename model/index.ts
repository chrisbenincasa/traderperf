import { Dinero, DineroSnapshot } from 'dinero.js';
import { DateTime } from 'luxon';

export interface Execution {
  symbol: string;
  executionType: ExecutionType;
  timestamp: DateTime;
  quantity: number;
  pps: Dinero<number>;
  totalOutflow: Dinero<number>;
}

export enum ExecutionType {
  BUY_TO_OPEN,
  SELL_TO_OPEN,
  BUY_TO_CLOSE,
  SELL_TO_CLOSE,
}

export interface Trade {
  symbol: string;
  quantity: number;
  executions: Execution[];
  isOpen: boolean;
  isShort: boolean;
  closedPl: DineroSnapshot<number>;
  outflow: Dinero<number>;
}
