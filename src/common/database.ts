import path from 'path';
import { Connection, ConnectionManager, ConnectionOptions, createConnection, getConnectionManager, Repository } from 'typeorm';
import Logger from './logger';
import Config from './config';
import { inject, injectable } from 'inversify';
import TYPES from './types';

const CONNECTION_NAME = 'default';

export default interface Database {
  getConnection(): Promise<Connection>;
  getRepository<TEntity>(type: new () => TEntity): Promise<Repository<TEntity>>;
}

@injectable()
export class TypeOrmDatabase implements Database {
  private readonly connectionManager: ConnectionManager

  constructor(@inject(TYPES.Logger) private readonly logger: Logger,
              @inject(TYPES.Config) private readonly config: Config) {
    this.connectionManager = getConnectionManager();
  }

  public async getRepository<TEntity>(type: new () => TEntity): Promise<Repository<TEntity>> {
    const connection = await this.getConnection();
    return connection.getRepository<TEntity>(type);
  }

  public async getConnection(): Promise<Connection> {
    let connection: Connection;

    if (this.connectionManager.has(CONNECTION_NAME)) {
      this.logger.info('Database.getConnection()-using existing connection ...');
      connection = this.connectionManager.get(CONNECTION_NAME);

      if (!connection.isConnected) {
        connection = await connection.connect();
      }
    } else {
      this.logger.info('Database.getConnection()-creating connection ...');

      const connectionOptions: ConnectionOptions = {
        name: CONNECTION_NAME,
        synchronize: true,
        logging: true,
        ...this.config.connectionOptions,
        entities: [
          `${path.resolve('..')}/**/entities/*(js|ts)`
        ]
      };

      connection = await createConnection(connectionOptions);
    }

    return connection;
  }
}
