import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrderStatusLogs1785300000000 implements MigrationInterface {
  name = 'AddOrderStatusLogs1785300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "order_status_logs" (
        "id" SERIAL NOT NULL,
        "orderId" integer NOT NULL,
        "fromStatus" "public"."orders_status_enum",
        "toStatus" "public"."orders_status_enum" NOT NULL,
        "note" text,
        "changedByUserId" integer,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_order_status_logs_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'FK_order_status_logs_order'
        ) THEN
          ALTER TABLE "order_status_logs"
          ADD CONSTRAINT "FK_order_status_logs_order"
          FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
        END IF;
      END $$;
    `);
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'FK_order_status_logs_changed_by_user'
        ) THEN
          ALTER TABLE "order_status_logs"
          ADD CONSTRAINT "FK_order_status_logs_changed_by_user"
          FOREIGN KEY ("changedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
        END IF;
      END $$;
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_order_status_logs_order_created"
      ON "order_status_logs" ("orderId", "createdAt")
    `);
    await queryRunner.query(`
      INSERT INTO "order_status_logs" (
        "orderId",
        "fromStatus",
        "toStatus",
        "note",
        "changedByUserId",
        "createdAt"
      )
      SELECT
        "orders"."id",
        NULL,
        "orders"."status",
        'Order created',
        NULL,
        "orders"."createdAt"
      FROM "orders"
      WHERE NOT EXISTS (
        SELECT 1
        FROM "order_status_logs"
        WHERE "order_status_logs"."orderId" = "orders"."id"
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS "public"."IDX_order_status_logs_order_created"
    `);
    await queryRunner.query(`
      ALTER TABLE "order_status_logs"
      DROP CONSTRAINT IF EXISTS "FK_order_status_logs_changed_by_user"
    `);
    await queryRunner.query(`
      ALTER TABLE "order_status_logs"
      DROP CONSTRAINT IF EXISTS "FK_order_status_logs_order"
    `);
    await queryRunner.query(`DROP TABLE IF EXISTS "order_status_logs"`);
  }
}
