import { createConnection } from 'typeorm';

export default async function syncDb() {
  const connection = await createConnection();
  await connection.synchronize();
}

syncDb();
