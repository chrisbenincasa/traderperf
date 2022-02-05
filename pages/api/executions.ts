// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { getConnection, getConnectionManager } from 'typeorm';
import db from '../../app/db';
import {
  ExecutionJson,
  fromExeuctionJson,
  toTradeJson,
  TradeJson,
  TraderperfRequest,
} from '../../model';
import { ExecutionDao } from '../../model/db/entity/ExecutionDao';
import { TradeDao } from '../../model/db/entity/TradeDao';
import TradeMatcher from '../../util/tradeMatcher';

type Data = {
  data?: TradeJson[];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const manager = await db.getManager();

  if (req.method === 'POST') {
    const body = req.body as TraderperfRequest<ExecutionJson[]>;

    if (body.data.length === 0) {
      res.status(400).json({ error: 'No' });
    }

    const trades = new TradeMatcher().match(body.data.map(fromExeuctionJson));

    const savedTrades = await manager.save(
      trades.map((trade) => TradeDao.fromTrade(trade))
    );

    // TODO group by platform

    res
      .status(200)
      .json({ data: savedTrades.map((trade) => toTradeJson(trade.toTrade())) });
  } else if (req.method === 'GET') {
    const trades = await manager.find(TradeDao);
    res.json({ data: trades.map((trade) => toTradeJson(trade.toTrade())) });
  } else {
    res.status(200).json({ data: [] });
  }
}
