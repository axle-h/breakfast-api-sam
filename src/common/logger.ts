import * as winston from 'winston';

interface LeveledLogMethod {
  (message: string): Logger;
  (message: string, meta: any): Logger;
  (message: string, ...meta: any[]): Logger;
  (infoObject: object): Logger;
}

export default interface Logger {
  error: LeveledLogMethod;
  warn: LeveledLogMethod;
  info: LeveledLogMethod;
  debug: LeveledLogMethod;

  child(options: Object): Logger;
}

const WinstonLogger = winston.createLogger({
  level: 'info',
  format: process.env.NODE_ENV === 'production'
    ? winston.format.json()
    : winston.format.simple(),
  transports: [
    new winston.transports.Console()
  ]
});

export const logger = WinstonLogger as Logger;
