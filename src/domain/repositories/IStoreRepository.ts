import { Store } from "../entities/Store";
import { StoreStatus } from "../constant/StoreStatus";

export interface IStoreRepository {
  save(store: Store): Promise<Store>;
  findById(id: string): Promise<Store | null>;
  findByUserId(userId: string): Promise<Store | null>;
  findByName(name: string): Promise<Store | null>;
  findByTaxCode(taxCode: string): Promise<Store | null>;
  findByIdentityNumber(identityNumber: string): Promise<Store | null>;
  findAndCount(
    page: number,
    limit: number,
    search?: string,
    status?: StoreStatus,
  ): Promise<{ stores: Store[]; totalCount: number }>;
  delete(id: string): Promise<void>;
}
