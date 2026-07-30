import { MigrationInterface, QueryRunner } from 'typeorm';

export class EnforceSingleUserRole1785400000000 implements MigrationInterface {
  name = 'EnforceSingleUserRole1785400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "roles" ("code", "name")
      VALUES
        ('admin', 'Quan tri vien'),
        ('staff', 'Nhan vien'),
        ('customer', 'Khach hang')
      ON CONFLICT ("code") DO NOTHING
    `);

    await queryRunner.query(`
      CREATE TABLE "user_role_migration_audits" (
        "id" SERIAL NOT NULL,
        "userId" integer NOT NULL,
        "action" character varying NOT NULL,
        "details" jsonb NOT NULL DEFAULT '{}'::jsonb,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_user_role_migration_audits" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "user_role_migration_user_backups" (
        "userId" integer NOT NULL,
        "email" character varying NOT NULL,
        "isActive" boolean NOT NULL,
        CONSTRAINT "PK_user_role_migration_user_backups"
          PRIMARY KEY ("userId")
      )
    `);
    await queryRunner.query(`
      INSERT INTO "user_role_migration_user_backups"
        ("userId", "email", "isActive")
      SELECT "id", "email", "isActive"
      FROM "users"
    `);
    await queryRunner.query(`
      CREATE TABLE "user_role_migration_role_backups" (
        "id" integer NOT NULL,
        "userId" integer NOT NULL,
        "roleId" integer NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        CONSTRAINT "PK_user_role_migration_role_backups"
          PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      INSERT INTO "user_role_migration_role_backups"
        ("id", "userId", "roleId", "createdAt")
      SELECT "id", "userId", "roleId", "createdAt"
      FROM "user_roles"
    `);

    await queryRunner.query(`
      INSERT INTO "user_role_migration_audits" ("userId", "action", "details")
      SELECT
        ranked."userId",
        'multiple_roles_resolved',
        jsonb_build_object(
          'keptRole', MAX(ranked."code") FILTER (WHERE ranked.priority = 1),
          'previousRoles', jsonb_agg(ranked."code" ORDER BY ranked.priority)
        )
      FROM (
        SELECT
          ur."userId",
          r."code"::text AS "code",
          ROW_NUMBER() OVER (
            PARTITION BY ur."userId"
            ORDER BY CASE r."code"::text
              WHEN 'admin' THEN 1
              WHEN 'staff' THEN 2
              ELSE 3
            END, ur."id"
          ) AS priority
        FROM "user_roles" ur
        INNER JOIN "roles" r ON r."id" = ur."roleId"
      ) ranked
      GROUP BY ranked."userId"
      HAVING COUNT(*) > 1
    `);

    await queryRunner.query(`
      WITH ranked AS (
        SELECT
          ur."id",
          ROW_NUMBER() OVER (
            PARTITION BY ur."userId"
            ORDER BY CASE r."code"::text
              WHEN 'admin' THEN 1
              WHEN 'staff' THEN 2
              ELSE 3
            END, ur."id"
          ) AS priority
        FROM "user_roles" ur
        INNER JOIN "roles" r ON r."id" = ur."roleId"
      )
      DELETE FROM "user_roles"
      WHERE "id" IN (SELECT "id" FROM ranked WHERE priority > 1)
    `);

    await queryRunner.query(`
      INSERT INTO "user_role_migration_audits" ("userId", "action", "details")
      SELECT
        u."id",
        CASE
          WHEN cp."id" IS NOT NULL THEN 'missing_role_assigned_customer'
          ELSE 'missing_role_assigned_customer_and_deactivated'
        END,
        jsonb_build_object('hadCustomerProfile', cp."id" IS NOT NULL)
      FROM "users" u
      LEFT JOIN "user_roles" ur ON ur."userId" = u."id"
      LEFT JOIN "customer_profiles" cp ON cp."userId" = u."id"
      WHERE ur."id" IS NULL
    `);

    await queryRunner.query(`
      UPDATE "users" u
      SET "isActive" = false
      WHERE NOT EXISTS (
        SELECT 1 FROM "user_roles" ur WHERE ur."userId" = u."id"
      )
      AND NOT EXISTS (
        SELECT 1 FROM "customer_profiles" cp WHERE cp."userId" = u."id"
      )
    `);

    await queryRunner.query(`
      INSERT INTO "user_roles" ("userId", "roleId")
      SELECT u."id", r."id"
      FROM "users" u
      CROSS JOIN "roles" r
      WHERE r."code" = 'customer'
      AND NOT EXISTS (
        SELECT 1 FROM "user_roles" ur WHERE ur."userId" = u."id"
      )
    `);

    await queryRunner.query(`
      INSERT INTO "user_role_migration_audits" ("userId", "action", "details")
      SELECT
        u."id",
        'customer_profile_preserved_for_non_customer',
        jsonb_build_object('role', r."code"::text)
      FROM "users" u
      INNER JOIN "customer_profiles" cp ON cp."userId" = u."id"
      INNER JOIN "user_roles" ur ON ur."userId" = u."id"
      INNER JOIN "roles" r ON r."id" = ur."roleId"
      WHERE r."code"::text <> 'customer'
    `);

    await queryRunner.query(`
      UPDATE "users" SET "email" = LOWER(TRIM("email"))
    `);

    await queryRunner.query(`
      DO $$
      DECLARE duplicate_emails text;
      BEGIN
        SELECT string_agg(
          format('%s (user ids: %s)', normalized_email, user_ids),
          '; '
        )
        INTO duplicate_emails
        FROM (
          SELECT
            LOWER(TRIM("email")) AS normalized_email,
            string_agg("id"::text, ',' ORDER BY "id") AS user_ids
          FROM "users"
          GROUP BY LOWER(TRIM("email"))
          HAVING COUNT(*) > 1
        ) duplicates;

        IF duplicate_emails IS NOT NULL THEN
          RAISE EXCEPTION
            'Duplicate normalized emails must be resolved before migration: %',
            duplicate_emails;
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$
      DECLARE constraint_name text;
      BEGIN
        SELECT c.conname INTO constraint_name
        FROM pg_constraint c
        WHERE c.conrelid = 'user_roles'::regclass
          AND c.contype = 'u'
          AND (
            SELECT array_agg(a.attname::text ORDER BY columns.ordinality)
            FROM unnest(c.conkey) WITH ORDINALITY columns(attnum, ordinality)
            JOIN pg_attribute a
              ON a.attrelid = c.conrelid AND a.attnum = columns.attnum
          ) = ARRAY['userId', 'roleId'];

        IF constraint_name IS NOT NULL THEN
          EXECUTE format(
            'ALTER TABLE "user_roles" DROP CONSTRAINT %I',
            constraint_name
          );
        END IF;
      END $$;
    `);
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "UQ_user_roles_userId" UNIQUE ("userId")`,
    );

    await queryRunner.query(`
      DO $$
      DECLARE constraint_name text;
      BEGIN
        SELECT c.conname INTO constraint_name
        FROM pg_constraint c
        JOIN pg_attribute a
          ON a.attrelid = c.conrelid AND a.attnum = ANY(c.conkey)
        WHERE c.conrelid = 'user_roles'::regclass
          AND c.contype = 'f'
          AND a.attname = 'roleId';

        IF constraint_name IS NOT NULL THEN
          EXECUTE format(
            'ALTER TABLE "user_roles" DROP CONSTRAINT %I',
            constraint_name
          );
        END IF;
      END $$;
    `);
    await queryRunner.query(`
      ALTER TABLE "user_roles"
      ADD CONSTRAINT "FK_user_roles_role_restrict"
      FOREIGN KEY ("roleId") REFERENCES "roles"("id")
      ON DELETE RESTRICT ON UPDATE NO ACTION
    `);

    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_users_email_lower_unique" ON "users" (LOWER("email"))`,
    );

    await queryRunner.query(`
      CREATE TABLE "user_role_histories" (
        "id" SERIAL NOT NULL,
        "userId" integer NOT NULL,
        "actorId" integer NOT NULL,
        "oldRoleId" integer,
        "newRoleId" integer NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_user_role_histories" PRIMARY KEY ("id"),
        CONSTRAINT "FK_user_role_histories_user"
          FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT,
        CONSTRAINT "FK_user_role_histories_actor"
          FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE RESTRICT,
        CONSTRAINT "FK_user_role_histories_old_role"
          FOREIGN KEY ("oldRoleId") REFERENCES "roles"("id") ON DELETE RESTRICT,
        CONSTRAINT "FK_user_role_histories_new_role"
          FOREIGN KEY ("newRoleId") REFERENCES "roles"("id") ON DELETE RESTRICT
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user_role_histories"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_users_email_lower_unique"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_user_roles_role_restrict"`,
    );
    await queryRunner.query(`
      ALTER TABLE "user_roles"
      ADD CONSTRAINT "FK_86033897c009fcca8b6505d6be2"
      FOREIGN KEY ("roleId") REFERENCES "roles"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "UQ_user_roles_userId"`,
    );
    await queryRunner.query(`
      ALTER TABLE "user_roles"
      ADD CONSTRAINT "UQ_88481b0c4ed9ada47e9fdd67475"
      UNIQUE ("userId", "roleId")
    `);
    await queryRunner.query(`
      DELETE FROM "user_roles"
      WHERE "userId" IN (
        SELECT "userId" FROM "user_role_migration_user_backups"
      )
    `);
    await queryRunner.query(`
      INSERT INTO "user_roles" ("id", "userId", "roleId", "createdAt")
      SELECT "id", "userId", "roleId", "createdAt"
      FROM "user_role_migration_role_backups"
      ORDER BY "id"
    `);
    await queryRunner.query(`
      UPDATE "users" u
      SET
        "email" = backup."email",
        "isActive" = backup."isActive"
      FROM "user_role_migration_user_backups" backup
      WHERE u."id" = backup."userId"
    `);
    await queryRunner.query(`DROP TABLE "user_role_migration_role_backups"`);
    await queryRunner.query(`DROP TABLE "user_role_migration_user_backups"`);
    await queryRunner.query(`DROP TABLE "user_role_migration_audits"`);
  }
}
