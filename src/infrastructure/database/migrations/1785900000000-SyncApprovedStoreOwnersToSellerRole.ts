import { MigrationInterface, QueryRunner } from "typeorm";

export class SyncApprovedStoreOwnersToSellerRole1785900000000 implements MigrationInterface {
    name = 'SyncApprovedStoreOwnersToSellerRole1785900000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Tự động nâng cấp tất cả các User đã có Store ở trạng thái ACTIVE sang Role SELLER
        await queryRunner.query(`
            UPDATE "users"
            SET "role_id" = (
                SELECT id FROM "roles"
                WHERE code = 'SELLER' OR name = 'Seller'
                LIMIT 1
            )
            WHERE id IN (
                SELECT user_id FROM "stores" WHERE status = 'ACTIVE'
            )
            AND "role_id" IS DISTINCT FROM (
                SELECT id FROM "roles"
                WHERE code = 'SELLER' OR name = 'Seller'
                LIMIT 1
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Rollback nếu cần
    }
}
