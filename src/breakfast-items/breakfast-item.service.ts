import { BreakfastItemDto } from './dto/breakfast-item';
import { CrudService } from '../common/crud/crud-service';
import { BreakfastItem } from './entities/breakfast-item';
import { CreateBreakfastItemRequest } from './requests/create-breakfast-item';
import { inject, injectable } from 'inversify';
import TYPES from '../common/types';
import Database from '../common/database';
import Mapper from '../common/mapper';

@injectable()
export class BreakfastItemService extends CrudService<BreakfastItem, BreakfastItemDto, CreateBreakfastItemRequest> {
  constructor(@inject(TYPES.Database) database: Database,
              @inject(TYPES.Mapper) mapper: Mapper) {
    super(BreakfastItem, database, mapper);
  }
}
