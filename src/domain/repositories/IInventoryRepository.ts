import { Inventory } from "../entities/Inventory";

export interface IInventoryRepository {
  save(inventory: Inventory, transactionalEntityManager?: any): Promise<Inventory>;
  findById(id: string): Promise<Inventory | null>;
  findByProductId(productId: string): Promise<Inventory | null>;
  findByProductIds(productIds: string[]): Promise<Inventory[]>;
  findByProductIdsWithLock(
    productIds: string[],
    transactionalEntityManager?: any
  ): Promise<Inventory[]>;
  findAll(): Promise<Inventory[]>;
}
