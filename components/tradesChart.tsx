import { add, Dinero, toUnit } from 'dinero.js';
import _ from 'lodash';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Trade } from '../model';
import { zero } from '../util/dineroUtil';
import { groupByDate } from '../util/tradeUtil';

interface Props {
  trades: Trade[];
}

export default function TradesChart(props: Props) {
  const calcPL = (trades: Trade[]): Dinero<number> => {
    if (trades.length === 0) {
      return zero();
    }

    const start = trades[0].closedPl;

    return _.chain(trades)
      .drop(1)
      .reduce((acc, trade) => {
        return add(start, trade.closedPl);
      }, start)
      .value();
  };

  const chartData = useMemo(() => {
    if (props.trades.length === 0) {
      console.log('em');
      return [];
    }

    const x = _.map(props.trades, (trade) => {
      return [trade.executions[0].timestamp.startOf('day'), trade];
    });

    const byDate = groupByDate(props.trades);

    console.log(byDate, 'hel');
    const cumPl: { name: DateTime; y: Dinero<number> }[] = [];
    for (let i = 0; i < byDate.length; i++) {
      const [date, trades] = byDate[i];
      let val;
      if (i === 0) {
        val = calcPL(trades);
      } else {
        val = add(cumPl[i - 1].y, calcPL(trades));
      }
      cumPl.push({ name: date, y: val });
    }

    return _.map(cumPl, (datum) => ({
      name: datum.name.toFormat('yyyy-MM-dd'),
      y: toUnit(datum.y),
    }));
  }, [props.trades]);

  return (
    <div>
      {chartData.length > 0 ? (
        <AreaChart
          width={730}
          height={250}
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="y"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorUv)"
          />
          {/* <Area
        type="monotone"
        dataKey="pv"
        stroke="#82ca9d"
        fillOpacity={1}
        fill="url(#colorPv)"
      /> */}
        </AreaChart>
      ) : null}
    </div>
  );
}
