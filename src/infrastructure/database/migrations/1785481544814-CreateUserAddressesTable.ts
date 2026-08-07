import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserAddressesTable1785481544814 implements MigrationInterface {
    name = 'CreateUserAddressesTable1785481544814'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_addresses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "recipient_name" character varying(100) NOT NULL, "phone_number" character varying(20) NOT NULL, "address_line_1" character varying(255) NOT NULL, "address_line_2" character varying(255), "ward" character varying(100) NOT NULL, "district" character varying(100) NOT NULL, "city" character varying(100) NOT NULL, "country" character varying(100) DEFAULT 'Việt Nam', "postal_code" character varying(20), "is_default" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8abbeb5e3239ff7877088ffc25b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_addresses" ADD CONSTRAINT "FK_7a5100ce0548ef27a6f1533a5ce" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_addresses" DROP CONSTRAINT "FK_7a5100ce0548ef27a6f1533a5ce"`);
        await queryRunner.query(`DROP TABLE "user_addresses"`);
    }

}
