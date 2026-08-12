import { MigrationInterface, QueryRunner } from "typeorm";

export class BackfillProductStoreIdFromSellerStores1785950000000 implements MigrationInterface {
    name = 'BackfillProductStoreIdFromSellerStores1785950000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Cập nhật store_id cho các sản phẩm chưa có store_id dựa theo gian hàng ACTIVE duy nhất hoặc gian hàng của Seller
        await queryRunner.query(`
            UPDATE "products" p
            SET "store_id" = s.id
            FROM "stores" s
            WHERE p."store_id" IS NULL
              AND s.status = 'ACTIVE'
              AND s.user_id IS NOT NULL;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Rollback nếu cần
    }
}
