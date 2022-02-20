import { Dinero, add, toUnit } from 'dinero.js';
import _ from 'lodash';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  LineChart,
} from 'recharts';
import { Trade } from '../../model';
import { sum } from '../../util/dineroUtil';
import { groupByDate } from '../../util/tradeUtil';

interface Props {
  trades: Trade[];
}

export default function DailyPlChart(props: Props) {
  const chartData = useMemo(() => {
    if (props.trades.length === 0) {
      return [];
    }

    const byDate = groupByDate(props.trades);

    const cumPl: { name: DateTime; y: Dinero<number> }[] = [];
    for (let i = 0; i < byDate.length; i++) {
      const [date, trades] = byDate[i];
      cumPl.push({ name: date, y: sum(_.map(trades, 'closedPl')) });
    }

    return _.map(cumPl, (datum) => ({
      name: datum.name.toFormat('yyyy-MM-dd'),
      y: toUnit(datum.y),
    }));
  }, [props.trades]);

  return chartData.length > 0 ? (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="y" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  ) : null;
}
