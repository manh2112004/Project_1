import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrdersAndOrderItemsTables1785500000000
  implements MigrationInterface {
  name = "CreateOrdersAndOrderItemsTables1785500000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Tạo bảng orders
    await queryRunner.query(`
      CREATE TABLE "orders" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "order_code" character varying(50) NOT NULL,
        "status" character varying(30) NOT NULL DEFAULT 'PENDING',
        "total_amount" numeric(15,2) NOT NULL,
        "discount_amount" numeric(15,2) NOT NULL DEFAULT 0,
        "shipping_fee" numeric(15,2) NOT NULL DEFAULT 0,
        "final_amount" numeric(15,2) NOT NULL,
        "payment_method" character varying(30) NOT NULL,
        "payment_status" character varying(30) NOT NULL DEFAULT 'UNPAID',
        "recipient_name" character varying(100) NOT NULL,
        "phone_number" character varying(20) NOT NULL,
        "shipping_address" text NOT NULL,
        "shipping_code" character varying(100),
        "customer_note" text,
        "cancel_reason" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "UQ_orders_order_code" UNIQUE ("order_code"),
        CONSTRAINT "PK_orders_id" PRIMARY KEY ("id")
      )
    `);

    // 2. Tạo khóa ngoại orders -> users
    await queryRunner.query(`
      ALTER TABLE "orders" 
      ADD CONSTRAINT "FK_orders_user_id" 
      FOREIGN KEY ("user_id") REFERENCES "users"("id") 
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    // 3. Tạo bảng order_items
    await queryRunner.query(`
      CREATE TABLE "order_items" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "order_id" uuid NOT NULL,
        "product_id" uuid NOT NULL,
        "quantity" integer NOT NULL,
        "unit_price" numeric(15,2) NOT NULL,
        "total_price" numeric(15,2) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_order_items_id" PRIMARY KEY ("id")
      )
    `);

    // 4. Tạo khóa ngoại order_items -> orders
    await queryRunner.query(`
      ALTER TABLE "order_items" 
      ADD CONSTRAINT "FK_order_items_order_id" 
      FOREIGN KEY ("order_id") REFERENCES "orders"("id") 
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    // 5. Tạo khóa ngoại order_items -> products
    await queryRunner.query(`
      ALTER TABLE "order_items" 
      ADD CONSTRAINT "FK_order_items_product_id" 
      FOREIGN KEY ("product_id") REFERENCES "products"("id") 
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "FK_order_items_product_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "FK_order_items_order_id"`
    );
    await queryRunner.query(`DROP TABLE "order_items"`);
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_orders_user_id"`
    );
    await queryRunner.query(`DROP TABLE "orders"`);
  }
}
