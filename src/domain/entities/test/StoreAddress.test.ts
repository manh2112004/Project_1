import { describe, it, expect } from "vitest";
import { StoreAddress } from "../StoreAddress";

describe("StoreAddress Domain Entity", () => {
  const validProps = {
    storeId: "store-uuid-123",
    contactName: "Nguyen Van Kho",
    phoneNumber: "0901234567",
    addressLine1: "123 Đường Lê Lợi",
    addressLine2: "Kho A, Tầng 1",
    ward: "Phường Bến Nghé",
    district: "Quận 1",
    city: "TP. Hồ Chí Minh",
    country: "Việt Nam",
    postalCode: "700000",
    latitude: 10.7769,
    longitude: 106.7009,
    isDefaultPickup: true,
    isDefaultReturn: false,
    isDefault: false,
  };

  describe("create (Instantiation)", () => {
    it("nên tạo thành công địa chỉ cửa hàng mới với đầy đủ thông tin hợp lệ", () => {
      const address = StoreAddress.create(validProps);

      expect(address.id).toBeDefined();
      expect(address.storeId).toBe(validProps.storeId);
      expect(address.contactName).toBe(validProps.contactName);
      expect(address.phoneNumber).toBe(validProps.phoneNumber);
      expect(address.addressLine1).toBe(validProps.addressLine1);
      expect(address.addressLine2).toBe(validProps.addressLine2);
      expect(address.ward).toBe(validProps.ward);
      expect(address.district).toBe(validProps.district);
      expect(address.city).toBe(validProps.city);
      expect(address.country).toBe(validProps.country);
      expect(address.postalCode).toBe(validProps.postalCode);
      expect(address.latitude).toBe(validProps.latitude);
      expect(address.longitude).toBe(validProps.longitude);
      expect(address.isDefaultPickup).toBe(true);
      expect(address.isDefaultReturn).toBe(false);
      expect(address.isDefault).toBe(false);
      expect(address.createdAt).toBeInstanceOf(Date);
      expect(address.updatedAt).toBeInstanceOf(Date);
    });

    it("nên cho phép phoneNumber để trống (null) và đặt giá trị mặc định cho country, isDefault, isDefaultPickup, isDefaultReturn", () => {
      const address = StoreAddress.create({
        storeId: "store-uuid-123",
        contactName: "Tran Van Kho 2",
        addressLine1: "456 Đường Nguyễn Huệ",
        ward: "Phường Bến Thành",
        district: "Quận 1",
        city: "TP. Hồ Chí Minh",
      });

      expect(address.phoneNumber).toBeNull();
      expect(address.country).toBe("Việt Nam");
      expect(address.isDefault).toBe(false);
      expect(address.isDefaultPickup).toBe(false);
      expect(address.isDefaultReturn).toBe(false);
      expect(address.addressLine2).toBeNull();
      expect(address.postalCode).toBeNull();
      expect(address.latitude).toBeNull();
      expect(address.longitude).toBeNull();
    });

    it("nên cắt bỏ khoảng trắng thừa (trim) ở đầu và cuối các chuỗi thông tin", () => {
      const address = StoreAddress.create({
        ...validProps,
        contactName: "  Nguyen Van Kho  ",
        addressLine1: "  123 Lê Lợi  ",
        ward: "  Phường Bến Nghé  ",
        district: "  Quận 1  ",
        city: "  TP. Hồ Chí Minh  ",
      });

      expect(address.contactName).toBe("Nguyen Van Kho");
      expect(address.addressLine1).toBe("123 Lê Lợi");
      expect(address.ward).toBe("Phường Bến Nghé");
      expect(address.district).toBe("Quận 1");
      expect(address.city).toBe("TP. Hồ Chí Minh");
    });

    it("nên ném lỗi khi storeId bị để trống", () => {
      expect(() => {
        StoreAddress.create({ ...validProps, storeId: "" });
      }).toThrowError("Mã cửa hàng không được để trống.");

      expect(() => {
        StoreAddress.create({ ...validProps, storeId: "   " });
      }).toThrowError("Mã cửa hàng không được để trống.");
    });

    it("nên ném lỗi khi contactName bị để trống", () => {
      expect(() => {
        StoreAddress.create({ ...validProps, contactName: "" });
      }).toThrowError("Tên người liên hệ địa chỉ không được để trống.");
    });

    it("nên ném lỗi khi nhập số điện thoại không hợp lệ", () => {
      expect(() => {
        StoreAddress.create({ ...validProps, phoneNumber: "12345" });
      }).toThrowError("Số điện thoại không đúng định dạng Việt Nam.");
    });

    it("nên ném lỗi khi addressLine1 bị để trống", () => {
      expect(() => {
        StoreAddress.create({ ...validProps, addressLine1: "" });
      }).toThrowError("Địa chỉ nhà / đường không được để trống.");
    });

    it("nên ném lỗi khi ward bị để trống", () => {
      expect(() => {
        StoreAddress.create({ ...validProps, ward: "" });
      }).toThrowError("Phường / Xã không được để trống.");
    });

    it("nên ném lỗi khi district bị để trống", () => {
      expect(() => {
        StoreAddress.create({ ...validProps, district: "" });
      }).toThrowError("Quận / Huyện không được để trống.");
    });

    it("nên ném lỗi khi city bị để trống", () => {
      expect(() => {
        StoreAddress.create({ ...validProps, city: "" });
      }).toThrowError("Tỉnh / Thành phố không được để trống.");
    });

    it("nên ném lỗi khi vĩ độ (latitude) ngoài khoảng [-90, 90]", () => {
      expect(() => {
        StoreAddress.create({ ...validProps, latitude: 100 });
      }).toThrowError("Vĩ độ (latitude) phải trong khoảng từ -90 đến 90.");
    });

    it("nên ném lỗi khi kinh độ (longitude) ngoài khoảng [-180, 180]", () => {
      expect(() => {
        StoreAddress.create({ ...validProps, longitude: 200 });
      }).toThrowError("Kinh độ (longitude) phải trong khoảng từ -180 đến 180.");
    });
  });

  describe("fullAddress Getter", () => {
    it("nên trả về chuỗi địa chỉ đầy đủ khi có addressLine2", () => {
      const address = StoreAddress.create(validProps);
      expect(address.fullAddress).toBe(
        "123 Đường Lê Lợi, Kho A, Tầng 1, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh, Việt Nam"
      );
    });

    it("nên trả về chuỗi địa chỉ đầy đủ khi không có addressLine2", () => {
      const { addressLine2, ...propsWithoutLine2 } = validProps;
      const address = StoreAddress.create(propsWithoutLine2);
      expect(address.fullAddress).toBe(
        "123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh, Việt Nam"
      );
    });
  });

  describe("Quản lý trạng thái địa chỉ mặc định (isDefault, isDefaultPickup, isDefaultReturn)", () => {
    it("nên quản lý trạng thái isDefault", () => {
      const address = StoreAddress.create(validProps);
      address.markAsDefault();
      expect(address.isDefault).toBe(true);

      address.unsetDefault();
      expect(address.isDefault).toBe(false);

      address.setDefault(true);
      expect(address.isDefault).toBe(true);
    });

    it("nên quản lý trạng thái isDefaultPickup", () => {
      const address = StoreAddress.create(validProps);
      address.markAsDefaultPickup();
      expect(address.isDefaultPickup).toBe(true);

      address.unsetDefaultPickup();
      expect(address.isDefaultPickup).toBe(false);

      address.setDefaultPickup(true);
      expect(address.isDefaultPickup).toBe(true);
    });

    it("nên quản lý trạng thái isDefaultReturn", () => {
      const address = StoreAddress.create(validProps);
      address.markAsDefaultReturn();
      expect(address.isDefaultReturn).toBe(true);

      address.unsetDefaultReturn();
      expect(address.isDefaultReturn).toBe(false);

      address.setDefaultReturn(true);
      expect(address.isDefaultReturn).toBe(true);
    });
  });

  describe("update (Cập nhật thông tin địa chỉ cửa hàng)", () => {
    it("nên cập nhật thành công các thông tin hợp lệ", () => {
      const address = StoreAddress.create(validProps);
      const initialUpdatedAt = address.updatedAt;

      address.update({
        contactName: "Tran Van Kho Mới",
        phoneNumber: "0987654321",
        addressLine1: "789 Đường Nam Kỳ Khởi Nghĩa",
        addressLine2: null,
        ward: "Phường Võ Thị Sáu",
        district: "Quận 3",
        city: "TP. Hồ Chí Minh",
        isDefaultPickup: false,
        isDefaultReturn: true,
        isDefault: true,
      });

      expect(address.contactName).toBe("Tran Van Kho Mới");
      expect(address.phoneNumber).toBe("0987654321");
      expect(address.addressLine1).toBe("789 Đường Nam Kỳ Khởi Nghĩa");
      expect(address.addressLine2).toBeNull();
      expect(address.ward).toBe("Phường Võ Thị Sáu");
      expect(address.district).toBe("Quận 3");
      expect(address.isDefaultPickup).toBe(false);
      expect(address.isDefaultReturn).toBe(true);
      expect(address.isDefault).toBe(true);
      expect(address.updatedAt.getTime()).toBeGreaterThanOrEqual(
        initialUpdatedAt.getTime()
      );
    });

    it("nên ném lỗi khi cập nhật SĐT không hợp lệ", () => {
      const address = StoreAddress.create(validProps);
      expect(() => {
        address.update({ phoneNumber: "invalid" });
      }).toThrowError("Số điện thoại không đúng định dạng Việt Nam.");
    });
  });
});
