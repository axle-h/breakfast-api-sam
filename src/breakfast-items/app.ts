import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { LambdaEntry } from '../common/lambda-entry';
import { BreakfastItemService } from './breakfast-item.service';

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  return new LambdaEntry(BreakfastItemService, event).run();
}
