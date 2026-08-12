import { describe, it, expect } from "vitest";
import { Store } from "../Store";
import { StoreAddress } from "../StoreAddress";
import { BusinessType } from "../../constant/BusinessType";
import { StoreStatus } from "../../constant/StoreStatus";

describe("Store Domain Entity", () => {
  const validPersonalProps = {
    userId: "user-uuid-123",
    name: "Shop Thời Trang GenZ",
    description: "Chuyên quần áo nam nữ đẹp",
    logo: "https://example.com/logo.png",
    coverImage: "https://example.com/cover.png",
    contactPhone: "0901234567",
    contactEmail: "store@example.com",
    businessType: BusinessType.PERSONAL,
    identityNumber: "012345678901",
  };

  const validEnterpriseProps = {
    userId: "user-uuid-456",
    name: "Công ty TNHH MTV Công Nghệ ABC",
    description: "Cung cấp thiết bị điện tử",
    contactPhone: "0987654321",
    contactEmail: "contact@company.com",
    businessType: BusinessType.ENTERPRISE,
    taxCode: "0312345678",
  };

  describe("registerStore (Đăng ký cửa hàng)", () => {
    it("nên đăng ký thành công cửa hàng cá nhân hợp lệ", () => {
      const store = Store.registerStore(validPersonalProps);

      expect(store.id).toBeDefined();
      expect(store.userId).toBe(validPersonalProps.userId);
      expect(store.name).toBe(validPersonalProps.name);
      expect(store.description).toBe(validPersonalProps.description);
      expect(store.contactPhone).toBe("0901234567");
      expect(store.contactEmail).toBe("store@example.com");
      expect(store.businessType).toBe(BusinessType.PERSONAL);
      expect(store.identityNumber).toBe("012345678901");
      expect(store.taxCode).toBeNull();
      expect(store.status).toBe(StoreStatus.PENDING);
      expect(store.statusNote).toBeNull();
      expect(store.isOnVacation).toBe(false);
      expect(store.createdAt).toBeInstanceOf(Date);
      expect(store.updatedAt).toBeInstanceOf(Date);
    });

    it("nên đăng ký thành công cửa hàng doanh nghiệp hợp lệ", () => {
      const store = Store.registerStore(validEnterpriseProps);

      expect(store.businessType).toBe(BusinessType.ENTERPRISE);
      expect(store.taxCode).toBe("0312345678");
      expect(store.identityNumber).toBeNull();
      expect(store.status).toBe(StoreStatus.PENDING);
    });

    it("nên ném lỗi khi tên cửa hàng bị để trống", () => {
      expect(() => {
        Store.registerStore({ ...validPersonalProps, name: "" });
      }).toThrowError("Tên cửa hàng không được để trống.");
    });

    it("nên ném lỗi khi đăng ký doanh nghiệp mà không có Mã số thuế", () => {
      expect(() => {
        Store.registerStore({ ...validEnterpriseProps, taxCode: "" });
      }).toThrowError(
        "Doanh nghiệp đăng ký cửa hàng bắt buộc phải cung cấp Mã số thuế."
      );
    });

    it("nên ném lỗi khi đăng ký cá nhân mà không có Số CCCD/CMND", () => {
      expect(() => {
        Store.registerStore({ ...validPersonalProps, identityNumber: "" });
      }).toThrowError(
        "Cá nhân đăng ký cửa hàng bắt buộc phải cung cấp Số CCCD/CMND."
      );
    });
  });

  describe("canAcceptOrders (Kiểm tra sẵn sàng nhận đơn)", () => {
    it("chỉ trả về true khi cửa hàng đang ACTIVE và không ở chế độ tạm nghỉ", () => {
      const store = Store.registerStore(validPersonalProps);
      expect(store.canAcceptOrders()).toBe(false); // Vì đang PENDING

      store.approve();
      expect(store.canAcceptOrders()).toBe(true); // Đã ACTIVE

      store.enableVacationMode();
      expect(store.canAcceptOrders()).toBe(false); // Đang nghỉ hè

      store.disableVacationMode();
      expect(store.canAcceptOrders()).toBe(true);
    });
  });

  describe("Phê duyệt và từ chối (approve, reject, suspend, reactivate)", () => {
    it("nên duyệt cửa hàng thành công (approve)", () => {
      const store = Store.registerStore(validPersonalProps);
      store.approve();

      expect(store.status).toBe(StoreStatus.ACTIVE);
      expect(store.statusNote).toBeNull();
    });

    it("nên ném lỗi khi duyệt cửa hàng đã ở trạng thái ACTIVE", () => {
      const store = Store.registerStore(validPersonalProps);
      store.approve();

      expect(() => store.approve()).toThrowError(
        "Cửa hàng đã ở trạng thái hoạt động, không thể duyệt lại."
      );
    });

    it("nên từ chối duyệt cửa hàng thành công kèm lý do (reject)", () => {
      const store = Store.registerStore(validPersonalProps);
      store.reject("Giấy tờ CCCD mờ không rõ nét");

      expect(store.status).toBe(StoreStatus.REJECTED);
      expect(store.statusNote).toBe("Giấy tờ CCCD mờ không rõ nét");
    });

    it("nên ném lỗi khi từ chối mà không nhập lý do", () => {
      const store = Store.registerStore(validPersonalProps);
      expect(() => store.reject("")).toThrowError(
        "Bắt buộc phải nhập lý do từ chối."
      );
    });

    it("nên khóa cửa hàng (suspend) và mở khóa lại (reactivate)", () => {
      const store = Store.registerStore(validPersonalProps);
      store.approve();

      store.suspend("Vi phạm chính sách bán hàng nhái");
      expect(store.status).toBe(StoreStatus.SUSPENDED);
      expect(store.statusNote).toBe("Vi phạm chính sách bán hàng nhái");

      store.reactivate();
      expect(store.status).toBe(StoreStatus.ACTIVE);
      expect(store.statusNote).toBeNull();
    });

    it("nên ném lỗi khi mở khóa cửa hàng không phải ở trạng thái SUSPENDED", () => {
      const store = Store.registerStore(validPersonalProps);
      expect(() => store.reactivate()).toThrowError(
        "Chỉ có thể mở khóa các cửa hàng đang bị đình chỉ/khóa."
      );
    });
  });

  describe("Cập nhật thông tin hồ sơ và thông tin pháp lý", () => {
    it("nên cập nhật hồ sơ thành công khi cửa hàng hợp lệ", () => {
      const store = Store.registerStore(validPersonalProps);
      store.approve();

      store.updateProfile({
        name: "Shop Thời Trang GenZ Mới",
        description: "Mô tả mới",
        logo: "https://example.com/new-logo.png",
      });

      expect(store.name).toBe("Shop Thời Trang GenZ Mới");
      expect(store.description).toBe("Mô tả mới");
      expect(store.logo).toBe("https://example.com/new-logo.png");
    });

    it("nên ném lỗi khi cập nhật hồ sơ lúc cửa hàng bị khóa (SUSPENDED)", () => {
      const store = Store.registerStore(validPersonalProps);
      store.approve();
      store.suspend("Vi phạm điều khoản");

      expect(() => {
        store.updateProfile({ name: "Tên Mới" });
      }).toThrowError("Cửa hàng đang bị khóa, không thể cập nhật hồ sơ.");
    });

    it("nên cập nhật email và số điện thoại liên hệ thành công", () => {
      const store = Store.registerStore(validPersonalProps);

      store.changeContactEmail("new-email@example.com");
      store.changeContactPhone("0988888888");

      expect(store.contactEmail).toBe("new-email@example.com");
      expect(store.contactPhone).toBe("0988888888");
    });

    it("nên reset trạng thái về PENDING khi cập nhật giấy tờ pháp lý (updateLegalInfo)", () => {
      const store = Store.registerStore(validEnterpriseProps);
      store.approve();

      store.updateLegalInfo("0399999999", null);

      expect(store.taxCode).toBe("0399999999");
      expect(store.status).toBe(StoreStatus.PENDING);
      expect(store.statusNote).toBe(
        "Chủ cửa hàng vừa cập nhật giấy tờ pháp lý. Cần duyệt lại."
      );
    });
  });

  describe("Quản lý địa chỉ kho hàng (StoreAddress) trong Store Aggregate", () => {
    it("nên thêm địa chỉ mới vào Store và tìm đúng địa chỉ lấy/trả hàng mặc định", () => {
      const store = Store.registerStore(validPersonalProps);

      const addr1 = StoreAddress.create({
        storeId: store.id,
        contactName: "Kho Hà Nội",
        addressLine1: "123 Cầu Giấy",
        ward: "Phường Dịch Vọng",
        district: "Quận Cầu Giấy",
        city: "TP. Hà Nội",
        isDefaultPickup: true,
        isDefault: true,
      });

      const addr2 = StoreAddress.create({
        storeId: store.id,
        contactName: "Kho HCM",
        addressLine1: "456 Nguyễn Huệ",
        ward: "Phường Bến Nghé",
        district: "Quận 1",
        city: "TP. Hồ Chí Minh",
        isDefaultReturn: true,
      });

      store.addAddress(addr1);
      store.addAddress(addr2);

      expect(store.addresses.length).toBe(2);
      expect(store.getDefaultAddress()?.contactName).toBe("Kho Hà Nội");
      expect(store.getDefaultPickupAddress()?.contactName).toBe("Kho Hà Nội");
      expect(store.getDefaultReturnAddress()?.contactName).toBe("Kho HCM");
    });

    it("nên ném lỗi khi thêm địa chỉ không thuộc về storeId của cửa hàng", () => {
      const store = Store.registerStore(validPersonalProps);
      const invalidAddr = StoreAddress.create({
        storeId: "other-store-id",
        contactName: "Kho Lạ",
        addressLine1: "789 Lê Lợi",
        ward: "Phường Bến Thành",
        district: "Quận 1",
        city: "TP. Hồ Chí Minh",
      });

      expect(() => store.addAddress(invalidAddr)).toThrowError(
        "Địa chỉ không thuộc về cửa hàng này."
      );
    });

    it("nên xóa địa chỉ kho khỏi Store", () => {
      const store = Store.registerStore(validPersonalProps);
      const addr = StoreAddress.create({
        storeId: store.id,
        contactName: "Kho Cần Thơ",
        addressLine1: "100 3 Tháng 2",
        ward: "Phường Xuân Khánh",
        district: "Quận Ninh Kiều",
        city: "TP. Cần Thơ",
      });

      store.addAddress(addr);
      expect(store.addresses.length).toBe(1);

      store.removeAddress(addr.id);
      expect(store.addresses.length).toBe(0);
    });
  });
});
