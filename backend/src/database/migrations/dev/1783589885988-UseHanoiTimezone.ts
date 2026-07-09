import { MigrationInterface, QueryRunner } from 'typeorm';

export class UseHanoiTimezone1783589885988 implements MigrationInterface {
  name = 'UseHanoiTimezone1783589885988';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_751332fc6cc6fc576c6975cd07"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_b853c3320df7cf06b7bfa413c8"`,
    );

    await queryRunner.query(`
      ALTER TABLE "customer_profiles"
        ALTER COLUMN "createdAt" TYPE TIMESTAMP WITH TIME ZONE USING "createdAt" AT TIME ZONE 'UTC',
        ALTER COLUMN "updatedAt" TYPE TIMESTAMP WITH TIME ZONE USING "updatedAt" AT TIME ZONE 'UTC'
    `);
    await queryRunner.query(`
      ALTER TABLE "roles"
        ALTER COLUMN "createdAt" TYPE TIMESTAMP WITH TIME ZONE USING "createdAt" AT TIME ZONE 'UTC',
        ALTER COLUMN "updatedAt" TYPE TIMESTAMP WITH TIME ZONE USING "updatedAt" AT TIME ZONE 'UTC'
    `);
    await queryRunner.query(`
      ALTER TABLE "user_roles"
        ALTER COLUMN "createdAt" TYPE TIMESTAMP WITH TIME ZONE USING "createdAt" AT TIME ZONE 'UTC'
    `);
    await queryRunner.query(`
      ALTER TABLE "users"
        ALTER COLUMN "createdAt" TYPE TIMESTAMP WITH TIME ZONE USING "createdAt" AT TIME ZONE 'UTC',
        ALTER COLUMN "updatedAt" TYPE TIMESTAMP WITH TIME ZONE USING "updatedAt" AT TIME ZONE 'UTC'
    `);
    await queryRunner.query(`
      ALTER TABLE "refresh_tokens"
        ALTER COLUMN "createdAt" TYPE TIMESTAMP WITH TIME ZONE USING "createdAt" AT TIME ZONE 'UTC'
    `);
    await queryRunner.query(`
      ALTER TABLE "product_stocks"
        ALTER COLUMN "createdAt" TYPE TIMESTAMP WITH TIME ZONE USING "createdAt" AT TIME ZONE 'UTC',
        ALTER COLUMN "updatedAt" TYPE TIMESTAMP WITH TIME ZONE USING "updatedAt" AT TIME ZONE 'UTC'
    `);
    await queryRunner.query(`
      ALTER TABLE "sizes"
        ALTER COLUMN "createdAt" TYPE TIMESTAMP WITH TIME ZONE USING "createdAt" AT TIME ZONE 'UTC',
        ALTER COLUMN "updatedAt" TYPE TIMESTAMP WITH TIME ZONE USING "updatedAt" AT TIME ZONE 'UTC'
    `);
    await queryRunner.query(`
      ALTER TABLE "category_sizes"
        ALTER COLUMN "createdAt" TYPE TIMESTAMP WITH TIME ZONE USING "createdAt" AT TIME ZONE 'UTC',
        ALTER COLUMN "updatedAt" TYPE TIMESTAMP WITH TIME ZONE USING "updatedAt" AT TIME ZONE 'UTC'
    `);
    await queryRunner.query(`
      ALTER TABLE "orders"
        ALTER COLUMN "createdAt" TYPE TIMESTAMP WITH TIME ZONE USING "createdAt" AT TIME ZONE 'UTC',
        ALTER COLUMN "updatedAt" TYPE TIMESTAMP WITH TIME ZONE USING "updatedAt" AT TIME ZONE 'UTC'
    `);
    await queryRunner.query(`
      ALTER TABLE "products"
        ALTER COLUMN "createdAt" TYPE TIMESTAMP WITH TIME ZONE USING "createdAt" AT TIME ZONE 'UTC',
        ALTER COLUMN "updatedAt" TYPE TIMESTAMP WITH TIME ZONE USING "updatedAt" AT TIME ZONE 'UTC'
    `);
    await queryRunner.query(`
      ALTER TABLE "categories"
        ALTER COLUMN "createdAt" TYPE TIMESTAMP WITH TIME ZONE USING "createdAt" AT TIME ZONE 'UTC',
        ALTER COLUMN "updatedAt" TYPE TIMESTAMP WITH TIME ZONE USING "updatedAt" AT TIME ZONE 'UTC'
    `);
    await queryRunner.query(`
      ALTER TABLE "category_toppings"
        ALTER COLUMN "created_at" TYPE TIMESTAMP WITH TIME ZONE USING "created_at" AT TIME ZONE 'UTC',
        ALTER COLUMN "updated_at" TYPE TIMESTAMP WITH TIME ZONE USING "updated_at" AT TIME ZONE 'UTC'
    `);
    await queryRunner.query(`
      ALTER TABLE "toppings"
        ALTER COLUMN "created_at" TYPE TIMESTAMP WITH TIME ZONE USING "created_at" AT TIME ZONE 'UTC',
        ALTER COLUMN "updated_at" TYPE TIMESTAMP WITH TIME ZONE USING "updated_at" AT TIME ZONE 'UTC'
    `);
    await queryRunner.query(`
      ALTER TABLE "conversation_participants"
        ALTER COLUMN "joinedAt" TYPE TIMESTAMP WITH TIME ZONE USING "joinedAt" AT TIME ZONE 'UTC',
        ALTER COLUMN "lastReadAt" TYPE TIMESTAMP WITH TIME ZONE USING "lastReadAt" AT TIME ZONE 'UTC',
        ALTER COLUMN "createdAt" TYPE TIMESTAMP WITH TIME ZONE USING "createdAt" AT TIME ZONE 'UTC',
        ALTER COLUMN "updatedAt" TYPE TIMESTAMP WITH TIME ZONE USING "updatedAt" AT TIME ZONE 'UTC'
    `);
    await queryRunner.query(`
      ALTER TABLE "conversations"
        ALTER COLUMN "lastMessageAt" TYPE TIMESTAMP WITH TIME ZONE USING "lastMessageAt" AT TIME ZONE 'UTC',
        ALTER COLUMN "createdAt" TYPE TIMESTAMP WITH TIME ZONE USING "createdAt" AT TIME ZONE 'UTC',
        ALTER COLUMN "updatedAt" TYPE TIMESTAMP WITH TIME ZONE USING "updatedAt" AT TIME ZONE 'UTC'
    `);
    await queryRunner.query(`
      ALTER TABLE "messages"
        ALTER COLUMN "createdAt" TYPE TIMESTAMP WITH TIME ZONE USING "createdAt" AT TIME ZONE 'UTC',
        ALTER COLUMN "updatedAt" TYPE TIMESTAMP WITH TIME ZONE USING "updatedAt" AT TIME ZONE 'UTC',
        ALTER COLUMN "deletedAt" TYPE TIMESTAMP WITH TIME ZONE USING "deletedAt" AT TIME ZONE 'UTC'
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_b853c3320df7cf06b7bfa413c8" ON "conversations" ("lastMessageAt")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_751332fc6cc6fc576c6975cd07" ON "messages" ("conversationId", "createdAt")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_751332fc6cc6fc576c6975cd07"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_b853c3320df7cf06b7bfa413c8"`,
    );

    await queryRunner.query(`
      ALTER TABLE "messages"
        ALTER COLUMN "createdAt" TYPE TIMESTAMP WITHOUT TIME ZONE USING "createdAt" AT TIME ZONE 'UTC',
        ALTER COLUMN "updatedAt" TYPE TIMESTAMP WITHOUT TIME ZONE USING "updatedAt" AT TIME ZONE 'UTC',
        ALTER COLUMN "deletedAt" TYPE TIMESTAMP WITHOUT TIME ZONE USING "deletedAt" AT TIME ZONE 'UTC'
    `);
    await queryRunner.query(`
      ALTER TABLE "conversations"
        ALTER COLUMN "lastMessageAt" TYPE TIMESTAMP WITHOUT TIME ZONE USING "lastMessageAt" AT TIME ZONE 'UTC',
        ALTER COLUMN "createdAt" TYPE TIMESTAMP WITHOUT TIME ZONE USING "createdAt" AT TIME ZONE 'UTC',
        ALTER COLUMN "updatedAt" TYPE TIMESTAMP WITHOUT TIME ZONE USING "updatedAt" AT TIME ZONE 'UTC'
    `);
    await queryRunner.query(`
      ALTER TABLE "conversation_participants"
        ALTER COLUMN "joinedAt" TYPE TIMESTAMP WITHOUT TIME ZONE USING "joinedAt" AT TIME ZONE 'UTC',
        ALTER COLUMN "lastReadAt" TYPE TIMESTAMP WITHOUT TIME ZONE USING "lastReadAt" AT TIME ZONE 'UTC',
        ALTER COLUMN "createdAt" TYPE TIMESTAMP WITHOUT TIME ZONE USING "createdAt" AT TIME ZONE 'UTC',
        ALTER COLUMN "updatedAt" TYPE TIMESTAMP WITHOUT TIME ZONE USING "updatedAt" AT TIME ZONE 'UTC'
    `);
    await queryRunner.query(`
      ALTER TABLE "toppings"
        ALTER COLUMN "created_at" TYPE TIMESTAMP WITHOUT TIME ZONE USING "created_at" AT TIME ZONE 'UTC',
        ALTER COLUMN "updated_at" TYPE TIMESTAMP WITHOUT TIME ZONE USING "updated_at" AT TIME ZONE 'UTC'
    `);
    await queryRunner.query(`
      ALTER TABLE "category_toppings"
        ALTER COLUMN "created_at" TYPE TIMESTAMP WITHOUT TIME ZONE USING "created_at" AT TIME ZONE 'UTC',
        ALTER COLUMN "updated_at" TYPE TIMESTAMP WITHOUT TIME ZONE USING "updated_at" AT TIME ZONE 'UTC'
    `);
    await queryRunner.query(`
      ALTER TABLE "categories"
        ALTER COLUMN "createdAt" TYPE TIMESTAMP WITHOUT TIME ZONE USING "createdAt" AT TIME ZONE 'UTC',
        ALTER COLUMN "updatedAt" TYPE TIMESTAMP WITHOUT TIME ZONE USING "updatedAt" AT TIME ZONE 'UTC'
    `);
    await queryRunner.query(`
      ALTER TABLE "products"
        ALTER COLUMN "createdAt" TYPE TIMESTAMP WITHOUT TIME ZONE USING "createdAt" AT TIME ZONE 'UTC',
        ALTER COLUMN "updatedAt" TYPE TIMESTAMP WITHOUT TIME ZONE USING "updatedAt" AT TIME ZONE 'UTC'
    `);
    await queryRunner.query(`
      ALTER TABLE "orders"
        ALTER COLUMN "createdAt" TYPE TIMESTAMP WITHOUT TIME ZONE USING "createdAt" AT TIME ZONE 'UTC',
        ALTER COLUMN "updatedAt" TYPE TIMESTAMP WITHOUT TIME ZONE USING "updatedAt" AT TIME ZONE 'UTC'
    `);
    await queryRunner.query(`
      ALTER TABLE "category_sizes"
        ALTER COLUMN "createdAt" TYPE TIMESTAMP WITHOUT TIME ZONE USING "createdAt" AT TIME ZONE 'UTC',
        ALTER COLUMN "updatedAt" TYPE TIMESTAMP WITHOUT TIME ZONE USING "updatedAt" AT TIME ZONE 'UTC'
    `);
    await queryRunner.query(`
      ALTER TABLE "sizes"
        ALTER COLUMN "createdAt" TYPE TIMESTAMP WITHOUT TIME ZONE USING "createdAt" AT TIME ZONE 'UTC',
        ALTER COLUMN "updatedAt" TYPE TIMESTAMP WITHOUT TIME ZONE USING "updatedAt" AT TIME ZONE 'UTC'
    `);
    await queryRunner.query(`
      ALTER TABLE "product_stocks"
        ALTER COLUMN "createdAt" TYPE TIMESTAMP WITHOUT TIME ZONE USING "createdAt" AT TIME ZONE 'UTC',
        ALTER COLUMN "updatedAt" TYPE TIMESTAMP WITHOUT TIME ZONE USING "updatedAt" AT TIME ZONE 'UTC'
    `);
    await queryRunner.query(`
      ALTER TABLE "refresh_tokens"
        ALTER COLUMN "createdAt" TYPE TIMESTAMP WITHOUT TIME ZONE USING "createdAt" AT TIME ZONE 'UTC'
    `);
    await queryRunner.query(`
      ALTER TABLE "users"
        ALTER COLUMN "createdAt" TYPE TIMESTAMP WITHOUT TIME ZONE USING "createdAt" AT TIME ZONE 'UTC',
        ALTER COLUMN "updatedAt" TYPE TIMESTAMP WITHOUT TIME ZONE USING "updatedAt" AT TIME ZONE 'UTC'
    `);
    await queryRunner.query(`
      ALTER TABLE "user_roles"
        ALTER COLUMN "createdAt" TYPE TIMESTAMP WITHOUT TIME ZONE USING "createdAt" AT TIME ZONE 'UTC'
    `);
    await queryRunner.query(`
      ALTER TABLE "roles"
        ALTER COLUMN "createdAt" TYPE TIMESTAMP WITHOUT TIME ZONE USING "createdAt" AT TIME ZONE 'UTC',
        ALTER COLUMN "updatedAt" TYPE TIMESTAMP WITHOUT TIME ZONE USING "updatedAt" AT TIME ZONE 'UTC'
    `);
    await queryRunner.query(`
      ALTER TABLE "customer_profiles"
        ALTER COLUMN "createdAt" TYPE TIMESTAMP WITHOUT TIME ZONE USING "createdAt" AT TIME ZONE 'UTC',
        ALTER COLUMN "updatedAt" TYPE TIMESTAMP WITHOUT TIME ZONE USING "updatedAt" AT TIME ZONE 'UTC'
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_b853c3320df7cf06b7bfa413c8" ON "conversations" ("lastMessageAt")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_751332fc6cc6fc576c6975cd07" ON "messages" ("conversationId", "createdAt")`,
    );
  }
}
