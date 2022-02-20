import { NextApiRequest, NextApiResponse } from 'next';
import { toTradeJson, TradeJson } from '../../../model';
import db from '../../../app/db';
import { TradeDao } from '../../../model/db/entity/TradeDao';
import _ from 'lodash';

type Data = {
  data?: TradeJson;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { id } = req.query;
  const normalizedId = parseInt(_.isArray(id) ? id[0] : id);

  if (_.isNaN(normalizedId)) {
    res.status(400);
    return;
  }

  if (req.method === 'GET') {
    const manager = await db.getManager();
    const trade = await manager.findOne(TradeDao, normalizedId);
    if (!trade) {
      res.status(404);
      return;
    }

    res.status(200).json({ data: toTradeJson(trade.toTrade()) });
  } else {
    res.status(405);
  }
}
