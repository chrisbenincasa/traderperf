import { TradeJson } from '..';

export type ImportTradesResponse = {
  imported: TradeJson[];
  numDuplicates: number;
};
