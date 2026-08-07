import { describe, it, expect } from "vitest";
import { UserAddress } from "../UserAddress";

describe("UserAddress Domain Entity", () => {
  const validProps = {
    userId: "user-uuid-123",
    recipientName: "Nguyen Van A",
    phoneNumber: "0901234567",
    addressLine1: "123 Đường Lê Lợi",
    addressLine2: "Tòa nhà ABC, Tầng 5",
    ward: "Phường Bến Nghé",
    district: "Quận 1",
    city: "TP. Hồ Chí Minh",
    country: "Việt Nam",
    postalCode: "700000",
    isDefault: false,
  };

  describe("create (Instantiation)", () => {
    it("nên tạo thành công địa chỉ mới với đầy đủ thông tin hợp lệ", () => {
      const address = UserAddress.create(validProps);

      expect(address.id).toBeDefined();
      expect(address.userId).toBe(validProps.userId);
      expect(address.recipientName).toBe(validProps.recipientName);
      expect(address.phoneNumber).toBe(validProps.phoneNumber);
      expect(address.addressLine1).toBe(validProps.addressLine1);
      expect(address.addressLine2).toBe(validProps.addressLine2);
      expect(address.ward).toBe(validProps.ward);
      expect(address.district).toBe(validProps.district);
      expect(address.city).toBe(validProps.city);
      expect(address.country).toBe(validProps.country);
      expect(address.postalCode).toBe(validProps.postalCode);
      expect(address.isDefault).toBe(false);
      expect(address.createdAt).toBeInstanceOf(Date);
      expect(address.updatedAt).toBeInstanceOf(Date);
    });

    it("nên đặt giá trị mặc định cho country là 'Việt Nam' và isDefault là false khi không truyền", () => {
      const address = UserAddress.create({
        userId: "user-uuid-123",
        recipientName: "Tran Van B",
        phoneNumber: "0912345678",
        addressLine1: "456 Đường Nguyễn Huệ",
        ward: "Phường Bến Thành",
        district: "Quận 1",
        city: "TP. Hồ Chí Minh",
      });

      expect(address.country).toBe("Việt Nam");
      expect(address.isDefault).toBe(false);
      expect(address.addressLine2).toBeNull();
      expect(address.postalCode).toBeNull();
    });

    it("nên cắt bỏ khoảng trắng thừa (trim) ở đầu và cuối các chuỗi thông tin", () => {
      const address = UserAddress.create({
        ...validProps,
        recipientName: "  Nguyen Van A  ",
        addressLine1: "  123 Lê Lợi  ",
        ward: "  Phường Bến Nghé  ",
        district: "  Quận 1  ",
        city: "  TP. Hồ Chí Minh  ",
      });

      expect(address.recipientName).toBe("Nguyen Van A");
      expect(address.addressLine1).toBe("123 Lê Lợi");
      expect(address.ward).toBe("Phường Bến Nghé");
      expect(address.district).toBe("Quận 1");
      expect(address.city).toBe("TP. Hồ Chí Minh");
    });

    it("nên ném lỗi khi userId bị để trống", () => {
      expect(() => {
        UserAddress.create({ ...validProps, userId: "" });
      }).toThrowError("Mã người dùng (userId) không được để trống.");

      expect(() => {
        UserAddress.create({ ...validProps, userId: "   " });
      }).toThrowError("Mã người dùng (userId) không được để trống.");
    });

    it("nên ném lỗi khi recipientName bị để trống", () => {
      expect(() => {
        UserAddress.create({ ...validProps, recipientName: "" });
      }).toThrowError("Tên người nhận không được để trống.");
    });

    it("nên ném lỗi khi số điện thoại không đúng định dạng Việt Nam", () => {
      expect(() => {
        UserAddress.create({ ...validProps, phoneNumber: "12345" });
      }).toThrowError("Số điện thoại không đúng định dạng Việt Nam.");
    });

    it("nên ném lỗi khi addressLine1 bị để trống", () => {
      expect(() => {
        UserAddress.create({ ...validProps, addressLine1: "" });
      }).toThrowError("Địa chỉ nhà / đường không được để trống.");
    });

    it("nên ném lỗi khi ward bị để trống", () => {
      expect(() => {
        UserAddress.create({ ...validProps, ward: "" });
      }).toThrowError("Phường / Xã không được để trống.");
    });

    it("nên ném lỗi khi district bị để trống", () => {
      expect(() => {
        UserAddress.create({ ...validProps, district: "" });
      }).toThrowError("Quận / Huyện không được để trống.");
    });

    it("nên ném lỗi khi city bị để trống", () => {
      expect(() => {
        UserAddress.create({ ...validProps, city: "" });
      }).toThrowError("Tỉnh / Thành phố không được để trống.");
    });
  });

  describe("fullAddress Getter", () => {
    it("nên trả về chuỗi địa chỉ đầy đủ khi có addressLine2", () => {
      const address = UserAddress.create(validProps);
      expect(address.fullAddress).toBe(
        "123 Đường Lê Lợi, Tòa nhà ABC, Tầng 5, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh, Việt Nam"
      );
    });

    it("nên trả về chuỗi địa chỉ đầy đủ khi không có addressLine2", () => {
      const { addressLine2, ...propsWithoutLine2 } = validProps;
      const address = UserAddress.create(propsWithoutLine2);
      expect(address.fullAddress).toBe(
        "123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh, Việt Nam"
      );
    });
  });

  describe("Quản lý trạng thái địa chỉ mặc định (isDefault)", () => {
    it("nên đánh dấu địa chỉ làm mặc định bằng markAsDefault()", () => {
      const address = UserAddress.create(validProps);
      const initialUpdatedAt = address.updatedAt;

      address.markAsDefault();

      expect(address.isDefault).toBe(true);
      expect(address.updatedAt.getTime()).toBeGreaterThanOrEqual(
        initialUpdatedAt.getTime()
      );
    });

    it("nên bỏ đánh dấu địa chỉ mặc định bằng unsetDefault()", () => {
      const address = UserAddress.create({ ...validProps, isDefault: true });
      address.unsetDefault();
      expect(address.isDefault).toBe(false);
    });

    it("nên thiết lập lại trạng thái mặc định bằng setDefault(boolean)", () => {
      const address = UserAddress.create(validProps);

      address.setDefault(true);
      expect(address.isDefault).toBe(true);

      address.setDefault(false);
      expect(address.isDefault).toBe(false);
    });
  });

  describe("update (Cập nhật thông tin địa chỉ)", () => {
    it("nên cập nhật thành công các thông tin hợp lệ", () => {
      const address = UserAddress.create(validProps);
      const initialUpdatedAt = address.updatedAt;

      address.update({
        recipientName: "Tran Van B",
        phoneNumber: "0987654321",
        addressLine1: "789 Đường Nam Kỳ Khởi Nghĩa",
        addressLine2: null,
        ward: "Phường Vo Thi Sau",
        district: "Quận 3",
        city: "TP. Hồ Chí Minh",
        isDefault: true,
      });

      expect(address.recipientName).toBe("Tran Van B");
      expect(address.phoneNumber).toBe("0987654321");
      expect(address.addressLine1).toBe("789 Đường Nam Kỳ Khởi Nghĩa");
      expect(address.addressLine2).toBeNull();
      expect(address.ward).toBe("Phường Vo Thi Sau");
      expect(address.district).toBe("Quận 3");
      expect(address.isDefault).toBe(true);
      expect(address.updatedAt.getTime()).toBeGreaterThanOrEqual(
        initialUpdatedAt.getTime()
      );
    });

    it("nên giữ nguyên thông tin cũ khi chỉ cập nhật một số trường (Partial Update)", () => {
      const address = UserAddress.create(validProps);
      address.update({ recipientName: "Nguyen Van C" });

      expect(address.recipientName).toBe("Nguyen Van C");
      expect(address.phoneNumber).toBe(validProps.phoneNumber);
      expect(address.addressLine1).toBe(validProps.addressLine1);
      expect(address.ward).toBe(validProps.ward);
      expect(address.district).toBe(validProps.district);
      expect(address.city).toBe(validProps.city);
    });

    it("nên ném lỗi khi cập nhật recipientName bị rỗng", () => {
      const address = UserAddress.create(validProps);
      expect(() => {
        address.update({ recipientName: "" });
      }).toThrowError("Tên người nhận không được để trống.");
    });

    it("nên ném lỗi khi cập nhật số điện thoại sai định dạng", () => {
      const address = UserAddress.create(validProps);
      expect(() => {
        address.update({ phoneNumber: "invalid_phone" });
      }).toThrowError("Số điện thoại không đúng định dạng Việt Nam.");
    });

    it("nên ném lỗi khi cập nhật addressLine1 bị rỗng", () => {
      const address = UserAddress.create(validProps);
      expect(() => {
        address.update({ addressLine1: "" });
      }).toThrowError("Địa chỉ nhà / đường không được để trống.");
    });

    it("nên ném lỗi khi cập nhật ward bị rỗng", () => {
      const address = UserAddress.create(validProps);
      expect(() => {
        address.update({ ward: "" });
      }).toThrowError("Phường / Xã không được để trống.");
    });

    it("nên ném lỗi khi cập nhật district bị rỗng", () => {
      const address = UserAddress.create(validProps);
      expect(() => {
        address.update({ district: "" });
      }).toThrowError("Quận / Huyện không được để trống.");
    });

    it("nên ném lỗi khi cập nhật city bị rỗng", () => {
      const address = UserAddress.create(validProps);
      expect(() => {
        address.update({ city: "" });
      }).toThrowError("Tỉnh / Thành phố không được để trống.");
    });
  });
});
