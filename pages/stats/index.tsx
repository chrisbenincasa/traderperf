import { DateTime } from 'luxon';
import { NextPage } from 'next';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DailyPlChart from '../../components/charts/dailyPlChart';
import TradesCalendar from '../../components/tradesCalendar';
import TradesChart from '../../components/charts/tradesChart';
import TradesSimpleStatsTable from '../../components/tradesSimpleStatsTable';
import {
  getExecutionsAsync,
  selectTrades,
} from '../../features/executionsSlice';
import { groupByDate } from '../../util/tradeUtil';

const StatsPage: NextPage = () => {
  const dispatch = useDispatch();
  const trades = useSelector(selectTrades);

  const years = useMemo(
    () => groupByDate(trades, 'year').map((pair) => pair[0]),
    [trades]
  );

  useEffect(() => {
    dispatch(getExecutionsAsync());
  }, []);

  const calendars = years.map((year) => <TradesCalendar startDate={year} />);

  return (
    <div>
      <TradesSimpleStatsTable trades={trades} />
      <TradesChart trades={trades} />
      <DailyPlChart trades={trades} />
      <div className="flex">{calendars}</div>
    </div>
  );
};

export default StatsPage;
