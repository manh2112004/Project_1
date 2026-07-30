import { describe, it, expect } from "vitest";
import { Permission } from "../Permission";

describe("Permission Entity", () => {
  describe("create (Instantiation)", () => {
    it("nên tạo thành công quyền mới với thông tin hợp lệ và tự động chuẩn hóa", () => {
      const permission = Permission.create({
        name: "  create_product  ",
        module: "  Product  ",
        description: "Quyền tạo sản phẩm mới",
      });

      expect(permission.id).toBeDefined();
      expect(permission.name).toBe("CREATE_PRODUCT"); // Tự động uppercase và trim
      expect(permission.module).toBe("product"); // Tự động lowercase và trim
      expect(permission.description).toBe("Quyền tạo sản phẩm mới");
      expect(permission.createdAt).toBeInstanceOf(Date);
    });

    it("nên ném lỗi khi tên quyền bị rỗng", () => {
      expect(() => {
        Permission.create({ name: "", module: "product" });
      }).toThrowError("Tên quyền (name) không được để trống.");

      expect(() => {
        Permission.create({ name: "   ", module: "product" });
      }).toThrowError("Tên quyền (name) không được để trống.");
    });

    it("nên ném lỗi khi tên nhóm chức năng (module) bị rỗng", () => {
      expect(() => {
        Permission.create({ name: "CREATE_PRODUCT", module: "" });
      }).toThrowError("Tên nhóm chức năng (module) không được để trống.");

      expect(() => {
        Permission.create({ name: "CREATE_PRODUCT", module: "   " });
      }).toThrowError("Tên nhóm chức năng (module) không được để trống.");
    });
  });

  describe("updateDescription", () => {
    it("nên cập nhật thành công mô tả mới", () => {
      const permission = Permission.create({
        name: "VIEW_PRODUCTS",
        module: "product",
        description: "Mô tả cũ",
      });

      permission.updateDescription("Mô tả mới đã thay đổi");
      expect(permission.description).toBe("Mô tả mới đã thay đổi");
    });

    it("nên cho phép cập nhật mô tả thành null", () => {
      const permission = Permission.create({
        name: "VIEW_PRODUCTS",
        module: "product",
        description: "Mô tả cũ",
      });

      permission.updateDescription(null);
      expect(permission.description).toBeNull();
    });
  });
});
