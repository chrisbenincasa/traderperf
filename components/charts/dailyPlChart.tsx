import { green, red, grey } from '@mui/material/colors';
import * as curves from '@visx/curve';
import { LinearGradient } from '@visx/gradient';
import { withParentSizeModern } from '@visx/responsive';
import { LinearScaleConfig, TimeScaleConfig } from '@visx/scale';
import {
  AreaSeries,
  Axis,
  DataContext,
  DataProvider,
  Grid,
  Tooltip,
  XYChart,
} from '@visx/xychart';
import { RenderTooltipParams } from '@visx/xychart/lib/components/Tooltip';
import { DataProviderProps } from '@visx/xychart/lib/providers/DataProvider';
import { extent } from 'd3-array';
import { Dinero, toUnit } from 'dinero.js';
import _ from 'lodash';
import { DateTime } from 'luxon';
import { useContext, useMemo } from 'react';
import { Trade } from '../../model';
import { max, min, sum, toUsdFormat } from '../../util/dineroUtil';
import { groupByDate } from '../../util/tradeUtil';
import ZeroClipPath from './zeroClipPath';

type Props = {
  parentWidth?: number;
  parentHeight?: number;
  initialWidth?: number;
  initialHeight?: number;
  debounceTime?: number;
  enableDebounceLeadingCall?: boolean;
  trades: Trade[];
  margin?: { top: number; right: number; bottom: number; left: number };
};

type Data = {
  date: DateTime;
  cumulativePL: Dinero<number>;
};

const defaultMargin = { top: 40, right: 30, bottom: 50, left: 40 };

const ChartBackground = () => {
  const { theme, width, height } = useContext(DataContext);
  return (
    <rect
      x={0}
      y={0}
      width={width}
      height={height}
      fill={theme?.backgroundColor ?? 'lightblue'}
    />
  );
};

export function DailyPlChartVisx(props: Props) {
  if (!props.parentHeight || !props.parentWidth) return null;

  const margin = props.margin || defaultMargin;
  const width = props.parentWidth;
  const height = props.parentHeight;

  const data = useMemo(() => {
    const points: Data[] = [];
    const byDate = groupByDate(props.trades);
    for (let i = 0; i < byDate.length; i++) {
      const [date, trades] = byDate[i];
      points.push({
        date,
        cumulativePL: sum(_.map(trades, 'closedPl')),
      });
    }

    return points;
  }, [props.trades]);

  const config: Omit<
    DataProviderProps<TimeScaleConfig<number>, LinearScaleConfig<number>>,
    'children'
  > = useMemo(() => {
    const c = _.map(data, 'cumulativePL');
    return {
      xScale: {
        domain: extent(data, (d) => d.date.toMillis()) as [number, number],
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
  }, [data]);

  const xAccessor = (d: Data) => {
    if (!d) {
      return 0;
    }
    return d.date.toMillis();
  };

  const renderTooltip = (x: RenderTooltipParams<Data>) => {
    const datum = x.tooltipData?.nearestDatum?.datum;
    const p = datum?.cumulativePL;
    const fmted = p ? toUsdFormat(p) : 'N/A';
    const date = datum ? datum.date.toISODate() : 'N/A';
    return <span>{`${date}: ${fmted}`}</span>;
  };

  const formatDate = (date: Date) => {
    return date.toDateString();
  };

  return data.length > 0 ? (
    <DataProvider {...config}>
      <XYChart>
        <ZeroClipPath idAbove="clip-above" idBelow="clip-below" />
        <LinearGradient
          id={'daily-pl-green-gradient'}
          clipPath="url(#clip-above)"
        >
          <stop stopColor={green[100]} offset="5%" />
          <stop stopColor={green[100]} offset="10%" stopOpacity={0} />
        </LinearGradient>
        <ChartBackground />
        <Axis
          orientation="bottom"
          numTicks={data.length}
          strokeWidth={1}
          stroke={grey[500]}
          tickFormat={formatDate}
          tickLabelProps={() => ({ angle: -45, textAnchor: 'end' })}
        />
        <Axis orientation="left" numTicks={data.length} stroke={grey[500]} />
        <Grid numTicks={4} strokeDasharray="2" />
        <AreaSeries
          dataKey={'>0'}
          data={data}
          xAccessor={xAccessor}
          yAccessor={(d) => toUnit(d.cumulativePL)}
          curve={curves.curveMonotoneX}
          lineProps={{
            clipPath: 'url(#clip-above)',
            stroke: green[300],
          }}
          fillOpacity={1}
          fill={green[100]}
          // fill="url(#daily-pl-green-gradient)"
          clipPath="url(#clip-above)"
        />
        <AreaSeries
          dataKey={'<0'}
          data={data}
          xAccessor={xAccessor}
          yAccessor={(d) => toUnit(d.cumulativePL)}
          curve={curves.curveMonotoneX}
          lineProps={{
            clipPath: 'url(#clip-below)',
            stroke: red[300],
          }}
          fillOpacity={1}
          fill={red[100]}
          clipPath="url(#clip-below)"
        />
        <Tooltip
          snapTooltipToDatumX
          snapTooltipToDatumY
          renderTooltip={renderTooltip}
          showDatumGlyph
          glyphStyle={{
            fill: green[500],
          }}
        />
      </XYChart>
    </DataProvider>
  ) : null;
}

export default withParentSizeModern(DailyPlChartVisx);
