import _ from 'lodash';
import { DateTime, DateTimeUnit } from 'luxon';
import { Trade } from '../model';
import { tuple } from './tupleUtil';

export default 0;

export const groupByDate = (
  trades: Trade[],
  unit: DateTimeUnit = 'day'
): [DateTime, Trade[]][] => {
  return _.chain(trades)
    .groupBy((trade) => trade.executions[0].timestamp.startOf(unit).toISO())
    .toPairs()
    .sortBy((t) => t[0])
    .map(([dt, t]) => {
      return tuple(DateTime.fromISO(dt), t);
    })
    .value();
};
