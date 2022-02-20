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
  entities: [__dirname + '/model/db/entity/**/*.ts'],
  synchronize: false,
  migrationsTableName: 'migration',
  migrations: ['migration/*.js'],
  cli: {
    migrationsDir: 'migration',
  },
};
