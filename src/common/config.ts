import { ConnectionOptions } from 'typeorm';
import { injectable } from 'inversify';

export default interface IConfig {
  connectionOptions: ConnectionOptions;
}

@injectable()
export class EnvironmentVariableConfig implements IConfig {
  get connectionOptions(): ConnectionOptions {
    return {
      type: 'mysql',
      host: process.env.DB_HOST || 'mysql',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      database: process.env.DB_NAME || 'breakfast',
      username: process.env.DB_USERNAME || 'breakfast-user',
      password: process.env.DB_PASSWORD || 'breakfast-password',
    };
  }

}
