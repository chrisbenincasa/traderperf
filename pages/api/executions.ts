// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import _ from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next';
import db from '../../app/db';
import {
  ExecutionJson,
  fromExeuctionJson,
  toTradeJson,
  TradeJson,
  TraderperfRequest,
  TraderperfResponse,
} from '../../model';
import { ImportTradesResponse } from '../../model/api';
import { ExecutionDao } from '../../model/db/entity/ExecutionDao';
import { TradeDao } from '../../model/db/entity/TradeDao';
import TradeMatcher from '../../util/tradeMatcher';
import { tuple } from '../../util/tupleUtil';

type Response =
  | TraderperfResponse<ImportTradesResponse>
  | TraderperfResponse<TradeJson[]>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const manager = await db.getManager();

  if (req.method === 'POST') {
    const body = req.body as TraderperfRequest<ExecutionJson[]>;

    if (_.isUndefined(body.data) || body.data.length === 0) {
      res.status(400).json({ error: 'No' });
    }

    const trades = new TradeMatcher().match(body.data!.map(fromExeuctionJson));

    // HACK: We keep two copies of the DAO objects, one here and one that is
    // passed into the query builder. This is because the query builder
    // mutates the passed in data, since we instruct it to return the response
    // By keeping a 2nd copy that is unaltered, we can correctly associated
    // executions for insertion later on.
    const tradeDaos = trades.map(TradeDao.fromTrade);

    // Attempt to insert the trades, ignoring duplicates based on their unique
    // key.
    const insertResult = await manager
      .createQueryBuilder()
      .insert()
      .into(TradeDao)
      .values(trades.map(TradeDao.fromTrade))
      .orIgnore()
      .returning('*')
      .execute();

    // Using the returned maps from the DB, create new DAOs that have their
    // auto generated IDs set.
    const insertedDaos = insertResult.generatedMaps
      .filter((m) => !_.isEmpty(m))
      .map((obj) => manager.getRepository(TradeDao).create(obj));

    const insertedDaosByKey = new Map(
      _.map(insertedDaos, (i) => tuple(i.uniqueKey, i))
    );

    // Separate out the inserted DAOs from the detected duplicates based on
    // their presence in the returned objects from the DB.
    const [inserted, duplicates] = _.partition(tradeDaos, (trade) =>
      insertedDaosByKey.has(trade.uniqueKey)
    );

    const insertedWithExecutions = _.forEach(inserted, (trade) => {
      // This is guaranteed to be true due to the partition above
      // This is the trade object returned from the DB that we just inserted.
      // It has the auto-generated ID set.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const insertedTrade = insertedDaosByKey.get(trade.uniqueKey)!;

      // Take the executions from the manually created DAO from earlier,
      // set their trade relation to the object from the DB (the one with)
      // the ID.
      const executions = _.forEach(
        [...trade.executions],
        (exec) => (exec.trade = insertedTrade)
      );

      // Set the new exections onto the "final" trade DAO.
      insertedTrade.executions = executions;
    });

    const executionsToInsert = _.flatMap(
      insertedWithExecutions,
      (trade) => trade.executions
    );

    await manager
      .createQueryBuilder()
      .insert()
      .into(ExecutionDao)
      .values(executionsToInsert)
      .orIgnore()
      .returning('*')
      .execute();

    // TODO group by platform

    res.status(200).json({
      data: {
        imported: insertedWithExecutions.map((trade) =>
          toTradeJson(trade.toTrade())
        ),
        numDuplicates: duplicates.length,
      },
    });
  } else if (req.method === 'GET') {
    const trades = await manager.find(TradeDao);
    res.json({ data: trades.map((trade) => toTradeJson(trade.toTrade())) });
  } else {
    res.status(200).json({ data: [] });
  }
}
