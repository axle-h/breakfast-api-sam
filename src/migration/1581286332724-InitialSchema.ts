import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1581286332724 implements MigrationInterface {
  name = 'InitialSchema1581286332724';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('CREATE TABLE `breakfast_items` (`id` varchar(36) NOT NULL, `name` varchar(100) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB', undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('DROP TABLE `breakfast_items`', undefined);
  }
}
