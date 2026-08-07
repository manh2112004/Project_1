import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserSocialAccountsTable1785600000000 implements MigrationInterface {
    name = 'CreateUserSocialAccountsTable1785600000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Cho phép password_hash có thể nhận giá trị NULL
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password_hash" DROP NOT NULL`);

        // 2. Tạo bảng user_social_accounts
        await queryRunner.query(`CREATE TABLE "user_social_accounts" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "user_id" uuid NOT NULL,
            "provider" character varying(20) NOT NULL,
            "sub_id" character varying(100) NOT NULL,
            "email" character varying(150),
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_user_social_accounts_id" PRIMARY KEY ("id"),
            CONSTRAINT "UQ_user_social_accounts_provider_sub_id" UNIQUE ("provider", "sub_id")
        )`);

        // 3. Khóa ngoại liên kết tới bảng users
        await queryRunner.query(`ALTER TABLE "user_social_accounts" ADD CONSTRAINT "FK_user_social_accounts_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_social_accounts" DROP CONSTRAINT "FK_user_social_accounts_user_id"`);
        await queryRunner.query(`DROP TABLE "user_social_accounts"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password_hash" SET NOT NULL`);
    }
}
