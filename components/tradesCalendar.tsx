import { Box, styled, Typography } from '@mui/material';
import { red as muiRed, green as muiGreen } from '@mui/material/colors';
import { greaterThan } from 'dinero.js';
import _ from 'lodash';
import { DateTime, Interval } from 'luxon';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectTrades } from '../features/executionsSlice';
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

const Calendar = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
  gap: theme.spacing(2),
}));

type CalendarDayProps = {
  green: boolean;
  red: boolean;
};

const CalendarDay = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'green' && prop !== 'red',
})<CalendarDayProps>(({ theme, green, red }) => {
  let bgColor = theme.palette.grey[100];
  if (green) {
    bgColor = muiGreen[200];
  } else if (red) {
    bgColor = muiRed[200];
  }
  return {
    aspectRatio: '1/1',
    backgroundColor: bgColor,
  };
});

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

      let x = 0;
      if (tradesForDate.length > 0) {
        const tradeStats = calculateTradeStats(tradesForDate);
        const cumulativePl = tradeStats.totalGainLoss();
        if (greaterThan(cumulativePl, zero())) {
          x = 1;
        } else {
          x = -1;
        }
      }

      squares.push(
        <CalendarDay
          key={d.toISODate()}
          className={clazz}
          green={x > 0}
          red={x < 0}
        >
          {d.toISODate()}
        </CalendarDay>
      );
    }
    return squares;
  }, [trades, startDate]);

  return (
    <Box>
      <Box textAlign="center">
        <Typography variant="h3">{startDate.monthLong}</Typography>
      </Box>
      {/* <Grid container spacing={2} columns={7}>
        {squares}
      </Grid> */}
      <Calendar>{squares}</Calendar>
      {/* <div className="mx-10 grid grid-cols-7 gap-2">{squares}</div> */}
    </Box>
  );
}
