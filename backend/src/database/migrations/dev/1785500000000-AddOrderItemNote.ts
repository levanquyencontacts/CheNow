import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrderItemNote1785500000000 implements MigrationInterface {
  name = 'AddOrderItemNote1785500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "order_items"
      ADD COLUMN IF NOT EXISTS "note" text
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "order_items"
      DROP COLUMN IF EXISTS "note"
    `);
  }
}
