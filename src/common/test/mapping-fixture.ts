import { ClassTransformerMapper } from '../mapper';
import { expect } from 'chai';

export class MappingFixture<TSource, TDestination> {
  private source: TSource;
  private cls: new(...args: any[]) => TDestination = null;
  private expectedFactory: ((TSource) => TDestination);

  whenMappingFrom(source: TSource | (() => TSource)): this {
    if(source instanceof Function) {
      this.source = source();
    } else {
      this.source = source;
    }
    return this;
  }

  toClass(cls: new(...args: any[]) => TDestination): this {
    this.cls = cls;
    return this;
  }

  shouldReturn(expectedFactory: (TSource) => TDestination): this {
    this.expectedFactory = expectedFactory;
    return this;
  }

  run() {
    const mapper = new ClassTransformerMapper();
    const expected = this.expectedFactory(this.source);

    if(this.cls !== null) {
      const result = mapper.mapToClass(this.cls, this.source);
      expect(result)
        .to.be.instanceOf(this.cls)
        .which.deep.equals(expected);
    } else {
      const result = mapper.mapToObject<TDestination>(this.source);
      expect(result)
        .to.be.instanceOf(Object)
        .which.deep.equals(expected);
    }
  }
}
