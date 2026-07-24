import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserAddresses1785100000000 implements MigrationInterface {
  name = 'AddUserAddresses1785100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_addresses" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "label" character varying(50) NOT NULL, "receiverName" character varying(100) NOT NULL, "receiverPhone" character varying(20) NOT NULL, "fullAddress" character varying(500) NOT NULL, "isDefault" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_user_addresses_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_user_addresses_userId" ON "user_addresses" ("userId")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_user_addresses_one_default_per_user" ON "user_addresses" ("userId") WHERE "isDefault" = true`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_addresses" ADD CONSTRAINT "FK_user_addresses_userId" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_addresses" DROP CONSTRAINT "FK_user_addresses_userId"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."UQ_user_addresses_one_default_per_user"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_user_addresses_userId"`);
    await queryRunner.query(`DROP TABLE "user_addresses"`);
  }
}
