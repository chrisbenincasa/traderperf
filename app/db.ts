import { Connection, createConnection } from 'typeorm';

export default async function initDb(): Promise<Connection> {
  return await createConnection();
}
