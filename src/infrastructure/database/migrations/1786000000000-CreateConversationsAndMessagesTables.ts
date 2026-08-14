import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateConversationsAndMessagesTables1786000000000
  implements MigrationInterface {
  name = "CreateConversationsAndMessagesTables1786000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Tạo bảng conversations
    await queryRunner.query(`
      CREATE TABLE "conversations" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "customer_id" uuid NOT NULL,
        "store_id" uuid NOT NULL,
        "last_message_content" text,
        "last_message_at" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_conversations_id" PRIMARY KEY ("id")
      )
    `);

    // 2. Thêm khóa ngoại conversations -> users & stores
    await queryRunner.query(`
      ALTER TABLE "conversations"
      ADD CONSTRAINT "FK_conversations_customer_id"
      FOREIGN KEY ("customer_id") REFERENCES "users"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "conversations"
      ADD CONSTRAINT "FK_conversations_store_id"
      FOREIGN KEY ("store_id") REFERENCES "stores"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    // 3. Tạo index & UNIQUE constraint cho conversations (Mỗi cặp Khách - Shop chỉ có 1 phòng chat chính)
    await queryRunner.query(`
      CREATE INDEX "IDX_conversations_customer_id" ON "conversations" ("customer_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_conversations_store_id" ON "conversations" ("store_id")
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_conversations_customer_store"
      ON "conversations" ("customer_id", "store_id")
      WHERE "deleted_at" IS NULL
    `);

    // 4. Tạo bảng messages
    await queryRunner.query(`
      CREATE TABLE "messages" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "conversation_id" uuid NOT NULL,
        "sender_id" uuid NOT NULL,
        "sender_type" character varying(30) NOT NULL,
        "type" character varying(30) NOT NULL DEFAULT 'TEXT',
        "content" text NOT NULL,
        "attachments" jsonb DEFAULT '[]',
        "metadata" jsonb,
        "is_read" boolean NOT NULL DEFAULT false,
        "read_at" TIMESTAMP,
        "is_recalled" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_messages_id" PRIMARY KEY ("id")
      )
    `);

    // 5. Thêm khóa ngoại messages -> conversations
    await queryRunner.query(`
      ALTER TABLE "messages"
      ADD CONSTRAINT "FK_messages_conversation_id"
      FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    // 6. Tạo index hỗ trợ truy vấn danh sách tin nhắn theo phòng chat và thời gian
    await queryRunner.query(`
      CREATE INDEX "IDX_messages_conversation_id" ON "messages" ("conversation_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_messages_created_at" ON "messages" ("created_at")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes & table messages
    await queryRunner.query(`DROP INDEX "IDX_messages_created_at"`);
    await queryRunner.query(`DROP INDEX "IDX_messages_conversation_id"`);
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT "FK_messages_conversation_id"`
    );
    await queryRunner.query(`DROP TABLE "messages"`);

    // Drop indexes & table conversations
    await queryRunner.query(`DROP INDEX "UQ_conversations_customer_store"`);
    await queryRunner.query(`DROP INDEX "IDX_conversations_store_id"`);
    await queryRunner.query(`DROP INDEX "IDX_conversations_customer_id"`);
    await queryRunner.query(
      `ALTER TABLE "conversations" DROP CONSTRAINT "FK_conversations_store_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" DROP CONSTRAINT "FK_conversations_customer_id"`
    );
    await queryRunner.query(`DROP TABLE "conversations"`);
  }
}
