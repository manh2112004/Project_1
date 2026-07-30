import { describe, it, expect } from "vitest";
import { Role } from "../Role";

describe("Role Entity", () => {
  describe("create (Instantiation)", () => {
    it("nên tạo thành công vai trò mới với thông tin hợp lệ", () => {
      const role = Role.create({
        name: "Admin",
        description: "Quản trị viên hệ thống",
      });

      expect(role.id).toBeDefined();
      expect(role.name).toBe("Admin");
      expect(role.description).toBe("Quản trị viên hệ thống");
      expect(role.permissionCodes).toEqual([]); // Mặc định rỗng
      expect(role.createdAt).toBeInstanceOf(Date);
      expect(role.updatedAt).toBeInstanceOf(Date);
    });

    it("nên ném lỗi khi tên vai trò bị rỗng", () => {
      expect(() => {
        Role.create({ name: "" });
      }).toThrowError("Tên vai trò không được để trống.");

      expect(() => {
        Role.create({ name: "   " });
      }).toThrowError("Tên vai trò không được để trống.");
    });
  });

  describe("update", () => {
    it("nên cập nhật thành công tên và mô tả mới", () => {
      const role = Role.create({
        name: "User",
        description: "Người dùng thường",
      });
      const initialUpdatedAt = role.updatedAt;

      role.update({
        name: "Member",
        description: "Thành viên chính thức",
      });

      expect(role.name).toBe("Member");
      expect(role.description).toBe("Thành viên chính thức");
      expect(role.updatedAt.getTime()).toBeGreaterThanOrEqual(
        initialUpdatedAt.getTime(),
      );
    });

    it("nên ném lỗi khi cập nhật tên vai trò rỗng", () => {
      const role = Role.create({ name: "User" });

      expect(() => {
        role.update({ name: "" });
      }).toThrowError("Tên vai trò không được để trống.");
    });
  });

  describe("Permissions Management", () => {
    it("nên gán quyền thành công và cập nhật thời gian updatedAt", () => {
      const role = Role.create({ name: "Staff" });
      const initialUpdatedAt = role.updatedAt;

      role.assignPermission("READ_PRODUCTS");

      expect(role.permissionCodes).toContain("READ_PRODUCTS");
      expect(role.hasPermission("READ_PRODUCTS")).toBe(true);
      expect(role.updatedAt.getTime()).toBeGreaterThanOrEqual(
        initialUpdatedAt.getTime(),
      );
    });

    it("không nên thêm quyền nếu quyền đó đã tồn tại", () => {
      const role = Role.create({ name: "Staff" });
      role.assignPermission("READ_PRODUCTS");

      const beforeLength = role.permissionCodes.length;

      role.assignPermission("READ_PRODUCTS"); // Gán lại lần nữa

      expect(role.permissionCodes.length).toBe(beforeLength);
    });

    it("nên thu hồi quyền thành công và cập nhật thời gian updatedAt", () => {
      const role = Role.create({ name: "Staff" });
      role.assignPermission("READ_PRODUCTS");
      role.assignPermission("WRITE_PRODUCTS");

      const initialUpdatedAt = role.updatedAt;

      role.revokePermission("READ_PRODUCTS");

      expect(role.permissionCodes).not.toContain("READ_PRODUCTS");
      expect(role.permissionCodes).toContain("WRITE_PRODUCTS");
      expect(role.hasPermission("READ_PRODUCTS")).toBe(false);
      expect(role.updatedAt.getTime()).toBeGreaterThanOrEqual(
        initialUpdatedAt.getTime(),
      );
    });

    it("không nên thay đổi gì khi thu hồi quyền không tồn tại", () => {
      const role = Role.create({ name: "Staff" });
      role.assignPermission("READ_PRODUCTS");

      const beforeLength = role.permissionCodes.length;

      role.revokePermission("WRITE_PRODUCTS"); // Thu hồi quyền chưa từng có

      expect(role.permissionCodes.length).toBe(beforeLength);
    });

    it("không được phép sửa đổi mảng permissionCodes trực tiếp từ bên ngoài", () => {
      const role = Role.create({ name: "Staff" });
      role.assignPermission("READ_PRODUCTS");

      const perms = role.permissionCodes;

      // Cố tình push trực tiếp vào mảng nhận về từ getter
      perms.push("WRITE_PRODUCTS");

      // Kiểm tra thực thể gốc xem có bị thay đổi không (phải KHÔNG bị ảnh hưởng)
      expect(role.permissionCodes).not.toContain("WRITE_PRODUCTS");
      expect(role.permissionCodes.length).toBe(1);
    });
  });

  describe("Soft Delete", () => {
    it("mặc định khi tạo mới thì deletedAt phải là null", () => {
      const role = Role.create({ name: "Admin" });
      expect(role.deletedAt).toBeNull();
    });

    it("nên đánh dấu thời gian deletedAt khi gọi hàm delete", () => {
      const role = Role.create({ name: "Admin" });
      role.delete();
      expect(role.deletedAt).toBeInstanceOf(Date);
    });
  });
});
