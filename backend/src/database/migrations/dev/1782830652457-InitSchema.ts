import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1782830652457 implements MigrationInterface {
  name = 'InitSchema1782830652457';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."customer_profile_gender_enum" AS ENUM('male', 'female', 'other')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."customer_profile_rank_enum" AS ENUM('bronze', 'silver', 'gold', 'diamond')`,
    );
    await queryRunner.query(
      `CREATE TABLE "customer_profiles" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "gender" "public"."customer_profile_gender_enum", "points" integer NOT NULL DEFAULT '0', "rank" "public"."customer_profile_rank_enum" NOT NULL DEFAULT 'bronze', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_5b534069c56790acd59665798c3" UNIQUE ("userId"), CONSTRAINT "REL_5b534069c56790acd59665798c" UNIQUE ("userId"), CONSTRAINT "PK_ece08ee55cbe707d9f870907727" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."role_code_enum" AS ENUM('admin', 'staff', 'customer')`,
    );
    await queryRunner.query(
      `CREATE TABLE "roles" ("id" SERIAL NOT NULL, "code" "public"."role_code_enum" NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_f6d54f95c31b73fb1bdd8e91d0c" UNIQUE ("code"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_roles" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "roleId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_88481b0c4ed9ada47e9fdd67475" UNIQUE ("userId", "roleId"), CONSTRAINT "PK_8acd5cf26ebd158416f477de799" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "fullName" character varying, "phone" character varying, "password" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "avatar" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "refresh_tokens" ("id" SERIAL NOT NULL, "refresh_token" character varying NOT NULL, "userId" integer NOT NULL, "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "revokedAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_stocks" ("id" SERIAL NOT NULL, "productId" integer NOT NULL, "quantity" integer NOT NULL, "minQuantity" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_5e5755d032c1551a16f4393cd9" UNIQUE ("productId"), CONSTRAINT "PK_3e6eefa449c5773c5fe43ab113d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sizes" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "code" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_9fc6e663546e7a6cfdc465e86df" UNIQUE ("name"), CONSTRAINT "UQ_f716f1c41ffc0a1f6967825f643" UNIQUE ("code"), CONSTRAINT "PK_09ffc681886e25eb5ce3b319fab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "category_sizes" ("id" SERIAL NOT NULL, "sizeId" integer NOT NULL, "extraPrice" numeric(10,2) NOT NULL DEFAULT '0', "categoryId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_af0b88f9e6f20ab1d1dcc8ea3d3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_76389f993141b1f639549d9e6d" ON "category_sizes" ("sizeId", "categoryId") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."orders_ordertype_enum" AS ENUM('dine_in', 'take_away', 'delivery')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."orders_paymentmethod_enum" AS ENUM('cash', 'momo', 'vnpay')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."orders_paymentstatus_enum" AS ENUM('pending', 'paid', 'failed', 'refunded')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."orders_status_enum" AS ENUM('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled')`,
    );
    await queryRunner.query(
      `CREATE TABLE "orders" ("id" SERIAL NOT NULL, "invoiceCode" character varying(20), "userId" integer NOT NULL, "subtotalAmount" numeric(10,2) NOT NULL, "discountAmount" numeric(10,2) NOT NULL DEFAULT '0', "shippingFee" numeric(10,2) NOT NULL DEFAULT '0', "totalAmount" numeric(10,2) NOT NULL, "orderType" "public"."orders_ordertype_enum" NOT NULL, "paymentMethod" "public"."orders_paymentmethod_enum" NOT NULL, "paymentStatus" "public"."orders_paymentstatus_enum" NOT NULL DEFAULT 'pending', "status" "public"."orders_status_enum" NOT NULL DEFAULT 'pending', "receiverName" character varying, "receiverPhone" character varying, "deliveryAddress" text, "note" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_33cd1ec041a6dc5022b375ea169" UNIQUE ("invoiceCode"), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_item_toppings" ("id" SERIAL NOT NULL, "orderItemId" integer NOT NULL, "toppingId" integer NOT NULL, "toppingName" character varying NOT NULL, "price" numeric(10,2) NOT NULL, "quantity" integer NOT NULL, CONSTRAINT "PK_6ca3b53c7387ef22bdd26d31be2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_items" ("id" SERIAL NOT NULL, "orderId" integer NOT NULL, "productId" integer NOT NULL, "categorySizeId" integer NOT NULL, "productName" character varying NOT NULL, "sizeName" character varying NOT NULL, "sizeCode" character varying NOT NULL, "sizeExtraPrice" numeric(10,2) NOT NULL DEFAULT '0', "price" numeric(10,2) NOT NULL, "quantity" integer NOT NULL, "subtotal" numeric(10,2) NOT NULL, CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."products_status_enum" AS ENUM('active', 'inactive')`,
    );
    await queryRunner.query(
      `CREATE TABLE "products" ("id" SERIAL NOT NULL, "categoryId" integer NOT NULL, "productName" character varying NOT NULL, "price" numeric(10,2) NOT NULL, "imageUrl" character varying, "description" text, "status" "public"."products_status_enum" NOT NULL DEFAULT 'active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."categories_status_enum" AS ENUM('active', 'inactive')`,
    );
    await queryRunner.query(
      `CREATE TABLE "categories" ("id" SERIAL NOT NULL, "categoryName" character varying NOT NULL, "description" character varying NOT NULL DEFAULT '', "status" "public"."categories_status_enum" NOT NULL DEFAULT 'active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "category_toppings" ("id" SERIAL NOT NULL, "categoryId" integer NOT NULL, "toppingId" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5bdf3b014d7811557d142a094a0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "toppings" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "price" integer NOT NULL DEFAULT '0', "imageUrl" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6a1c9185d307454dfadc29f3019" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_profiles" ADD CONSTRAINT "FK_5b534069c56790acd59665798c3" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_472b25323af01488f1f66a06b67" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_86033897c009fcca8b6505d6be2" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_610102b60fea1455310ccd299de" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_stocks" ADD CONSTRAINT "FK_5e5755d032c1551a16f4393cd9d" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_sizes" ADD CONSTRAINT "FK_13cf058a0f6d8a6448d2518f700" FOREIGN KEY ("sizeId") REFERENCES "sizes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_sizes" ADD CONSTRAINT "FK_4235b6e4966f3291720bb925aab" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item_toppings" ADD CONSTRAINT "FK_1a74ccebef16dd8afba0527edee" FOREIGN KEY ("orderItemId") REFERENCES "order_items"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item_toppings" ADD CONSTRAINT "FK_a10302aa366869faacb0ad637cc" FOREIGN KEY ("toppingId") REFERENCES "toppings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "FK_cdb99c05982d5191ac8465ac010" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "FK_67e28e3e0dfbea2d01e8f4ed369" FOREIGN KEY ("categorySizeId") REFERENCES "category_sizes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "FK_ff56834e735fa78a15d0cf21926" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_toppings" ADD CONSTRAINT "FK_c247b92e5367ad591cc5fc8dcd4" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_toppings" ADD CONSTRAINT "FK_d51118a825a371962cdd76ca347" FOREIGN KEY ("toppingId") REFERENCES "toppings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "category_toppings" DROP CONSTRAINT "FK_d51118a825a371962cdd76ca347"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_toppings" DROP CONSTRAINT "FK_c247b92e5367ad591cc5fc8dcd4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_ff56834e735fa78a15d0cf21926"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "FK_67e28e3e0dfbea2d01e8f4ed369"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "FK_cdb99c05982d5191ac8465ac010"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item_toppings" DROP CONSTRAINT "FK_a10302aa366869faacb0ad637cc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item_toppings" DROP CONSTRAINT "FK_1a74ccebef16dd8afba0527edee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_sizes" DROP CONSTRAINT "FK_4235b6e4966f3291720bb925aab"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_sizes" DROP CONSTRAINT "FK_13cf058a0f6d8a6448d2518f700"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_stocks" DROP CONSTRAINT "FK_5e5755d032c1551a16f4393cd9d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_610102b60fea1455310ccd299de"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_86033897c009fcca8b6505d6be2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_472b25323af01488f1f66a06b67"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_profiles" DROP CONSTRAINT "FK_5b534069c56790acd59665798c3"`,
    );
    await queryRunner.query(`DROP TABLE "toppings"`);
    await queryRunner.query(`DROP TABLE "category_toppings"`);
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`DROP TYPE "public"."categories_status_enum"`);
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(`DROP TYPE "public"."products_status_enum"`);
    await queryRunner.query(`DROP TABLE "order_items"`);
    await queryRunner.query(`DROP TABLE "order_item_toppings"`);
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."orders_paymentstatus_enum"`);
    await queryRunner.query(`DROP TYPE "public"."orders_paymentmethod_enum"`);
    await queryRunner.query(`DROP TYPE "public"."orders_ordertype_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_76389f993141b1f639549d9e6d"`,
    );
    await queryRunner.query(`DROP TABLE "category_sizes"`);
    await queryRunner.query(`DROP TABLE "sizes"`);
    await queryRunner.query(`DROP TABLE "product_stocks"`);
    await queryRunner.query(`DROP TABLE "refresh_tokens"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "user_roles"`);
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(`DROP TYPE "public"."role_code_enum"`);
    await queryRunner.query(`DROP TABLE "customer_profiles"`);
    await queryRunner.query(`DROP TYPE "public"."customer_profile_rank_enum"`);
    await queryRunner.query(
      `DROP TYPE "public"."customer_profile_gender_enum"`,
    );
  }
}
