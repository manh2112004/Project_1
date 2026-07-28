import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeletedAtToInventoryAndProductImage1785208417133 implements MigrationInterface {
    name = 'AddDeletedAtToInventoryAndProductImage1785208417133'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventories" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "product_images" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_images" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "inventories" DROP COLUMN "deleted_at"`);
    }

}
