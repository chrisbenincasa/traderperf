import 'reflect-metadata';
import {
  Connection,
  ConnectionManager,
  createConnection,
  EntityManager,
  getConnectionManager,
  getConnectionOptions,
} from 'typeorm';
import { Execution } from '../model/db/entity/Execution';
import { Trade } from '../model/db/entity/Trade';

export async function initDb(): Promise<Connection> {
  const connectionOptions = await getConnectionOptions();
  Object.assign(connectionOptions, {
    entities: [Execution, Trade],
  });
  return await createConnection();
}

// const getConnectionOptions = () => {};

/**
 * Database manager class
 */
class Database {
  private connectionManager: ConnectionManager;

  private hasCreatedConnection = false;

  constructor() {
    this.connectionManager = getConnectionManager();
  }

  private async getConnection(): Promise<Connection> {
    const DEFAULT_CONNECTION_NAME = 'default';
    const currentConnection = this.connectionManager.has(
      DEFAULT_CONNECTION_NAME
    )
      ? this.connectionManager.get(DEFAULT_CONNECTION_NAME)
      : undefined;
    if (currentConnection && !this.hasCreatedConnection) {
      console.debug('recreating connection due to hot reloading');
      if (currentConnection.isConnected) {
        await currentConnection.close();
      }
      console.debug('done closing, making new connection..');
      return this.createConnectionWithName(DEFAULT_CONNECTION_NAME);
    }
    if (currentConnection) {
      if (!currentConnection.isConnected) {
        return currentConnection.connect();
      } else return currentConnection;
    } else {
      return this.createConnectionWithName(DEFAULT_CONNECTION_NAME);
    }
  }

  private async createConnectionWithName(name: string): Promise<Connection> {
    this.hasCreatedConnection = true;
    const connectionOptions = await getConnectionOptions();
    Object.assign(connectionOptions, {
      entities: [Execution, Trade],
    });
    return createConnection(connectionOptions);
  }

  public getManager(): Promise<EntityManager> {
    return this.getConnection().then((conn) => conn.manager);
  }
}

const db = new Database();
export default db;
