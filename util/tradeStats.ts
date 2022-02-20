import { add, Dinero } from 'dinero.js';
import _ from 'lodash';
import { Trade } from '../model';
import { zero } from './dineroUtil';

export type TradeStats = {
  totalGainLoss: () => Dinero<number>;
};

export default function calculateTradeStats(trades: Trade[]) {
  const totalGainLoss = _.once(() => {
    return _.reduce(
      trades,
      (acc, trade) => {
        return add(acc, trade.closedPl);
      },
      zero()
    );
  });

  return {
    totalGainLoss,
  };
}
