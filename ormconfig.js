require('dotenv/config');

const database = {
  development: 'traderperf_dev',
  production: 'prod-db',
  test: 'test-db',
};

module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: database[process.env.NODE_ENV],
  entities: ['./model/db/entity/*{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production',
  migrationsTableName: 'migration',
  migrations: ['migration/*.js'],
  cli: {
    migrationsDir: 'migration',
  },
};
