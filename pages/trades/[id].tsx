import _ from 'lodash';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getTradeAsync,
  selectTradeDetail,
  selectTradeDetailLoading,
} from '../../features/executionsSlice';

const TradeDetailPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const dispatch = useDispatch();
  const tradeLoading = useSelector(selectTradeDetailLoading);
  const tradeDetail = useSelector(selectTradeDetail);

  useEffect(() => {
    if (!_.isUndefined(id)) {
      const normalizedId = parseInt(_.isArray(id) ? id[0] : id);
      dispatch(getTradeAsync({ id: normalizedId }));
    }
  }, [id]);

  return (
    <div className="container mx-auto flex flex-col  flex-wrap items-center p-5 md:flex-row">
      {tradeLoading ? null : (
        <h1 className="text-6xl">{tradeDetail?.symbol}</h1>
      )}
    </div>
  );
};

export default TradeDetailPage;
