import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';
import { Container } from 'inversify';
import { CrudService } from './crud/crud-service';
import { ServiceError } from './errors';
import Database, { TypeOrmDatabase } from './database';
import TYPES from './types';
import Logger, { logger } from './logger';
import Mapper, { ClassTransformerMapper } from './mapper';
import Config, { EnvironmentVariableConfig } from './config';

function getErrorResponse(error: ServiceError, statusCode: number): APIGatewayProxyResult {
  return {
    statusCode,
    body: JSON.stringify({
      code: statusCode,
      message: error.message,
      detail: error.detail
    })
  };
}

export class LambdaEntry<TService extends CrudService<any, any, any>> {
  private readonly container: Container;

  constructor(
    private readonly serviceType: new (...args: any[]) => TService,
    private readonly event: APIGatewayProxyEvent) {
    this.container = new Container();
    this.container.bind(serviceType).toSelf();
    this.container.bind<Mapper>(TYPES.Mapper).to(ClassTransformerMapper).inSingletonScope();
    this.container.bind<Database>(TYPES.Database).to(TypeOrmDatabase).inSingletonScope();
    this.container.bind<Config>(TYPES.Config).to(EnvironmentVariableConfig).inSingletonScope();

    const requestLogger = logger.child({ requstId: event.requestContext.requestId });
    this.container.bind<Logger>(TYPES.Logger).toConstantValue(requestLogger);
  }

  bind(func: (container: Container) => void): this {
    func(this.container);
    return this;
  }

  async run(): Promise<APIGatewayProxyResult> {
    const service = this.container.get(this.serviceType);
    let result: any;

    try {
      switch (this.event.httpMethod) {
        case 'GET':
          result = await service.get(this.event.pathParameters.id);
          break;

        case 'POST':
          result = await service.create(JSON.parse(this.event.body));
          break;
      }

      return {
        statusCode: 200,
        body: JSON.stringify(result)
      };
    } catch (e) {
      switch (e.name) {
        case 'BadRequestError':
          return getErrorResponse(e, 400);

        case 'NotFoundError':
          return getErrorResponse(e, 404);

        default:
          return {
            statusCode: 500,
            body: JSON.stringify({
              code: 500,
              message: 'An unknown error has occurred'
            })
          };
      }
    }
  }
}
