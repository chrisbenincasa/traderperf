// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { getConnection, getConnectionManager } from 'typeorm';
import initDb from '../../app/db';

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (getConnectionManager().connections.length === 0) {
    await initDb();
  }

  const connection = getConnection();
  // await initDb();
  res.status(200).json({ name: 'John Doe' });
}
