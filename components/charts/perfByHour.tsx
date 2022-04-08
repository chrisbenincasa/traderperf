import { green, red } from '@mui/material/colors';
import withParentSizeModern, {
  WithParentSizeProps,
  WithParentSizeProvidedProps,
} from '@visx/responsive/lib/enhancers/withParentSizeModern';
import { BandScaleConfig, LinearScaleConfig } from '@visx/scale';
import { Axis, BarSeries, Tooltip, XYChart } from '@visx/xychart';
import { RenderTooltipParams } from '@visx/xychart/lib/components/Tooltip';
import DataProvider, {
  DataProviderProps,
} from '@visx/xychart/lib/providers/DataProvider';
import { Dinero, greaterThan, toUnit } from 'dinero.js';
import _ from 'lodash';
import { HourNumbers } from 'luxon';
import { useMemo } from 'react';
import { Trade } from '../../model';
import { max, min, sum, toUsdFormat, zero } from '../../util/dineroUtil';
import { groupByTradingHours } from '../../util/tradeUtil';
import { defaultMargin } from './baseAreaChart';

interface Props {
  trades: Trade[];
  margin?: { top: number; right: number; bottom: number; left: number };
}

type Data = {
  hour: HourNumbers;
  trades: Trade[];
  cumulativePl: Dinero<number>;
};

function PerfByHourChart(
  props: Props & WithParentSizeProps & WithParentSizeProvidedProps
) {
  const margin = props.margin || defaultMargin;
  const width = props.parentWidth;
  const height = props.parentHeight;

  const chartData: Data[] = useMemo(() => {
    if (props.trades.length === 0) {
      return [];
    }

    const points: Data[] = [];
    const grouped = groupByTradingHours(props.trades);

    for (let i = 0; i < grouped.length; i++) {
      const [hour, trades] = grouped[i];
      points.push({
        hour,
        trades,
        cumulativePl: sum(_.map(trades, 'closedPl')),
      });
    }

    return points;
  }, [props.trades]);

  const config: Omit<
    DataProviderProps<LinearScaleConfig<number>, BandScaleConfig<string>>,
    'children'
  > = useMemo(() => {
    const c = _.map(chartData, 'cumulativePl');
    return {
      yScale: {
        domain: _.map(chartData, (d) => d.hour.toString()),
        reverse: true,
        nice: true,
        type: 'band',
        paddingInner: 0.1,
        paddingOuter: 0.1,
      },
      xScale: {
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

  const renderTooltip = (x: RenderTooltipParams<Data>) => {
    const datum = x.tooltipData?.nearestDatum?.datum;
    if (datum?.trades.length === 0) {
      return null;
    }
    const p = datum?.cumulativePl;
    const fmted = p ? toUsdFormat(p) : 'N/A';
    const date = datum ? datum.hour : 'N/A';
    return <span>{`${date}: ${fmted}`}</span>;
  };

  return chartData.length > 0 ? (
    <DataProvider {...config}>
      <XYChart
        xScale={config.xScale}
        yScale={config.yScale}
        height={height}
        width={width}
        margin={margin}
      >
        <Axis
          orientation="bottom"
          numTicks={chartData.length}
          strokeWidth={1}
          stroke="#adb5bd"
        />
        <Axis orientation="left" numTicks={chartData.length} stroke="#adb5bd" />
        <BarSeries
          dataKey="key1"
          data={chartData}
          yAccessor={(d) => d.hour}
          xAccessor={(d) => toUnit(d.cumulativePl)}
          colorAccessor={(d) =>
            greaterThan(d.cumulativePl, zero()) ? green[100] : red[100]
          }
        />
        <Tooltip
          snapTooltipToDatumX
          snapTooltipToDatumY
          renderTooltip={renderTooltip}
          showDatumGlyph
        />
      </XYChart>
    </DataProvider>
  ) : null;
}

export default withParentSizeModern(PerfByHourChart);
