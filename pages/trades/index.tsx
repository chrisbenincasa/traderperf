import { NextPage } from 'next';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TradesTable from '../../components/tradesTable';
import {
  selectTrades,
  getExecutionsAsync,
} from '../../features/executionsSlice';

const TradesPage: NextPage = () => {
  const dispatch = useDispatch();
  const trades = useSelector(selectTrades);

  useEffect(() => {
    dispatch(getExecutionsAsync());
  }, []);

  return (
    <div>
      <TradesTable trades={trades} />
    </div>
  );
};

export default TradesPage;
