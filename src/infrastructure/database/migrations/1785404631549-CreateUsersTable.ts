import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1785404631549 implements MigrationInterface {
    name = 'CreateUsersTable1785404631549'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role_id" uuid NOT NULL, "email" character varying(150) NOT NULL, "phone_number" character varying(15), "password_hash" character varying(255) NOT NULL, "full_name" character varying(100) NOT NULL, "avatar_url" character varying(255), "date_of_birth" TIMESTAMP, "gender" character varying(20) NOT NULL, "status" character varying(20) NOT NULL DEFAULT 'ACTIVE', "email_verified_at" TIMESTAMP, "phone_verified_at" TIMESTAMP, "last_login_at" TIMESTAMP, "refresh_token" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_17d1817f241f10a3dbafb169fd2" UNIQUE ("phone_number"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "roles" ALTER COLUMN "code" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`);
        await queryRunner.query(`ALTER TABLE "roles" ALTER COLUMN "code" DROP NOT NULL`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
