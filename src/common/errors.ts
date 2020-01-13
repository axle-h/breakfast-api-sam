import { v4 as uuid } from 'uuid';
import { Entity } from './crud/entity';

export interface ServiceError {
  id: string;
  name: string;
  message: string;
  detail?: any;
  cause?: Error;
}

class ServiceErrorBase extends Error implements ServiceError {
  public readonly id: string = uuid();
  public readonly name: string = this.constructor.name;
  public readonly message: string;
  public readonly detail?: any;
  public readonly cause?: Error;

  constructor(message: string, detail?: any, cause?: Error) {
    super();
    this.message = message;
    this.detail = detail;
    this.cause = cause;
  }
}

export class BadRequestError extends ServiceErrorBase {}

export class NotFoundError<T> extends ServiceErrorBase {
  constructor(type: new () => T, key: keyof T, value: string) {
    super(`An ${type.name} with ${key} of ${value} cannot be found`, { type, key, value });
  }
}

export function entityNotFound<T extends Entity>(type: new () => T, id: string): NotFoundError<T> {
  return new NotFoundError(type, 'id', id);
}
