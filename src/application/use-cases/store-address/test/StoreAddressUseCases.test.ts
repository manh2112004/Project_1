import { describe, it, expect, beforeEach } from "vitest";
import {
  CreateStoreAddressUseCase,
  UpdateStoreAddressUseCase,
  GetStoreAddressesByStoreIdUseCase,
  DeleteStoreAddressUseCase,
  SetDefaultStoreAddressUseCase,
} from "../StoreAddressUseCases";
import { StoreAddress } from "../../../../domain/entities/StoreAddress";
import { Store } from "../../../../domain/entities/Store";
import { IStoreAddressRepository } from "../../../../domain/repositories/IStoreAddressRepository";
import { IStoreRepository } from "../../../../domain/repositories/IStoreRepository";
import { BusinessType } from "../../../../domain/constant/BusinessType";

class InMemoryStoreAddressRepository implements IStoreAddressRepository {
  public addresses: StoreAddress[] = [];

  async save(storeAddress: StoreAddress): Promise<StoreAddress> {
    const index = this.addresses.findIndex((a) => a.id === storeAddress.id);
    if (index >= 0) {
      this.addresses[index] = storeAddress;
    } else {
      this.addresses.push(storeAddress);
    }
    return storeAddress;
  }

  async findById(id: string): Promise<StoreAddress | null> {
    return this.addresses.find((a) => a.id === id) || null;
  }

  async findByStoreId(storeId: string): Promise<StoreAddress[]> {
    return this.addresses.filter((a) => a.storeId === storeId);
  }

  async findDefaultByStoreId(storeId: string): Promise<StoreAddress | null> {
    return this.addresses.find((a) => a.storeId === storeId && a.isDefault) || null;
  }

  async findDefaultPickupByStoreId(storeId: string): Promise<StoreAddress | null> {
    return this.addresses.find((a) => a.storeId === storeId && a.isDefaultPickup) || null;
  }

  async findDefaultReturnByStoreId(storeId: string): Promise<StoreAddress | null> {
    return this.addresses.find((a) => a.storeId === storeId && a.isDefaultReturn) || null;
  }

  async delete(id: string): Promise<void> {
    this.addresses = this.addresses.filter((a) => a.id !== id);
  }

  async resetDefaultAddress(storeId: string): Promise<void> {
    this.addresses.forEach((a) => {
      if (a.storeId === storeId) a.unsetDefault();
    });
  }

  async resetDefaultPickupAddress(storeId: string): Promise<void> {
    this.addresses.forEach((a) => {
      if (a.storeId === storeId) a.unsetDefaultPickup();
    });
  }

  async resetDefaultReturnAddress(storeId: string): Promise<void> {
    this.addresses.forEach((a) => {
      if (a.storeId === storeId) a.unsetDefaultReturn();
    });
  }
}

class InMemoryStoreRepository implements IStoreRepository {
  public stores: Store[] = [];

  async save(store: Store): Promise<Store> {
    this.stores.push(store);
    return store;
  }
  async findById(id: string): Promise<Store | null> {
    return this.stores.find((s) => s.id === id) || null;
  }
  async findByUserId(): Promise<Store | null> { return null; }
  async findByName(): Promise<Store | null> { return null; }
  async findByTaxCode(): Promise<Store | null> { return null; }
  async findByIdentityNumber(): Promise<Store | null> { return null; }
  async findAndCount(): Promise<{ stores: Store[]; totalCount: number }> {
    return { stores: this.stores, totalCount: this.stores.length };
  }
  async delete(): Promise<void> {}
}

describe("StoreAddress Application Layer Use Cases", () => {
  let addressRepo: InMemoryStoreAddressRepository;
  let storeRepo: InMemoryStoreRepository;
  let sampleStore: Store;

  beforeEach(async () => {
    addressRepo = new InMemoryStoreAddressRepository();
    storeRepo = new InMemoryStoreRepository();

    sampleStore = Store.registerStore({
      userId: "user-1",
      name: "Shop Dep",
      contactEmail: "dep@example.com",
      businessType: BusinessType.PERSONAL,
      identityNumber: "123456789",
    });
    await storeRepo.save(sampleStore);
  });

  describe("CreateStoreAddressUseCase", () => {
    it("nên tự động đặt địa chỉ đầu tiên làm địa chỉ mặc định, lấy hàng và trả hàng mặc định", async () => {
      const useCase = new CreateStoreAddressUseCase(addressRepo, storeRepo);
      const addr = await useCase.execute({
        storeId: sampleStore.id,
        contactName: "Kho Ha Noi",
        addressLine1: "123 Cau Giay",
        ward: "Phuong Dich Vong",
        district: "Quan Cau Giay",
        city: "TP. Ha Noi",
      });

      expect(addr.id).toBeDefined();
      expect(addr.isDefault).toBe(true);
      expect(addr.isDefaultPickup).toBe(true);
      expect(addr.isDefaultReturn).toBe(true);
    });

    it("nên ném lỗi khi storeId không tồn tại", async () => {
      const useCase = new CreateStoreAddressUseCase(addressRepo, storeRepo);
      await expect(
        useCase.execute({
          storeId: "invalid-store-id",
          contactName: "Kho 1",
          addressLine1: "123 Street",
          ward: "Ward",
          district: "District",
          city: "City",
        })
      ).rejects.toThrowError("Không tìm thấy cửa hàng.");
    });
  });

  describe("SetDefaultStoreAddressUseCase", () => {
    it("nên thay đổi địa chỉ lấy hàng mặc định thành công", async () => {
      const createUseCase = new CreateStoreAddressUseCase(addressRepo, storeRepo);
      const setDefaultUseCase = new SetDefaultStoreAddressUseCase(addressRepo);

      const addr1 = await createUseCase.execute({
        storeId: sampleStore.id,
        contactName: "Kho 1",
        addressLine1: "123 St",
        ward: "W1",
        district: "D1",
        city: "City 1",
      });

      const addr2 = await createUseCase.execute({
        storeId: sampleStore.id,
        contactName: "Kho 2",
        addressLine1: "456 St",
        ward: "W2",
        district: "D2",
        city: "City 2",
      });

      await setDefaultUseCase.execute(addr2.id, "pickup");

      const defaultPickup = await addressRepo.findDefaultPickupByStoreId(sampleStore.id);
      expect(defaultPickup?.id).toBe(addr2.id);
    });
  });
});
