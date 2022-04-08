import { Box, Grid, styled, Typography } from '@mui/material';
import { NextPage } from 'next';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CumulativePlChart from '../../components/charts/cumulativePlChart';
import DailyPlChartVisx from '../../components/charts/dailyPlChart';
import PerfByDayChart from '../../components/charts/perfByDay';
import PerfByHourChart from '../../components/charts/perfByHour';
import TradesCalendar from '../../components/tradesCalendar';
import TradesSimpleStatsTable from '../../components/tradesSimpleStatsTable';
import {
  getExecutionsAsync,
  selectTrades,
} from '../../features/executionsSlice';
import { groupByDate } from '../../util/tradeUtil';

const FourByThreeBox = styled(Box)({
  aspectRatio: '4/3',
});

const StatsPage: NextPage = () => {
  const dispatch = useDispatch();
  const trades = useSelector(selectTrades);

  const months = useMemo(
    () => groupByDate(trades, 'month').map((pair) => pair[0]),
    [trades]
  );

  useEffect(() => {
    dispatch(getExecutionsAsync());
  }, []);

  const calendars = months.map((month) => <TradesCalendar startDate={month} />);

  return (
    <div>
      <TradesSimpleStatsTable trades={trades} />
      <Grid container sx={{ minHeight: 400 }} spacing={2}>
        <Grid item xs={6}>
          <Typography>Cumulative P/L</Typography>
          <FourByThreeBox>
            <CumulativePlChart trades={trades} />
          </FourByThreeBox>
        </Grid>
        <Grid item xs={6} sx={{ minHeight: 400 }}>
          <Typography>Daily P/L</Typography>
          <FourByThreeBox>
            <DailyPlChartVisx trades={trades} />
          </FourByThreeBox>
        </Grid>
        <Grid item xs={6} sx={{ minHeight: 400 }}>
          <Typography>P/L by Day</Typography>
          <FourByThreeBox>
            <PerfByDayChart trades={trades} />
          </FourByThreeBox>
        </Grid>
        <Grid item xs={6} sx={{ minHeight: 400 }}>
          <Typography>P/L by Hour</Typography>
          <FourByThreeBox>
            <PerfByHourChart trades={trades} />
          </FourByThreeBox>
        </Grid>
      </Grid>
      <div className="flex">{calendars}</div>
    </div>
  );
};

export default StatsPage;
