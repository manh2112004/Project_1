import { MigrationInterface, QueryRunner } from "typeorm";

export class SyncAndAutoAssignSuperAdminPermissions1785320000000 implements MigrationInterface {
    name = 'SyncAndAutoAssignSuperAdminPermissions1785320000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Thêm cột "code" vào bảng "roles" (vì cột này chưa tồn tại trong database)
        await queryRunner.query(`ALTER TABLE "roles" ADD COLUMN IF NOT EXISTS "code" character varying(50)`);

        // 2. Cập nhật code mặc định cho Super Admin và các vai trò hiện tại
        await queryRunner.query(`UPDATE "roles" SET "code" = 'SUPER_ADMIN' WHERE "name" = 'Super Admin' AND "code" IS NULL`);
        await queryRunner.query(`UPDATE "roles" SET "code" = UPPER(REPLACE("name", ' ', '_')) WHERE "code" IS NULL`);

        // 3. Thêm ràng buộc UNIQUE cho cột "code"
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_constraint WHERE conname = 'UQ_roles_code'
                ) THEN
                    ALTER TABLE "roles" ADD CONSTRAINT "UQ_roles_code" UNIQUE ("code");
                END IF;
            END;
            $$;
        `);

        // 4. Đồng bộ toàn bộ các quyền hiện có trong DB sang cho Super Admin
        await queryRunner.query(`
            INSERT INTO "role_permissions" ("role_id", "permission_id")
            SELECT r.id, p.id
            FROM "roles" r
            CROSS JOIN "permissions" p
            WHERE r.code = 'SUPER_ADMIN' OR r.name = 'Super Admin'
            ON CONFLICT DO NOTHING
        `);

        // 5. Tạo Trigger Function trong PostgreSQL để tự động gán quyền mới cho Super Admin
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION auto_assign_permission_to_super_admin()
            RETURNS TRIGGER AS $$
            BEGIN
                INSERT INTO "role_permissions" ("role_id", "permission_id")
                SELECT id, NEW.id
                FROM "roles"
                WHERE code = 'SUPER_ADMIN' OR name = 'Super Admin'
                ON CONFLICT DO NOTHING;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

        // 6. Đăng ký Trigger vào bảng permissions (kích hoạt sau mỗi khi chèn dòng mới vào bảng permissions)
        await queryRunner.query(`
            DROP TRIGGER IF EXISTS trg_auto_assign_permission_to_super_admin ON "permissions";
            CREATE TRIGGER trg_auto_assign_permission_to_super_admin
            AFTER INSERT ON "permissions"
            FOR EACH ROW
            EXECUTE FUNCTION auto_assign_permission_to_super_admin();
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Xóa Trigger và Trigger Function khi thực hiện Rollback Migration
        await queryRunner.query(`DROP TRIGGER IF EXISTS trg_auto_assign_permission_to_super_admin ON "permissions"`);
        await queryRunner.query(`DROP FUNCTION IF EXISTS auto_assign_permission_to_super_admin()`);

        // Xóa ràng buộc UNIQUE và cột "code" khỏi bảng "roles"
        await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT IF EXISTS "UQ_roles_code"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN IF EXISTS "code"`);
    }
}
