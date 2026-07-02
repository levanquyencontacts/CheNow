import { MigrationInterface, QueryRunner } from "typeorm";

export class AddConversation1782981990633 implements MigrationInterface {
    name = 'AddConversation1782981990633'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DO $$
            BEGIN
                CREATE TYPE "public"."conversation_user_role_enum" AS ENUM('customer', 'admin');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);
        await queryRunner.query(`CREATE TABLE "conversation_participants" ("id" SERIAL NOT NULL, "conversationId" integer NOT NULL, "userId" integer NOT NULL, "participantRole" "public"."conversation_user_role_enum" NOT NULL, "joinedAt" TIMESTAMP NOT NULL, "lastReadAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e43efbfa3b850160b5b2c50e3ec" UNIQUE ("conversationId", "userId"), CONSTRAINT "PK_61b51428ad9453f5921369fbe94" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4453e20858b14ab765a09ad728" ON "conversation_participants" ("conversationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_18c4ba3b127461649e5f5039db" ON "conversation_participants" ("userId") `);
        await queryRunner.query(`CREATE TABLE "conversations" ("id" SERIAL NOT NULL, "customerId" integer NOT NULL, "assignedAdminId" integer, "title" character varying, "lastMessageId" integer, "lastMessageAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ee34f4f7ced4ec8681f26bf04ef" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_5a4866f304edf4591ad785d34a" ON "conversations" ("customerId") `);
        await queryRunner.query(`CREATE INDEX "IDX_355b7679501547ab24cb54c1a4" ON "conversations" ("assignedAdminId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b853c3320df7cf06b7bfa413c8" ON "conversations" ("lastMessageAt") `);
        await queryRunner.query(`
            DO $$
            BEGIN
                CREATE TYPE "public"."message_type_enum" AS ENUM('text', 'image', 'file');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);
        await queryRunner.query(`CREATE TABLE "messages" ("id" SERIAL NOT NULL, "conversationId" integer NOT NULL, "senderId" integer NOT NULL, "senderRole" "public"."conversation_user_role_enum" NOT NULL, "type" "public"."message_type_enum" NOT NULL DEFAULT 'text', "content" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2db9cf2b3ca111742793f6c37c" ON "messages" ("senderId") `);
        await queryRunner.query(`CREATE INDEX "IDX_751332fc6cc6fc576c6975cd07" ON "messages" ("conversationId", "createdAt") `);
        await queryRunner.query(`ALTER TYPE "public"."products_status_enum" RENAME TO "products_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."products_status_enum" AS ENUM('active', 'inactive')`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "status" TYPE "public"."products_status_enum" USING "status"::"text"::"public"."products_status_enum"`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "status" SET DEFAULT 'active'`);
        await queryRunner.query(`DROP TYPE "public"."products_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "conversation_participants" ADD CONSTRAINT "FK_4453e20858b14ab765a09ad728c" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "conversation_participants" ADD CONSTRAINT "FK_18c4ba3b127461649e5f5039dbf" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "conversations" ADD CONSTRAINT "FK_5a4866f304edf4591ad785d34a4" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "conversations" ADD CONSTRAINT "FK_355b7679501547ab24cb54c1a4c" FOREIGN KEY ("assignedAdminId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "conversations" ADD CONSTRAINT "FK_c6e63680bca6085833f396ac1fa" FOREIGN KEY ("lastMessageId") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_e5663ce0c730b2de83445e2fd19" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_2db9cf2b3ca111742793f6c37ce" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_2db9cf2b3ca111742793f6c37ce"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_e5663ce0c730b2de83445e2fd19"`);
        await queryRunner.query(`ALTER TABLE "conversations" DROP CONSTRAINT "FK_c6e63680bca6085833f396ac1fa"`);
        await queryRunner.query(`ALTER TABLE "conversations" DROP CONSTRAINT "FK_355b7679501547ab24cb54c1a4c"`);
        await queryRunner.query(`ALTER TABLE "conversations" DROP CONSTRAINT "FK_5a4866f304edf4591ad785d34a4"`);
        await queryRunner.query(`ALTER TABLE "conversation_participants" DROP CONSTRAINT "FK_18c4ba3b127461649e5f5039dbf"`);
        await queryRunner.query(`ALTER TABLE "conversation_participants" DROP CONSTRAINT "FK_4453e20858b14ab765a09ad728c"`);
        await queryRunner.query(`CREATE TYPE "public"."products_status_enum_old" AS ENUM('active', 'inactive')`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "status" TYPE "public"."products_status_enum_old" USING "status"::"text"::"public"."products_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "status" SET DEFAULT 'active'`);
        await queryRunner.query(`DROP TYPE "public"."products_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."products_status_enum_old" RENAME TO "products_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_751332fc6cc6fc576c6975cd07"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2db9cf2b3ca111742793f6c37c"`);
        await queryRunner.query(`DROP TABLE "messages"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."message_type_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b853c3320df7cf06b7bfa413c8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_355b7679501547ab24cb54c1a4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5a4866f304edf4591ad785d34a"`);
        await queryRunner.query(`DROP TABLE "conversations"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_18c4ba3b127461649e5f5039db"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4453e20858b14ab765a09ad728"`);
        await queryRunner.query(`DROP TABLE "conversation_participants"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."conversation_user_role_enum"`);
    }

}
