import { Entity as EntityBase } from '../../common/crud/entity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Expose } from 'class-transformer';

@Entity('breakfast_items')
export class BreakfastItem implements EntityBase {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;

  @Column({
    length: 100
  })
  @Expose()
  name: string;
}
