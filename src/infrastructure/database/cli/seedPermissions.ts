import { AppDataSource } from "../data-source";
import { PermissionOrmEntity } from "../entities/PermissionOrmEntity";

interface PermissionData {
  name: string;
  module: string;
  description: string;
}

// Danh sách tất cả mã quyền hạn (Permissions) dựa trên các vai trò và tính năng hệ thống
const permissionsData: PermissionData[] = [
  // --- Module: product (Sản phẩm) ---
  { name: "CREATE_PRODUCT", module: "product", description: "Quyền tạo sản phẩm mới" },
  { name: "READ_PRODUCT", module: "product", description: "Quyền xem danh sách và chi tiết sản phẩm" },
  { name: "UPDATE_PRODUCT", module: "product", description: "Quyền cập nhật thông tin và giá sản phẩm" },
  { name: "DELETE_PRODUCT", module: "product", description: "Quyền xóa sản phẩm" },

  // --- Module: category (Danh mục sản phẩm) ---
  { name: "CREATE_CATEGORY", module: "category", description: "Quyền tạo danh mục sản phẩm mới" },
  { name: "READ_CATEGORY", module: "category", description: "Quyền xem danh sách danh mục" },
  { name: "UPDATE_CATEGORY", module: "category", description: "Quyền chỉnh sửa thông tin danh mục" },
  { name: "DELETE_CATEGORY", module: "category", description: "Quyền xóa danh mục" },

  // --- Module: brand (Thương hiệu) ---
  { name: "CREATE_BRAND", module: "brand", description: "Quyền tạo thương hiệu mới" },
  { name: "READ_BRAND", module: "brand", description: "Quyền xem danh sách thương hiệu" },
  { name: "UPDATE_BRAND", module: "brand", description: "Quyền chỉnh sửa thông tin thương hiệu" },
  { name: "DELETE_BRAND", module: "brand", description: "Quyền xóa thương hiệu" },

  // --- Module: inventory (Tồn kho) ---
  { name: "READ_INVENTORY", module: "inventory", description: "Quyền xem tồn kho sản phẩm" },
  { name: "UPDATE_INVENTORY", module: "inventory", description: "Quyền điều chỉnh số lượng tồn kho" },
  { name: "IMPORT_INVENTORY", module: "inventory", description: "Quyền nhập hàng vào kho" },

  // --- Module: order (Đơn hàng) ---
  { name: "CREATE_ORDER", module: "order", description: "Quyền đặt hàng / tạo đơn hàng mới" },
  { name: "READ_ORDER", module: "order", description: "Quyền xem danh sách và chi tiết đơn hàng" },
  { name: "UPDATE_ORDER_STATUS", module: "order", description: "Quyền cập nhật trạng thái đơn hàng (Xác nhận, Đang giao, Hoàn thành)" },
  { name: "CANCEL_ORDER", module: "order", description: "Quyền hủy đơn hàng" },
  { name: "REFUND_ORDER", module: "order", description: "Quyền xử lý khiếu nại, đổi trả và hoàn tiền" },

  // --- Module: user (Người dùng & Tài khoản) ---
  { name: "CREATE_USER", module: "user", description: "Quyền tạo tài khoản người dùng" },
  { name: "READ_USER", module: "user", description: "Quyền xem danh sách và thông tin người dùng" },
  { name: "UPDATE_USER", module: "user", description: "Quyền cập nhật thông tin người dùng" },
  { name: "DELETE_USER", module: "user", description: "Quyền khóa hoặc xóa tài khoản người dùng" },

  // --- Module: role (Vai trò & Phân quyền) ---
  { name: "CREATE_ROLE", module: "role", description: "Quyền tạo vai trò mới" },
  { name: "READ_ROLE", module: "role", description: "Quyền xem danh sách vai trò hệ thống" },
  { name: "UPDATE_ROLE", module: "role", description: "Quyền cập nhật thông tin vai trò" },
  { name: "DELETE_ROLE", module: "role", description: "Quyền xóa vai trò" },
  { name: "ASSIGN_PERMISSION", module: "role", description: "Quyền gán hoặc gỡ bỏ quyền hạn (permissions) của một vai trò" },

  // --- Module: permission (Mã quyền) ---
  { name: "READ_PERMISSION", module: "permission", description: "Quyền xem danh sách tất cả mã quyền hạn hệ thống" },
  { name: "MANAGE_PERMISSION", module: "permission", description: "Quyền tạo, chỉnh sửa hoặc xóa mã quyền hạn" },

  // --- Module: report (Báo cáo & Thống kê) ---
  { name: "READ_REPORT", module: "report", description: "Quyền xem báo cáo doanh thu và thống kê hệ thống" },
];

const seedPermissions = async () => {
  try {
    console.log("\n==========================================");
    console.log("🚀 KHỞI CHẠY SEEDING PERMISSIONS");
    console.log("==========================================\n");

    await AppDataSource.initialize();
    console.log("✅ Kết nối Cơ sở dữ liệu thành công.\n");

    const permRepo = AppDataSource.getRepository(PermissionOrmEntity);

    console.log("🔄 Đang khởi tạo danh sách Permissions vào DB...");
    let addedCount = 0;
    let updatedCount = 0;

    for (const pData of permissionsData) {
      let perm = await permRepo.findOne({ where: { name: pData.name } });
      if (!perm) {
        perm = permRepo.create(pData);
        await permRepo.save(perm);
        console.log(`   + [NEW] Created permission: ${pData.name} (${pData.module})`);
        addedCount++;
      } else {
        perm.module = pData.module;
        perm.description = pData.description;
        await permRepo.save(perm);
        console.log(`   ~ [EXISTING] Updated permission: ${pData.name}`);
        updatedCount++;
      }
    }

    console.log("\n==========================================");
    console.log("🎉 SEEDING PERMISSIONS HOÀN TẤT!");
    console.log(`✨ Thêm mới: ${addedCount}`);
    console.log(`🔄 Cập nhật: ${updatedCount}`);
    console.log(`🛡️  Tổng số Permissions: ${permissionsData.length}`);
    console.log("==========================================\n");
  } catch (error: any) {
    console.error("\n❌ Lỗi trong quá trình Seeding Permissions:", error.message || error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    process.exit(0);
  }
};

seedPermissions();
