import path from 'path';
import winston from 'winston';

const log = winston.createLogger({
  level: 'info',
  format: process.env.NODE_ENV === 'production'
    ? winston.format.json()
    : winston.format.simple(),
  transports: [
    new winston.transports.Console()
  ]
});

/**
 * This is a hybrid between:
 * https://github.com/typeorm/typeorm/blob/master/src/platform/PlatformTools.ts
 * and
 * https://github.com/typeorm/typeorm/blob/master/src/platform/BrowserPlatformTools.template
 * as we don't support writing files on lambda and want a smaller bundle size so exlcued some heavy dependencies.
 */
class PlatformTools {
  static getGlobalVariable() {
    return global;
  }

  static load(name) {
    switch (name) {
      case 'mysql':
        return require('mysql');

      case 'mkdirp':
        return require('mkdirp');

      case 'path':
        return require('path');

      case 'debug':
        return require('debug');

      case 'glob':
        return require('glob');

      default:
        return require(name);
    }
  }

  /**
     * Normalizes given path. Does "path.normalize".
     */
  static pathNormalize(pathStr) {
    return path.normalize(pathStr);
  }

  /**
   * Gets file extension. Does "path.extname".
   */
  static pathExtname(pathStr) {
    return path.extname(pathStr);
  }

  /**
   * Resolved given path. Does "path.resolve".
   */
  static pathResolve(pathStr) {
    return path.resolve(pathStr);
  }

  /**
     * Synchronously checks if file exist. Does "fs.existsSync".
     */
  static fileExist(pathStr) {
    throw new Error(`This option/function is not supported in the lambda environment. Failed operation: fs.existsSync("${pathStr}").`);
  }

  static readFileSync(filename) {
    throw new Error(`This option/function is not supported in the lambda environment. Failed operation: fs.readFileSync("${filename}").`);
  }

  static appendFileSync(filename, data) {
    throw new Error(`This option/function is not supported in the lambda environment. Failed operation: fs.appendFileSync("${filename}").`);
  }

  static async writeFile(path, data) {
    throw new Error(`This option/function is not supported in the lambda environment. Failed operation: fs.writeFile("${path}").`);
  }

  /**
   * Gets environment variable.
   */
  static getEnvVariable(name) {
    return process.env[name];
  }

  /**
   * Highlights sql string to be print in the console.
   */
  static highlightSql(sql) {
    return sql;
  }

  /**
   * Highlights json string to be print in the console.
   */
  static highlightJson(json) {
    return json;
  }

  /**
   * Logging functions needed by AdvancedConsoleLogger
   */
  static logInfo(prefix, info) {
    log.info(`${prefix} ${info}`);
  }

  static logError(prefix, error) {
    log.error(`${prefix} ${error}`);
  }

  static logWarn(prefix, warning) {
    log.warn(`${prefix} ${warning}`);
  }

  static log(message) {
    log.info(message);
  }

  static warn(message) {
    log.warn(message);
  }
}

PlatformTools.type = 'node';

export { PlatformTools };
