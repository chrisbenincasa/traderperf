import { Container } from '@mui/material';
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

  return <TradesTable trades={trades} />;
};

export default TradesPage;
