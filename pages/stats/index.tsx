import { NextPage } from 'next';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

  console.log(trades);

  return <div></div>;
};

export default StatsPage;
