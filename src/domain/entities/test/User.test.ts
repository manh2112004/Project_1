import { describe, it, expect } from "vitest";
import { User } from "../User";
import { UserStatus } from "../../constant/UserStatus";

describe("User Domain Entity", () => {
  const validProps = {
    roleId: "uuid-role-123",
    email: "user@example.com",
    passwordHash: "hashedpassword123",
    fullName: "Nguyen Van A",
    phoneNumber: "0901234567",
    gender: "MALE",
  };

  describe("create (Instantiation)", () => {
    it("nên tạo thành công vai trò mới với thông tin hợp lệ", () => {
      const user = User.create(validProps);

      expect(user.id).toBeDefined();
      expect(user.roleId).toBe(validProps.roleId);
      expect(user.email).toBe(validProps.email);
      expect(user.phoneNumber).toBe(validProps.phoneNumber);
      expect(user.passwordHash).toBe(validProps.passwordHash);
      expect(user.fullName).toBe(validProps.fullName);
      expect(user.gender).toBe("MALE");
      expect(user.status).toBe(UserStatus.ACTIVE);
      expect(user.emailVerifiedAt).toBeNull();
      expect(user.phoneVerifiedAt).toBeNull();
      expect(user.lastLoginAt).toBeNull();
      expect(user.refreshToken).toBeNull();
    });

    it("nên ném lỗi khi định dạng email không hợp lệ", () => {
      expect(() => {
        User.create({ ...validProps, email: "invalid-email" });
      }).toThrowError("Định dạng email không hợp lệ.");
    });

    it("nên ném lỗi khi họ tên bị để trống", () => {
      expect(() => {
        User.create({ ...validProps, fullName: "" });
      }).toThrowError("Họ và tên không được để trống.");

      expect(() => {
        User.create({ ...validProps, fullName: "   " });
      }).toThrowError("Họ và tên không được để trống.");
    });

    it("nên ném lỗi khi giới tính không hợp lệ", () => {
      expect(() => {
        User.create({ ...validProps, gender: "UNKNOWN" });
      }).toThrowError("Giới tính phải là MALE, FEMALE hoặc OTHER.");
    });

    it("nên tạo thành công khi không truyền số điện thoại", () => {
      const { phoneNumber, ...propsWithoutPhone } = validProps;
      const user = User.create(propsWithoutPhone);
      expect(user.phoneNumber).toBeUndefined();
    });

    it("nên ném lỗi khi số điện thoại sai định dạng", () => {
      expect(() => {
        User.create({ ...validProps, phoneNumber: "12345" });
      }).toThrowError("Số điện thoại không đúng định dạng Việt Nam.");
    });
  });

  describe("updateProfile", () => {
    it("nên cập nhật thành công thông tin cá nhân và gọi touch()", () => {
      const user = User.create(validProps);
      const initialUpdatedAt = user.updatedAt;

      user.updateProfile({
        fullName: "Tran Van B",
        avatarUrl: "https://example.com/avatar.png",
        gender: "FEMALE",
      });

      expect(user.fullName).toBe("Tran Van B");
      expect(user.avatarUrl).toBe("https://example.com/avatar.png");
      expect(user.gender).toBe("FEMALE");
      expect(user.updatedAt.getTime()).toBeGreaterThanOrEqual(
        initialUpdatedAt.getTime(),
      );
    });

    it("nên ném lỗi khi cập nhật họ tên trống", () => {
      const user = User.create(validProps);
      expect(() => {
        user.updateProfile({ fullName: "" });
      }).toThrowError("Họ và tên không được để trống.");
    });

    it("nên giữ nguyên các trường cũ khi chỉ cập nhật một vài thông tin (Partial Update)", () => {
      const user = User.create(validProps);
      user.updateProfile({ avatarUrl: "https://new-avatar.png" });

      expect(user.avatarUrl).toBe("https://new-avatar.png");
      expect(user.fullName).toBe(validProps.fullName);
      expect(user.gender).toBe(validProps.gender);
    });

    it("nên ném lỗi khi cập nhật giới tính không hợp lệ", () => {
      const user = User.create(validProps);
      expect(() => {
        user.updateProfile({ gender: "GAY" });
      }).toThrowError("Giới tính phải là MALE, FEMALE hoặc OTHER.");
    });
  });

  describe("changePassword", () => {
    it("nên thay đổi mật khẩu thành công và gọi touch()", () => {
      const user = User.create(validProps);
      user.changePassword("newhashedpassword123");
      expect(user.passwordHash).toBe("newhashedpassword123");
    });

    it("nên ném lỗi khi mật khẩu mới bị trống", () => {
      const user = User.create(validProps);
      expect(() => {
        user.changePassword("");
      }).toThrowError("Mật khẩu băm không được để trống.");
    });
  });

  describe("changeEmail", () => {
    it("nên đổi email, chuẩn hóa viết thường và reset trạng thái xác minh email", () => {
      const user = User.create(validProps);
      user.verifyEmail();
      expect(user.emailVerifiedAt).not.toBeNull();

      user.changeEmail("NEW.EMAIL@EXAMPLE.COM");
      expect(user.email).toBe("new.email@example.com");
      expect(user.emailVerifiedAt).toBeNull();
    });

    it("nên ném lỗi khi đổi sang email không hợp lệ", () => {
      const user = User.create(validProps);
      expect(() => {
        user.changeEmail("email-invalid");
      }).toThrowError("Định dạng email không hợp lệ.");
    });
  });

  describe("verifyEmail & verifyPhone", () => {
    it("nên ghi nhận thời điểm xác minh email và số điện thoại thành công", () => {
      const user = User.create(validProps);
      user.verifyEmail();
      user.verifyPhone();

      expect(user.emailVerifiedAt).toBeInstanceOf(Date);
      expect(user.phoneVerifiedAt).toBeInstanceOf(Date);
    });
  });

  describe("Trạng thái tài khoản (block & activate)", () => {
    it("nên chuyển đổi trạng thái block và activate thành công", () => {
      const user = User.create(validProps);
      expect(user.status).toBe(UserStatus.ACTIVE);

      user.block();
      expect(user.status).toBe(UserStatus.BLOCKED);

      user.activate();
      expect(user.status).toBe(UserStatus.ACTIVE);
    });
  });

  describe("updateLastLogin & updateRefreshToken", () => {
    it("nên cập nhật token và thời điểm đăng nhập cuối cùng thành công", () => {
      const user = User.create(validProps);
      user.updateLastLogin();
      user.updateRefreshToken("token123");

      expect(user.lastLoginAt).toBeInstanceOf(Date);
      expect(user.refreshToken).toBe("token123");

      user.updateRefreshToken(null);
      expect(user.refreshToken).toBeNull();
    });
  });

  describe("changeRole", () => {
    it("nên đổi vai trò thành công", () => {
      const user = User.create(validProps);
      user.changeRole("new-role-uuid");
      expect(user.roleId).toBe("new-role-uuid");
    });

    it("nên ném lỗi khi đổi sang mã vai trò rỗng", () => {
      const user = User.create(validProps);
      expect(() => {
        user.changeRole("");
      }).toThrowError("Mã vai trò không hợp lệ.");
    });
  });
});
