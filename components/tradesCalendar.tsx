import { greaterThan } from 'dinero.js';
import _ from 'lodash';
import { DateTime, Interval, WeekdayNumbers } from 'luxon';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectTrades } from '../features/executionsSlice';
import { Trade } from '../model';
import { zero } from '../util/dineroUtil';
import calculateTradeStats from '../util/tradeStats';
import { groupByDate } from '../util/tradeUtil';

// tailwind requires we have the full class names with no interpolation
const offsetToClass = {
  1: 'col-start-2',
  2: 'col-start-3',
  3: 'col-start-4',
  4: 'col-start-5',
  5: 'col-start-6',
  6: 'col-start-7',
  7: '',
};

type Props = {
  startDate: DateTime;
};

export default function TradesCalendar(props: Props) {
  const trades = useSelector(selectTrades);
  const startDate = props.startDate.startOf('month');

  const groupedByDay = useMemo(() => groupByDate(trades, 'day'), [trades]);

  const squares = useMemo(() => {
    const squares = [];
    for (let i = 0; i < startDate.daysInMonth; i++) {
      const d = startDate.plus({ days: i });
      let clazz = '';
      if (i === 0 && offsetToClass[d.weekday]) {
        clazz = offsetToClass[d.weekday];
      }

      const interval = Interval.fromDateTimes(d.startOf('day'), d.endOf('day'));

      const tradesForDate = _.chain(groupedByDay)
        .filter(([dt, _]) => {
          return interval.contains(dt);
        })
        .map((d) => d[1])
        .flatten()
        .value();

      let bgClazz = 'bg-slate-100';
      if (tradesForDate.length > 0) {
        const tradeStats = calculateTradeStats(tradesForDate);
        const cumulativePl = tradeStats.totalGainLoss();
        if (greaterThan(cumulativePl, zero())) {
          bgClazz = 'bg-lime-500';
        } else {
          bgClazz = 'bg-red-500';
        }
      }

      squares.push(
        <div
          className={`${clazz} aspect-square ${bgClazz}`}
          key={d.toISODate()}
        >
          {d.toISODate()}
        </div>
      );
    }
    return squares;
  }, [trades, startDate]);

  return (
    <div>
      <div className="text-center">
        <h3>{startDate.monthLong}</h3>
      </div>
      <div className="mx-10 grid grid-cols-7 gap-2">{squares}</div>
    </div>
  );
}
