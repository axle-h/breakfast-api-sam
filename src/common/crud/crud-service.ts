import { injectable, unmanaged } from 'inversify';
import { Entity } from './entity';
import { Dto } from './dto';
import Database from '../database';
import { entityNotFound } from '../errors';
import Mapper from '../mapper';

@injectable()
export abstract class CrudService<TEntity extends Entity,
  TDto extends Dto,
  TCreateRequest> {
  protected constructor(
    @unmanaged() protected readonly type: new () => TEntity,
    @unmanaged() protected readonly database: Database,
    @unmanaged() protected readonly mapper: Mapper) {}

  public async get(id: string): Promise<TDto> {
    const repository = await this.database.getRepository(this.type);
    const entity = await repository.findOne(id);
    if (!entity) {
      throw entityNotFound(this.type, id);
    }
    return this.mapper.mapToObject<TDto>(entity);
  }

  public async create(request: TCreateRequest): Promise<TDto> {
    const repository = await this.database.getRepository(this.type);
    const entity = this.mapper.mapToClass(this.type, request);
    await repository.insert(entity as any);
    return this.mapper.mapToObject<TDto>(entity);
  }
}
