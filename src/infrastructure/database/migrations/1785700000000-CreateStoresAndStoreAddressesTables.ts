import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStoresAndStoreAddressesTables1785700000000
  implements MigrationInterface {
  name = "CreateStoresAndStoreAddressesTables1785700000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Tạo bảng stores
    await queryRunner.query(`
      CREATE TABLE "stores" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "name" character varying(150) NOT NULL,
        "description" text,
        "logo" character varying(255),
        "cover_image" character varying(255),
        "contact_phone" character varying(20),
        "contact_email" character varying(150) NOT NULL,
        "business_type" character varying(50) NOT NULL,
        "tax_code" character varying(50),
        "identity_number" character varying(50),
        "status" character varying(50) NOT NULL DEFAULT 'PENDING',
        "status_note" text,
        "is_on_vacation" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_stores_id" PRIMARY KEY ("id")
      )
    `);

    // 2. Tạo khóa ngoại stores -> users
    await queryRunner.query(`
      ALTER TABLE "stores"
      ADD CONSTRAINT "FK_stores_user_id"
      FOREIGN KEY ("user_id") REFERENCES "users"("id")
      ON DELETE RESTRICT ON UPDATE NO ACTION
    `);

    // 3. Tạo bảng store_addresses
    await queryRunner.query(`
      CREATE TABLE "store_addresses" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "store_id" uuid NOT NULL,
        "contact_name" character varying(100) NOT NULL,
        "phone_number" character varying(20),
        "address_line_1" character varying(255) NOT NULL,
        "address_line_2" character varying(255),
        "ward" character varying(100) NOT NULL,
        "district" character varying(100) NOT NULL,
        "city" character varying(100) NOT NULL,
        "country" character varying(100) DEFAULT 'Việt Nam',
        "postal_code" character varying(20),
        "latitude" double precision,
        "longitude" double precision,
        "is_default_pickup" boolean NOT NULL DEFAULT false,
        "is_default_return" boolean NOT NULL DEFAULT false,
        "is_default" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_store_addresses_id" PRIMARY KEY ("id")
      )
    `);

    // 4. Tạo khóa ngoại store_addresses -> stores
    await queryRunner.query(`
      ALTER TABLE "store_addresses"
      ADD CONSTRAINT "FK_store_addresses_store_id"
      FOREIGN KEY ("store_id") REFERENCES "stores"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    // 5. Thêm cột store_id vào bảng products (nếu chưa có)
    await queryRunner.query(`
      ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "store_id" uuid
    `);
    await queryRunner.query(`
      ALTER TABLE "products"
      ADD CONSTRAINT "FK_products_store_id"
      FOREIGN KEY ("store_id") REFERENCES "stores"("id")
      ON DELETE SET NULL ON UPDATE NO ACTION
    `);

    // 6. Thêm cột store_id và store_address_id vào bảng inventories
    await queryRunner.query(`
      ALTER TABLE "inventories" ADD COLUMN IF NOT EXISTS "store_id" uuid, ADD COLUMN IF NOT EXISTS "store_address_id" uuid
    `);
    await queryRunner.query(`
      ALTER TABLE "inventories"
      ADD CONSTRAINT "FK_inventories_store_id"
      FOREIGN KEY ("store_id") REFERENCES "stores"("id")
      ON DELETE SET NULL ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "inventories"
      ADD CONSTRAINT "FK_inventories_store_address_id"
      FOREIGN KEY ("store_address_id") REFERENCES "store_addresses"("id")
      ON DELETE SET NULL ON UPDATE NO ACTION
    `);

    // 7. Thêm cột store_id và pickup_address_id vào bảng orders
    await queryRunner.query(`
      ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "store_id" uuid, ADD COLUMN IF NOT EXISTS "pickup_address_id" uuid
    `);
    await queryRunner.query(`
      ALTER TABLE "orders"
      ADD CONSTRAINT "FK_orders_store_id"
      FOREIGN KEY ("store_id") REFERENCES "stores"("id")
      ON DELETE SET NULL ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "orders"
      ADD CONSTRAINT "FK_orders_pickup_address_id"
      FOREIGN KEY ("pickup_address_id") REFERENCES "store_addresses"("id")
      ON DELETE SET NULL ON UPDATE NO ACTION
    `);

    // 8. Thêm cột store_id vào bảng order_items
    await queryRunner.query(`
      ALTER TABLE "order_items" ADD COLUMN IF NOT EXISTS "store_id" uuid
    `);
    await queryRunner.query(`
      ALTER TABLE "order_items"
      ADD CONSTRAINT "FK_order_items_store_id"
      FOREIGN KEY ("store_id") REFERENCES "stores"("id")
      ON DELETE SET NULL ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT IF EXISTS "FK_order_items_store_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP COLUMN IF EXISTS "store_id"`
    );

    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT IF EXISTS "FK_orders_pickup_address_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT IF EXISTS "FK_orders_store_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP COLUMN IF EXISTS "pickup_address_id", DROP COLUMN IF EXISTS "store_id"`
    );

    await queryRunner.query(
      `ALTER TABLE "inventories" DROP CONSTRAINT IF EXISTS "FK_inventories_store_address_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "inventories" DROP CONSTRAINT IF EXISTS "FK_inventories_store_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "inventories" DROP COLUMN IF EXISTS "store_address_id", DROP COLUMN IF EXISTS "store_id"`
    );

    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT IF EXISTS "FK_products_store_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP COLUMN IF EXISTS "store_id"`
    );

    await queryRunner.query(
      `ALTER TABLE "store_addresses" DROP CONSTRAINT IF EXISTS "FK_store_addresses_store_id"`
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "store_addresses"`);

    await queryRunner.query(
      `ALTER TABLE "stores" DROP CONSTRAINT IF EXISTS "FK_stores_user_id"`
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "stores"`);
  }
}
