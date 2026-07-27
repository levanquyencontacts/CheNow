import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductIsNew1785200000000 implements MigrationInterface {
  name = 'AddProductIsNew1785200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "products"
      ADD COLUMN IF NOT EXISTS "isNew" boolean NOT NULL DEFAULT false
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "products"
      DROP COLUMN IF EXISTS "isNew"
    `);
  }
}
