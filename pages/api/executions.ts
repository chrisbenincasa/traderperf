// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { getConnection, getConnectionManager } from 'typeorm';
import db from '../../app/db';
import { ExecutionJson, TraderperfRequest } from '../../model';
import { Execution } from '../../model/db/entity/Execution';

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const manager = await db.getManager();

  if (req.method === 'POST') {
    const body = req.body as TraderperfRequest<ExecutionJson[]>;
    console.log(body);

    const daos = body.data.map((execution) => {
      const dao = new Execution();
      dao.userId = 1; // Hardcode right now
      dao.symbol = execution.symbol;
      dao.executionTimestamp = new Date(execution.timestamp);
      dao.platform = execution.platform;
      dao.executionType = execution.executionType;
      dao.quantity = execution.quantity;
      dao.pricePerShare = execution.pps.amount;
      dao.pricePerShareScale = execution.pps.scale;
      dao.currency = execution.pps.currency.code;
      dao.totalOutflow = execution.totalOutflow.amount;
      dao.totalOutflowScale = execution.totalOutflow.scale;
      return dao;
    });

    await manager.save(daos);
  }

  // await initDb();
  res.status(200).json({ name: 'John Doe' });
}
