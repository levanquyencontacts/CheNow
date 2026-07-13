import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCustomerCart1783958045356 implements MigrationInterface {
  name = 'AddCustomerCart1783958045356';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "carts" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "REL_69828a178f152f157dcf2f70a8" UNIQUE ("userId"), CONSTRAINT "PK_b5f695a59f5ebb50af3c8160816" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cart_items" ("id" SERIAL NOT NULL, "cartId" integer NOT NULL, "productId" integer NOT NULL, "categorySizeId" integer NOT NULL, "quantity" integer NOT NULL, "note" text, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_6fccf5ec03c172d27a28a82928b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cart_item_toppings" ("id" SERIAL NOT NULL, "cartItemId" integer NOT NULL, "toppingId" integer NOT NULL, CONSTRAINT "PK_62ae7f06bc33b36efe85c76dd80" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cart_items_cartId" ON "cart_items" ("cartId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cart_items_productId" ON "cart_items" ("productId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cart_items_categorySizeId" ON "cart_items" ("categorySizeId")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_cart_item_toppings_item_topping" ON "cart_item_toppings" ("cartItemId", "toppingId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cart_item_toppings_cartItemId" ON "cart_item_toppings" ("cartItemId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cart_item_toppings_toppingId" ON "cart_item_toppings" ("toppingId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "carts" ADD CONSTRAINT "FK_69828a178f152f157dcf2f70a89" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_items" ADD CONSTRAINT "FK_edd714311619a5ad09525045838" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_items" ADD CONSTRAINT "FK_72679d98b31c737937b8932ebe6" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_items" ADD CONSTRAINT "FK_03fdfb923bb52066b1e7d4b0f0d" FOREIGN KEY ("categorySizeId") REFERENCES "category_sizes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_item_toppings" ADD CONSTRAINT "FK_ed794261c0ac5ac0ab6ae3011f9" FOREIGN KEY ("cartItemId") REFERENCES "cart_items"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_item_toppings" ADD CONSTRAINT "FK_26379122aa239da8590ab50b922" FOREIGN KEY ("toppingId") REFERENCES "toppings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cart_item_toppings" DROP CONSTRAINT "FK_26379122aa239da8590ab50b922"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_item_toppings" DROP CONSTRAINT "FK_ed794261c0ac5ac0ab6ae3011f9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_items" DROP CONSTRAINT "FK_03fdfb923bb52066b1e7d4b0f0d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_items" DROP CONSTRAINT "FK_72679d98b31c737937b8932ebe6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_items" DROP CONSTRAINT "FK_edd714311619a5ad09525045838"`,
    );
    await queryRunner.query(
      `ALTER TABLE "carts" DROP CONSTRAINT "FK_69828a178f152f157dcf2f70a89"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cart_item_toppings_toppingId"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cart_item_toppings_cartItemId"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cart_item_toppings_item_topping"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cart_items_categorySizeId"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_cart_items_productId"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_cart_items_cartId"`);
    await queryRunner.query(`DROP TABLE "cart_item_toppings"`);
    await queryRunner.query(`DROP TABLE "cart_items"`);
    await queryRunner.query(`DROP TABLE "carts"`);
  }
}
