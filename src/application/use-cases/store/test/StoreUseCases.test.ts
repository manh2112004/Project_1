import { describe, it, expect, beforeEach } from "vitest";
import { RegisterStoreUseCase } from "../RegisterStoreUseCase";
import {
  GetStoreByIdUseCase,
  GetStoreByUserIdUseCase,
  GetStoresPaginatedUseCase,
} from "../StoreQueryUseCases";
import {
  UpdateStoreProfileUseCase,
  ApproveStoreUseCase,
  SuspendStoreUseCase,
  RejectStoreUseCase,
  ReactivateStoreUseCase,
  ToggleVacationModeUseCase,
} from "../ManageStoreUseCases";
import { Store } from "../../../../domain/entities/Store";
import { IStoreRepository } from "../../../../domain/repositories/IStoreRepository";
import { BusinessType } from "../../../../domain/constant/BusinessType";
import { StoreStatus } from "../../../../domain/constant/StoreStatus";

class InMemoryStoreRepository implements IStoreRepository {
  public stores: Store[] = [];

  async save(store: Store): Promise<Store> {
    const index = this.stores.findIndex((s) => s.id === store.id);
    if (index >= 0) {
      this.stores[index] = store;
    } else {
      this.stores.push(store);
    }
    return store;
  }

  async findById(id: string): Promise<Store | null> {
    return this.stores.find((s) => s.id === id) || null;
  }

  async findByUserId(userId: string): Promise<Store | null> {
    return this.stores.find((s) => s.userId === userId) || null;
  }

  async findByName(name: string): Promise<Store | null> {
    return this.stores.find((s) => s.name.toLowerCase() === name.toLowerCase()) || null;
  }

  async findByTaxCode(taxCode: string): Promise<Store | null> {
    return this.stores.find((s) => s.taxCode === taxCode) || null;
  }

  async findByIdentityNumber(identityNumber: string): Promise<Store | null> {
    return this.stores.find((s) => s.identityNumber === identityNumber) || null;
  }

  async findAndCount(
    page: number,
    limit: number,
    search?: string,
    status?: StoreStatus
  ): Promise<{ stores: Store[]; totalCount: number }> {
    let filtered = [...this.stores];
    if (status) {
      filtered = filtered.filter((s) => s.status === status);
    }
    if (search) {
      filtered = filtered.filter((s) => s.name.includes(search));
    }
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);
    return { stores: paginated, totalCount: filtered.length };
  }

  async delete(id: string): Promise<void> {
    this.stores = this.stores.filter((s) => s.id !== id);
  }
}

describe("Store Application Layer Use Cases", () => {
  let storeRepo: InMemoryStoreRepository;

  beforeEach(() => {
    storeRepo = new InMemoryStoreRepository();
  });

  describe("RegisterStoreUseCase", () => {
    it("nên đăng ký cửa hàng mới thành công khi thông tin hợp lệ", async () => {
      const useCase = new RegisterStoreUseCase(storeRepo);
      const store = await useCase.execute({
        userId: "user-1",
        name: "Shop 1",
        contactEmail: "shop1@example.com",
        businessType: BusinessType.PERSONAL,
        identityNumber: "123456789",
      });

      expect(store.id).toBeDefined();
      expect(store.name).toBe("Shop 1");
      expect(store.status).toBe(StoreStatus.PENDING);
    });

    it("nên ném lỗi khi người dùng đã có cửa hàng", async () => {
      const useCase = new RegisterStoreUseCase(storeRepo);
      await useCase.execute({
        userId: "user-1",
        name: "Shop 1",
        contactEmail: "shop1@example.com",
        businessType: BusinessType.PERSONAL,
        identityNumber: "123456789",
      });

      await expect(
        useCase.execute({
          userId: "user-1",
          name: "Shop 2",
          contactEmail: "shop2@example.com",
          businessType: BusinessType.PERSONAL,
          identityNumber: "987654321",
        })
      ).rejects.toThrowError("Người dùng đã có cửa hàng trên hệ thống.");
    });

    it("nên ném lỗi khi tên cửa hàng bị trùng", async () => {
      const useCase = new RegisterStoreUseCase(storeRepo);
      await useCase.execute({
        userId: "user-1",
        name: "Shop 1",
        contactEmail: "shop1@example.com",
        businessType: BusinessType.PERSONAL,
        identityNumber: "123456789",
      });

      await expect(
        useCase.execute({
          userId: "user-2",
          name: "Shop 1",
          contactEmail: "shop2@example.com",
          businessType: BusinessType.PERSONAL,
          identityNumber: "987654321",
        })
      ).rejects.toThrowError("Tên cửa hàng đã tồn tại trên hệ thống. Vui lòng chọn tên khác.");
    });
  });

  describe("Approve, Suspend, Reject, Reactivate UseCases", () => {
    it("nên duyệt cửa hàng và mở khóa cửa hàng thành công", async () => {
      const regUseCase = new RegisterStoreUseCase(storeRepo);
      const approveUseCase = new ApproveStoreUseCase(storeRepo);
      const suspendUseCase = new SuspendStoreUseCase(storeRepo);
      const reactivateUseCase = new ReactivateStoreUseCase(storeRepo);

      const store = await regUseCase.execute({
        userId: "user-1",
        name: "Shop X",
        contactEmail: "shopx@example.com",
        businessType: BusinessType.PERSONAL,
        identityNumber: "123456789",
      });

      // Approve
      const approved = await approveUseCase.execute(store.id);
      expect(approved.status).toBe(StoreStatus.ACTIVE);

      // Suspend
      const suspended = await suspendUseCase.execute(store.id, { reason: "Vi phạm" });
      expect(suspended.status).toBe(StoreStatus.SUSPENDED);

      // Reactivate
      const reactivated = await reactivateUseCase.execute(store.id);
      expect(reactivated.status).toBe(StoreStatus.ACTIVE);
    });

    it("nên từ chối duyệt cửa hàng thành công", async () => {
      const regUseCase = new RegisterStoreUseCase(storeRepo);
      const rejectUseCase = new RejectStoreUseCase(storeRepo);

      const store = await regUseCase.execute({
        userId: "user-1",
        name: "Shop Y",
        contactEmail: "shopy@example.com",
        businessType: BusinessType.PERSONAL,
        identityNumber: "123456789",
      });

      const rejected = await rejectUseCase.execute(store.id, { reason: "Sai CCCD" });
      expect(rejected.status).toBe(StoreStatus.REJECTED);
      expect(rejected.statusNote).toBe("Sai CCCD");
    });
  });

  describe("ToggleVacationModeUseCase", () => {
    it("nên bật/tắt chế độ tạm nghỉ thành công", async () => {
      const regUseCase = new RegisterStoreUseCase(storeRepo);
      const approveUseCase = new ApproveStoreUseCase(storeRepo);
      const vacationUseCase = new ToggleVacationModeUseCase(storeRepo);

      const store = await regUseCase.execute({
        userId: "user-1",
        name: "Shop Z",
        contactEmail: "shopz@example.com",
        businessType: BusinessType.PERSONAL,
        identityNumber: "123456789",
      });

      await approveUseCase.execute(store.id);

      const vacationOn = await vacationUseCase.execute(store.id, true);
      expect(vacationOn.isOnVacation).toBe(true);

      const vacationOff = await vacationUseCase.execute(store.id, false);
      expect(vacationOff.isOnVacation).toBe(false);
    });
  });
});
