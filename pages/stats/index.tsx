import { NextPage } from 'next';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TradesChart from '../../components/tradesChart';
import TradesSimpleStatsTable from '../../components/tradesSimpleStatsTable';
import {
  getExecutionsAsync,
  selectTrades,
} from '../../features/executionsSlice';

const StatsPage: NextPage = () => {
  const dispatch = useDispatch();
  const trades = useSelector(selectTrades);

  useEffect(() => {
    dispatch(getExecutionsAsync());
  }, []);

  return (
    <div>
      <TradesSimpleStatsTable trades={trades} />
      <TradesChart trades={trades} />
    </div>
  );
};

export default StatsPage;
