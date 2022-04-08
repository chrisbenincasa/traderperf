import { green, red, grey } from '@mui/material/colors';
import { curveMonotoneX } from '@visx/curve';
import withParentSizeModern, {
  WithParentSizeProps,
  WithParentSizeProvidedProps,
} from '@visx/responsive/lib/enhancers/withParentSizeModern';
import { LinearScaleConfig, TimeScaleConfig } from '@visx/scale';
import { AreaSeries, Axis, DataProvider, Grid, XYChart } from '@visx/xychart';
import { DataProviderProps } from '@visx/xychart/lib/providers/DataProvider';
import { extent } from 'd3-array';
import { add, Dinero, toUnit } from 'dinero.js';
import _ from 'lodash';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { Trade } from '../../model';
import { max, min, zero } from '../../util/dineroUtil';
import { groupByDate } from '../../util/tradeUtil';
import { defaultMargin } from './baseAreaChart';

interface Props {
  trades: Trade[];
  margin?: { top: number; right: number; bottom: number; left: number };
}

type Data = {
  date: DateTime;
  cumulativePl: Dinero<number>;
};

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

function CumulativePlChart(
  props: Props & WithParentSizeProps & WithParentSizeProvidedProps
) {
  const margin = props.margin || defaultMargin;
  const width = props.parentWidth;
  const height = props.parentHeight;

  const chartData: Data[] = useMemo(() => {
    if (props.trades.length === 0) {
      return [];
    }

    const byDate = groupByDate(props.trades);

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
      date: datum.name,
      cumulativePl: datum.y,
    }));
  }, [props.trades]);

  const config: Omit<
    DataProviderProps<TimeScaleConfig<number>, LinearScaleConfig<number>>,
    'children'
  > = useMemo(() => {
    const c = _.map(chartData, 'cumulativePl');
    return {
      xScale: {
        domain: extent(chartData, (d) => d.date.toMillis()) as [number, number],
        // range: [0, xMax],
        nice: true,
        type: 'time',
      },
      yScale: {
        domain: [toUnit(min(c)), toUnit(max(c))],
        // range: [yMax, 0],
        nice: true,
        type: 'linear',
      },
      initialDimensions: {
        height,
        width,
        margin,
      },
    };
  }, [chartData]);

  const formatDate = (date: Date) => {
    return date.toDateString();
  };

  const xAccessor = (d: Data) => {
    if (!d) {
      return 0;
    }
    return d.date.toMillis();
  };

  return chartData.length > 0 ? (
    <DataProvider {...config}>
      <XYChart>
        <Axis
          orientation="bottom"
          numTicks={chartData.length}
          strokeWidth={1}
          stroke={grey[500]}
          tickFormat={formatDate}
        />
        <Axis
          orientation="left"
          numTicks={chartData.length}
          stroke={grey[500]}
        />
        <Grid numTicks={4} strokeDasharray="2" />
        <AreaSeries
          dataKey={'Line 1'}
          data={chartData}
          xAccessor={xAccessor}
          yAccessor={(d) => toUnit(d.cumulativePl)}
          curve={curveMonotoneX}
          lineProps={{
            stroke: green[300],
          }}
          fillOpacity={1}
          fill={green[100]}
        />
      </XYChart>
    </DataProvider>
  ) : null;
}

export default withParentSizeModern(CumulativePlChart);
