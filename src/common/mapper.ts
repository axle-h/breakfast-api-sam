import { classToPlain, plainToClass } from 'class-transformer';
import { injectable } from 'inversify';

export default interface Mapper {
  mapToClass<TSource, TDestination>(cls: new (...args: any[]) => TDestination, source: TSource): TDestination;
  mapToObject<TDestination>(source: any): TDestination;
}

@injectable()
export class ClassTransformerMapper implements Mapper {
  mapToClass<TSource, TDestination>(cls: new(...args: any[]) => TDestination, source: TSource): TDestination {
    return plainToClass(cls, source, { excludeExtraneousValues: true });
  }

  mapToObject<TDestination>(source: any): TDestination {
    return classToPlain(source, { strategy: 'excludeAll' }) as TDestination;
  }
}
