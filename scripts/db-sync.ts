import { createConnection } from 'typeorm';

export default async function syncDb(args: string[]) {
  console.log(args);
  const connection = await createConnection();
  const drop = args.length > 0 ? args[0] === 'drop' : false;
  await connection.synchronize(drop);
}

syncDb(process.argv.slice(2));
