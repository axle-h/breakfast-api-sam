import { suite, test } from 'mocha-typescript';
import * as faker from 'faker';
import { CreateBreakfastItemRequest } from '../requests/create-breakfast-item';
import { BreakfastItem } from './breakfast-item';
import { BreakfastItemDto } from '../dto/breakfast-item';
import { MappingFixture } from '../../common/test/mapping-fixture';

@suite
class BreakfastItemSpec {
  @test
  When_mapping_from_request_to_entity() {
    new MappingFixture<CreateBreakfastItemRequest, BreakfastItem>()
      .whenMappingFrom({ name: faker.random.uuid() })
      .toClass(BreakfastItem)
      .shouldReturn(src => ({
        id: undefined,
        name: src.name
      }))
      .run();
  }

  @test
  When_mapping_from_entity_to_dto() {
    new MappingFixture<BreakfastItem, BreakfastItemDto>()
      .whenMappingFrom(Object.assign(new BreakfastItem(), {
        id: faker.random.uuid(),
        name: faker.random.uuid()
      }))
      .shouldReturn(src => ({
        id: src.id,
        name: src.name
      }))
      .run();
  }
}
