import _, { xor } from 'lodash';
import {
  DateTime,
  DateTimeUnit,
  HourNumbers,
  Info,
  WeekdayNumbers,
} from 'luxon';
import { Trade } from '../model';
import { tuple } from './tupleUtil';

export default 0;

export const groupByDate = (
  trades: Trade[],
  unit: DateTimeUnit = 'day',
  closedTradesOnly = false
): [DateTime, Trade[]][] => {
  return _.chain(trades)
    .filter((trade) => (closedTradesOnly ? !trade.isOpen : true))
    .groupBy((trade) => trade.executions[0].timestamp.startOf(unit).toISO())
    .toPairs()
    .sortBy((t) => t[0])
    .map(([dt, t]) => {
      return tuple(DateTime.fromISO(dt), t);
    })
    .value();
};

export type WeekData = {
  day: number;
  short: string;
};

export const groupByDayOfWeek = (
  trades: Trade[],
  closedTradesOnly = false
): [WeekData, Trade[]][] => {
  const weekdays = _.range(0, 5);
  const weekdata: [WeekData, Trade[]][] = _.map(weekdays, (d) =>
    tuple(
      {
        day: d,
        short: Info.weekdays('short')[d],
      },
      [] as Trade[]
    )
  );

  _.chain(trades)
    .filter((trade) => (closedTradesOnly ? !trade.isOpen : true))
    .forEach((trade) => {
      const wd = trade.executions[0].timestamp.weekday;
      weekdata[wd - 1][1].push(trade);
    })
    .value();

  return weekdata;
};

export const groupByTradingHours = (
  trades: Trade[],
  closedTradesOnly = false
): [HourNumbers, Trade[]][] => {
  const tradingHours = _.range(6, 21) as HourNumbers[];
  const hourData: [HourNumbers, Trade[]][] = _.map(tradingHours, (hour) =>
    tuple(hour, [] as Trade[])
  );

  _.chain(trades)
    .filter((trade) => (closedTradesOnly ? !trade.isOpen : true))
    .forEach((trade) => {
      const hour =
        trade.executions[0].timestamp.setZone('America/New_York').hour;
      hourData[hour - 6][1].push(trade);
    })
    .value();

  console.log(hourData);

  return hourData;
};
