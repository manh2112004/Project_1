import { StoreAddress } from "../entities/StoreAddress";

export interface IStoreAddressRepository {
  save(storeAddress: StoreAddress): Promise<StoreAddress>;
  findById(id: string): Promise<StoreAddress | null>;
  findByStoreId(storeId: string): Promise<StoreAddress[]>;
  findDefaultByStoreId(storeId: string): Promise<StoreAddress | null>;
  findDefaultPickupByStoreId(storeId: string): Promise<StoreAddress | null>;
  findDefaultReturnByStoreId(storeId: string): Promise<StoreAddress | null>;
  delete(id: string): Promise<void>;
  resetDefaultAddress(storeId: string): Promise<void>;
  resetDefaultPickupAddress(storeId: string): Promise<void>;
  resetDefaultReturnAddress(storeId: string): Promise<void>;
}
